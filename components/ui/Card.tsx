import { cn } from "@/lib/utils";
import type { ProductStatus } from "@/lib/api";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-nasah-border bg-white p-7 transition-all duration-300",
        "hover:-translate-y-1 hover:border-nasah-red/30 hover:shadow-card",
        "dark:border-white/10 dark:bg-nasah-dark-surface dark:hover:border-nasah-red/40",
        className
      )}
    >
      {children}
    </div>
  );
}

const statusStyles: Record<ProductStatus, string> = {
  live: "text-success bg-success/10",
  beta: "text-warning bg-warning/10",
  soon: "text-nasah-gray bg-nasah-surface border border-nasah-border dark:bg-white/5 dark:border-white/10",
};

const statusLabel: Record<ProductStatus, string> = {
  live: "Live",
  beta: "Beta",
  soon: "Coming soon",
};

export function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        statusStyles[status]
      )}
    >
      ● {statusLabel[status]}
    </span>
  );
}
