import { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { WhatsAppFab } from "./WhatsAppFab";

export function SiteLayout({ children, showWhatsAppFab = true }: { children: ReactNode; showWhatsAppFab?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      {showWhatsAppFab && <WhatsAppFab />}
    </div>
  );
}
