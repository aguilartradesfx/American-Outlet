import type { Metadata } from "next";
import Script from "next/script";
import { Poppins } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nombre} — ${site.tagline}`,
    template: `%s · ${site.nombre}`,
  },
  description: site.descripcion,
  applicationName: site.nombre,
  keywords: [
    "outlet Costa Rica",
    "liquidaciones americanas",
    "saldos americanos",
    "outlet San Carlos",
    "outlet Ciudad Quesada",
    "American Outlet",
    "tiendas departamentales EE.UU.",
  ],
  authors: [{ name: site.nombre }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CR",
    url: site.url,
    siteName: site.nombre,
    title: `${site.nombre} — ${site.tagline}`,
    description: site.descripcion,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nombre} — ${site.tagline}`,
    description: site.descripcion,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CR" className={poppins.variable}>
      <head>
        {GTM_ID ? (
          <Script id="gtm-base" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        ) : null}
      </head>
      <body>
        {GTM_ID ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <div className="bg-ambient" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
