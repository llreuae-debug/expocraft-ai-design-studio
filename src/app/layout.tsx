import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ProjectProvider } from "@/context/ProjectContext";
import { I18nProvider } from "@/context/I18nContext";
import { AppLayout } from "@/components/layout/AppLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#020617",
};

export const metadata: Metadata = {
  title: "ExpoCraft AI — 3D Exhibition Stall Design & Estimation Platform",
  description: "Production-ready AI exhibition stall design platform: Natural Language Brief → 4 3D Perspectives → 8K Presentation Renders → Commercial Proposals.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ExpoCraft AI",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=192&auto=format&fit=crop&q=80",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${outfit.variable}`}>
      <body className="bg-slate-950 text-slate-100 antialiased font-sans selection:bg-cyan-500 selection:text-slate-950">
        <AuthProvider>
          <ProjectProvider>
            <I18nProvider>
              <AppLayout>{children}</AppLayout>
            </I18nProvider>
          </ProjectProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
