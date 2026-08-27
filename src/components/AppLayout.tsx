import { Outlet, Link, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Bell, Moon, Sun, Globe, LogOut, Mic } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const langs = ["English", "हिन्दी (Hindi)", "ಕನ್ನಡ (Kannada)"];

const AppLayout = () => {
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState("English");

  const startVoice = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return toast.error("Voice not supported in this browser");
    const r = new SR();
    r.lang = lang.startsWith("हिन") ? "hi-IN" : lang.startsWith("ಕನ") ? "kn-IN" : "en-US";
    r.onresult = (e: any) => toast.success(`Heard: "${e.results[0][0].transcript}"`);
    r.onerror = () => toast.error("Voice error");
    r.start();
    toast.info("Listening…");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-accent/20">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card/60 backdrop-blur-md px-3 sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm text-muted-foreground hidden sm:inline">Smart Agriculture Platform</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={startVoice} title="Voice assistant"><Mic className="w-4 h-4" /></Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" title="Language"><Globe className="w-4 h-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {langs.map((l) => (
                    <DropdownMenuItem key={l} onClick={() => { setLang(l); toast.success(`Language: ${l}`); }}>{l}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={() => toast("3 new alerts: high-risk weed detected in Field B")} title="Notifications">
                <span className="relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-destructive" />
                </span>
              </Button>
              <Button variant="ghost" size="icon" onClick={toggle} title="Theme">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              {user ? (
                <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate("/"); }}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </Button>
              ) : (
                <Button asChild size="sm"><Link to="/auth">Sign in</Link></Button>
              )}
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
