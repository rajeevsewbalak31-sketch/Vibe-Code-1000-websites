import SquareGrid from "@/components/SquareGrid";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center px-4 py-10 sm:py-14">
      <div className="w-full max-w-lg text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
          Website #001
        </p>
        <h1
          className="text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl"
          style={{ fontFamily: "var(--font-instrument-sans), system-ui, sans-serif" }}
        >
          Buy a Square
        </h1>
        <p className="mt-3 text-lg text-[var(--color-muted)] sm:text-xl">
          <span className="font-semibold text-[var(--color-ink)]">€1</span> per square
        </p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Tap any square below — you&apos;ll be taken to PayPal to complete payment.
        </p>
      </div>

      <section className="mt-10 w-full flex justify-center sm:mt-12">
        <SquareGrid />
      </section>

      <footer className="mt-10 text-center text-xs text-[var(--color-muted)] sm:mt-12">
        <p>100 squares · €1 each · PayPal</p>
      </footer>
    </main>
  );
}
