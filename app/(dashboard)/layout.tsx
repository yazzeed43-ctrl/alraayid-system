import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "الرائد",
  description: "نظام إدارة الأملاك",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar />
      <main className="mr-64 flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
