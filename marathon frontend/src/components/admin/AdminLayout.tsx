import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet, SheetContent, SheetTrigger, SheetTitle,
} from "@/components/ui/sheet";
import {
  LayoutDashboard, Users, Shirt, FileText, MessageSquare, LogOut,
  ClipboardList, ReceiptText, Award, Settings, Menu, HelpCircle,
  Bell, ChevronDown, ChevronRight, Search, Moon, Sun, X,
} from "lucide-react";
import type { AdminTab } from "./types";
import { PremiumAvatar, TrendBadge } from "./PremiumUI";

interface AdminLayoutProps {
  tab: AdminTab;
  setTab: (tab: AdminTab) => void;
  onLogout: () => void;
  participantCount: number;
  children: React.ReactNode;
}

const tabConfig = [
  { key: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard, description: "Overview & analytics" },
  { key: "players" as const, label: "Participants", icon: Users, description: "Manage registrations" },
  { key: "results" as const, label: "Results & Certs", icon: Award, description: "Runner times & certificates" },
  { key: "tshirt" as const, label: "T-Shirt Sizes", icon: Shirt, description: "Size distribution" },
  { key: "reports" as const, label: "Reports", icon: FileText, description: "Revenue analytics" },
  { key: "contacts" as const, label: "Messages", icon: MessageSquare, description: "Contact inquiries" },
];

const secondaryNav = [
  { label: "Registrations", icon: ClipboardList, target: "players" as const },
  { label: "Payments", icon: ReceiptText, target: "reports" as const },
  { label: "Certificates", icon: Award, target: "players" as const },
  { label: "Settings", icon: Settings, target: "dashboard" as const },
];

function SidebarContent({ tab, setTab, onLogout, participantCount, onNavClick }: {
  tab: AdminTab;
  setTab: (t: AdminTab) => void;
  onLogout: () => void;
  participantCount: number;
  onNavClick?: () => void;
}) {
  function handleClick(key: AdminTab) {
    setTab(key);
    onNavClick?.();
  }

  return (
    <>
      <div className="flex h-16 items-center gap-3 px-4 border-b border-border/40 dark:border-white/10">
        <div className="relative">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-base font-black text-white shadow-lg shadow-primary/25">
            R
          </div>
          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-success border-2 border-card dark:border-slate-900 animate-pulse-soft" />
        </div>
        <div>
          <p className="text-sm font-extrabold tracking-tight text-foreground dark:text-white">RUN BEYOND</p>
          <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">Admin Console</p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4 scrollbar-hide">
        <p className="mb-2.5 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/80 dark:text-white/40">Overview</p>
        <nav className="space-y-1" role="navigation" aria-label="Main navigation">
          {tabConfig.map(({ key, label, icon: Icon, description }) => {
            const isActive = tab === key;
            return (
              <button
                key={key}
                onClick={() => handleClick(key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
                )}
                title={description}
              >
                <span className={cn("relative z-10 flex h-9 w-9 items-center justify-center rounded-lg",
                  isActive ? "bg-white/20 text-white" : "bg-muted/65 text-muted-foreground dark:bg-white/5 dark:text-white/70"
                )}>
                  <Icon className={cn("h-4.5 w-4.5", isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground dark:text-white/70")} />
                </span>
                <span className="relative z-10 flex-1 text-left">{label}</span>
                {key === "players" && participantCount > 0 && (
                  <span className={cn(
                    "relative z-10 ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold min-w-[24px] text-center transition-all",
                    isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20"
                  )}>
                    {participantCount}
                  </span>
                )}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-0.5 bg-gradient-to-b from-primary to-secondary rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>

      </ScrollArea>

      <div className="mx-3 mb-2 rounded-xl bg-muted/40 p-3.5 border border-border/60 dark:bg-white/5 dark:border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground dark:text-white">
          <HelpCircle className="h-4 w-4 text-primary" /> Need help?
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground dark:text-white/50">Contact the event support team.</p>
        <button className="mt-2 text-xs font-bold text-primary hover:text-primary-light transition-colors">View help center</button>
      </div>

      <Separator className="mx-3 mb-2 bg-border/60 dark:bg-white/10" />

      <button
        onClick={onLogout}
        className="mx-3 mb-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive dark:text-white/70 dark:hover:bg-destructive/20 dark:hover:text-destructive-light group transition-all duration-200"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground group-hover:bg-destructive/10 group-hover:text-destructive dark:bg-white/5 dark:text-white/70 dark:group-hover:bg-destructive/20 dark:group-hover:text-destructive-light transition-colors">
          <LogOut className="h-4.5 w-4.5" />
        </span>
        Log out
      </button>
    </>
  );
}

export function AdminLayout({ tab, setTab, onLogout, participantCount, children }: AdminLayoutProps) {
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin_dark_mode");
      return saved ? saved === "true" : false;
    }
    return false;
  });

  const toggleDarkMode = () => {
    const nextVal = !darkMode;
    setDarkMode(nextVal);
    localStorage.setItem("admin_dark_mode", nextVal.toString());
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const currentTabLabel = tabConfig.find((x) => x.key === tab)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Animated background mesh */}
      <div className="fixed inset-0 -z-10 mesh-bg pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl animate-float-gentle" style={{ animationDelay: "0s" }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-float-gentle" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl animate-float-gentle" style={{ animationDelay: "4s" }} />
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border/40 bg-card/90 dark:bg-slate-950/80 dark:border-white/10 backdrop-blur-xl lg:flex">
        <SidebarContent
          tab={tab}
          setTab={setTab}
          onLogout={onLogout}
          participantCount={participantCount}
        />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="fixed top-4 left-4 z-40 lg:hidden h-10 w-10 p-0 rounded-xl bg-card/85 dark:bg-white/10 backdrop-blur-sm border border-border/40 dark:border-white/10 text-foreground dark:text-white animate-fade-in">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-card dark:bg-slate-950 border-border/40 dark:border-white/10">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-full flex-col">
            <SidebarContent
              tab={tab}
              setTab={setTab}
              onLogout={onLogout}
              participantCount={participantCount}
              onNavClick={() => setMobileOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border/40 bg-card/60 dark:bg-slate-950/50 backdrop-blur-xl px-4 sm:px-6">
          <div className="lg:hidden w-12" />

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/60 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/5" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/60 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/5 relative">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse-soft" />
            </Button>
            <Separator orientation="vertical" className="h-6 hidden sm:block border-border/40" />
            <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-2 py-1.5 hover:bg-muted/40 dark:hover:bg-white/5 transition-colors">
              <PremiumAvatar name="Admin Gokul" size="md" colorIndex={0} />
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-foreground leading-tight">Admin Gokul</p>
                <p className="text-[11px] text-muted-foreground">Event Administrator</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] px-3 py-4 sm:px-6 lg:px-8">
          <div className="mb-4 md:mb-8 flex justify-center items-center text-center">
            <div className="animate-fade-in-up flex flex-col items-center justify-center text-center">
              <div className="mb-1.5 flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground">
                Admin <ChevronRight className="h-3 w-3" /> <span className="text-primary font-semibold">{currentTabLabel}</span>
              </div>
              <h1 className="font-display text-xl sm:text-3xl lg:text-5xl font-black tracking-tight text-foreground">
                {tab === "dashboard" ? "Dashboard Overview" : currentTabLabel}
              </h1>
              <p className="mt-1 text-xs md:text-sm text-muted-foreground max-w-2xl hidden sm:block">
                {tab === "dashboard"
                  ? "Real-time insights into your marathon registrations and revenue"
                  : "Manage your event data with precision and elegance"}
              </p>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}