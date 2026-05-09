import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { SITE } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold">{SITE.name}</h3>
          <p className="mt-2 text-sm text-sidebar-foreground/70">{SITE.tagline}. Building digital skills since day one.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary-glow">Home</Link></li>
            <li><Link to="/courses" className="hover:text-primary-glow">Courses</Link></li>
            <li><Link to="/about" className="hover:text-primary-glow">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary-glow">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-sidebar-foreground/80">
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5" /> {SITE.phone}</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5" /> {SITE.email}</li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5" /> {SITE.address}</li>
          </ul>
        </div>

        
       <div>
          <h4 className="font-semibold mb-3">Collaborated by</h4>
          <div className="flex gap-6 items-center">
            <img src="https://i.postimg.cc/CKQjCsdN/20260509-082406.png" alt="Collaborator 1" className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            <img src="https://i.postimg.cc/fyxmN4C2/20260509-082422.png" alt="Collaborator 2" className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            <img src="https://i.postimg.cc/dtYG91td/1280px-Information-and-Communication-Technology-Division-svg.png" alt="Collaborator 3" className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            <img src="https://i.postimg.cc/tCqHP3PC/1.png" alt="Collaborator 4" className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
      <div className="border-t border-sidebar-border py-4 text-center text-xs text-sidebar-foreground/60">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved. developed by <a href="https://rotonbhai.vercel.app/" target="_blank" className="hover:text-primary-glow text-white" >Mahfujor Rahman Roton</a>.
      </div>
    </footer>
  );
}
