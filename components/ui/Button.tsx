import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

const variants = {
  primary: "bg-nasah-red text-white hover:bg-nasah-red-dark",
  secondary:
    "border border-nasah-border text-nasah-ink hover:bg-nasah-surface dark:border-white/15 dark:text-white dark:hover:bg-white/5",
  ghost: "text-nasah-gray hover:text-nasah-ink dark:hover:text-white",
};

const sizes = {
  sm: "text-sm px-4 py-2",
  md: "text-[15px] px-5 py-2.5",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors duration-200",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
