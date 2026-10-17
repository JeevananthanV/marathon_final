import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  LogIn,
  ShieldAlert,
  Eye,
  EyeOff,
  Sun,
  Moon,
  User,
  Lock,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const floatVariants = {
  animate: {
    y: [0, -12, 0],
    x: [0, 6, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
};

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin_dark_mode");
      return saved ? saved === "true" : false;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Load saved credentials if remember me was previously set
  useEffect(() => {
    const saved = localStorage.getItem("admin_remember");
    if (saved) {
      try {
        const { username: savedUser, password: savedPass } = JSON.parse(saved);
        setUsername(savedUser);
        setPassword(savedPass);
        setRememberMe(true);
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  // Auto-focus username on mount
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoginError(null);

    let valid = true;
    if (!username.trim()) {
      setErrors((prev) => ({ ...prev, username: "Username is required" }));
      valid = false;
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      valid = false;
    }
    if (!valid) return;

    setIsLoading(true);
    try {
      await onLogin(username, password);
      // Persist credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem("admin_remember", JSON.stringify({ username, password }));
      } else {
        localStorage.removeItem("admin_remember");
      }
    } catch (err: any) {
      setLoginError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  function clearField(field: "username" | "password") {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (loginError) setLoginError(null);
  }

  const isFormDisabled = isLoading || !username.trim() || !password.trim();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-4 py-12">
      {/* Theme Toggle — floating in top-right */}
      <div className="fixed top-6 right-6 z-30">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-11 w-11 rounded-2xl p-0 transition-all duration-300",
              "text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white",
              "hover:bg-slate-200/60 dark:hover:bg-white/10",
              "border border-slate-200 dark:border-white/10",
              "shadow-sm dark:shadow-none",
            )}
            onClick={() => {
              const nextVal = !darkMode;
              setDarkMode(nextVal);
              localStorage.setItem("admin_dark_mode", nextVal.toString());
            }}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <motion.div
              key={darkMode ? "sun" : "moon"}
              initial={{ rotate: -180, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] as const }}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.div>
          </Button>
        </motion.div>
      </div>

      {/* Animated background mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 dark:bg-primary/20 blur-3xl"
          variants={floatVariants}
          animate="animate"
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-secondary/10 dark:bg-secondary/20 blur-3xl"
          variants={floatVariants}
          animate="animate"
          style={{ animationDelay: "2s" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-accent/5 dark:bg-accent/10 blur-3xl"
          variants={floatVariants}
          animate="animate"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Centered Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <motion.div
            variants={itemVariants}
            className={cn(
              "relative overflow-hidden rounded-3xl border",
              "border-slate-200/50 dark:border-white/10",
              "bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl",
              "shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]",
            )}
          >
            {/* Gradient border accent */}
            <div
              className="absolute inset-0 -z-10 rounded-3xl opacity-30 dark:opacity-20"
              style={{
                background: "var(--gradient-primary-soft)",
              }}
            />

            {/* Loading Overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                  animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                  exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                  className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 dark:bg-slate-900/60 rounded-3xl"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative flex items-center justify-center mb-6"
                  >
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 rounded-full border-4 border-slate-200 dark:border-white/10 border-t-primary border-r-primary border-b-secondary shadow-lg shadow-primary/20"
                    />
                    <ShieldAlert className="absolute w-8 h-8 text-primary animate-pulse" />
                  </motion.div>
                  
                  <motion.h3 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-lg font-bold text-slate-800 dark:text-white tracking-wide"
                  >
                    Authenticating...
                  </motion.h3>
                  <p className="text-sm text-slate-500 dark:text-white/60 mt-2">
                    Securing your connection
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-8 sm:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  variants={itemVariants}
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/25"
                >
                  <ShieldAlert className="h-7 w-7" />
                </motion.div>
                <motion.h2
                  variants={itemVariants}
                  className="font-display text-2xl font-black text-slate-800 dark:text-white tracking-tight"
                >
                  Admin Sign In
                </motion.h2>
                <motion.p
                  variants={itemVariants}
                  className="mt-2 text-sm text-slate-500 dark:text-white/60"
                >
                  Enter your credentials to access the dashboard
                </motion.p>
              </div>

              {/* Login error banner */}
              <AnimatePresence>
                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                    className={cn(
                      "mb-5 flex items-start gap-3 rounded-xl",
                      "bg-destructive-muted/50 dark:bg-destructive/10",
                      "border border-destructive/20 dark:border-destructive/20",
                      "px-4 py-3",
                    )}
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 text-destructive shrink-0" />
                    <span className="text-sm text-destructive">{loginError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username field */}
                <motion.div variants={itemVariants}>
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="flex items-center justify-between text-xs font-bold text-slate-400 dark:text-white/50 uppercase tracking-wider"
                    >
                      <span>Username</span>
                      {errors.username && (
                        <motion.span
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-1 text-xs text-destructive font-medium"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.username}
                        </motion.span>
                      )}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-white/40" />
                      <Input
                        ref={usernameRef}
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          clearField("username");
                        }}
                        className={cn(
                          "h-12 rounded-xl pl-11 pr-4",
                          "bg-slate-100/50 dark:bg-white/5",
                          "border border-slate-200 dark:border-white/10",
                          "text-slate-800 dark:text-white",
                          "placeholder:text-slate-400 dark:placeholder:text-white/40",
                          "transition-all duration-200",
                          "focus:bg-white dark:focus:bg-white/10",
                          "focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
                          errors.username && "border-destructive/50 focus:border-destructive focus:ring-destructive/20",
                        )}
                        autoComplete="username"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Password field */}
                <motion.div variants={itemVariants}>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="flex items-center justify-between text-xs font-bold text-slate-400 dark:text-white/50 uppercase tracking-wider"
                    >
                      <span>Password</span>
                      {errors.password && (
                        <motion.span
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-1 text-xs text-destructive font-medium"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.password}
                        </motion.span>
                      )}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-white/40" />
                      <Input
                        ref={passwordRef}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          clearField("password");
                        }}
                        className={cn(
                          "h-12 rounded-xl pl-11 pr-12",
                          "bg-slate-100/50 dark:bg-white/5",
                          "border border-slate-200 dark:border-white/10",
                          "text-slate-800 dark:text-white",
                          "placeholder:text-slate-400 dark:placeholder:text-white/40",
                          "transition-all duration-200",
                          "focus:bg-white dark:focus:bg-white/10",
                          "focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
                          errors.password && "border-destructive/50 focus:border-destructive focus:ring-destructive/20",
                        )}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={cn(
                          "absolute right-3 top-1/2 -translate-y-1/2",
                          "text-slate-400 dark:text-white/50",
                          "hover:text-slate-600 dark:hover:text-white",
                          "transition-colors",
                        )}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4.5 w-4.5" />
                        ) : (
                          <Eye className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Remember me */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                      className="h-4 w-4 border-slate-300 dark:border-white/20 text-primary focus:ring-primary/20"
                    />
                    <Label
                      htmlFor="remember-me"
                      className="text-sm font-medium text-slate-600 dark:text-white/70 cursor-pointer"
                    >
                      Remember me
                    </Label>
                  </div>
                </motion.div>

                {/* Submit button */}
                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    disabled={isFormDisabled}
                    whileHover={!isFormDisabled ? { scale: 1.02 } : undefined}
                    whileTap={!isFormDisabled ? { scale: 0.98 } : undefined}
                    className={cn(
                      "relative w-full h-12 rounded-xl",
                      "font-bold text-sm transition-all duration-200",
                      "flex items-center justify-center gap-2",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500",
                      isFormDisabled
                        ? "cursor-not-allowed opacity-60 bg-slate-200 dark:bg-white/10 text-slate-400 border border-slate-300 dark:border-white/10"
                        : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-slate-900 dark:border-white hover:bg-slate-700 dark:hover:bg-slate-100 shadow-sm hover:shadow-md",
                    )}
                  >
                    {isLoading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                        />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {/* Demo credentials */}
              <motion.div
                variants={itemVariants}
                className={cn(
                  "mt-8 rounded-xl border border-slate-200 dark:border-white/10",
                  "bg-slate-50/50 dark:bg-white/3",
                  "px-4 py-3",
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-xs font-bold text-slate-400 dark:text-white/50 uppercase tracking-wider">
                    Demo Credentials
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5 font-mono text-sm">
                  <span className="rounded-md bg-slate-200/50 dark:bg-white/5 px-2.5 py-1 text-slate-700 dark:text-white/70">admin</span>
                  <span className="text-slate-400 dark:text-white/40">/</span>
                  <span className="rounded-md bg-slate-200/50 dark:bg-white/5 px-2.5 py-1 text-slate-700 dark:text-white/70">password123</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
