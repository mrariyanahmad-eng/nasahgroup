"use client";

export function DocsSearchButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("nasah:open-search"))}
      className="mb-10 flex w-full max-w-2xl items-center gap-2 rounded-control border border-nasah-border bg-nasah-surface px-4 py-2.5 text-sm text-nasah-gray transition-colors hover:border-nasah-red/40 dark:border-white/10 dark:bg-white/5"
    >
      Search documentation…
      <kbd className="ml-auto rounded border border-nasah-border bg-white px-1.5 text-xs dark:border-white/10 dark:bg-nasah-dark-bg">
        ⌘K
      </kbd>
    </button>
  );
}
