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
      <section className="py-14 md:py-20" style={{ background: "var(--gradient-soft)" }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Our Courses</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">Pick a course that matches your goals — beginner-friendly to advanced. All courses include hands-on lab time.</p>
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
