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

        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground">আমাদের সেশন</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">আমরা সারা বছর জুড়ে নমনীয় সেশন সময়সূচী অফার করি যাতে আপনি আপনার সুবিধামত যেকোনো সময় যোগ দিতে পারেন। আমাদের কোর্সগুলি তিন এবং ছয় মাসের দুটি বিকল্পে পাওয়া যায়।</p>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card className="p-8 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm">
              <h3 className="text-xl font-bold text-foreground">৩ মাসের কোর্স</h3>
              <p className="mt-3 text-lg font-semibold text-primary">৪টি সেশন প্রতি বছর</p>
              <p className="mt-2 text-sm text-muted-foreground">জানুয়ারি, এপ্রিল, জুলাই এবং অক্টোবরে শুরু হয়</p>
            </Card>
            <Card className="p-8 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm">
              <h3 className="text-xl font-bold text-foreground">৬ মাসের কোর্স</h3>
              <p className="mt-3 text-lg font-semibold text-primary">২টি সেশন প্রতি বছর</p>
              <p className="mt-2 text-sm text-muted-foreground">জানুয়ারি এবং জুলাইতে শুরু হয়</p>
            </Card>
          </div>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-2">আমাদের প্রতিশ্রুতি</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">প্রতিটি কোর্স জুড়ে, আমরা শুধু শিক্ষা নয়, একটি সম্পূর্ণ অভিজ্ঞতা প্রদান করি। আমাদের সুসংগঠিত প্রক্রিয়া নিশ্চিত করে যে আপনি সর্বোত্তম শিক্ষার মান এবং সহায়তা পান।</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "সহজ ভর্তি প্রক্রিয়া", desc: "প্রতিটি সেশনের পূর্বে ভর্তি কার্যক্রম চালু থাকে। কোন জটিলতা নেই, শুধু সরল পদক্ষেপ।" },
              { title: "সার্টিফিকেট নিবন্ধন", desc: "সরকারি স্বীকৃত সার্টিফিকেটের জন্য বোর্ড রেজিস্ট্রেশন এবং সম্পূর্ণ সহায়তা প্রদান করি।" },
              { title: "কঠোর মূল্যায়ন পদ্ধতি", desc: "ইনস্টিটিউট এবং বোর্ড উভয় স্তরে তাত্ত্বিক এবং ব্যবহারিক পরীক্ষা নিশ্চিত করে দক্ষতা যাচাই।" },
              { title: "নবীন বরণ অনুষ্ঠান", desc: "প্রতিটি নতুন ব্যাচের জন্য একটি স্মরণীয় স্বাগত অনুষ্ঠানের আয়োজন করি।" },
              { title: "সাংস্কৃতিক বিকাশ", desc: "সাংস্কৃতিক প্রতিযোগিতা এবং কার্যক্রমের মাধ্যমে শিক্ষার্থীদের প্রতিভা বিকাশে সহায়তা।" },
              { title: "শিক্ষামূলক ভ্রমণ", desc: "প্রতিটি সেশনে শিক্ষা সফরের মাধ্যমে বাস্তব জগতের অভিজ্ঞতা অর্জন করুন।" },
              { title: "ক্যারিয়ার সহায়তা", desc: "চাকরি খুঁজে পেতে এবং সফল ক্যারিয়ার গড়ে তুলতে সম্পূর্ণ সহযোগিতা প্রদান করি।" },
              { title: "প্রতিভা বৃত্তি", desc: "প্রতিভাবান এবং দরিদ্র শিক্ষার্থীদের জন্য বিশেষ আর্থিক সহায়তা উপলব্ধ।" },
              { title: "নমনীয় ক্লাস সময়", desc: "প্রতিদিন ১.৫ ঘণ্টার সেশন সপ্তাহে ৬ দিন যা আপনার সময়সূচীর সাথে মানানসই।" },
              { title: "অত্যাধুনিক প্রশিক্ষণ", desc: "ইন্টারনেট, মাল্টিমিডিয়া এবং ফ্রিল্যান্সিং এ সাশ্রয়ী মূল্যে উন্নত প্রশিক্ষণ।" },
              { title: "স্বাস্থ্য ও সুস্থতা", desc: "শিক্ষার্থীদের শারীরিক এবং মানসিক সুস্থতার জন্য বিনোদন ও স্বাস্থ্য সুবিধা।" },
              { title: "আধুনিক সুবিধা", desc: "অত্যাধুনিক কম্পিউটার ল্যাব এবং শিক্ষা প্রযুক্তি সহ সম্পূর্ণ প্রস্তুত পরিবেশ।" },
            ].map((item) => (
              <Card key={item.title} className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200">
                <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg"><Link to="/courses">Explore our courses</Link></Button>
        </div>
      </section>
    </SiteLayout>
  );
}
