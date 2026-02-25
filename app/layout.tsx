import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "نظام الرائد",
  description: "منصة إدارة الأملاك العقارية",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Tajawal', sans-serif", background: "#FAF6F0" }}>
        <Sidebar />
        <main className="mr-64 min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
