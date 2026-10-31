import type { ReactNode } from "react";
import { Button } from "../ui/button";

export type DateRangeValue = {
  startDate: string;
  endDate: string;
};

export type SectionTab = {
  id: string;
  label: string;
};

interface SectionShellProps {
  title: string;
  description: string;
  dateRange: DateRangeValue;
  onDateChange: (range: DateRangeValue) => void;
  tabs: SectionTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: ReactNode;
}

export function SectionShell({
  title,
  description,
  dateRange,
  onDateChange,
  tabs,
  activeTab,
  onTabChange,
  children,
}: SectionShellProps) {
  return (
    <div className="flex flex-col gap-3">
      <header className="sticky top-0 z-20 -mx-1 px-1 pt-0.5 pb-3 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Rango de fechas
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                onDateChange({ ...dateRange, startDate: e.target.value })
              }
              className="border rounded-md px-2 py-1 text-sm bg-background"
            />
            <span className="text-muted-foreground text-sm">a</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                onDateChange({ ...dateRange, endDate: e.target.value })
              }
              className="border rounded-md px-2 py-1 text-sm bg-background"
            />
          </div>
        </div>
        <nav
          className="flex flex-wrap gap-2 mt-3"
          aria-label="Vistas de la sección"
        >
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              type="button"
              size="sm"
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </nav>
      </header>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
