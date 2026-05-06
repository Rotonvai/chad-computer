import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SITE, waLink } from "@/lib/site-config";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: `Courses — ${SITE.name}` },
      { name: "description", content: "Browse all computer courses offered at AlfaaX: Basic Computer, MS Office, Tally, DTP, Web Designing, Python and more." },
    ],
  }),
  component: CoursesPage,
});

type Course = { id: string; name: string; slug: string; description: string; duration: string; fee: number };

function CoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  useEffect(() => {
    supabase.from("courses").select("id,name,slug,description,duration,fee").eq("is_active", true).order("sort_order")
      .then(({ data }) => setCourses(data ?? []));
  }, []);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden py-16 md:py-24" style={{ background: "var(--gradient-soft)" }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(82,63,255,0.16),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.12),_transparent_28%)]" />
        <div className="relative container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] items-center">
            <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 md:p-12 shadow-sm">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Our Courses</span>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Learn the skills that make you ready for work.</h1>
              <p className="mt-5 max-w-2xl text-base md:text-lg text-slate-600 leading-relaxed">Choose from beginner to advanced courses with hands-on classes, project work, and real-world tools. Every course is built to help you gain confidence and practical ability.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Live practical training",
                  "Modern computer labs",
                  "Small batch sizes",
                  "Placement support",
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="sm:max-w-max">
                  <Link to="/contact">Get in touch</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="sm:max-w-max">
                  <Link to="/about">Why choose us</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              <Card className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
                <div className="text-sm uppercase font-semibold tracking-[0.18em] text-slate-500">Why this page</div>
                <p className="mt-5 text-slate-600">Browse all active courses and compare duration, fee, and what you will learn. Each card includes quick contact actions so you can inquire without delay.</p>
              </Card>
              <Card className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="text-sm uppercase font-semibold tracking-[0.18em] text-slate-500">Course styles</div>
                <div className="mt-5 space-y-4 text-slate-700">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">Beginner-friendly lessons</div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">Practical labs with trainer support</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        {courses === null ? (
          <div className="text-center text-muted-foreground py-20">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">No courses available right now. Please check back soon.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <Card key={c.id} className="p-6 flex flex-col hover:translate-y-[-2px] transition" style={{ boxShadow: "var(--shadow-card)" }}>
                <h3 className="text-xl font-semibold">{c.name}</h3>
                <p className="text-sm text-muted-foreground mt-2 flex-1">{c.description}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {c.duration}</span>
                  <span className="flex items-center gap-1 font-semibold text-foreground"><span>৳</span>{Number(c.fee).toLocaleString("en-IN")}</span>
                </div>
                <div className="mt-5 flex gap-2">
                  <Button asChild className="flex-1">
                    <a href={waLink(`Hi ${SITE.name}, I'm interested in ${c.name}. Please share details.`)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-1" /> WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/contact" search={{ course: c.name }}>Enquire</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
