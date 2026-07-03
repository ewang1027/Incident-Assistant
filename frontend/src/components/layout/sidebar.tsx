import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", index: "01", label: "Incidents", end: true },
  { to: "/chat", index: "02", label: "Copilot" },
  { to: "/metrics", index: "03", label: "Metrics" },
];

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 items-center border-b border-border px-4">
        <span className="font-mono text-xs font-semibold tracking-[0.08em] text-foreground">
          INCIDENT<span className="text-primary">/</span>COPILOT
        </span>
      </div>

      <nav className="flex-1 py-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-baseline gap-2 px-4 py-2 font-mono text-[13px] transition-colors duration-120",
                isActive
                  ? "font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className="w-5 shrink-0 text-[11px] tabular-nums" aria-hidden>
                  {isActive ? "■" : item.index}
                </span>
                <span>/ {item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-3">
        <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
          Demo data · simulated streaming
          <br />
          No real backend connected.
        </p>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-48 shrink-0 border-r border-border bg-background md:block">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-60 border-r border-border bg-background">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex size-7 items-center justify-center text-muted-foreground transition-colors duration-120 hover:text-foreground"
          aria-label="Close menu"
        >
          <X className="size-4" />
        </button>
        <SidebarContent onNavigate={onClose} />
      </div>
    </div>
  );
}
