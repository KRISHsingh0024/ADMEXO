import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADEMXO | Scalable Growth Engineering, Performance Marketing & Automation",
  description: "ADEMXO engineers scalable growth for hyper-scaling brands through data-driven performance marketing campaigns and custom intelligent workflow automations.",
  keywords: ["performance marketing", "intelligent automation", "growth hacking", "lead generation", "CRM integration", "NextJS", "workflow automation"],
  authors: [{ name: "ADEMXO" }],
  openGraph: {
    title: "ADEMXO | Scalable Growth Engineering & Intelligent Automation",
    description: "Scale your acquisition funnel with custom automated growth systems.",
    type: "website",
    locale: "en_US",
  }
};

export default function RootLayout({
  children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
