import DashboardSidebar from "@/components/layout/DashboardSidebar";
import PageTransition from "@/components/ui/page-transition";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Sidebar terpusat — RBAC sudah dikelola di dalam komponen */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out xl:pl-28">
        <div className="flex-1 p-4 md:p-6 lg:p-8 pt-4 lg:pt-8 max-w-7xl w-full mx-auto">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}
