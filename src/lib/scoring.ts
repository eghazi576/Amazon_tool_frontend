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

// ─── Scoring Config (admin-configurable) ─────────────────────────────────────

export type ScoringConfig = {
  maxBsr:          number;
  minMonthlySales: number;
  minRoi:          number;
  minFbaSellers:   number;
  maxFbaSellers:   number;
  minRating:       number;
  minReviews:      number;
  minPrice:        number;
  excellentPct:    number;
  goodPct:         number;
  averagePct:      number;
  weights: {
    notSeasonal:    number;
    sales:          number;
    noRankSpikes:   number;
    roi:            number;
    profit:         number;
    bbRotates:      number;
    noAmazon:       number;
    storageFee:     number;
    mapAllows:      number;
    fbaCount:       number;
    noRepricers:    number;
    sellerRotation: number;
    rating:         number;
    reviews:        number;
    minPrice:       number;
    notGated:       number;
    listingActive:  number;
    buyBoxExists:   number;
  };
};

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  maxBsr: 50000, minMonthlySales: 100, minRoi: 20,
  minFbaSellers: 3, maxFbaSellers: 15,
  minRating: 4.3, minReviews: 100, minPrice: 8,
  excellentPct: 80, goodPct: 60, averagePct: 40,
  weights: {
    notSeasonal: 10, sales: 10, noRankSpikes: 10, roi: 10,
    profit: 10, bbRotates: 10, noAmazon: 10,
    storageFee: 5, mapAllows: 5, fbaCount: 5,
    noRepricers: 5, sellerRotation: 5, rating: 5,
    reviews: 2, minPrice: 2,
    notGated: 10, listingActive: 10, buyBoxExists: 10,
  },
};

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
  flags: ManualFlags,
  cfg: ScoringConfig = DEFAULT_SCORING_CONFIG
): ScoreResult {
  const W = cfg.weights;
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
  if (rankToCheck >= cfg.maxBsr)   rejectionReasons.push(`BSR ≥ ${cfg.maxBsr.toLocaleString()} (90d avg: ${rankToCheck.toLocaleString()})`);
  if (flags.ipComplaint)           rejectionReasons.push("IP Complaint on record (#14)");
  if (flags.authenticityComplaint) rejectionReasons.push("Recent Authenticity Complaint (#15)");
  if (metrics.isHazmat)            rejectionReasons.push("Hazmat product — auto-detected (#16)");

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
  const roiPasses  = roi != null ? roi >= cfg.minRoi : false;
  const profitPass = profit != null ? profit > 0 : false;

  const raw: Omit<ScoreCriterion, "earned">[] = [
    // ── HIGH (10 pts each) ────────────────────────────────────────────────
    {
      key: "notSeasonal",    criteriaNum: 2,  tier: "high",   weight: W.notSeasonal,   source: "manual",
      label: "Not seasonal",
      passCondition: "Seasonal Only = No",
      passed: !flags.seasonal,
    },
    {
      key: "sales",          criteriaNum: 3,  tier: "high",   weight: W.sales,         source: "auto",
      label: `Sales > ${cfg.minMonthlySales} units/month`,
      passCondition: `Monthly sales > ${cfg.minMonthlySales} units`,
      passed: (metrics.monthlySales ?? 0) > cfg.minMonthlySales,
    },
    {
      key: "noRankSpikes",   criteriaNum: 4,  tier: "high",   weight: W.noRankSpikes,  source: "auto",
      label: "No sudden rank spikes",
      passCondition: "No unnatural BSR spikes in last 30 days",
      passed: !metrics.rankSpike,
    },
    {
      key: "roi",            criteriaNum: 5,  tier: "high",   weight: W.roi,           source: "auto",
      label: `ROI ≥ ${cfg.minRoi}%`,
      passCondition: `ROI ≥ ${cfg.minRoi}%`,
      passed: roiPasses,
    },
    {
      key: "profit",         criteriaNum: 6,  tier: "high",   weight: W.profit,        source: "auto",
      label: "Profit per unit > $0",
      passCondition: "Estimated profit after all fees and COGS > $0",
      passed: profitPass,
    },
    {
      key: "bbRotates",      criteriaNum: 10, tier: "high",   weight: W.bbRotates,     source: "manual",
      label: "Stable Buy Box Rotation",
      passCondition: "Buy Box rotates among sellers (not brand-locked)",
      passed: flags.buyBoxRotates,
    },
    {
      key: "noAmazon",       criteriaNum: 11, tier: "high",   weight: W.noAmazon,      source: "auto",
      label: "Amazon is NOT a seller",
      passCondition: "Amazon as Seller = No",
      passed: !metrics.amazonIsSeller,
    },
    // ── MEDIUM ───────────────────────────────────────────────────────────
    {
      key: "storageFee",     criteriaNum: 7,  tier: "medium", weight: W.storageFee,    source: "manual",
      label: "Storage fee = Low or Medium",
      passCondition: "Storage fee impact = Low or Medium",
      passed: flags.storageFeeLowOrMedium,
    },
    {
      key: "mapAllows",      criteriaNum: 8,  tier: "medium", weight: W.mapAllows,     source: "manual",
      label: "Selling price ≥ MAP (or no MAP)",
      passCondition: "Selling price ≥ MAP (or MAP not enforced)",
      passed: mapOk,
    },
    {
      key: "fbaCount",       criteriaNum: 9,  tier: "medium", weight: W.fbaCount,      source: "auto",
      label: `FBA sellers ${cfg.minFbaSellers}–${cfg.maxFbaSellers}`,
      passCondition: `FBA Sellers ≥ ${cfg.minFbaSellers} and ≤ ${cfg.maxFbaSellers}`,
      passed: fbaSellers >= cfg.minFbaSellers && fbaSellers <= cfg.maxFbaSellers,
    },
    {
      key: "noRepricers",    criteriaNum: 12, tier: "medium", weight: W.noRepricers,   source: "manual",
      label: "No aggressive repricers",
      passCondition: "Aggressive Repricers Present = No",
      passed: flags.noAggressiveRepricers,
    },
    {
      key: "sellerRotation", criteriaNum: 13, tier: "medium", weight: W.sellerRotation,source: "manual",
      label: "Seller rotation = Stable",
      passCondition: "Seller Rotation Frequency = Stable",
      passed: flags.sellerRotationStable,
    },
    {
      key: "rating",         criteriaNum: 19, tier: "medium", weight: W.rating,        source: "auto",
      label: `Rating ≥ ${cfg.minRating} stars`,
      passCondition: `Ratings ≥ ${cfg.minRating} stars`,
      passed: (metrics.currentRating ?? 0) >= cfg.minRating,
    },
    // ── HIGH — previously hard-reject, now scored ─────────────────────
    {
      key: "notGated",       criteriaNum: 22, tier: "high",   weight: W.notGated,      source: "manual",
      label: "Not gated (category / brand)",
      passCondition: "Category or brand is not gated on Amazon",
      passed: !flags.gated,
    },
    {
      key: "listingActive",  criteriaNum: 17, tier: "high",   weight: W.listingActive, source: "manual",
      label: "Listing is active",
      passCondition: "Listing is currently live and active on Amazon",
      passed: flags.listingActive,
    },
    {
      key: "buyBoxExists",   criteriaNum: 18, tier: "high",   weight: W.buyBoxExists,  source: "auto",
      label: "Buy Box exists",
      passCondition: "An active Buy Box is present on the listing",
      passed: flags.buyBoxExists,
    },
    // ── LOW ──────────────────────────────────────────────────────────────
    {
      key: "reviews",        criteriaNum: 20, tier: "low",    weight: W.reviews,       source: "auto",
      label: `Reviews ≥ ${cfg.minReviews}`,
      passCondition: `Total reviews ≥ ${cfg.minReviews}`,
      passed: (metrics.currentReviewCount ?? 0) >= cfg.minReviews,
    },
    {
      key: "minPrice",       criteriaNum: 21, tier: "low",    weight: W.minPrice,      source: "auto",
      label: `Selling price ≥ $${cfg.minPrice}`,
      passCondition: `Selling Price ≥ $${cfg.minPrice} USD`,
      passed: sellingPrice >= cfg.minPrice,
    },
  ];

  const criteria = raw.map((c) => ({ ...c, earned: c.passed ? c.weight : 0 })) as ScoreCriterion[];
  const total    = criteria.reduce((s, c) => s + c.earned, 0);
  const maxTotal = criteria.reduce((s, c) => s + c.weight, 0); // 104
  const pct      = parseFloat(((total / maxTotal) * 100).toFixed(1));

  let decision: ScoreResult["decision"];
  if (pct >= cfg.excellentPct)      decision = "EXCELLENT";
  else if (pct >= cfg.goodPct)      decision = "GOOD";
  else if (pct >= cfg.averagePct)   decision = "AVERAGE";
  else                              decision = "BAD";

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
