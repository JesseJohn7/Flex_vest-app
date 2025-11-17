import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FlexVest - Dashboard",
  description: "Responsive dark dashboard built with Next.js + Framer Motion",
};

export default function RootLayout({ children }:{
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-bg min-h-screen">
        {children}
      </body>
    </html>
  );
}
