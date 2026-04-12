/**
 * Pure pricing functions extracted from order-configurator
 * for testability and reuse.
 */

export interface PriceInput {
  basePrice: number;
  fillingSurcharge: number;
  finishSurcharge: number;
  hasFinishOptions: boolean;
  topperPrice: number;
  topperMessage: string;
  quantity: number;
}

export interface PriceBreakdown {
  base: number;
  fillingSurcharge: number;
  finishSurcharge: number;
  topperCost: number;
  unit: number;
  total: number;
  hasPrice: boolean;
}

export function calculatePrice(input: PriceInput): PriceBreakdown {
  if (input.basePrice <= 0) {
    return {
      base: 0,
      fillingSurcharge: 0,
      finishSurcharge: 0,
      topperCost: 0,
      unit: 0,
      total: 0,
      hasPrice: false,
    };
  }

  const base = input.basePrice;
  const fillingSurcharge = input.fillingSurcharge;
  const finishSurcharge = input.hasFinishOptions ? input.finishSurcharge : 0;
  const topperCost = input.topperMessage.trim() ? input.topperPrice : 0;
  const unit = base + fillingSurcharge + finishSurcharge + topperCost;
  const total = unit * input.quantity;

  return { base, fillingSurcharge, finishSurcharge, topperCost, unit, total, hasPrice: true };
}

export interface InquirySummaryInput {
  productName: string;
  sizeLabel: string;
  sizeDiameter: string;
  sizeServes: string;
  fillingLabel: string;
  fillingSurcharge: number;
  hasFinishOptions: boolean;
  finishLabel: string;
  finishSurcharge: number;
  topperMessage: string;
  topperPrice: number;
  quantity: number;
  total: number;
  hasPrice: boolean;
}

export function buildInquirySummary(input: InquirySummaryInput): string {
  const lines = [
    "Hi Cakish! I'd like to order a pavlova.",
    "",
    `Product: ${input.productName}`,
    `Size: ${input.sizeLabel} (${input.sizeDiameter}) — serves ${input.sizeServes}`,
    `Filling: ${input.fillingLabel}${input.fillingSurcharge > 0 ? ` (+EUR ${input.fillingSurcharge})` : " (included)"}`,
  ];
  if (input.hasFinishOptions) {
    lines.push(
      `Finish: ${input.finishLabel}${input.finishSurcharge > 0 ? ` (+EUR ${input.finishSurcharge})` : " (included)"}`
    );
  }
  if (input.topperMessage.trim()) {
    lines.push(`Custom topper message: "${input.topperMessage.trim()}" (+EUR ${input.topperPrice})`);
  }
  lines.push(`Quantity: ${input.quantity}`);
  if (input.hasPrice) {
    lines.push(`Estimated total: EUR ${input.total.toFixed(2)}`);
  }
  lines.push("");
  lines.push("Please let me know your availability and collection details. Thank you!");
  return lines.join("\n");
}
