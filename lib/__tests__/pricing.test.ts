import { describe, it, expect } from "vitest";
import { calculatePrice, buildInquirySummary } from "../pricing";
import type { PriceInput, InquirySummaryInput } from "../pricing";

/* ── Helper to build a PriceInput with sensible defaults ── */
function makeInput(overrides: Partial<PriceInput> = {}): PriceInput {
  return {
    basePrice: 48,
    fillingSurcharge: 0,
    finishSurcharge: 0,
    hasFinishOptions: false,
    topperPrice: 5,
    topperMessage: "",
    quantity: 1,
    ...overrides,
  };
}

describe("calculatePrice", () => {
  // ── Specific product scenarios from QA ──

  it("Strawberry Small + Nutella + Patisserie + no topper = 48", () => {
    const result = calculatePrice(
      makeInput({
        basePrice: 48,
        fillingSurcharge: 0,   // Nutella
        finishSurcharge: 0,    // Patisserie
        hasFinishOptions: true,
        topperMessage: "",
      })
    );
    expect(result.unit).toBe(48);
    expect(result.total).toBe(48);
    expect(result.hasPrice).toBe(true);
  });

  it("Strawberry Large + Dulce de Leche + Floral + topper = 138", () => {
    const result = calculatePrice(
      makeInput({
        basePrice: 112,
        fillingSurcharge: 3,   // Dulce de Leche
        finishSurcharge: 18,   // Floral
        hasFinishOptions: true,
        topperPrice: 5,
        topperMessage: "Happy Birthday!",
      })
    );
    expect(result.base).toBe(112);
    expect(result.fillingSurcharge).toBe(3);
    expect(result.finishSurcharge).toBe(18);
    expect(result.topperCost).toBe(5);
    expect(result.unit).toBe(138);
    expect(result.total).toBe(138);
  });

  it("Heart Standard + Nutella + no finish + topper = 83", () => {
    const result = calculatePrice(
      makeInput({
        basePrice: 78,
        fillingSurcharge: 0,
        finishSurcharge: 18,   // even if set, ignored when hasFinishOptions is false
        hasFinishOptions: false,
        topperPrice: 5,
        topperMessage: "With Love",
      })
    );
    expect(result.unit).toBe(83);
    expect(result.finishSurcharge).toBe(0);
  });

  it("Mixed Berries Medium + Dulce de Leche + no finish + no topper = 79", () => {
    const result = calculatePrice(
      makeInput({
        basePrice: 76,
        fillingSurcharge: 3,
        hasFinishOptions: false,
        topperMessage: "",
      })
    );
    expect(result.unit).toBe(79);
    expect(result.total).toBe(79);
  });

  // ── Quantity multiplier ──

  it.each([1, 2, 5])("total = unit × quantity (qty=%i)", (qty) => {
    const result = calculatePrice(
      makeInput({
        basePrice: 112,
        fillingSurcharge: 3,
        finishSurcharge: 18,
        hasFinishOptions: true,
        topperPrice: 5,
        topperMessage: "Happy Birthday!",
        quantity: qty,
      })
    );
    expect(result.unit).toBe(138);
    expect(result.total).toBe(138 * qty);
  });

  // ── Edge cases ──

  it("whitespace-only topper message does NOT add topper cost", () => {
    const result = calculatePrice(
      makeInput({
        basePrice: 48,
        topperPrice: 5,
        topperMessage: "   ",
      })
    );
    expect(result.topperCost).toBe(0);
    expect(result.unit).toBe(48);
  });

  it("finish surcharge only applies when hasFinishOptions is true", () => {
    const without = calculatePrice(
      makeInput({ basePrice: 78, finishSurcharge: 18, hasFinishOptions: false })
    );
    const with_ = calculatePrice(
      makeInput({ basePrice: 78, finishSurcharge: 18, hasFinishOptions: true })
    );
    expect(without.finishSurcharge).toBe(0);
    expect(without.unit).toBe(78);
    expect(with_.finishSurcharge).toBe(18);
    expect(with_.unit).toBe(96);
  });

  it("returns hasPrice: false when basePrice is 0", () => {
    const result = calculatePrice(makeInput({ basePrice: 0 }));
    expect(result.hasPrice).toBe(false);
    expect(result.total).toBe(0);
  });

  it("returns hasPrice: false when basePrice is negative", () => {
    const result = calculatePrice(makeInput({ basePrice: -1 }));
    expect(result.hasPrice).toBe(false);
  });
});

describe("buildInquirySummary", () => {
  function makeSummaryInput(overrides: Partial<InquirySummaryInput> = {}): InquirySummaryInput {
    return {
      productName: "Strawberry Pavlova",
      sizeLabel: "Small",
      sizeDiameter: "6 inches",
      sizeServes: "5–6",
      fillingLabel: "Nutella",
      fillingSurcharge: 0,
      hasFinishOptions: true,
      finishLabel: "Patisserie Sliced Finish",
      finishSurcharge: 0,
      topperMessage: "",
      topperPrice: 5,
      quantity: 1,
      total: 48,
      hasPrice: true,
      ...overrides,
    };
  }

  it("includes product name and size info", () => {
    const summary = buildInquirySummary(makeSummaryInput());
    expect(summary).toContain("Product: Strawberry Pavlova");
    expect(summary).toContain("Size: Small (6 inches) — serves 5–6");
  });

  it("shows (included) for zero-surcharge filling", () => {
    const summary = buildInquirySummary(makeSummaryInput({ fillingSurcharge: 0, fillingLabel: "Nutella" }));
    expect(summary).toContain("Filling: Nutella (included)");
  });

  it("shows surcharge amount for non-zero filling", () => {
    const summary = buildInquirySummary(makeSummaryInput({ fillingSurcharge: 3, fillingLabel: "Dulce de Leche" }));
    expect(summary).toContain("Filling: Dulce de Leche (+EUR 3)");
  });

  it("includes finish line when hasFinishOptions is true", () => {
    const summary = buildInquirySummary(makeSummaryInput({ hasFinishOptions: true, finishLabel: "Floral Finish", finishSurcharge: 18 }));
    expect(summary).toContain("Finish: Floral Finish (+EUR 18)");
  });

  it("omits finish line when hasFinishOptions is false", () => {
    const summary = buildInquirySummary(makeSummaryInput({ hasFinishOptions: false }));
    expect(summary).not.toContain("Finish:");
  });

  it("includes topper message when provided", () => {
    const summary = buildInquirySummary(makeSummaryInput({ topperMessage: "Happy Birthday!", topperPrice: 5 }));
    expect(summary).toContain('Custom topper message: "Happy Birthday!" (+EUR 5)');
  });

  it("omits topper line when message is empty", () => {
    const summary = buildInquirySummary(makeSummaryInput({ topperMessage: "" }));
    expect(summary).not.toContain("Custom topper message");
  });

  it("trims whitespace from topper message", () => {
    const summary = buildInquirySummary(makeSummaryInput({ topperMessage: "  Hello  " }));
    expect(summary).toContain('"Hello"');
  });

  it("includes quantity", () => {
    const summary = buildInquirySummary(makeSummaryInput({ quantity: 3 }));
    expect(summary).toContain("Quantity: 3");
  });

  it("includes estimated total when hasPrice is true", () => {
    const summary = buildInquirySummary(makeSummaryInput({ total: 138, hasPrice: true }));
    expect(summary).toContain("Estimated total: EUR 138.00");
  });

  it("omits estimated total when hasPrice is false", () => {
    const summary = buildInquirySummary(makeSummaryInput({ hasPrice: false }));
    expect(summary).not.toContain("Estimated total");
  });

  it("starts with greeting and ends with closing", () => {
    const summary = buildInquirySummary(makeSummaryInput());
    expect(summary.startsWith("Hi Cakish!")).toBe(true);
    expect(summary).toContain("Please let me know your availability");
  });
});
