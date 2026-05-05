import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell, AdminGate } from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/courses")({
  head: () => ({ meta: [{ title: "Courses — Admin" }, { name: "robots", content: "noindex" }] }),
  component: CoursesAdminPage,
});

type Course = { id: string; name: string; slug: string; description: string; duration: string; fee: number; is_active: boolean; sort_order: number };

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const empty = { name: "", slug: "", description: "", duration: "", fee: 0, is_active: true, sort_order: 0 };

function CoursesAdminPage() {
  const auth = useAdminAuth();
  return <AdminGate loading={auth.loading} isAdmin={auth.isAdmin}><AdminShell><CoursesAdmin /></AdminShell></AdminGate>;
}

function CoursesAdmin() {
  const [list, setList] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const { data } = await supabase.from("courses").select("*").order("sort_order");
    setList(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditId(null); setForm({ ...empty, sort_order: list.length + 1 }); setOpen(true); };
  const openEdit = (c: Course) => {
    setEditId(c.id);
    setForm({ name: c.name, slug: c.slug, description: c.description, duration: c.duration, fee: Number(c.fee), is_active: c.is_active, sort_order: c.sort_order });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    const payload = { ...form, name: form.name.trim(), slug: (form.slug || slugify(form.name)) };
    const { error } = editId
      ? await supabase.from("courses").update(payload).eq("id", editId)
      : await supabase.from("courses").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(editId ? "Course updated" : "Course added");
    setOpen(false); load();
  };

  const requestDelete = (id: string) => {
    setDeleteTarget(id);
    setConfirmOpen(true);
  };

  const remove = async (id: string) => {
    setConfirmOpen(false);
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted"); load();
  };

  const toggleActive = async (c: Course) => {
    await supabase.from("courses").update({ is_active: !c.is_active }).eq("id", c.id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="text-muted-foreground text-sm">These appear on the public website.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add Course</Button>
      </div>

      <Card className="p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right w-40">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.sort_order}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.duration}</TableCell>
                <TableCell>৳{Number(c.fee).toLocaleString("en-IN")}</TableCell>
                <TableCell>
                  <Badge variant={c.is_active ? "default" : "secondary"} className="cursor-pointer" onClick={() => toggleActive(c)}>
                    {c.is_active ? "Active" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => requestDelete(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editId ? "Edit Course" : "Add Course"}</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editId ? form.slug : slugify(e.target.value) })} /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} /></div>
            <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div><Label>Duration</Label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="3 Months" /></div>
              <div><Label>Fee (৳)</Label><Input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })} /></div>
              <div><Label>Sort</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
            </div>
            <div className="flex items-center gap-3"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label>Active (visible on site)</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editId ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete course?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the course from the site and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && remove(deleteTarget)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </Dialog>
    </div>
  );
}
