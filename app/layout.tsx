import type { Metadata } from "next";
import { Archivo, Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "KENDYN — Batteries, Tyres & Industrial Tools | Sagamu, Nigeria",
  description:
    "Kendyn Batteries and Tyres Ltd. Premium automotive batteries, performance tyres and industrial-grade tools. Power. Performance. Reliability. 52, Oba Erinwole Road, Sagamu, Ogun State.",
  keywords: [
    "batteries",
    "tyres",
    "industrial tools",
    "Sagamu",
    "Ogun State",
    "Nigeria",
    "car battery",
    "truck tyres",
  ],
  openGraph: {
    title: "KENDYN — Power. Performance. Reliability.",
    description:
      "Premium automotive batteries, performance tyres and industrial-grade tools in Sagamu, Ogun State.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${inter.variable} ${jetbrains.variable} ${newsreader.variable} antialiased`}
    >
      <body>
        {process.env.NODE_ENV === "development" && (
          // TEMP DEV SHIM — keeps rAF ticking in hidden tabs so headless
          // preview screenshots can render. Remove before shipping.
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){var n=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=function(cb){return document.hidden?setTimeout(function(){cb(performance.now())},16):n(cb)};})();`,
            }}
          />
        )}
        {children}
      </body>
    </html>
  );
}
