import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { WhatsAppContactTracker } from "@/components/analytics/WhatsAppContactTracker";
import { JsonLd } from "@/components/ui/Container";
import { organizationSchema } from "@/lib/schema";

/**
 * Chrome del sitio público (Header / Footer / WhatsApp + datos estructurados).
 * El área interna /panel vive fuera de este grupo y usa su propio layout.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <Header />
      <main className="relative">{children}</main>
      <Footer />
      <WhatsAppFab />
      <WhatsAppContactTracker />
    </>
  );
}
