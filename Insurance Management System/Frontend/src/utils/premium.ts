export interface PremiumBreakdown {
  baseRatePercent: number;
  addOnPercent: number;
  premium: number;
}

/** premium = (sumInsured x baseRate%) x (1 + total add-on %). Same formula as the backend. */
export function calculatePremium(
  baseRatePercent: number,
  addOnPercents: number[],
  sumInsured: number
): PremiumBreakdown {
  const base = (sumInsured * baseRatePercent) / 100;
  const addOnPercent = addOnPercents.reduce((sum, p) => sum + p, 0);
  const premium = Math.round(base * (1 + addOnPercent / 100) * 100) / 100;
  return { baseRatePercent, addOnPercent, premium };
}