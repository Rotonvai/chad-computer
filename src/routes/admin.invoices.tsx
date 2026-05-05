import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Eye, Printer, ArrowLeft } from "lucide-react";
import { AdminShell, AdminGate } from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/admin/invoices")({
  head: () => ({ meta: [{ title: "Invoices — Admin" }, { name: "robots", content: "noindex" }] }),
  component: InvoicesPage,
});

type Student = { id: string; full_name: string };
type Course = { id: string; name: string; fee: number };
type Invoice = {
  id: string; invoice_no: number; student_id: string; course_id: string | null;
  total_amount: number; notes: string | null; issued_on: string;
  students?: { full_name: string } | null; courses?: { name: string } | null;
};
type Installment = { id: string; invoice_id: string; label: string; amount: number; due_date: string; paid_amount: number };

function InvoicesPage() {
  const auth = useAdminAuth();
  return <AdminGate loading={auth.loading} isAdmin={auth.isAdmin}><AdminShell><Invoices /></AdminShell></AdminGate>;
}

function Invoices() {
  const [list, setList] = useState<Invoice[]>([]);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [filter, setFilter] = useState<"all" | "paid" | "partial" | "overdue">("all");
  const [openNew, setOpenNew] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const load = async () => {
    const [{ data: inv }, { data: inst }] = await Promise.all([
      supabase.from("invoices").select("*, students(full_name), courses(name)").order("created_at", { ascending: false }),
      supabase.from("installments").select("*"),
    ]);
    setList((inv as Invoice[]) ?? []);
    setInstallments(inst ?? []);
  };
  useEffect(() => { load(); }, []);

  const summary = (id: string) => {
    const items = installments.filter((i) => i.invoice_id === id);
    const total = items.reduce((a, i) => a + Number(i.amount), 0);
    const paid = items.reduce((a, i) => a + Number(i.paid_amount), 0);
    const overdue = items.some((i) => Number(i.paid_amount) < Number(i.amount) && new Date(i.due_date) < new Date());
    const status = paid >= total && total > 0 ? "paid" : paid > 0 ? "partial" : "unpaid";
    return { total, paid, pending: Math.max(total - paid, 0), status, overdue };
  };

  const filtered = list.filter((i) => {
    if (filter === "all") return true;
    const s = summary(i.id);
    if (filter === "paid") return s.status === "paid";
    if (filter === "partial") return s.status === "partial" || s.status === "unpaid";
    if (filter === "overdue") return s.overdue;
    return true;
  });

  const requestDelete = (id: string) => {
    setDeleteTarget(id);
    setConfirmOpen(true);
  };

  const remove = async (id: string) => {
    setConfirmOpen(false);
    const { error } = await supabase.from("invoices").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  if (selected) {
    return <InvoiceDetail invoice={selected} onBack={() => { setSelected(null); load(); }} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground text-sm">Generate invoices, track installments and payments.</p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partial">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setOpenNew(true)}><Plus className="h-4 w-4 mr-1" /> New Invoice</Button>
        </div>
      </div>

      <Card className="p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No invoices yet.</TableCell></TableRow>}
            {filtered.map((i) => {
              const s = summary(i.id);
              return (
                <TableRow key={i.id}>
                  <TableCell className="font-mono">#{i.invoice_no}</TableCell>
                  <TableCell className="font-medium">{i.students?.full_name ?? "—"}</TableCell>
                  <TableCell>{i.courses?.name ?? "—"}</TableCell>
                  <TableCell>{i.issued_on}</TableCell>
                  <TableCell>৳{s.total.toLocaleString("en-IN")}</TableCell>
                  <TableCell>৳{s.paid.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    {s.status === "paid" ? <Badge className="bg-success text-success-foreground">Paid</Badge>
                      : s.overdue ? <Badge variant="destructive">Overdue</Badge>
                      : s.status === "partial" ? <Badge variant="secondary">Partial</Badge>
                      : <Badge variant="outline">Unpaid</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => setSelected(i)}><Eye className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => requestDelete(i.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the invoice and any associated installments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && remove(deleteTarget)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <NewInvoiceDialog open={openNew} onOpenChange={setOpenNew} onCreated={load} />
    </div>
  );
}

function NewInvoiceDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; onCreated: () => void }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [notes, setNotes] = useState("");
  const [issuedOn, setIssuedOn] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<{ label: string; amount: number; due_date: string }[]>([
    { label: "Installment 1", amount: 0, due_date: new Date().toISOString().slice(0, 10) },
  ]);

  useEffect(() => {
    if (!open) return;
    supabase.from("students").select("id,full_name").order("full_name").then(({ data }) => setStudents(data ?? []));
    supabase.from("courses").select("id,name,fee").order("sort_order").then(({ data }) => setCourses((data ?? []) as Course[]));
  }, [open]);

  const onCourseChange = (v: string) => {
    setCourseId(v);
    const c = courses.find((c) => c.id === v);
    if (c) setItems([{ label: "Installment 1", amount: Number(c.fee), due_date: issuedOn }]);
  };

  const total = items.reduce((a, i) => a + Number(i.amount || 0), 0);

  const addItem = () => setItems([...items, { label: `Installment ${items.length + 1}`, amount: 0, due_date: issuedOn }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, patch: Partial<typeof items[0]>) => setItems(items.map((it, i) => i === idx ? { ...it, ...patch } : it));

  const create = async () => {
    if (!studentId) { toast.error("Select a student"); return; }
    if (items.length === 0 || total <= 0) { toast.error("Add at least one installment"); return; }
    const { data: inv, error } = await supabase.from("invoices").insert({
      student_id: studentId, course_id: courseId || null, total_amount: total, notes: notes || null, issued_on: issuedOn,
    }).select().single();
    if (error || !inv) { toast.error(error?.message ?? "Failed"); return; }
    const rows = items.map((i) => ({ invoice_id: inv.id, label: i.label, amount: i.amount, due_date: i.due_date }));
    const { error: ie } = await supabase.from("installments").insert(rows);
    if (ie) { toast.error(ie.message); return; }
    toast.success(`Invoice #${inv.invoice_no} created`);
    onOpenChange(false); onCreated();
    setStudentId(""); setCourseId(""); setNotes(""); setItems([{ label: "Installment 1", amount: 0, due_date: issuedOn }]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>New Invoice</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Student *</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>{students.map((s) => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course</Label>
              <Select value={courseId} onValueChange={onCourseChange}>
                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent>{courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} (৳{Number(c.fee).toLocaleString("en-IN")})</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>Issued On</Label><Input type="date" value={issuedOn} onChange={(e) => setIssuedOn(e.target.value)} /></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Installments</Label>
              <Button size="sm" variant="outline" onClick={addItem}><Plus className="h-3 w-3 mr-1" />Add</Button>
            </div>
            <div className="space-y-2">
              {items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5"><Input placeholder="Label" value={it.label} onChange={(e) => updateItem(idx, { label: e.target.value })} /></div>
                  <div className="col-span-3"><Input type="number" placeholder="Amount" value={it.amount} onChange={(e) => updateItem(idx, { amount: Number(e.target.value) })} /></div>
                  <div className="col-span-3"><Input type="date" value={it.due_date} onChange={(e) => updateItem(idx, { due_date: e.target.value })} /></div>
                  <div className="col-span-1"><Button size="icon" variant="ghost" onClick={() => removeItem(idx)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
                </div>
              ))}
            </div>
            <div className="text-right text-sm mt-2">Total: <strong>৳{total.toLocaleString("en-IN")}</strong></div>
          </div>
          <div><Label>Notes</Label><Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={create}>Create Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InvoiceDetail({ invoice, onBack }: { invoice: Invoice; onBack: () => void }) {
  const [items, setItems] = useState<Installment[]>([]);
  const [payments, setPayments] = useState<Record<string, { id: string; amount: number; paid_on: string; method: string }[]>>({});
  const [payOpen, setPayOpen] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState(0);
  const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));
  const [payMethod, setPayMethod] = useState("cash");

  const load = async () => {
    const { data: inst } = await supabase.from("installments").select("*").eq("invoice_id", invoice.id).order("due_date");
    setItems(inst ?? []);
    if (inst && inst.length) {
      const { data: pays } = await supabase.from("payments").select("id,amount,paid_on,method,installment_id").in("installment_id", inst.map((i) => i.id));
      const grouped: typeof payments = {};
      (pays ?? []).forEach((p: { id: string; amount: number; paid_on: string; method: string; installment_id: string }) => {
        (grouped[p.installment_id] ||= []).push({ id: p.id, amount: Number(p.amount), paid_on: p.paid_on, method: p.method });
      });
      setPayments(grouped);
    }
  };
  useEffect(() => { load(); }, [invoice.id]);

  const total = items.reduce((a, i) => a + Number(i.amount), 0);
  const paid = items.reduce((a, i) => a + Number(i.paid_amount), 0);

  const recordPayment = async (instId: string) => {
    if (payAmount <= 0) { toast.error("Enter amount"); return; }
    const { error } = await supabase.from("payments").insert({ installment_id: instId, amount: payAmount, paid_on: payDate, method: payMethod });
    if (error) { toast.error(error.message); return; }
    toast.success("Payment recorded"); setPayOpen(null); setPayAmount(0); load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1" /> Print</Button>
      </div>
      <Card className="p-8" id="print-area">
        <div className="flex items-start justify-between flex-wrap gap-4 border-b border-border pb-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">{SITE.name}</h1>
            <p className="text-sm text-muted-foreground">{SITE.tagline}</p>
            <p className="text-xs text-muted-foreground mt-1">{SITE.address}</p>
            <p className="text-xs text-muted-foreground">{SITE.phone} · {SITE.email}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">INVOICE</div>
            <div className="font-mono text-sm">#{invoice.invoice_no}</div>
            <div className="text-xs text-muted-foreground mt-1">Issued: {invoice.issued_on}</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-xs uppercase text-muted-foreground">Bill To</div>
            <div className="font-semibold mt-1">{invoice.students?.full_name}</div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">Course</div>
            <div className="font-semibold mt-1">{invoice.courses?.name ?? "—"}</div>
          </div>
        </div>

        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Installment</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="print:hidden text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((i) => {
              const due = Number(i.amount) - Number(i.paid_amount);
              const isPaid = due <= 0;
              const overdue = !isPaid && new Date(i.due_date) < new Date();
              return (
                <TableRow key={i.id}>
                  <TableCell>{i.label}</TableCell>
                  <TableCell>{i.due_date}</TableCell>
                  <TableCell>৳{Number(i.amount).toLocaleString("en-IN")}</TableCell>
                  <TableCell>৳{Number(i.paid_amount).toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    {isPaid ? <Badge className="bg-success text-success-foreground">Paid</Badge>
                      : overdue ? <Badge variant="destructive">Overdue</Badge>
                      : <Badge variant="secondary">Pending</Badge>}
                  </TableCell>
                  <TableCell className="print:hidden text-right">
                    {!isPaid && <Button size="sm" onClick={() => { setPayOpen(i.id); setPayAmount(due); }}>Record Payment</Button>}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="mt-4 flex justify-end">
          <div className="w-full sm:w-72 space-y-1 text-sm">
            <div className="flex justify-between"><span>Total</span><span>৳{total.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between text-success"><span>Paid</span><span>৳{paid.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between font-bold border-t border-border pt-2"><span>Balance Due</span><span>৳{(total - paid).toLocaleString("en-IN")}</span></div>
          </div>
        </div>

        {Object.keys(payments).length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Payment History</h3>
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Installment</TableHead><TableHead>Method</TableHead><TableHead>Amount</TableHead></TableRow></TableHeader>
              <TableBody>
                {items.flatMap((i) => (payments[i.id] ?? []).map((p) => (
                  <TableRow key={p.id}><TableCell>{p.paid_on}</TableCell><TableCell>{i.label}</TableCell><TableCell className="capitalize">{p.method}</TableCell><TableCell>৳{p.amount.toLocaleString("en-IN")}</TableCell></TableRow>
                )))}
              </TableBody>
            </Table>
          </div>
        )}

        {invoice.notes && <p className="mt-6 text-sm text-muted-foreground"><strong>Notes:</strong> {invoice.notes}</p>}
      </Card>

      <Dialog open={!!payOpen} onOpenChange={(v) => !v && setPayOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div><Label>Amount (৳)</Label><Input type="number" value={payAmount} onChange={(e) => setPayAmount(Number(e.target.value))} /></div>
            <div><Label>Date</Label><Input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} /></div>
            <div>
              <Label>Method</Label>
              <Select value={payMethod} onValueChange={setPayMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayOpen(null)}>Cancel</Button>
            <Button onClick={() => payOpen && recordPayment(payOpen)}>Save Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
