import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MonitorSmartphone } from "lucide-react";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: `Admin Login — ${SITE.name}` }, { name: "robots", content: "noindex" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@alfaax");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in as admin, bounce to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
        if (data) navigate({ to: "/admin" });
      }
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Try sign in
    let { error } = await supabase.auth.signInWithPassword({ email, password });
    // If admin doesn't exist yet, sign up (first-run bootstrap)
    if (error && /invalid/i.test(error.message) && email === "admin@alfaax") {
      const { error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      if (signUpErr) {
        setLoading(false);
        toast.error(signUpErr.message);
        return;
      }
      const r = await supabase.auth.signInWithPassword({ email, password });
      error = r.error;
    }
    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }
    // Verify role
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }
    const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
    setLoading(false);
    if (!role) {
      await supabase.auth.signOut();
      toast.error("This account does not have admin access.");
      return;
    }
    toast.success("Welcome back!");
    navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--gradient-soft)" }}>
      <Card className="w-full max-w-md p-8" style={{ boxShadow: "var(--shadow-elevated)" }}>
        <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MonitorSmartphone className="h-5 w-5" />
          </span>
          {SITE.name} Admin
        </Link>
        <h1 className="text-2xl font-bold">Sign in</h1>
        {/* <p className="text-sm text-muted-foreground mt-1">Default: admin@alfaax.com / admin123</p> */}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
        </form>
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary block mt-4 text-center">← Back to website</Link>
      </Card>
    </div>
  );
}
