import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SITE, waLink } from "@/lib/site-config";

type Search = { course?: string };

export const Route = createFileRoute("/contact")({
  validateSearch: (s: Record<string, unknown>): Search => ({ course: typeof s.course === "string" ? s.course : undefined }),
  head: () => ({
    meta: [
      { title: `Contact — ${SITE.name}` },
      { name: "description", content: `Get in touch with ${SITE.name}. Visit our coaching center, call us, or send us a message.` },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().min(7, "Enter a valid phone").max(30),
  email: z.string().trim().email("Enter a valid email").max(200).optional().or(z.literal("")),
  course_interest: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

function ContactPage() {
  const { course } = Route.useSearch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", course_interest: course ?? "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      course_interest: parsed.data.course_interest || null,
      message: parsed.data.message || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Could not send. Please try WhatsApp or phone.");
      return;
    }
    toast.success("Thanks! We'll get back to you shortly.");
    setForm({ name: "", phone: "", email: "", course_interest: "", message: "" });
  };

  return (
    <SiteLayout>
      <section className="py-14 md:py-20" style={{ background: "var(--gradient-soft)" }}>
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold">Get in Touch</h1>
          <p className="mt-3 text-muted-foreground">We'd love to hear from you. Reach out via the form, WhatsApp, or just walk in.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-bold">Send us a message</h2>
            <form onSubmit={submit} className="mt-6 grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={120} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required maxLength={30} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={200} />
                </div>
                <div>
                  <Label htmlFor="course">Course Interested In</Label>
                  <Input id="course" value={form.course_interest} onChange={(e) => setForm({ ...form, course_interest: e.target.value })} maxLength={120} />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={2000} />
              </div>
              <Button type="submit" disabled={loading} size="lg">{loading ? "Sending..." : "Send Message"}</Button>
            </form>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Reach Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3"><Phone className="h-5 w-5 text-primary mt-0.5" /><div><div className="font-medium">{SITE.phone}</div><div className="text-muted-foreground">Mon–Sat, 9am–8pm</div></div></li>
              <li className="flex gap-3"><Mail className="h-5 w-5 text-primary mt-0.5" /><div className="font-medium">{SITE.email}</div></li>
              <li className="flex gap-3"><MapPin className="h-5 w-5 text-primary mt-0.5" /><div>{SITE.address}</div></li>
            </ul>
            <Button asChild variant="outline" className="w-full mt-5">
              <a href={waLink(`Hi ${SITE.name}, I'd like to know more.`)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-1" /> Chat on WhatsApp
              </a>
            </Button>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <Card className="overflow-hidden">
          <iframe
            src={SITE.mapEmbed}
            width="100%"
            height="380"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${SITE.name} location`}
          />
        </Card>
      </section>
    </SiteLayout>
  );
}
