import type { Metadata } from "next";
import { Press_Start_2P, Courier_Prime, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/app/components/nav";
import Footer from "@/app/components/footer";

// Fuentes de app/references/app.jsx. next/font las descarga en build y las sirve
// desde este mismo dominio, sin peticiones a fonts.googleapis.com en runtime.
const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start",
  subsets: ["latin"],
  display: "swap",
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  variable: "--font-courier-prime",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arcade Vault · Portal Retro",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${pressStart2P.variable} ${courierPrime.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <div className="av-bg"></div>
        <div className="av-noise"></div>
        <div id="root">
          <Nav />
          <main className="av-main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
