import { ReactNode, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, BookOpen, Receipt, Inbox, LogOut, Menu, X, MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site-config";
import { toast } from "sonner";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/invoices", label: "Invoices", icon: Receipt },
  { to: "/admin/leads", label: "Leads", icon: Inbox },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/admin/login" });
  };

  const SidebarLinks = (
    <nav className="flex-1 p-3 space-y-1">
      {nav.map((n) => {
        const active = n.exact ? path === n.to : path.startsWith(n.to);
        return (
          <Link
            key={n.to}
            to={n.to as never}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
              active
                ? "bg-sidebar-accent text-sidebar-primary-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            }`}
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Desktop sidebar */}
      <aside className="admin-sidebar hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-sidebar-border font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MonitorSmartphone className="h-4 w-4" />
          </span>
          {SITE.name} Admin
        </div>
        {SidebarLinks}
        <div className="p-3 border-t border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="admin-sidebar relative w-64 flex flex-col bg-sidebar text-sidebar-foreground">
            <div className="h-16 flex items-center justify-between px-5 border-b border-sidebar-border font-bold">
              <span>{SITE.name} Admin</span>
              <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            {SidebarLinks}
            <div className="p-3 border-t border-sidebar-border">
              <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </Button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="admin-header h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6">
          <button className="md:hidden p-2" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="font-semibold">Admin Panel</div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">View site →</Link>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export function AdminGate({ loading, isAdmin, children }: { loading: boolean; isAdmin: boolean; children: ReactNode }) {
  const navigate = useNavigate();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (!isAdmin) {
    navigate({ to: "/admin/login" });
    return null;
  }
  return <>{children}</>;
}
