import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { AuthGuard } from "@/components/layout/auth-guard";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Dashboard" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 max-w-7xl mx-auto">
              {children}
            </div>
          </main>

        </div>
      </div>
    </AuthGuard>
  );
}
