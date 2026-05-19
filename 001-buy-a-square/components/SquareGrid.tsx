"use client";

const PAYPAL_URL = "https://paypal.me/RajeevSewbalak";
const SQUARE_COUNT = 100;

export default function SquareGrid() {
  const squares = Array.from({ length: SQUARE_COUNT }, (_, i) => i + 1);

  const openPayPal = () => {
    window.open(PAYPAL_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="grid w-full max-w-[min(100%,28rem)] grid-cols-10 gap-1 sm:max-w-md sm:gap-1.5 md:max-w-lg md:gap-2"
      role="grid"
      aria-label="Squares 1 to 100"
    >
      {squares.map((number) => (
        <button
          key={number}
          type="button"
          role="gridcell"
          onClick={openPayPal}
          aria-label={`Buy square ${number} for one euro`}
          className="aspect-square flex items-center justify-center rounded-md border border-[var(--color-grid-border)] bg-[var(--color-grid)] text-xs font-medium text-[var(--color-ink)] shadow-sm transition-all duration-150 hover:border-[var(--color-accent)] hover:bg-[var(--color-grid-hover)] hover:text-[var(--color-accent)] hover:shadow-md active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:rounded-lg sm:text-sm md:text-base"
        >
          {number}
        </button>
      ))}
    </div>
  );
}
