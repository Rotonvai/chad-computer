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
      <section className="bg-slate-50 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr] items-start">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 md:p-12 shadow-sm">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">About {SITE.name}</span>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Practical computer learning, personal attention, and real career results.</h1>
              <p className="mt-5 max-w-2xl text-base md:text-lg text-slate-600 leading-relaxed">From basic computer skills to programming, our coaching center combines live practice, updated technology, and small batch training so every student gains confidence and real workplace ability.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Small batches for focused learning",
                  "Hands-on exercises in every class",
                  "Resume and interview preparation",
                  "Flexible schedules for all learners",
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="sm:max-w-max">
                  <Link to="/contact">Get in touch</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="sm:max-w-max">
                  <Link to="/courses">Explore courses</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
                <div className="text-sm uppercase font-semibold tracking-[0.18em] text-slate-500">Why choose us</div>
                <div className="mt-6 space-y-4 text-sm text-slate-700">
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <div className="font-semibold">Small batch sizes</div>
                    <div className="mt-1 text-slate-500">Personal coaching and a pace that suits you.</div>
                  </div>
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <div className="font-semibold">Practical training</div>
                    <div className="mt-1 text-slate-500">Learn by doing with real software and projects.</div>
                  </div>
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <div className="font-semibold">Career support</div>
                    <div className="mt-1 text-slate-500">Get resume help, interview coaching, and placement guidance.</div>
                  </div>
                </div>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { value: "1500+", label: "Students trained" },
                  { value: "95%", label: "Placement support" },
                  { value: "10+", label: "Expert trainers" },
                  { value: "20+", label: "Courses offered" },
                ].map((stat) => (
                  <Card key={stat.label} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
                    <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                    <div className="mt-2 text-sm text-slate-500">{stat.label}</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
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
          <p>একটি ছোট কম্পিউটার সাক্ষরতা কার্যক্রম হিসেবে যা শুরু হয়েছিল, তা এখন বেসিক কম্পিউটিং থেকে শুরু করে প্রোগ্রামিং পর্যন্ত সবকিছু শেখানো একটি পূর্ণাঙ্গ কোচিং সেন্টারে পরিণত হয়েছে। বিগত বছরগুলোতে, আমরা শত শত শিক্ষার্থীকে তাদের প্রথম চাকরি পেতে, পেশা পরিবর্তন করতে, অথবা প্রযুক্তিতে আরও আত্মবিশ্বাসী হতে সাহায্য করেছি।</p>
          <p>আমরা ইচ্ছাকৃতভাবে ব্যাচের আকার ছোট রাখি। এর ফলে আমাদের প্রশিক্ষকরা প্রত্যেক শিক্ষার্থীকে নাম ধরে চেনেন এবং আপনার সুবিধা অনুযায়ী পাঠের গতি নির্ধারণ করতে পারেন, উল্টোটা নয়।</p>
          <h2 className="text-2xl font-bold text-foreground">What you get with us</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>হালনাগাদকৃত, শিল্পক্ষেত্রের সাথে সামঞ্জস্যপূর্ণ সিলেবাস</li>
            <li>আধুনিক হার্ডওয়্যারে নির্দিষ্ট ল্যাব সময়</li>
            <li>শুধু স্লাইড নয়, প্রকল্প-ভিত্তিক শিক্ষা</li>
            <li>জীবনবৃত্তান্ত তৈরিতে সহায়তা এবং সাক্ষাৎকারের প্রস্তুতি</li>
            <li>২৪/৭ সুবিধাজনক ব্যাচ</li>
          </ul>
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg"><Link to="/courses">Explore our courses</Link></Button>
        </div>
      </section>
    </SiteLayout>
  );
}
