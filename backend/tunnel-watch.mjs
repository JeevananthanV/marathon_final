/**
 * tunnel-watch.mjs — self-healing guardian for the permanent public link.
 *
 * Keeps alive:
 *   1. backend  (localhost:5000)  — API, /verify, /scan
 *   2. frontend (localhost:5173)  — the website (TanStack Start)
 *   3. cloudflared quick tunnel   — public HTTPS address
 * And whenever the tunnel URL changes it updates config.json on the
 * gh-pages branch (GitHub Pages permanent hub) so QR codes never break:
 *
 *   QR -> https://gokulraj-2006-code.github.io/marathon_final/verify?code=...
 *         (permanent, never changes)
 *       -> config.json -> current tunnel URL -> localhost backend
 *
 * Run:  node backend/tunnel-watch.mjs
 * Stop: Ctrl+C (or kill the node process)
 */
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, ".."); // git repo root
const BACKEND_DIR = __dirname; // this folder has package.json (npm start)
const FRONTEND_DIR = path.join(REPO_ROOT, "frontend");
const PAGES_DIR =
  process.env.WATCH_PAGES_DIR ||
  path.join(os.tmpdir(), "opencode", "marathon-pages");
const CONFIG_PATH = path.join(PAGES_DIR, "config.json");
const STATE_DIR = path.join(os.tmpdir(), "opencode", "watch-state");
const CLOUDFLARED = path.join(
  process.env.LOCALAPPDATA || os.homedir(),
  "cloudflared",
  "cloudflared.exe"
);

const TICK_MS = Number(process.env.WATCH_TICK_MS || 60_000);
const BACKEND_HEALTH = "http://localhost:5000/api/health";
const FRONTEND_URL = "http://localhost:5173";

fs.mkdirSync(STATE_DIR, { recursive: true });

/* ------------------------------ logging ------------------------------ */
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try {
    fs.appendFileSync(path.join(STATE_DIR, "watch.log"), line + "\n");
  } catch {
    /* ignore */
  }
}

/* --------------------------- single instance -------------------------- */
const lockFile = path.join(STATE_DIR, "watch.pid");
if (fs.existsSync(lockFile)) {
  const oldPid = Number(fs.readFileSync(lockFile, "utf8").trim());
  try {
    process.kill(oldPid, 0);
    console.log(`Watcher already running (pid ${oldPid}) — exiting.`);
    process.exit(0);
  } catch {
    /* stale lock */
  }
}
fs.writeFileSync(lockFile, String(process.pid));
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    try {
      fs.unlinkSync(lockFile);
    } catch {}
    process.exit(0);
  });
}

/* ------------------------------ helpers ------------------------------- */
async function probe(url, timeoutMs = 8000) {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), timeoutMs);
    const r = await fetch(url, {
      redirect: "manual",
      cache: "no-store",
      signal: ctl.signal,
    });
    clearTimeout(t);
    return r.status;
  } catch {
    return 0;
  }
}

// shell:true is required on Windows for npm.cmd (Node CVE-2024-27980).
function spawnNpm(npmArgs, cwd, logFile) {
  const out = fs.openSync(logFile, "a");
  const child = spawn(
    process.platform === "win32" ? "npm.cmd" : "npm",
    npmArgs,
    {
      cwd,
      detached: true,
      stdio: ["ignore", out, out],
      windowsHide: true,
      shell: true,
    }
  );
  child.unref();
  fs.closeSync(out);
  return child;
}

function spawnTunnel(logFile) {
  const out = fs.openSync(logFile, "a");
  const child = spawn(
    CLOUDFLARED,
    ["tunnel", "--url", "http://localhost:5000", "--no-autoupdate"],
    {
      cwd: STATE_DIR,
      detached: true,
      stdio: ["ignore", out, out],
      windowsHide: true,
      shell: false,
    }
  );
  child.unref();
  fs.closeSync(out);
  return child;
}

function killNodeByPattern(psPattern) {
  // Kills node processes whose CommandLine matches the given PowerShell regex.
  const script = [
    `Get-CimInstance Win32_Process -Filter "Name='node.exe'"`,
    `| Where-Object { $_.CommandLine -match '${psPattern}' }`,
    `| ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`,
  ].join(" ");
  try {
    execSync(`powershell.exe -NoProfile -Command "${script.replace(/"/g, '\\"')}"`, {
      stdio: "ignore",
      timeout: 20000,
      windowsHide: true,
    });
  } catch {
    /* none found */
  }
}

function git(...args) {
  // Quote any arg containing spaces (e.g. commit messages with a URL),
  // otherwise cmd.exe splits it and git chokes on stray pathspecs ("ERROR 123:
  // The filename, directory name, or volume label syntax is incorrect").
  const quoted = args
    .map((a) => (/[\s]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a))
    .join(" ");
  return execSync(`git ${quoted}`, {
    cwd: PAGES_DIR,
    encoding: "utf8",
    timeout: 60_000,
    windowsHide: true,
  });
}

/* --------------------------- component state -------------------------- */
const state = {
  tunnelLog: null, // log file of a cloudflared WE started
  tunnelUrl: "", // last known good tunnel URL
  tunnelDownStreak: 0,
  backendDownStreak: 0,
  frontendDownStreak: 0,
  lastConfigSync: "",
  busy: false,
};

/* ------------------------------ backend ------------------------------- */
async function ensureBackend() {
  const status = await probe(BACKEND_HEALTH);
  if (status === 200) {
    state.backendDownStreak = 0;
    return;
  }
  state.backendDownStreak += 1;
  if (state.backendDownStreak < 2) return; // tolerate one blip
  log(`backend DOWN (status ${status}) — restarting npm start`);
  killNodeByPattern("server\\.js");
  await new Promise((r) => setTimeout(r, 1500));
  spawnNpm(["start"], BACKEND_DIR, path.join(STATE_DIR, "backend.log"));
  state.backendDownStreak = 0;
}

/* ------------------------------ frontend ------------------------------ */
async function ensureFrontend() {
  const status = await probe(FRONTEND_URL);
  if (status > 0) {
    state.frontendDownStreak = 0;
    return;
  }
  state.frontendDownStreak += 1;
  if (state.frontendDownStreak < 2) return;
  log(`frontend DOWN — restarting wrangler (production build server)`);
  killNodeByPattern("vite.*(5173|dev|preview)|wrangler.*5173|workerd|edge-runtime|--port\\s+5173");
  await new Promise((r) => setTimeout(r, 1000));
  // Serves the BUILT app via wrangler (nitro's cloudflare preset): measured
  // 500 simultaneous visitors with 0 errors (the dev server returned 502s).
  // NOTE: after editing frontend code run `npm run build` (frontend) first,
  // otherwise the server keeps serving the last build.
  spawnNpm(
    ["run", "serve"],
    FRONTEND_DIR,
    path.join(STATE_DIR, "frontend.log")
  );
  state.frontendDownStreak = 0;
}

/* ------------------------------- tunnel ------------------------------- */
function readLogTunnelUrl() {
  if (!state.tunnelLog || !fs.existsSync(state.tunnelLog)) return "";
  try {
    const txt = fs.readFileSync(state.tunnelLog, "utf8");
    const m = [...txt.matchAll(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/g)];
    return m.length ? m[m.length - 1][0] : "";
  } catch {
    return "";
  }
}

function readHubTunnelUrl() {
  // What the permanent hub currently points at (starting hint only).
  try {
    const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    return typeof cfg.backend === "string" ? cfg.backend : "";
  } catch {
    return "";
  }
}

function readExternalTunnelUrls() {
  // A tunnel may have been started outside this watcher (e.g. manually after a
  // restart). Look at recent shell outputs so we adopt it instead of killing it.
  try {
    const root = path.join(os.homedir(), ".local", "share", "opencode", "shell");
    const files = [];
    for (const hashDir of fs.readdirSync(root)) {
      const d = path.join(root, hashDir);
      try {
        if (!fs.statSync(d).isDirectory()) continue;
      } catch {
        continue;
      }
      for (const f of fs.readdirSync(d)) {
        if (!f.endsWith(".out")) continue;
        const fp = path.join(d, f);
        try {
          const st = fs.statSync(fp);
          if (Date.now() - st.mtimeMs < 6 * 3600_000) files.push({ fp, mtime: st.mtimeMs });
        } catch {}
      }
    }
    const urls = [];
    for (const { fp } of files.sort((a, b) => b.mtime - a.mtime).slice(0, 5)) {
      try {
        const tail = fs.readFileSync(fp, "utf8").slice(-4000);
        const m = tail.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
        if (m) urls.push(m[0]);
      } catch {}
    }
    return urls;
  } catch {
    return [];
  }
}

async function tunnelHealthy(url) {
  if (!url) return false;
  // /scan is served natively by the backend — stable health probe.
  return (await probe(`${url}/scan`, 10000)) === 200;
}

async function adoptTunnel(url) {
  const changed = state.tunnelUrl !== url;
  state.tunnelUrl = url;
  if (changed) log(`tunnel ready: ${url}`);
  await syncConfig(); // no-op if hub already points here
}

async function ensureTunnel() {
  // 1) remember our own URL, else discover an externally started one, else the hub's
  const candidates = [];
  const add = (u) => {
    if (u && !candidates.includes(u)) candidates.push(u);
  };
  add(state.tunnelUrl);
  add(readLogTunnelUrl());
  for (const u of readExternalTunnelUrls()) add(u);
  add(readHubTunnelUrl());

  for (const url of candidates) {
    if (await tunnelHealthy(url)) {
      await adoptTunnel(url);
      state.tunnelDownStreak = 0;
      return;
    }
  }

  state.tunnelDownStreak += 1;
  if (state.tunnelDownStreak < 2) return; // tolerate one blip
  log("tunnel DEAD — restarting cloudflared");

  try {
    execSync("taskkill /F /IM cloudflared.exe", {
      stdio: "ignore",
      timeout: 15000,
      windowsHide: true,
    });
  } catch {
    /* not running */
  }
  await new Promise((r) => setTimeout(r, 2000));

  state.tunnelLog = path.join(STATE_DIR, `tunnel-${Date.now()}.log`);
  spawnTunnel(state.tunnelLog);
  state.tunnelDownStreak = 0;
  state.tunnelUrl = "";

  // wait up to ~90s for the new URL to appear and answer
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const fresh = readLogTunnelUrl();
    if (fresh && (await tunnelHealthy(fresh))) {
      await adoptTunnel(fresh);
      log(`tunnel restarted: ${fresh}`);
      return;
    }
  }
  log("tunnel restart: no healthy URL after 90s — will retry next tick");
}

/* --------------------------- config sync (gh-pages) ------------------- */
async function syncConfig() {
  if (!state.tunnelUrl) return;
  if (state.lastConfigSync === state.tunnelUrl) return;
  if (!fs.existsSync(CONFIG_PATH)) {
    log(`config sync skipped — pages dir missing: ${PAGES_DIR}`);
    return;
  }
  try {
    const current = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    // Write when the file mismatches; ALWAYS continue to add/commit/push when
    // this URL hasn't been confirmed pushed yet (local file can already match
    // while GitHub Pages still serves the previous tunnel — that state hung the
    // permanent hub before).
    if (current.backend !== state.tunnelUrl) {
      fs.writeFileSync(
        CONFIG_PATH,
        JSON.stringify({
          backend: state.tunnelUrl,
          updatedAt: new Date().toISOString(),
          note: "auto-managed by tunnel watcher - do not edit manually",
        })
      );
    }
    git("add", "config.json");
    const pending = git("status", "--porcelain", "config.json").trim();
    if (pending) {
      git(
        "-c",
        "user.name=Gokulraj-2006-code",
        "-c",
        "user.email=Gokulraj-2006-code@users.noreply.github.com",
        "commit",
        "-m",
        `config: tunnel -> ${state.tunnelUrl}`
      );
    }
    git("push", "origin", "gh-pages");
    state.lastConfigSync = state.tunnelUrl;
    log(`permanent hub updated -> ${state.tunnelUrl}`);
  } catch (err) {
    log(`config sync FAILED: ${err.message} (will retry)`);
  }
}

/* -------------------------------- main -------------------------------- */
async function tick() {
  if (state.busy) return;
  state.busy = true;
  try {
    await ensureBackend();
    await ensureFrontend();
    await ensureTunnel();
  } catch (err) {
    log(`tick error: ${err.message}`);
  } finally {
    state.busy = false;
  }
}

log(`watcher started (pid ${process.pid})`);
log(`repo=${REPO_ROOT}`);
log(`pages=${PAGES_DIR} exists=${fs.existsSync(PAGES_DIR)}`);
log(`cloudflared=${CLOUDFLARED} exists=${fs.existsSync(CLOUDFLARED)}`);
await tick();
setInterval(tick, TICK_MS);
