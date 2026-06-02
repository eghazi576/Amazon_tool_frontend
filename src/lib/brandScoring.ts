/**
 * Brand Intelligence Scoring Engine
 * ===================================
 * Exactly matches "Automated Brand Hunting Tools for Amazon Wholesale FBA" DOCX spec.
 *
 * ── USER INPUT FIELDS (from spec Table A) ───────────────────────────────────
 *  ASIN, Brand Name, Brand Website URL, Business Registration Details (date),
 *  Category, Sales Estimate (per ASIN), Ratings (avg), Reviews Count (avg),
 *  Number of FBA Sellers (per ASIN), Buybox Share (Amazon as seller %),
 *  IP Complaints History (ip-alert.com result), Hazmat Status,
 *  Listing Suppressions History, MAP Violation Sensitivity,
 *  Adult / High-Risk Category
 *
 * ── EVALUATION CRITERIA (from spec Table B) ─────────────────────────────────
 *  HARD REJECT (Fail = Reject):
 *   1. Has official website
 *   2. Has registered business details
 *   9. No hazmat-heavy catalog (≥10% = reject)
 *   10. No adult / high-risk category
 *   12. No history of mass account takedowns
 *
 *  HIGH weight (non-reject):
 *   3. Brand is active (last sale within 30 days)
 *   5. No frequent IP complaints (0–1 in last 12 months)
 *
 *  MEDIUM weight:
 *   6. No counterfeit risks (IP-Alert)
 *   7. FBA sellers per ASIN: ideal 3–5
 *   8. Sales velocity > 100 units/month per ASIN
 *   11. No frequent listing suppressions
 *
 * Decision: APPROVED if all hard checks pass AND score ≥ 70% of max points.
 */

// ─── Brand Scoring Config (admin-configurable) ───────────────────────────────

export type BrandScoringConfig = {
  approvalPct:     number;   // default 70 — min % to APPROVE
  minFbaSellers:   number;   // default 3
  maxFbaSellers:   number;   // default 5
  minMonthlySales: number;   // default 100
  maxIpComplaints: number;   // default 1
  weights: {
    website:            number; // 10
    registeredBusiness: number; // 10
    noHazmat:           number; // 10
    noAdultRisk:        number; // 10
    noTakedowns:        number; // 10
    brandActive:        number; // 10
    noIPComplaints:     number; // 10
    noCounterfeit:      number; // 5
    fbaSellers:         number; // 5
    salesVelocity:      number; // 5
  };
};

export const DEFAULT_BRAND_CONFIG: BrandScoringConfig = {
  approvalPct: 70, minFbaSellers: 3, maxFbaSellers: 5,
  minMonthlySales: 100, maxIpComplaints: 1,
  weights: {
    website: 10, registeredBusiness: 10, noHazmat: 10,
    noAdultRisk: 10, noTakedowns: 10, brandActive: 10,
    noIPComplaints: 10, noCounterfeit: 5, fbaSellers: 5,
    salesVelocity: 5,
  },
};

export type BrandInput = {
  // User input fields (Table A)
  asin: string;
  brandName: string;
  brandWebsite: string;          // empty = no website → REJECT
  hasRegisteredBusiness: boolean; // any country → REJECT if false
  businessRegistrationDate: string;
  category: string;
  monthlySalesPerAsin: number;   // Sales estimate per ASIN
  avgRating: number;
  avgReviewCount: number;
  fbaSellersPerAsin: number;     // FBA sellers per ASIN
  amazonBuyboxSharePct: number;  // % of Buy Box held by Amazon
  ipComplaintsLast12Mo: number;  // from ip-alert.com — 0/1 = OK, ≥2 = fail
  ipAlertRedFlags: boolean;      // counterfeit / IP red flags on IP-Alert
  hazmatHeavyCatalog: boolean;   // ≥10% of catalog is hazmat → REJECT
  mapViolationSensitive: boolean; // brand aggressively enforces MAP
  adultOrHighRisk: boolean;      // adult/gambling/weapons etc. → REJECT
  massAccountTakedowns: boolean; // history of mass takedowns → REJECT
  lastSaleWithin30Days: boolean; // brand is active
};

export type BrandCriterion = {
  key: string;
  label: string;
  criteriaNum: number;
  weight: number;
  passed: boolean;
  earned: number;
  tier: "high" | "medium";
  rejectIfFail: boolean;
  passCondition: string;
};

export type BrandScoreResult = {
  rejected: boolean;
  rejectionReasons: string[];
  total: number;
  maxTotal: number;
  pct: number;
  decision: "APPROVED" | "REJECTED";
  explanation: string;
  criteria: BrandCriterion[];
};

const HIGH   = 10;
const MEDIUM = 5;

export function scoreBrand(
  input: BrandInput,
  cfg: BrandScoringConfig = DEFAULT_BRAND_CONFIG
): BrandScoreResult {
  const W = cfg.weights;
  const hasWebsite = !!input.brandWebsite.trim();

  const raw: Omit<BrandCriterion, "earned">[] = [
    // ── HARD REJECT ────────────────────────────────────────────────────────
    {
      key: "website",          criteriaNum: 1,  tier: "high",   weight: W.website,
      label: "Has official website",             rejectIfFail: true,
      passCondition: "Brand website URL is provided",
      passed: hasWebsite,
    },
    {
      key: "registeredBusiness", criteriaNum: 2, tier: "high",  weight: W.registeredBusiness,
      label: "Has registered business details",  rejectIfFail: true,
      passCondition: "Business registration provided (any country)",
      passed: input.hasRegisteredBusiness,
    },
    {
      key: "noHazmat",         criteriaNum: 9,  tier: "high",   weight: W.noHazmat,
      label: "No hazmat-heavy catalog (< 10%)", rejectIfFail: false,
      passCondition: "Less than 10% of catalog classified as hazmat",
      passed: !input.hazmatHeavyCatalog,
    },
    {
      key: "noAdultRisk",      criteriaNum: 10, tier: "high",   weight: W.noAdultRisk,
      label: "No adult / high-risk category",   rejectIfFail: false,
      passCondition: "Not adult, gambling, weapons, or other high-risk",
      passed: !input.adultOrHighRisk,
    },
    {
      key: "noTakedowns",      criteriaNum: 12, tier: "high",   weight: W.noTakedowns,
      label: "No history of mass account takedowns", rejectIfFail: true,
      passCondition: "No history of mass seller account takedowns",
      passed: !input.massAccountTakedowns,
    },

    // ── HIGH weight (non-reject) ────────────────────────────────────────
    {
      key: "brandActive",      criteriaNum: 3,  tier: "high",   weight: W.brandActive,
      label: "Brand is active (sale within 30 days)", rejectIfFail: false,
      passCondition: "Last sale recorded within 30 days",
      passed: input.lastSaleWithin30Days,
    },
    {
      key: "noIPComplaints",   criteriaNum: 5,  tier: "high",   weight: W.noIPComplaints,
      label: `≤${cfg.maxIpComplaints} IP complaints in last 12 months`, rejectIfFail: false,
      passCondition: `0–${cfg.maxIpComplaints} IP complaints in last 12 months`,
      passed: input.ipComplaintsLast12Mo <= cfg.maxIpComplaints,
    },

    // ── MEDIUM weight ───────────────────────────────────────────────────
    {
      key: "noCounterfeit",    criteriaNum: 6,  tier: "medium", weight: W.noCounterfeit,
      label: "No counterfeit risks (IP-Alert)",  rejectIfFail: false,
      passCondition: "No red flags on IP-Alert.com",
      passed: !input.ipAlertRedFlags,
    },
    {
      key: "fbaSellers",       criteriaNum: 7,  tier: "medium", weight: W.fbaSellers,
      label: `FBA sellers per ASIN: ${cfg.minFbaSellers}–${cfg.maxFbaSellers}`, rejectIfFail: false,
      passCondition: `FBA seller count ${cfg.minFbaSellers}–${cfg.maxFbaSellers} (ideal)`,
      passed: input.fbaSellersPerAsin >= cfg.minFbaSellers && input.fbaSellersPerAsin <= cfg.maxFbaSellers,
    },
    {
      key: "salesVelocity",    criteriaNum: 8,  tier: "medium", weight: W.salesVelocity,
      label: `Sales velocity > ${cfg.minMonthlySales} units/month`, rejectIfFail: false,
      passCondition: `Monthly sales > ${cfg.minMonthlySales} units per top ASIN`,
      passed: input.monthlySalesPerAsin > cfg.minMonthlySales,
    },
  ];

  const criteria = raw.map((c) => ({
    ...c,
    earned: c.passed ? c.weight : 0,
  })) as BrandCriterion[];

  // Hard-fail check
  const failedRejects = criteria.filter((c) => c.rejectIfFail && !c.passed);
  const rejectionReasons = failedRejects.map((c) => c.label);

  const total    = criteria.reduce((s, c) => s + c.earned, 0);
  const maxTotal = criteria.reduce((s, c) => s + c.weight, 0);
  const pct      = parseFloat(((total / maxTotal) * 100).toFixed(1));

  if (failedRejects.length > 0) {
    return {
      rejected: true,
      rejectionReasons,
      total,
      maxTotal,
      pct,
      decision: "REJECTED",
      explanation: `Rejected on hard criteria: ${rejectionReasons.join("; ")}.`,
      criteria,
    };
  }

  const approved = pct >= cfg.approvalPct;
  const decision: "APPROVED" | "REJECTED" = approved ? "APPROVED" : "REJECTED";
  const explanation = approved
    ? `APPROVED — All hard checks passed. Score ${total}/${maxTotal} (${pct}%). Good to do business.`
    : `REJECTED — Hard checks passed but score ${total}/${maxTotal} (${pct}%) is below the 70% threshold.`;

  return {
    rejected: !approved,
    rejectionReasons: [],
    total,
    maxTotal,
    pct,
    decision,
    explanation,
    criteria,
  };
}
