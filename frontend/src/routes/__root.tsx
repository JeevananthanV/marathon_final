import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollProgressBar from "@/components/ScrollProgressBar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-black text-royal">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-charcoal">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="/" className="mt-6 inline-flex rounded-full gradient-cta text-white px-6 py-3 text-sm font-semibold shadow-soft">Back to Home</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full gradient-cta text-white px-5 py-2.5 text-sm font-semibold"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-input px-5 py-2.5 text-sm font-semibold">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Run Beyond Limits 2026 · Run Beyond Limits" },
      { name: "description", content: "Join Run Beyond Limits on September 27, 2026 across Chennai, Bengaluru, and Salem. Push your endurance across 21.1K, 10K and 5K categories." },
      { name: "author", content: "Run Beyond Limits" },
      { property: "og:title", content: "Run Beyond Limits 2026 · Run Beyond Limits" },
      { property: "og:description", content: "Join Run Beyond Limits on September 27, 2026 across Chennai, Bengaluru, and Salem. Push your endurance across 21.1K, 10K and 5K categories." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Run Beyond Limits 2026 · Run Beyond Limits" },
      { name: "twitter:description", content: "Join Run Beyond Limits on September 27, 2026 across Chennai, Bengaluru, and Salem. Push your endurance across 21.1K, 10K and 5K categories." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e5ecaf9f-b5d0-45c0-9e3c-1fbdec4ad95c/id-preview-cd4fab79--f4afad68-ee54-4656-81c8-41650b828d4e.lovable.app-1784613300369.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e5ecaf9f-b5d0-45c0-9e3c-1fbdec4ad95c/id-preview-cd4fab79--f4afad68-ee54-4656-81c8-41650b828d4e.lovable.app-1784613300369.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const isAdmin = router.state.location.pathname === "/admin";
  const isHome = router.state.location.pathname === "/" || router.state.location.pathname.includes("theme-preview");
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <ScrollProgressBar />
        <LoadingScreen />
        {!isAdmin && <Navbar />}
        <main className="flex-1">
          <Outlet />
        </main>
        {!isAdmin && <Footer />}
        {!isAdmin && <WhatsAppButton />}
        <Toaster richColors position="top-center" />
      </div>
    </QueryClientProvider>
  );
}
