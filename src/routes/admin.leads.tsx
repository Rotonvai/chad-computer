import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Phone, Mail } from "lucide-react";
import { AdminShell, AdminGate } from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({ meta: [{ title: "Leads — Admin" }, { name: "robots", content: "noindex" }] }),
  component: LeadsPage,
});

type Lead = { id: string; name: string; phone: string; email: string | null; course_interest: string | null; message: string | null; status: string; created_at: string };

function LeadsPage() {
  const auth = useAdminAuth();
  return <AdminGate loading={auth.loading} isAdmin={auth.isAdmin}><AdminShell><Leads /></AdminShell></AdminGate>;
}

function Leads() {
  const [list, setList] = useState<Lead[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const load = async () => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setList(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    await supabase.from("leads").update({ status }).eq("id", id); load();
  };
  const requestDelete = (id: string) => {
    setDeleteTarget(id);
    setConfirmOpen(true);
  };

  const remove = async (id: string) => {
    setConfirmOpen(false);
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="text-muted-foreground text-sm">Submissions from the website contact form.</p>
      </div>
      <Card className="p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No leads yet.</TableCell></TableRow>}
            {list.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell className="text-sm">
                  <a href={`tel:${l.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="h-3 w-3" />{l.phone}</a>
                  {l.email && <a href={`mailto:${l.email}`} className="flex items-center gap-1 hover:text-primary mt-1"><Mail className="h-3 w-3" />{l.email}</a>}
                </TableCell>
                <TableCell>{l.course_interest || "—"}</TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">{l.message || "—"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Select value={l.status} onValueChange={(v) => setStatus(l.id, v)}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new"><Badge variant="default">New</Badge></SelectItem>
                      <SelectItem value="contacted"><Badge variant="secondary">Contacted</Badge></SelectItem>
                      <SelectItem value="converted"><Badge>Converted</Badge></SelectItem>
                      <SelectItem value="closed"><Badge variant="outline">Closed</Badge></SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell><Button size="icon" variant="ghost" onClick={() => requestDelete(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete lead?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the lead from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && remove(deleteTarget)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </Card>
    </div>
  );
}
