const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "";

export type PricePoint = { t: number; v: number };

export type ProductApiResponse = {
  asin: string;
  title: string | null;
  brand: string | null;
  manufacturer: string | null;
  model: string | null;
  category: string | null;
  rootCategory: string | null;
  allCategories: string | null;
  image: string | null;
  isHazmat: boolean;
  isAdultProduct: boolean;
  hasBuyBox: boolean;
  packageWeightG: number | null;
  itemWeightG: number | null;
  dimensions: { length: number | null; width: number | null; height: number | null } | null;
  partNumber: string | null;
  eanList: string[] | null;
  upcList: string[] | null;
  pricing: {
    sellingPrice: number | null;
    medianBuyBox: number | null;
    listPrice: number | null;
    mapPrice: number | null;
    amazonPrice: number | null;
    newFbaPrice: number | null;
    priceTrend90: number | null;
    stats90: {
      avgBuyBox: number | null;
      minBuyBox: number | null;
      maxBuyBox: number | null;
      minRank: number | null;
      maxRank: number | null;
      avgRank: number | null;
    };
  };
  metrics: {
    currentRank: number | null;
    avgRank90: number | null;
    currentRating: number | null;
    currentReviewCount: number | null;
    currentOfferCount: number | null;
    currentFbaCount: number | null;
    amazonIsSeller: boolean;
    hasBuyBox: boolean;
    monthlySalesEstimate: number | null;
    monthlyRevenue: number | null;
    salesRankDrops30: number | null;
    salesRankDrops90: number | null;
    rankSpike: boolean;
    bsrTrend90: number | null;
  };
  profitAnalysis: {
    priceUsed: number;
    referralFee: number;
    referralRate: number;
    fbaFee: number | null;
    storageFee: number | null;
    inboundPlacementFee: number | null;
    totalFees: number | null;
    netProfit: number | null;
    roi: number | null;
    margin: number | null;
    breakEven: number | null;
    weightMissing: boolean;
    note: string;
  };
  series: {
    price: PricePoint[];
    rank: PricePoint[];
    reviews: PricePoint[];
    offerCount: PricePoint[];
    fbaCount: PricePoint[];
  };
  tokensLeft: number | null;
};

export async function fetchProduct(
  asin: string,
  domain: number = 1,
  cogs: number = 0,
  manualWeightG: number = 0,
  manualReferralRate: number | null = null
): Promise<ProductApiResponse> {
  const resp = await fetch(`${BACKEND_URL}/api/keepa/product`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ asin, domain, cogs, manualWeightG, manualReferralRate }),
  });
  const json = await resp.json();
  if (!resp.ok) throw new Error(json?.error || `HTTP ${resp.status}`);
  return json.data as ProductApiResponse;
}
