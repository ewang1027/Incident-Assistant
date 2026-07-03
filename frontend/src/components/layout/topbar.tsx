import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/use-theme";

/** Live UTC clock, HH:MM:SS, ticking every second. */
function useUtcClock(): string {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return now.toISOString().slice(11, 19);
}

export function Topbar({
  title,
  onOpenMobileNav,
}: {
  title: string;
  onOpenMobileNav: () => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const clock = useUtcClock();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase transition-colors duration-120 hover:text-foreground md:hidden"
          aria-label="Open menu"
        >
          Menu
        </button>
        <h1 className="font-mono text-xs font-medium tracking-[0.08em] text-foreground uppercase">
          <span className="text-muted-foreground">Incident/Copilot /</span> {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden font-mono text-xs text-muted-foreground tabular-nums sm:inline">
          {clock} UTC
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-[0.08em] text-primary">
          {/* rounded-full is intentional: the LIVE pulse dot is the one allowed circle */}
          <span className="size-1.5 animate-live-pulse rounded-full bg-primary" aria-hidden />
          LIVE
        </span>
        <button
          type="button"
          onClick={toggleTheme}
          className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase transition-colors duration-120 hover:text-foreground"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
        <span className="font-mono text-[11px] font-medium tracking-[0.08em] text-foreground">
          EW
        </span>
      </div>
    </header>
  );
}
