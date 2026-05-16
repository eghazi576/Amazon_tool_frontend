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
 *   4. Brand already listed on Amazon
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
  listingSuppressions: boolean;  // frequent suppression history
  mapViolationSensitive: boolean; // brand aggressively enforces MAP
  adultOrHighRisk: boolean;      // adult/gambling/weapons etc. → REJECT
  massAccountTakedowns: boolean; // history of mass takedowns → REJECT
  listedOnAmazon: boolean;       // brand already on Amazon → REJECT if false
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

export function scoreBrand(input: BrandInput): BrandScoreResult {
  const hasWebsite = !!input.brandWebsite.trim();

  // Build all criteria exactly as per spec Table B
  const raw: Omit<BrandCriterion, "earned">[] = [
    // ── HARD REJECT (High weight, Fail = Reject) ──────────────────────────
    {
      key: "website",
      label: "Has official website",
      criteriaNum: 1,
      weight: HIGH,
      tier: "high",
      rejectIfFail: true,
      passCondition: "Brand website URL is provided",
      passed: hasWebsite,
    },
    {
      key: "registeredBusiness",
      label: "Has registered business details",
      criteriaNum: 2,
      weight: HIGH,
      tier: "high",
      rejectIfFail: true,
      passCondition: "Business registration provided (any country)",
      passed: input.hasRegisteredBusiness,
    },
    {
      key: "listedOnAmazon",
      label: "Brand already listed on Amazon",
      criteriaNum: 4,
      weight: HIGH,
      tier: "high",
      rejectIfFail: true,
      passCondition: "Brand has active listings on Amazon",
      passed: input.listedOnAmazon,
    },
    {
      key: "noHazmat",
      label: "No hazmat-heavy catalog (< 10%)",
      criteriaNum: 9,
      weight: HIGH,
      tier: "high",
      rejectIfFail: true,
      passCondition: "Less than 10% of catalog classified as hazmat",
      passed: !input.hazmatHeavyCatalog,
    },
    {
      key: "noAdultRisk",
      label: "No adult / high-risk category",
      criteriaNum: 10,
      weight: HIGH,
      tier: "high",
      rejectIfFail: true,
      passCondition: "Not adult, gambling, weapons, or other high-risk",
      passed: !input.adultOrHighRisk,
    },
    {
      key: "noTakedowns",
      label: "No history of mass account takedowns",
      criteriaNum: 12,
      weight: HIGH,
      tier: "high",
      rejectIfFail: true,
      passCondition: "No history of mass seller account takedowns",
      passed: !input.massAccountTakedowns,
    },

    // ── HIGH weight (non-reject) ───────────────────────────────────────────
    {
      key: "brandActive",
      label: "Brand is active (sale within 30 days)",
      criteriaNum: 3,
      weight: HIGH,
      tier: "high",
      rejectIfFail: false,
      passCondition: "Last sale recorded within 30 days",
      passed: input.lastSaleWithin30Days,
    },
    {
      key: "noIPComplaints",
      label: "0–1 IP complaints in last 12 months",
      criteriaNum: 5,
      weight: HIGH,
      tier: "high",
      rejectIfFail: false,
      passCondition: "0 or 1 IP complaints in last 12 months (from ip-alert.com)",
      passed: input.ipComplaintsLast12Mo <= 1,
    },

    // ── MEDIUM weight ──────────────────────────────────────────────────────
    {
      key: "noCounterfeit",
      label: "No counterfeit risks (IP-Alert)",
      criteriaNum: 6,
      weight: MEDIUM,
      tier: "medium",
      rejectIfFail: false,
      passCondition: "No red flags on IP-Alert.com for counterfeit risks",
      passed: !input.ipAlertRedFlags,
    },
    {
      key: "fbaSellers",
      label: "FBA sellers per ASIN: 3–5",
      criteriaNum: 7,
      weight: MEDIUM,
      tier: "medium",
      rejectIfFail: false,
      passCondition: "FBA seller count per ASIN is between 3 and 5 (ideal)",
      passed: input.fbaSellersPerAsin >= 3 && input.fbaSellersPerAsin <= 5,
    },
    {
      key: "salesVelocity",
      label: "Sales velocity > 100 units/month",
      criteriaNum: 8,
      weight: MEDIUM,
      tier: "medium",
      rejectIfFail: false,
      passCondition: "Monthly sales estimate per top ASIN > 100 units",
      passed: input.monthlySalesPerAsin > 100,
    },
    {
      key: "noSuppressions",
      label: "No frequent listing suppressions",
      criteriaNum: 11,
      weight: MEDIUM,
      tier: "medium",
      rejectIfFail: false,
      passCondition: "Brand has not faced frequent listing suppressions",
      passed: !input.listingSuppressions,
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

  // Pass threshold: ≥ 70% of max points
  const approved = pct >= 70;
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
