"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="cakish-button print:hidden"
    >
      Print inspection pack
    </button>
  );
}
