import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
      <span className="mb-4 font-display text-sm font-semibold text-nasah-red">404</span>
      <h1 className="mb-3 font-display text-h1">Page not found</h1>
      <p className="mb-8 max-w-sm text-nasah-gray">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <div className="flex gap-3">
        <Button href="/">Go home</Button>
        <Link
          href="/contact"
          className="inline-flex items-center rounded-control border border-nasah-border px-5 py-2.5 text-[15px] font-semibold hover:bg-nasah-surface dark:border-white/10 dark:hover:bg-white/5"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
