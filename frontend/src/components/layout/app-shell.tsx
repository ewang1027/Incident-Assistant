import { useState } from "react";
import { Outlet, useLocation, useMatch } from "react-router-dom";
import { Sidebar, MobileSidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

function usePageTitle(): string {
  const location = useLocation();
  const incidentMatch = useMatch("/incidents/:id");

  if (incidentMatch) return incidentMatch.params.id ?? "Incident";
  if (location.pathname === "/chat") return "Copilot";
  if (location.pathname === "/metrics") return "Metrics";
  return "Incidents";
}

export function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const title = usePageTitle();

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <Sidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
