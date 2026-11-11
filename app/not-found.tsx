import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-[70svh] flex-col items-center justify-center px-4 py-20 text-center md:px-6"
    >
      <p className="text-step-small uppercase tracking-[0.22em] text-muted">
        Page not found
      </p>
      <h1 className="font-display text-step-head mt-4 max-w-prose">
        This page has moved on
      </h1>
      <p className="text-step-body text-muted mt-6 max-w-prose">
        The piece you were looking for is not here. Browse the collection or
        send us a DM and we&rsquo;ll point you to it.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/products"
          className="btn-press inline-block bg-jade text-ground px-7 py-4 text-step-small uppercase tracking-[0.18em] font-semibold"
        >
          Browse the collection
        </Link>
        <Link
          href="/"
          className="btn-outline inline-block px-7 py-4 text-step-small uppercase tracking-[0.18em] font-semibold"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
