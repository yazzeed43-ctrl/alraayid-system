import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#0F0F0F", minHeight: "100vh" }}>
      <Sidebar />
      <main className="mr-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}
