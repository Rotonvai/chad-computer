import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Eye, Heart } from "lucide-react";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About — ${SITE.name}` },
      { name: "description", content: `Learn about ${SITE.name} — our mission, our trainers, and how we help students build careers in technology.` },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="py-14 md:py-20" style={{ background: "var(--gradient-soft)" }}>
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold">About {SITE.name}</h1>
          <p className="mt-4 text-muted-foreground text-lg">A computer coaching center built on practical learning, personal attention, and real outcomes.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Target, t: "Our Mission", d: "Make quality computer education accessible to every student in our community." },
            { icon: Eye, t: "Our Vision", d: "Become the most trusted starting point for anyone beginning a career in technology." },
            { icon: Heart, t: "Our Values", d: "Honesty, hard work, and student-first decisions in everything we do." },
          ].map((b) => (
            <Card key={b.t} className="p-6">
              <b.icon className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold mt-3">{b.t}</h3>
              <p className="mt-2 text-muted-foreground">{b.d}</p>
            </Card>
          ))}
        </div>

        <div className="mt-16 prose-style max-w-3xl mx-auto text-muted-foreground space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Our Story</h2>
          <p>What started as a small computer literacy program has grown into a full-fledged coaching center offering everything from basic computing to programming. Over the years, we've helped hundreds of students land their first jobs, switch careers, or just become more confident with technology.</p>
          <p>We keep batch sizes small on purpose. It means our trainers actually know each student by name — and can adapt the pace to suit you, not the other way around.</p>
          <h2 className="text-2xl font-bold text-foreground">What you get with us</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Updated, industry-aligned syllabus</li>
            <li>Dedicated lab time on modern hardware</li>
            <li>Project-based learning — not just slides</li>
            <li>Resume help and interview preparation</li>
            <li>Flexible morning, afternoon and evening batches</li>
          </ul>
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg"><Link to="/courses">Explore our courses</Link></Button>
        </div>
      </section>
    </SiteLayout>
  );
}
