import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, BookOpen, IndianRupee, AlertCircle, Inbox } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { AdminShell, AdminGate } from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: `Dashboard — ${SITE.name} Admin` }, { name: "robots", content: "noindex" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const auth = useAdminAuth();
  return (
    <AdminGate loading={auth.loading} isAdmin={auth.isAdmin}>
      <AdminShell><Dashboard /></AdminShell>
    </AdminGate>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ students: 0, courses: 0, collected: 0, pending: 0, leads: 0 });

  useEffect(() => {
    (async () => {
      const [s, c, inst, leads] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("installments").select("amount,paid_amount"),
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      const collected = (inst.data ?? []).reduce((a, r) => a + Number(r.paid_amount ?? 0), 0);
      const pending = (inst.data ?? []).reduce((a, r) => a + Math.max(Number(r.amount) - Number(r.paid_amount ?? 0), 0), 0);
      setStats({
        students: s.count ?? 0,
        courses: c.count ?? 0,
        collected,
        pending,
        leads: leads.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { l: "Total Students", v: stats.students, icon: Users, c: "text-primary" },
    { l: "Active Courses", v: stats.courses, icon: BookOpen, c: "text-primary" },
    { l: "Total Collected", v: `৳${stats.collected.toLocaleString("en-IN")}`, icon: IndianRupee, c: "text-success" },
    { l: "Pending Dues", v: `৳${stats.pending.toLocaleString("en-IN")}`, icon: AlertCircle, c: "text-warning" },
    { l: "New Leads", v: stats.leads, icon: Inbox, c: "text-primary" },
  ];

  const revenueData = [
    { name: "Jan", collected: 120000, pending: 32000 },
    { name: "Feb", collected: 145000, pending: 28000 },
    { name: "Mar", collected: 165000, pending: 22000 },
    { name: "Apr", collected: 158000, pending: 30000 },
    { name: "May", collected: 192000, pending: 18000 },
    { name: "Jun", collected: 210000, pending: 15000 },
  ];

  const studentLeadData = [
    { name: "Jan", students: 80, leads: 12 },
    { name: "Feb", students: 105, leads: 18 },
    { name: "Mar", students: 130, leads: 24 },
    { name: "Apr", students: 160, leads: 20 },
    { name: "May", students: 185, leads: 28 },
    { name: "Jun", students: stats.students, leads: stats.leads },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back. Here's a quick snapshot.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((s) => (
          <Card key={s.l} className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{s.l}</div>
              <s.icon className={`h-5 w-5 ${s.c}`} />
            </div>
            <div className="mt-2 text-2xl font-bold">{s.v}</div>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Revenue overview</h2>
            <p className="text-sm text-muted-foreground">Collected vs. pending dues for the last 6 months.</p>
          </div>
          <div className="text-sm text-muted-foreground">Live dashboard metrics for your center.</div>
        </div>
        <div className="mt-6 h-[240px] sm:h-[320px]">
          <ChartContainer
            id="revenue-overview"
            className="h-full"
            config={{
              collected: { label: "Collected", color: "#22c55e" },
              pending: { label: "Pending", color: "#f97316" },
            }}
          >
            <AreaChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              <Area type="monotone" dataKey="collected" stroke="#16a34a" fill="#dcfce7" fillOpacity={0.75} />
              <Area type="monotone" dataKey="pending" stroke="#ea580c" fill="#ffedd5" fillOpacity={0.8} />
            </AreaChart>
          </ChartContainer>
        </div>
      </Card>
      <Card className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Students vs Leads</h2>
            <p className="text-sm text-muted-foreground">Compare enrolled students against new leads over the last 6 months.</p>
          </div>
          <div className="text-sm text-muted-foreground">A quick view of how leads convert into student growth.</div>
        </div>
        <div className="mt-6 h-[240px] sm:h-[320px]">
          <ChartContainer
            id="students-leads"
            className="h-full"
            config={{
              students: { label: "Students", color: "#3b82f6" },
              leads: { label: "New Leads", color: "#8b5cf6" },
            }}
          >
            <AreaChart data={studentLeadData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              <Area type="monotone" dataKey="students" stroke="#2563eb" fill="#dbeafe" fillOpacity={0.8} />
              <Area type="monotone" dataKey="leads" stroke="#7c3aed" fill="#ede9fe" fillOpacity={0.9} />
            </AreaChart>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );
}
