import { MessageCircle } from "lucide-react";
import { waLink, SITE } from "@/lib/site-config";

export function WhatsAppFab() {
  return (
    <a
      href={waLink(`Hi ${SITE.name}, I'd like to know more about your courses.`)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-elevated hover:scale-105 transition"
      aria-label="Chat on WhatsApp"
      style={{ boxShadow: "var(--shadow-elevated)" }}
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
