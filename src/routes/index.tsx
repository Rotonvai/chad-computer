import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, GraduationCap, Award, Users, Laptop, BadgeCheck, Briefcase } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { SITE, waLink } from "@/lib/site-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.name} — Computer Coaching Center` },
      { name: "description", content: "Job-ready computer courses with hands-on training. MS Office, Tally, DTP, Web Design, Python and more." },
    ],
  }),
  component: HomePage,
});

type Course = { id: string; name: string; slug: string; description: string; duration: string; fee: number };

function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    supabase.from("courses").select("id,name,slug,description,duration,fee").eq("is_active", true).order("sort_order").limit(3)
      .then(({ data }) => setCourses(data ?? []));
  }, []);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://scontent.fdac177-1.fna.fbcdn.net/v/t1.6435-9/79924904_2457862907875228_25595415218880512_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=2a1932&_nc_eui2=AeHsxco_gb7nyh52FElYbJzwGdxgh6jzgzUZ3GCHqPODNZD9FMxFCc5M9IbPChOcL0UnveudSIGyyWBBidGZ2fgw&_nc_ohc=b8FjUMDX2ikQ7kNvwHjVFS3&_nc_oc=Adqt8BSo0PGFumCol1w3YDlhQS9uqyfeChuG56mRAZH36GKLR6mqP4OcHHwsKkmwbcs&_nc_zt=23&_nc_ht=scontent.fdac177-1.fna&_nc_gid=McZ_LDIWrk4BHVXrglELvQ&_nc_ss=7b2a8&oh=00_Af7qmKbOhivXRPO5TNNReLd-zkTxwTn4K1u2ct2TlQ9aUA&oe=6A24E3EA"
            alt="Students learning in a computer classroom"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/65" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-primary-foreground">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm font-medium mb-6 backdrop-blur-sm border border-white/15">
              <span className="h-2 w-2 rounded-full bg-primary" /> Admissions Open · Limited Seats
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Transform your future with <span className="text-primary-glow">practical computer training</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
              {SITE.name} helps learners gain job-ready skills through hands-on classes, modern labs, and placement support. Start now with courses built for real career outcomes.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link to="/courses">Browse Courses <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/15">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: "1500+", l: "Students Trained" },
            { n: "10+", l: "Expert Faculty" },
            { n: "20+", l: "Courses Offered" },
            { n: "95%", l: "Placement Support" },
          ].map((s) => (
            <Card key={s.l} className="p-5 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="text-2xl md:text-3xl font-bold text-primary">{s.n}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-end text-right ml-5">
            <span className="text-3xl md:text-4xl font-bold text-primary uppercase tracking-widest">About Us</span>
            <div className="mt-6 rounded-3xl overflow-hidden border border-border w-full max-w-xl">
              <img
                src="https://scontent.fdac177-2.fna.fbcdn.net/v/t1.6435-9/167919607_2861540914174090_6693552372810333560_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=53a332&_nc_eui2=AeGpru44IUaiPzsSt-8OFZqFZ_hN8WuRNPpn-E3xa5E0-lhQeis4azbEP0Ggj70pZOcUg6j_LfvwTzBj6UHFxZuK&_nc_ohc=IlmiGFUYNOYQ7kNvwHOpU8J&_nc_oc=Adp7nX6KsaZB1UXBl5-G7Az3vJh1NZSlAtUl6Awut5YqeUejwVCLQDB52wNot-R3Ga8&_nc_zt=23&_nc_ht=scontent.fdac177-2.fna&_nc_gid=UjPTZgsZyHvSJvUy0p4mQw&_nc_ss=7b2a8&oh=00_Af5fDITCdu2fmuNf5hX7w6tNUv-kQUqlLubv5XE1EKQFxw&oe=6A251ACA"
                alt="Students and instructors during a computer training session"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Where Skills Meet Opportunity</h2>
            <p className="text-muted-foreground leading-relaxed">
              {SITE.name} is a leading computer coaching center dedicated to empowering students with practical digital skills. Our curriculum blends theory with hands-on lab work so every learner can confidently step into the workplace.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We focus on small batch sizes, personal attention, and real-world projects — because that's how you actually learn.
            </p>
            <Button asChild className="mt-6">
              <Link to="/about">Learn more <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

       {/* Featured courses */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">Popular</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Featured Courses</h2>
          </div>
          <Button asChild variant="outline"><Link to="/courses">View all courses</Link></Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((c) => (
            <Card key={c.id} className="p-6 flex flex-col" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="text-xl font-semibold">{c.name}</h3>
              <p className="text-sm text-muted-foreground mt-2 flex-1">{c.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div>
                  <div className="text-xs text-muted-foreground">{c.duration}</div>
                  <div className="font-bold text-primary">৳{Number(c.fee).toLocaleString("en-IN")}</div>
                </div>
                <Button asChild size="sm">
                  <Link to="/contact">Enquire</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">A learning experience built for results</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              { icon: BadgeCheck, t: "Industry-aligned syllabus", d: "Curriculum updated regularly to match what employers actually need." },
              { icon: Users, t: "Small batch sizes", d: "Personal attention and one-on-one doubt clearing for every student." },
              { icon: Laptop, t: "100% practical", d: "Every concept is reinforced with real lab exercises and projects." },
            ].map((f) => (
              <Card key={f.t} className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mt-4">{f.t}</h3>
                <p className="text-muted-foreground mt-2">{f.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="p-10 text-center" style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-elevated)" }}>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Ready to start your journey?</h2>
          <p className="mt-3 text-primary-foreground/90 max-w-xl mx-auto">Talk to our counsellors and pick the right course for your goals.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" variant="secondary"><Link to="/contact">Book a Free Counselling</Link></Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
              <a href={waLink()} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
            </Button>
          </div>
        </Card>
      </section>
    </SiteLayout>
  );
}
