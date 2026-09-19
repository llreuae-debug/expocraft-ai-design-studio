import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "ExpoCraft | AI Exhibition Stall Design & Estimation Platform",
  description: "Production-ready platform connecting Brief → AI 3D Design → Technical Specification → BOQ → Market Estimate → Quotation PDF → Client Approval.",
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
