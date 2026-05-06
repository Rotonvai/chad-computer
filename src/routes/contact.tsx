import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

type CourseOption = { id: string; name: string };

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
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", course_interest: course ?? "", message: "" });

  useEffect(() => {
    supabase
      .from("courses")
      .select("id,name")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => setCourseOptions(data ?? []));
  }, []);

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
      <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "var(--gradient-soft)" }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(82,63,255,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),_transparent_28%)]" />
        <div className="relative container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 md:p-12 shadow-sm">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Get in Touch</span>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Contact us for the best computer training guidance.</h1>
              <p className="mt-5 max-w-2xl text-base md:text-lg text-slate-600 leading-relaxed">Share your details and course interest, and our team will guide you to the right program with schedule and pricing information.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Quick response", value: "WhatsApp and form support" },
                  { label: "Flexible timing", value: "Morning, afternoon and evening batches" },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="text-sm font-semibold text-slate-900">{item.label}</div>
                    <div className="mt-1 text-sm text-slate-600">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm uppercase font-semibold tracking-[0.18em] text-slate-500">Call us</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{SITE.phone}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm uppercase font-semibold tracking-[0.18em] text-slate-500">Email</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{SITE.email}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm uppercase font-semibold tracking-[0.18em] text-slate-500">Location</p>
                  <p className="mt-2 text-slate-700">{SITE.address}</p>
                </div>
              </div>
              <Button asChild className="mt-8 w-full">
                <a href={waLink(`Hi ${SITE.name}, I'd like to know more about your courses.`)} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
              </Button>
            </div>
          </div>
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
                  <select
                    id="course"
                    value={form.course_interest}
                    onChange={(e) => setForm({ ...form, course_interest: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="">Select a course</option>
                    {courseOptions.map((courseOption) => (
                      <option key={courseOption.id} value={courseOption.name}>
                        {courseOption.name}
                      </option>
                    ))}
                  </select>
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
