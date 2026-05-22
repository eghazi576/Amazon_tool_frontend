/**
 * FBA Product Scoring Engine
 * ===========================
 * Exactly matches PDF spec: "Automated Product Hunting Tool for Amazon Wholesale FBA"
 *
 * ── HARD REJECTION (any one = REJECT, no scoring) ────────────────────────────
 *  #1  BSR ≥ 50,000
 *  #14 IP Complaint = Yes
 *  #15 Authenticity Complaint = Yes
 *  #16 Hazmat = Yes  (auto-detected)
 *  #17 Listing Active = No
 *  #18 Buy Box Exists = No
 *  #22 Gated = Yes
 *
 * ── SCORING CRITERIA ─────────────────────────────────────────────────────────
 *  HIGH weight (10 pts each) — 7 criteria:
 *   #2  Not seasonal
 *   #3  Sales > 100/month
 *   #4  No sudden rank spikes
 *   #5  ROI ≥ 20%
 *   #6  Profit per unit > $0
 *   #10 Buy Box rotates
 *   #11 Amazon NOT a seller
 *
 *  MEDIUM weight (5 pts each) — 6 criteria:
 *   #7  Storage fee = Low or Medium
 *   #8  Selling price ≥ MAP (or no MAP)
 *   #9  FBA sellers 3–15
 *   #12 No aggressive repricers
 *   #13 Seller rotation = Stable
 *   #19 Rating ≥ 4.3 stars
 *
 *  LOW weight (2 pts each) — 2 criteria:
 *   #20 Reviews ≥ 100
 *   #21 Selling price ≥ $8
 *
 * Max score: (7×10) + (6×5) + (2×2) = 70 + 30 + 4 = 104
 * Thresholds: ≥80% = EXCELLENT | ≥60% = GOOD | ≥40% = AVERAGE | <40% = BAD
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ManualFlags = {
  // Hard-reject flags (user verifies manually)
  gated: boolean;                   // #22
  ipComplaint: boolean;             // #14
  authenticityComplaint: boolean;   // #15
  listingActive: boolean;           // #17
  buyBoxExists: boolean;            // #18

  // High-weight scoring (user verifies manually)
  seasonal: boolean;                // #2
  buyBoxRotates: boolean;           // #10

  // Medium-weight scoring (user verifies manually)
  storageFeeLowOrMedium: boolean;   // #7
  noAggressiveRepricers: boolean;   // #12
  sellerRotationStable: boolean;    // #13

  // Cost inputs
  estCogs: number;                  // for profit & ROI calculation
  mapPrice: number | null;          // #8 MAP price if enforced
};

export type KeepaMetrics = {
  // Auto-fetched from Keepa
  sellingPrice: number | null;      // current Buy Box price
  currentBuyBox: number | null;
  currentPrice: number | null;
  medianBuyBox90: number | null;
  currentRank: number | null;       // current BSR
  avgRank90: number | null;         // 90-day avg BSR — used for reject check
  monthlySales: number | null;      // #3 sales estimate
  rankSpike: boolean;               // #4 rank spike detected
  currentFbaCount: number | null;   // #9 FBA seller count
  currentOfferCount: number | null;
  amazonIsSeller: boolean;          // #11
  hasBuyBox: boolean;               // #18
  currentRating: number | null;     // #19
  currentReviewCount: number | null;// #20
  isHazmat: boolean;                // #16 auto-detected from Keepa

  // Profit fields (from backend calculation)
  referralFee: number;
  fbaFee: number | null;
  storageFee: number | null;
  totalFees: number | null;
};

export type ScoreCriterion = {
  key: string;
  label: string;
  criteriaNum: number;
  weight: number;
  passed: boolean;
  earned: number;
  tier: "high" | "medium" | "low";
  passCondition: string;
  source: "auto" | "manual";       // auto = from Keepa | manual = user enters
};

export type ScoreResult = {
  rejected: boolean;
  rejectionReasons: string[];
  total: number;
  maxTotal: number;
  pct: number;
  decision: "EXCELLENT" | "GOOD" | "AVERAGE" | "BAD" | "REJECT";
  explanation: string;
  criteria: ScoreCriterion[];

  // Profit summary
  sellingPrice: number;
  referralFee: number;
  fbaFee: number | null;
  storageFee: number | null;
  totalFees: number | null;
  cogs: number;
  profit: number | null;
  roi: number | null;
  margin: number | null;
  breakEven: number | null;
};

// ─── Main scoring function ────────────────────────────────────────────────────

export function scoreProduct(
  metrics: KeepaMetrics,
  flags: ManualFlags
): ScoreResult {
  const sellingPrice = metrics.sellingPrice ?? metrics.currentBuyBox ?? metrics.currentPrice ?? 0;
  const cogs         = flags.estCogs ?? 0;

  // Profit calculation
  const referralFee = metrics.referralFee ?? 0;
  const fbaFee      = metrics.fbaFee ?? null;
  const storageFee  = metrics.storageFee ?? null;
  const totalFees   = metrics.totalFees ?? null;

  const profit    = totalFees != null ? parseFloat((sellingPrice - totalFees - cogs).toFixed(2)) : null;
  const roi       = profit != null && cogs > 0 ? parseFloat(((profit / cogs) * 100).toFixed(1)) : null;
  const margin    = profit != null && sellingPrice > 0 ? parseFloat(((profit / sellingPrice) * 100).toFixed(1)) : null;
  const breakEven = totalFees != null ? parseFloat((totalFees + cogs).toFixed(2)) : null;

  // ── HARD REJECTION ──────────────────────────────────────────────────────────
  const rejectionReasons: string[] = [];

  // #1 BSR — use 90d avg for stability
  const rankToCheck = metrics.avgRank90 ?? metrics.currentRank ?? Infinity;
  if (rankToCheck >= 50_000)       rejectionReasons.push(`BSR ≥ 50,000 (90d avg: ${rankToCheck.toLocaleString()})`);
  if (flags.ipComplaint)           rejectionReasons.push("IP Complaint on record (#14)");
  if (flags.authenticityComplaint) rejectionReasons.push("Authenticity complaint history (#15)");
  if (metrics.isHazmat)            rejectionReasons.push("Hazmat product — auto-detected (#16)");
  if (!flags.listingActive)        rejectionReasons.push("Listing is not active (#17)");
  if (!flags.buyBoxExists)         rejectionReasons.push("No active Buy Box (#18)");
  if (flags.gated)                 rejectionReasons.push("Category/brand is gated (#22)");

  const MAX_TOTAL = 104; // 7×10 + 6×5 + 2×2

  if (rejectionReasons.length > 0) {
    return {
      rejected: true, rejectionReasons,
      total: 0, maxTotal: MAX_TOTAL, pct: 0,
      decision: "REJECT",
      explanation: `Rejected: ${rejectionReasons.join("; ")}.`,
      criteria: [],
      sellingPrice, referralFee, fbaFee, storageFee, totalFees,
      cogs, profit, roi, margin, breakEven,
    };
  }

  // ── SCORING ─────────────────────────────────────────────────────────────────
  const fbaSellers = metrics.currentFbaCount ?? metrics.currentOfferCount ?? 0;
  const mapOk      = !flags.mapPrice || flags.mapPrice <= 0 || sellingPrice >= flags.mapPrice;
  const roiPasses  = roi != null ? roi >= 20 : false;
  const profitPass = profit != null ? profit > 0 : false;

  const raw: Omit<ScoreCriterion, "earned">[] = [
    // ── HIGH (10 pts each) ────────────────────────────────────────────────
    {
      key: "notSeasonal",    criteriaNum: 2,  tier: "high",   weight: 10, source: "manual",
      label: "Not seasonal",
      passCondition: "Seasonal Only = No",
      passed: !flags.seasonal,
    },
    {
      key: "sales",          criteriaNum: 3,  tier: "high",   weight: 10, source: "auto",
      label: "Sales > 100 units/month",
      passCondition: "Monthly sales > 100 units",
      passed: (metrics.monthlySales ?? 0) > 100,
    },
    {
      key: "noRankSpikes",   criteriaNum: 4,  tier: "high",   weight: 10, source: "auto",
      label: "No sudden rank spikes",
      passCondition: "No unnatural BSR spikes in last 30 days",
      passed: !metrics.rankSpike,
    },
    {
      key: "roi",            criteriaNum: 5,  tier: "high",   weight: 10, source: "auto",
      label: "ROI ≥ 20%",
      passCondition: "ROI ≥ 20–25%",
      passed: roiPasses,
    },
    {
      key: "profit",         criteriaNum: 6,  tier: "high",   weight: 10, source: "auto",
      label: "Profit per unit > $0",
      passCondition: "Estimated profit after all fees and COGS > $0",
      passed: profitPass,
    },
    {
      key: "bbRotates",      criteriaNum: 10, tier: "high",   weight: 10, source: "manual",
      label: "Buy Box rotates (no lock)",
      passCondition: "Buy Box rotation = Yes (not brand-locked)",
      passed: flags.buyBoxRotates,
    },
    {
      key: "noAmazon",       criteriaNum: 11, tier: "high",   weight: 10, source: "auto",
      label: "Amazon is NOT a seller",
      passCondition: "Amazon as Seller = No",
      passed: !metrics.amazonIsSeller,
    },
    // ── MEDIUM (5 pts each) ───────────────────────────────────────────────
    {
      key: "storageFee",     criteriaNum: 7,  tier: "medium", weight: 5,  source: "manual",
      label: "Storage fee = Low or Medium",
      passCondition: "Storage fee impact = Low or Medium",
      passed: flags.storageFeeLowOrMedium,
    },
    {
      key: "mapAllows",      criteriaNum: 8,  tier: "medium", weight: 5,  source: "manual",
      label: "Selling price ≥ MAP (or no MAP)",
      passCondition: "Selling price ≥ MAP (or MAP not enforced)",
      passed: mapOk,
    },
    {
      key: "fbaCount",       criteriaNum: 9,  tier: "medium", weight: 5,  source: "auto",
      label: "FBA sellers 3–15",
      passCondition: "FBA Sellers ≥ 3 and ≤ 15",
      passed: fbaSellers >= 3 && fbaSellers <= 15,
    },
    {
      key: "noRepricers",    criteriaNum: 12, tier: "medium", weight: 5,  source: "manual",
      label: "No aggressive repricers",
      passCondition: "Aggressive Repricers Present = No",
      passed: flags.noAggressiveRepricers,
    },
    {
      key: "sellerRotation", criteriaNum: 13, tier: "medium", weight: 5,  source: "manual",
      label: "Seller rotation = Stable",
      passCondition: "Seller Rotation Frequency = Stable",
      passed: flags.sellerRotationStable,
    },
    {
      key: "rating",         criteriaNum: 19, tier: "medium", weight: 5,  source: "auto",
      label: "Rating ≥ 4.3 stars",
      passCondition: "Ratings ≥ 4.3 stars",
      passed: (metrics.currentRating ?? 0) >= 4.3,
    },
    // ── LOW (2 pts each) ─────────────────────────────────────────────────
    {
      key: "reviews",        criteriaNum: 20, tier: "low",    weight: 2,  source: "auto",
      label: "Reviews ≥ 100",
      passCondition: "Total reviews ≥ 100",
      passed: (metrics.currentReviewCount ?? 0) >= 100,
    },
    {
      key: "minPrice",       criteriaNum: 21, tier: "low",    weight: 2,  source: "auto",
      label: "Selling price ≥ $8",
      passCondition: "Selling Price ≥ $8 USD",
      passed: sellingPrice >= 8,
    },
  ];

  const criteria = raw.map((c) => ({ ...c, earned: c.passed ? c.weight : 0 })) as ScoreCriterion[];
  const total    = criteria.reduce((s, c) => s + c.earned, 0);
  const maxTotal = criteria.reduce((s, c) => s + c.weight, 0); // 104
  const pct      = parseFloat(((total / maxTotal) * 100).toFixed(1));

  let decision: ScoreResult["decision"];
  if (pct >= 80)      decision = "EXCELLENT";
  else if (pct >= 60) decision = "GOOD";
  else if (pct >= 40) decision = "AVERAGE";
  else                decision = "BAD";

  const passedHigh = criteria.filter((c) => c.tier === "high" && c.passed).length;

  const explanation =
    decision === "EXCELLENT"
      ? `Strong FBA opportunity — ${passedHigh}/7 high-weight checks passed. Score: ${total}/${maxTotal} (${pct}%)`
      : decision === "GOOD"
      ? `Solid product — ${total}/${maxTotal} pts (${pct}%). Worth deeper sourcing.`
      : decision === "AVERAGE"
      ? `Marginal — ${total}/${maxTotal} pts (${pct}%). Only proceed with clear edge.`
      : `Weak signals — ${total}/${maxTotal} pts (${pct}%). Better opportunities exist.`;

  return {
    rejected: false, rejectionReasons: [],
    total, maxTotal, pct,
    decision, explanation, criteria,
    sellingPrice, referralFee, fbaFee, storageFee, totalFees,
    cogs, profit, roi, margin, breakEven,
  };
}
