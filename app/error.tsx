"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
      <span className="mb-4 font-display text-sm font-semibold text-nasah-red">Error</span>
      <h1 className="mb-3 font-display text-h1">Something went wrong</h1>
      <p className="mb-8 max-w-sm text-nasah-gray">
        An unexpected error occurred. You can try again, or head back home.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="secondary">
          Go home
        </Button>
      </div>
    </div>
  );
}
