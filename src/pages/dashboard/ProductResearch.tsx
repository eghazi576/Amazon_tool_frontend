import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { addHistory } from "@/lib/history";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Loader2, CheckCircle2, XCircle, AlertTriangle,
  TrendingUp, DollarSign, Star, Package, BarChart2, ShieldAlert,
  Weight, Tag, TrendingDown, Users, Award, Info,
} from "lucide-react";
import { fetchKeepaProduct, type KeepaProductResponse } from "@/lib/keepaService";
import { scoreProduct, type ManualFlags, type ScoreResult } from "@/lib/scoring";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ReferenceLine,
} from "recharts";

// ─── Default manual flags (matches PDF spec user input fields) ───────────────
// All fields the user must manually verify — cannot be auto-fetched from Keepa
const defaultFlags: ManualFlags = {
  // Hard-reject flags
  gated: false,                    // User checks: is this category/brand gated?
  ipComplaint: false,              // User checks: any IP complaint on record?
  authenticityComplaint: false,    // User checks: any authenticity complaint?
  listingActive: true,             // User checks: is listing currently live?
  buyBoxExists: true,              // User checks: is there an active Buy Box?
  // High-weight scoring
  seasonal: false,                 // User checks: is demand highly seasonal?
  buyBoxRotates: true,             // User checks: does Buy Box rotate among sellers?
  // Medium-weight scoring
  storageFeeLowOrMedium: true,     // User checks: is storage fee impact low/medium?
  noAggressiveRepricers: true,     // User checks: no aggressive repricers present?
  sellerRotationStable: true,      // User checks: is seller rotation stable?
  // Cost inputs
  estCogs: 0,                      // User enters: Cost of Goods Sold ($)
  mapPrice: null,                  // User enters: MAP price if enforced
};

// ─── Detect Amazon fee category from Keepa category + product title ─────────
// Uses ALL Keepa categoryTree levels + product title for accuracy
// Keepa deepest subcategory = "Wrist Watches", "T-Shirts", "Sunglasses" etc.

function hasWord(text: string, word: string): boolean {
  const escaped = word.replace(/[-/]/g, '\\$&');
  return new RegExp('(?<![a-zA-Z])' + escaped + '(?![a-zA-Z])', 'i').test(text);
}

function detectCategory(allCategoryLevels: string, title: string, price: number): string {
  const full = `${allCategoryLevels} ${title}`.toLowerCase();
  const t    = (title || "").toLowerCase();

  // ── WATCHES ───────────────────────────────────────────────────────────────
  if (full.includes("wrist watch") || full.includes("wristwatches") ||
      full.includes("pocket watch") || full.includes("smartwatch") ||
      full.includes("smart watch") || full.includes("chronograph") ||
      hasWord(t, "watch") || hasWord(t, "watches") || hasWord(t, "timepiece"))
    return price <= 1500 ? "watches_low" : "watches_high";

  // ── SUNGLASSES ────────────────────────────────────────────────────────────
  if (full.includes("sunglasses") || full.includes("sunglass") ||
      full.includes("goggles") || full.includes("polarized lens") ||
      full.includes("uv400") || full.includes("eyewear"))
    return price <= 75 ? "shoes_low" : price <= 150 ? "shoes_mid" : "shoes_high";

  // ── SHOES / FOOTWEAR ──────────────────────────────────────────────────────
  if (full.includes("running shoe") || full.includes("dress shoe") ||
      full.includes("athletic shoe") || full.includes("walking shoe") ||
      full.includes("casual shoe") || full.includes("basketball shoe") ||
      hasWord(full, "sneakers") || hasWord(full, "sneaker") ||
      hasWord(full, "boots") || hasWord(full, "sandals") || hasWord(full, "sandal") ||
      hasWord(full, "slippers") || hasWord(full, "slipper") ||
      hasWord(full, "loafers") || hasWord(full, "loafer") ||
      hasWord(full, "footwear") ||
      (hasWord(t, "shoes") && !t.includes("shoe rack") && !t.includes("shoe box")) ||
      (hasWord(t, "shoe") && !t.includes("shoe box") && !t.includes("shoehorn")))
    return price <= 75 ? "shoes_low" : price <= 150 ? "shoes_mid" : "shoes_high";

  // ── HANDBAGS / PURSES ─────────────────────────────────────────────────────
  if (full.includes("handbag") || full.includes("shoulder bag") ||
      full.includes("tote bag") || full.includes("crossbody bag") ||
      full.includes("clutch bag") || full.includes("wristlet") ||
      full.includes("satchel") || hasWord(t, "purse"))
    return price <= 75 ? "shoes_low" : price <= 150 ? "shoes_mid" : "shoes_high";

  // ── BACKPACKS / LUGGAGE ───────────────────────────────────────────────────
  if (full.includes("backpacks") || full.includes("backpack") ||
      full.includes("rucksack") || full.includes("carry-on") ||
      full.includes("suitcase") || full.includes("luggage") ||
      full.includes("duffel bag") || full.includes("duffle bag") ||
      full.includes("briefcase") || full.includes("laptop bag") ||
      full.includes("messenger bag") || full.includes("school bag") ||
      full.includes("gym bag") || full.includes("diaper bag") ||
      full.includes("travel bag"))
    return "luggage";

  // ── JEWELRY ───────────────────────────────────────────────────────────────
  if (full.includes("necklaces") || full.includes("necklace") ||
      full.includes("bracelets") || full.includes("bracelet") ||
      full.includes("earrings") || full.includes("earring") ||
      full.includes("pendants") || full.includes("pendant") ||
      full.includes("anklets") || full.includes("fine jewelry") ||
      full.includes("fashion jewelry") || full.includes("brooches") ||
      full.includes("cufflinks") || full.includes("bangles") ||
      (full.includes("ring") && !full.includes("ring light") &&
       !full.includes("boxing ring") && !full.includes("o-ring") &&
       !full.includes("curtain ring") && !full.includes("key ring")))
    return price <= 250 ? "jewelry_low" : "jewelry_high";

  // ── CLOTHING ──────────────────────────────────────────────────────────────
  if (full.includes("t-shirts") || full.includes("dress shirts") ||
      full.includes("polo shirts") || full.includes("tank tops") ||
      full.includes("sweatshirts") || full.includes("hoodies") ||
      full.includes("activewear") || full.includes("swimwear") ||
      full.includes("sleepwear") || full.includes("lingerie") ||
      full.includes("fashion hoodies") || full.includes("graphic tees") ||
      hasWord(t, "shirt") || hasWord(t, "t-shirt") || hasWord(t, "tshirt") ||
      hasWord(t, "polo") || hasWord(t, "blouse") ||
      hasWord(t, "hoodie") || hasWord(t, "sweatshirt") || hasWord(t, "sweater") ||
      hasWord(t, "cardigan") || hasWord(t, "pullover") ||
      hasWord(t, "jeans") || hasWord(t, "denim") ||
      hasWord(t, "pants") || hasWord(t, "trouser") || hasWord(t, "chino") ||
      hasWord(t, "shorts") || hasWord(t, "jogger") || hasWord(t, "legging") ||
      hasWord(t, "jacket") || hasWord(t, "coat") || hasWord(t, "blazer") ||
      hasWord(t, "dress") || hasWord(t, "skirt") || hasWord(t, "vest") ||
      hasWord(t, "swimsuit") || hasWord(t, "uniform") ||
      hasWord(t, "pajama") || hasWord(t, "pyjama") || hasWord(t, "scarf") ||
      (full.includes("clothing") && !full.includes("shoe") &&
       !full.includes("watch") && !full.includes("sunglass") &&
       !full.includes("jewelry") && !full.includes("bag")))
    return price <= 15 ? "clothing_low" : price <= 20 ? "clothing_mid" : "clothing_high";

  // ── ELECTRONICS ACCESSORIES ───────────────────────────────────────────────
  if (full.includes("earbud headphone") || full.includes("in-ear headphone") ||
      full.includes("over-ear headphone") || full.includes("noise cancelling") ||
      hasWord(full, "earbuds") || hasWord(full, "earphones") ||
      hasWord(full, "headphones") || hasWord(full, "headset") ||
      full.includes("tws earbuds") || full.includes("phone cases") ||
      full.includes("screen protectors") || full.includes("charging cables") ||
      full.includes("power banks") || full.includes("usb cables"))
    return price <= 100 ? "elec_acc_low" : "elec_acc_high";

  // ── CONSUMER ELECTRONICS ──────────────────────────────────────────────────
  if (full.includes("laptops") || full.includes("tablets") ||
      full.includes("televisions") || full.includes("monitors") ||
      full.includes("consumer electronics") || full.includes("computers") ||
      full.includes("digital cameras") || full.includes("projectors") ||
      hasWord(t, "laptop") || hasWord(t, "tablet") ||
      hasWord(t, "television") || hasWord(t, "monitor"))
    return "electronics";

  // ── BABY ──────────────────────────────────────────────────────────────────
  if (full.includes("baby product") || full.includes("baby gear") ||
      full.includes("stroller") || full.includes("diaper") ||
      hasWord(t, "baby") || hasWord(t, "infant") || hasWord(t, "toddler"))
    return price <= 10 ? "baby_low" : "baby_high";

  // ── BEAUTY & PERSONAL CARE ────────────────────────────────────────────────
  if (full.includes("skin care") || full.includes("hair care") ||
      full.includes("personal care") || full.includes("beauty") ||
      hasWord(t, "shampoo") || hasWord(t, "moisturizer") || hasWord(t, "serum"))
    return price <= 10 ? "beauty_low" : "beauty_high";

  // ── HEALTH ────────────────────────────────────────────────────────────────
  if (full.includes("vitamins") || full.includes("supplements") ||
      full.includes("health care") || full.includes("household supplies") ||
      hasWord(t, "vitamin") || hasWord(t, "supplement"))
    return price <= 10 ? "health_low" : "health_high";

  // ── GROCERY ───────────────────────────────────────────────────────────────
  if (full.includes("grocery") || full.includes("gourmet food") ||
      full.includes("snack food") || full.includes("beverages"))
    return price <= 15 ? "grocery_low" : "grocery_high";

  // ── FURNITURE ─────────────────────────────────────────────────────────────
  if (full.includes("furniture") || hasWord(t, "sofa") || hasWord(t, "mattress"))
    return price <= 200 ? "furniture_low" : "furniture_high";

  // ── SPORTS ────────────────────────────────────────────────────────────────
  if (full.includes("sports") || full.includes("outdoor recreation") ||
      full.includes("exercise") || full.includes("fitness"))
    return "sports";

  // ── TOYS ──────────────────────────────────────────────────────────────────
  if (full.includes("toys") || full.includes("board games") ||
      hasWord(t, "toy") || hasWord(t, "lego"))
    return "toys";

  // ── PET ───────────────────────────────────────────────────────────────────
  if (full.includes("pet supplies") || full.includes("dog food") ||
      full.includes("cat food"))
    return "pet";

  // ── HOME & KITCHEN ────────────────────────────────────────────────────────
  if (full.includes("kitchen") || full.includes("home & kitchen") ||
      full.includes("cookware") || full.includes("bedding"))
    return "home_kitchen";

  // ── TOOLS ─────────────────────────────────────────────────────────────────
  if (full.includes("tools & home") || full.includes("power tools") ||
      full.includes("home improvement"))
    return "tools";

  // ── OFFICE ────────────────────────────────────────────────────────────────
  if (full.includes("office products") || full.includes("office supplies"))
    return "office";

  // ── AUTOMOTIVE ────────────────────────────────────────────────────────────
  if (full.includes("automotive") || full.includes("powersports"))
    return "automotive";

  // ── INDUSTRIAL ────────────────────────────────────────────────────────────
  if (full.includes("industrial") || full.includes("scientific"))
    return "industrial";

  // ── BOOKS ─────────────────────────────────────────────────────────────────
  if (full.includes("books") || full.includes("kindle"))
    return "books";

  // ── LARGE APPLIANCES ──────────────────────────────────────────────────────
  if (full.includes("large appliance") || full.includes("refrigerator") ||
      full.includes("washing machine"))
    return price <= 300 ? "large_app_low" : price <= 500 ? "large_app_mid" : "large_app_high";

  return "everything_else";
}

// ─── Amazon Categories 2026 — Exact tiered referral rates ──────────────────
// Source: Amazon Referral Fee Complete Guide 2026
// rate = effective rate shown in dropdown (for display)
// tierNote = full tier description
type AmazonCategory = { label: string; rate: number; tierNote: string; key: string };

const AMAZON_CATEGORIES: AmazonCategory[] = [
  { key: "amazon_device",    label: "Amazon Device Accessories",          rate: 45, tierNote: "45% flat" },
  { key: "automotive",       label: "Automotive & Powersports",           rate: 12, tierNote: "12% flat" },
  { key: "baby_low",         label: "Baby Products (price ≤ $10)",        rate: 8,  tierNote: "8% if ≤$10" },
  { key: "baby_high",        label: "Baby Products (price > $10)",        rate: 15, tierNote: "15% if >$10" },
  { key: "beauty_low",       label: "Beauty & Personal Care (≤ $10)",     rate: 8,  tierNote: "8% if ≤$10" },
  { key: "beauty_high",      label: "Beauty & Personal Care (> $10)",     rate: 15, tierNote: "15% if >$10" },
  { key: "books",            label: "Books",                              rate: 15, tierNote: "15%, no min fee" },
  { key: "camera",           label: "Camera & Photo",                     rate: 8,  tierNote: "8% flat" },
  { key: "cell_phone",       label: "Cell Phones / Wireless",             rate: 8,  tierNote: "8% flat" },
  { key: "clothing_low",     label: "Clothing & Accessories (≤ $15)",     rate: 5,  tierNote: "5% if ≤$15" },
  { key: "clothing_mid",     label: "Clothing & Accessories ($15–$20)",   rate: 10, tierNote: "10% if $15–$20" },
  { key: "clothing_high",    label: "Clothing & Accessories (> $20)",     rate: 17, tierNote: "17% if >$20" },
  { key: "shoes_low",        label: "Shoes, Handbags & Sunglasses (≤ $75)",  rate: 5,  tierNote: "5% if ≤$75" },
  { key: "shoes_mid",        label: "Shoes, Handbags & Sunglasses ($75–$150)", rate: 10, tierNote: "10% if $75–$150" },
  { key: "shoes_high",       label: "Shoes, Handbags & Sunglasses (> $150)", rate: 15, tierNote: "15% if >$150" },
  { key: "electronics",      label: "Consumer Electronics",               rate: 8,  tierNote: "8% flat" },
  { key: "elec_acc_low",     label: "Electronics Accessories (≤ $100)",   rate: 15, tierNote: "15% on portion ≤ $100" },
  { key: "elec_acc_high",    label: "Electronics Accessories (> $100)",   rate: 8,  tierNote: "8% on portion > $100" },
  { key: "computers",        label: "Computers",                          rate: 8,  tierNote: "8% flat" },
  { key: "furniture_low",    label: "Furniture (≤ $200)",                 rate: 15, tierNote: "15% if ≤$200" },
  { key: "furniture_high",   label: "Furniture (> $200)",                 rate: 10, tierNote: "10% if >$200" },
  { key: "gift_cards",       label: "Gift Cards",                         rate: 20, tierNote: "20%, no min fee" },
  { key: "grocery_low",      label: "Grocery & Gourmet (≤ $15)",          rate: 8,  tierNote: "8% if ≤$15, no min" },
  { key: "grocery_high",     label: "Grocery & Gourmet (> $15)",          rate: 15, tierNote: "15% if >$15, no min" },
  { key: "health_low",       label: "Health & Household (≤ $10)",         rate: 8,  tierNote: "8% if ≤$10" },
  { key: "health_high",      label: "Health & Household (> $10)",         rate: 15, tierNote: "15% if >$10" },
  { key: "home_kitchen",     label: "Home & Kitchen",                     rate: 15, tierNote: "15% flat" },
  { key: "industrial",       label: "Industrial & Scientific",            rate: 12, tierNote: "12% flat" },
  { key: "jewelry_low",      label: "Jewelry (portion ≤ $250)",           rate: 20, tierNote: "20% on ≤$250 portion" },
  { key: "jewelry_high",     label: "Jewelry (portion > $250)",           rate: 5,  tierNote: "5% on >$250 portion" },
  { key: "large_app_low",    label: "Large Appliances (≤ $300)",          rate: 8,  tierNote: "8% if ≤$300" },
  { key: "large_app_mid",    label: "Large Appliances ($300–$500)",       rate: 15, tierNote: "15% if $300–$500" },
  { key: "large_app_high",   label: "Large Appliances (> $500)",          rate: 8,  tierNote: "8% if >$500" },
  { key: "luggage",          label: "Luggage & Travel",                   rate: 15, tierNote: "15% flat" },
  { key: "musical",          label: "Musical Instruments",                rate: 15, tierNote: "15% flat" },
  { key: "office",           label: "Office Products",                    rate: 15, tierNote: "15% flat" },
  { key: "pet",              label: "Pet Supplies",                       rate: 15, tierNote: "15% flat" },
  { key: "sports",           label: "Sports & Outdoors",                  rate: 15, tierNote: "15% flat" },
  { key: "toys",             label: "Toys & Games",                       rate: 15, tierNote: "15% flat" },
  { key: "tools",            label: "Tools & Home Improvement",           rate: 15, tierNote: "15% flat" },
  { key: "video_games",      label: "Video Games",                        rate: 15, tierNote: "15% flat" },
  { key: "video_console",    label: "Video Game Consoles",                rate: 8,  tierNote: "8% flat" },
  { key: "watches_low",      label: "Watches (portion ≤ $1,500)",         rate: 16, tierNote: "16% on ≤$1,500, min $2" },
  { key: "watches_high",     label: "Watches (portion > $1,500)",         rate: 3,  tierNote: "3% on >$1,500 portion" },
  { key: "fine_art_1",       label: "Fine Art (≤ $100)",                  rate: 20, tierNote: "20% if ≤$100" },
  { key: "fine_art_2",       label: "Fine Art ($100–$1,000)",             rate: 15, tierNote: "15% if $100–$1,000" },
  { key: "fine_art_3",       label: "Fine Art ($1,000–$5,000)",           rate: 10, tierNote: "10% if $1,000–$5,000" },
  { key: "fine_art_4",       label: "Fine Art (> $5,000)",                rate: 5,  tierNote: "5% if >$5,000" },
  { key: "handmade",         label: "Handmade",                           rate: 15, tierNote: "15%, min $1.00" },
  { key: "everything_else",  label: "Everything Else",                    rate: 15, tierNote: "15% flat" },
];

const decisionStyles = {
  EXCELLENT: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", icon: CheckCircle2, label: "EXCELLENT" },
  GOOD:      { bg: "bg-sky-500/15",     text: "text-sky-400",     border: "border-sky-500/30",     icon: CheckCircle2, label: "GOOD" },
  AVERAGE:   { bg: "bg-amber-500/15",   text: "text-amber-400",   border: "border-amber-500/30",   icon: AlertTriangle, label: "AVERAGE" },
  BAD:       { bg: "bg-orange-500/15",  text: "text-orange-400",  border: "border-orange-500/30",  icon: AlertTriangle, label: "BAD" },
  REJECT:    { bg: "bg-destructive/15", text: "text-destructive", border: "border-destructive/30", icon: XCircle, label: "REJECT" },
} as const;

// ─── Component ───────────────────────────────────────────────────────────────
const ProductResearch = () => {
  const [asin, setAsin]       = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData]       = useState<KeepaProductResponse | null>(null);
  const [flags, setFlags]     = useState<ManualFlags>(defaultFlags);
  const [manualWeightLb, setManualWeightLb] = useState<string>("");
  const [score, setScore]          = useState<ScoreResult | null>(null);
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showCatDropdown, setShowCatDropdown]   = useState(false);
  const [manualRate, setManualRate]             = useState<number | null>(null);
  const { toast }             = useToast();
  const [searchParams]        = useSearchParams();

  const fetchData = async (override?: string) => {
    const target = (override ?? asin).trim();
    if (!/^[A-Z0-9]{10}$/i.test(target)) {
      toast({ title: "Invalid ASIN", description: "Must be 10 alphanumeric characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setScore(null);
    setData(null);
    try {
      const weightG = manualWeightLb ? parseFloat(manualWeightLb) * 453.592 : 0;
      const resp = await fetchKeepaProduct(target, 1, flags.estCogs, weightG);
      setData(resp);
      setFlags((f) => ({ ...f, buyBoxExists: resp.hasBuyBox }));
      // Use ALL Keepa category levels + title for maximum accuracy
      // e.g. "Clothing, Shoes & Jewelry | Watches | Wrist Watches" gives "Wrist Watches"
      const keepaCat = resp.allCategories || [resp.rootCategory, resp.category].filter(Boolean).join(" | ");
      const title    = resp.title || "";
      const price    = resp.pricing.sellingPrice ?? resp.pricing.medianBuyBox ?? 0;
      if (keepaCat || title) {
        const detectedKey = detectCategory(keepaCat, title, price);
        const bestMatch   = AMAZON_CATEGORIES.find(c => c.key === detectedKey) ?? null;
        if (bestMatch) {
          setSelectedCategory(bestMatch.label);
          setCategorySearch(bestMatch.label);
          setManualRate(bestMatch.rate);
        } else {
          setCategorySearch(keepaCat);
          setSelectedCategory("");
          setManualRate(null);
        }
      }
      toast({ title: "Product loaded", description: resp.title?.slice(0, 60) ?? target });
    } catch (err: any) {
      toast({ title: "Failed to fetch", description: err?.message ?? "Check backend URL and API key.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const calculate = () => {
    if (!data) return;

    // Recalculate fees using manualRate from category dropdown
    // This ensures profit card and scoring section use SAME values
    const price      = data.pricing.sellingPrice ?? data.pricing.medianBuyBox ?? 0;
    const rate       = (manualRate ?? data.profitAnalysis.referralRate) / 100;
    const refFee     = parseFloat(Math.max(price * rate, 0.30).toFixed(2));
    const fbaFee     = data.profitAnalysis.fbaFee ?? 0;
    const storage    = data.profitAnalysis.storageFee ?? 0;
    const inbound    = data.profitAnalysis.inboundPlacementFee ?? 0;
    const totalFees  = parseFloat((refFee + fbaFee + storage + inbound).toFixed(2));

    const metrics = {
      currentPrice:      price,
      currentBuyBox:     price,
      sellingPrice:      price,
      medianBuyBox90:    data.pricing.medianBuyBox,
      currentRank:       data.metrics.currentRank,
      avgRank90:         data.metrics.avgRank90,
      monthlySales:      data.metrics.monthlySalesEstimate,
      rankSpike:         data.metrics.rankSpike,
      currentFbaCount:   data.metrics.currentFbaCount,
      currentOfferCount: data.metrics.currentOfferCount,
      amazonIsSeller:    data.metrics.amazonIsSeller,
      hasBuyBox:         data.metrics.hasBuyBox,
      currentRating:     data.metrics.currentRating,
      currentReviewCount:data.metrics.currentReviewCount,
      isHazmat:          data.isHazmat,
      // Use recalculated fees — same as profit card
      referralFee:       refFee,
      fbaFee:            fbaFee,
      storageFee:        storage,
      totalFees:         totalFees,
    };
    const result = scoreProduct(metrics, flags);
    setScore(result);
    addHistory({
      asin:                 data.asin,
      title:                data.title,
      brand:                data.brand,
      image:                data.image,
      category:             data.category,
      decision:             result.decision,
      total:                result.total,
      maxTotal:             result.maxTotal,
      pct:                  result.pct,
      sellingPrice:         result.sellingPrice,
      medianPrice:          data.pricing.medianBuyBox,
      profit:               result.profit,
      roi:                  result.roi,
      rejectionReasons:     result.rejectionReasons,
      currentRank:          data.metrics.currentRank,
      avgRank90:            data.metrics.avgRank90,
      rating:               data.metrics.currentRating,
      reviewCount:          data.metrics.currentReviewCount,
      fbaSellerCount:       data.metrics.currentFbaCount,
      monthlySalesEstimate: data.metrics.monthlySalesEstimate,
      monthlyRevenue:       data.metrics.monthlyRevenue,
      isHazmat:             data.isHazmat,
      amazonIsSeller:       data.metrics.amazonIsSeller,
    }, result);
  };

  useEffect(() => {
    const a = searchParams.get("asin");
    if (a && /^[A-Z0-9]{10}$/i.test(a)) {
      setAsin(a.toUpperCase());
      fetchData(a.toUpperCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateFlag = <K extends keyof ManualFlags>(k: K, v: ManualFlags[K]) =>
    setFlags((f) => ({ ...f, [k]: v }));

  const fmtDate  = (t: number) => new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "2-digit" });
  const fmtMoney = (v: number | null | undefined) => (v == null ? "—" : `$${v.toFixed(2)}`);
  const fmtNum   = (v: number | null | undefined) => (v == null ? "—" : v.toLocaleString());
  const fmtPct   = (v: number | null | undefined) => (v == null ? "—" : `${v > 0 ? "+" : ""}${v.toFixed(1)}%`);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Product Research</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter an Amazon ASIN to fetch 90-day market data and score FBA viability using the Product Hunting Tool criteria.
        </p>
      </div>

      {/* ── ASIN Lookup ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lookup ASIN</CardTitle>
          <CardDescription>Auto-fetches: BSR, Sales, Ratings, Reviews, FBA Sellers, Selling Price, Buy Box, Hazmat, Rank Spikes (last 90 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={asin}
              onChange={(e) => setAsin(e.target.value.toUpperCase())}
              placeholder="Enter 10-character ASIN (e.g. B07PXGQC1Q)"
              maxLength={10}
              className="font-mono uppercase"
              onKeyDown={(e) => e.key === "Enter" && fetchData()}
            />
            <Button onClick={() => fetchData()} disabled={loading} variant="hero" className="w-44 shrink-0">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Search className="h-4 w-4 mr-1" />}
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <>
          {/* ── Product Header ────────────────────────────────────────────── */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {data.image && (
                  <img
                    src={data.image}
                    alt={data.title ?? data.asin}
                    className="h-28 w-28 sm:h-36 sm:w-36 object-contain rounded-lg bg-muted/30 p-2 shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary" className="font-mono">{data.asin}</Badge>
                    {data.brand && <Badge variant="outline">{data.brand}</Badge>}
                    {data.rootCategory && <Badge variant="outline">{data.rootCategory}</Badge>}
                    {data.category && data.category !== data.rootCategory && (
                      <Badge variant="outline" className="text-muted-foreground text-[11px]">{data.category}</Badge>
                    )}
                    {data.isHazmat && (
                      <Badge variant="destructive" className="gap-1">
                        <ShieldAlert className="h-3 w-3" /> Hazmat — AUTO REJECT
                      </Badge>
                    )}
                    {data.isAdultProduct && (
                      <Badge variant="destructive">Adult Product</Badge>
                    )}
                    {data.metrics.amazonIsSeller && (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Amazon sells this</Badge>
                    )}
                    {data.metrics.rankSpike && (
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">⚠ Rank spike detected</Badge>
                    )}
                  </div>

                  <h2 className="font-semibold text-base sm:text-lg leading-snug line-clamp-2 mb-4">
                    {data.title ?? "Untitled"}
                  </h2>

                  {/* Auto-fetched metrics grid (from PDF spec "auto-fetch" fields) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <AutoStat label="Selling Price (now)" value={fmtMoney(data.pricing.sellingPrice)} auto />
                    <AutoStat label="Buy Box (90d median)" value={fmtMoney(data.pricing.medianBuyBox)} auto />
                    <AutoStat label="BSR (current)" value={fmtNum(data.metrics.currentRank)} auto />
                    <AutoStat label="BSR (90d avg)" value={fmtNum(data.metrics.avgRank90)} auto />
                    <AutoStat label="Rating (avg)" value={data.metrics.currentRating?.toFixed(1) ?? "—"} auto />
                    <AutoStat label="Reviews (total)" value={fmtNum(data.metrics.currentReviewCount)} auto />
                    <AutoStat label="FBA Sellers" value={fmtNum(data.metrics.currentFbaCount ?? data.metrics.currentOfferCount)} auto />
                    <AutoStat label="Est. Sales / month" value={fmtNum(data.metrics.monthlySalesEstimate)} auto />
                  </div>

                  {/* Secondary metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                    <AutoStat label="Price trend (90d)" value={fmtPct(data.pricing.priceTrend90)} trend={data.pricing.priceTrend90} auto />
                    <AutoStat label="BSR trend (90d)" value={fmtPct(data.metrics.bsrTrend90)} trend={data.metrics.bsrTrend90 != null ? -data.metrics.bsrTrend90 : null} note="neg = improving" auto />
                    <AutoStat label="Min price (90d)" value={fmtMoney(data.pricing.stats90.minBuyBox)} auto />
                    <AutoStat label="Max price (90d)" value={fmtMoney(data.pricing.stats90.maxBuyBox)} auto />
                  </div>

                  {/* Product attributes row */}
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {data.pricing.listPrice && (
                      <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> MSRP: {fmtMoney(data.pricing.listPrice)}</span>
                    )}
                    {data.pricing.mapPrice && (
                      <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> MAP: {fmtMoney(data.pricing.mapPrice)}</span>
                    )}
                    {data.packageWeightG && (
                      <span className="flex items-center gap-1"><Weight className="h-3 w-3" /> {(data.packageWeightG / 453.592).toFixed(2)} lb</span>
                    )}
                    {data.model && <span>Model: {data.model}</span>}
                    {data.tokensLeft != null && (
                      <span className="ml-auto opacity-50">API tokens: {fmtNum(data.tokensLeft)}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Profit Analysis Card ─────────────────────────────────────── */}
          <Card className="border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Profit Analysis
                <Badge variant="outline" className="text-[10px] ml-1">Amazon Revenue Calculator</Badge>
              </CardTitle>
              <CardDescription>
                Net Profit = Item Price − Referral Fee − FBA Fee − Storage − Inbound Placement − COGS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* ── Input row: Category + COGS + Weight ───────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                {/* Category search dropdown */}
                <div className="relative sm:col-span-1">
                  <Label className="text-xs flex items-center gap-1">
                    Amazon Category
                    {(data.rootCategory || data.category) && (
                      <span className="text-[9px] bg-primary/15 text-primary rounded px-1">auto</span>
                    )}
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      placeholder="Search category…"
                      value={categorySearch}
                      onChange={(e) => {
                        setCategorySearch(e.target.value);
                        setShowCatDropdown(true);
                        if (!e.target.value) { setSelectedCategory(""); setManualRate(null); }
                      }}
                      onFocus={() => setShowCatDropdown(true)}
                      className="pr-8 text-xs"
                    />
                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  </div>
                  {showCatDropdown && categorySearch && (
                    <div className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border border-border bg-background shadow-lg">
                      {AMAZON_CATEGORIES.filter(c =>
                        c.label.toLowerCase().includes(categorySearch.toLowerCase())
                      ).slice(0, 15).map(c => (
                        <button
                          key={c.key}
                          type="button"
                          className="w-full text-left px-3 py-2 text-xs hover:bg-muted/80 border-b border-border/40 last:border-0"
                          onClick={() => {
                            setSelectedCategory(c.label);
                            setCategorySearch(c.label);
                            setManualRate(c.rate);
                            setShowCatDropdown(false);
                          }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium truncate">{c.label}</span>
                            <span className="text-primary font-mono font-bold shrink-0">{c.rate}%</span>
                          </div>
                          <p className="text-muted-foreground text-[10px] mt-0.5">{c.tierNote}</p>
                        </button>
                      ))}
                      {AMAZON_CATEGORIES.filter(c =>
                        c.label.toLowerCase().includes(categorySearch.toLowerCase())
                      ).length === 0 && (
                        <div className="px-3 py-2 text-xs text-muted-foreground">
                          No match — using 15% default (Everything Else)
                        </div>
                      )}
                    </div>
                  )}
                  {selectedCategory && manualRate != null && (
                    <p className="text-[10px] text-primary mt-1 flex items-center gap-1">
                      ✓ {manualRate}% referral rate selected
                    </p>
                  )}
                </div>

                {/* COGS */}
                <div>
                  <Label className="text-xs">COGS ($) <span className="text-muted-foreground">(optional — for ROI)</span></Label>
                  <Input
                    type="number" step="0.01" min="0" placeholder="Your supplier cost"
                    value={flags.estCogs || ""}
                    onChange={(e) => updateFlag("estCogs", Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                {/* Manual weight if Keepa missing */}
                <div>
                  <Label className={`text-xs ${data.profitAnalysis.weightMissing ? "text-amber-400" : ""}`}>
                    {data.profitAnalysis.weightMissing ? "⚠ Weight (lb) — not available" : `Weight: ${data.packageWeightG ? (data.packageWeightG / 453.592).toFixed(2) + " lb (auto)" : "—"}`}
                  </Label>
                  {data.profitAnalysis.weightMissing ? (
                    <Input
                      type="number" step="0.01" min="0" placeholder="e.g. 2.5 — check Amazon listing"
                      value={manualWeightLb}
                      onChange={(e) => setManualWeightLb(e.target.value)}
                      className="mt-1 border-amber-500/40"
                    />
                  ) : (
                    <div className="mt-1 h-9 rounded-md border border-border/40 bg-muted/20 px-3 flex items-center text-xs text-muted-foreground">
                      {data.packageWeightG ? `${(data.packageWeightG / 453.592).toFixed(2)} lb — auto-detected` : "No weight data"}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Fee breakdown cards ───────────────────────────────── */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                <ProfitCell
                  label="Item Price"
                  sub="current Buy Box"
                  value={fmtMoney(data.pricing.sellingPrice ?? data.pricing.medianBuyBox)}
                />
                <ProfitCell
                  label={`Referral Fee (${manualRate ?? data.profitAnalysis.referralRate}%)`}
                  sub={selectedCategory ? selectedCategory.split("(")[0].trim() : "Amazon commission"}
                  value={(() => {
                    const price = data.pricing.sellingPrice ?? data.pricing.medianBuyBox ?? 0;
                    let fee: number;
                    const selCat = selectedCategory;
                    // Electronics Accessories tiered calculation
                    if (selCat.includes("Electronics Accessories")) {
                      if (price <= 100) fee = Math.max(price * 0.15, 0.30);
                      else fee = Math.max((100 * 0.15) + ((price - 100) * 0.08), 0.30);
                    } else if (selCat.includes("Jewelry") && price > 250) {
                      fee = Math.max((250 * 0.20) + ((price - 250) * 0.05), 0.30);
                    } else if (selCat.includes("Watches") && price > 1500) {
                      fee = Math.max((1500 * 0.16) + ((price - 1500) * 0.03), 2.00);
                    } else {
                      const rate = (manualRate ?? data.profitAnalysis.referralRate) / 100;
                      fee = Math.max(price * rate, 0.30);
                    }
                    return `-${fmtMoney(fee)}`;
                  })()}
                  negative
                />
                <ProfitCell
                  label="FBA Fulfillment"
                  sub="pick, pack & ship"
                  value={data.profitAnalysis.fbaFee != null ? `-${fmtMoney(data.profitAnalysis.fbaFee)}` : "Enter weight ↑"}
                  negative={data.profitAnalysis.fbaFee != null}
                  warn={data.profitAnalysis.fbaFee == null}
                />
                <ProfitCell
                  label="Storage Cost"
                  sub="per unit/month"
                  value={data.profitAnalysis.storageFee != null ? `-${fmtMoney(data.profitAnalysis.storageFee)}` : "—"}
                  negative={data.profitAnalysis.storageFee != null && data.profitAnalysis.storageFee > 0}
                />
                <ProfitCell
                  label="Inbound Placement"
                  sub="Feb 2025 fee"
                  value={data.profitAnalysis.inboundPlacementFee != null ? `-${fmtMoney(data.profitAnalysis.inboundPlacementFee)}` : "Enter weight ↑"}
                  negative={data.profitAnalysis.inboundPlacementFee != null}
                  warn={data.profitAnalysis.inboundPlacementFee == null}
                />
                <ProfitCell
                  label="Net Profit"
                  highlight
                  value={(() => {
                    const price      = data.pricing.sellingPrice ?? data.pricing.medianBuyBox ?? 0;
                    const rate       = (manualRate ?? data.profitAnalysis.referralRate) / 100;
                    const refFee     = Math.max(price * rate, 0.30);
                    const fbaFee     = data.profitAnalysis.fbaFee ?? 0;
                    const storage    = data.profitAnalysis.storageFee ?? 0;
                    const inbound    = data.profitAnalysis.inboundPlacementFee ?? 0;
                    const totalFees  = refFee + fbaFee + storage + inbound;
                    if (data.profitAnalysis.fbaFee == null) return "Enter weight ↑";
                    return fmtMoney(price - totalFees - flags.estCogs);
                  })()}
                  sub={(() => {
                    const price     = data.pricing.sellingPrice ?? data.pricing.medianBuyBox ?? 0;
                    const rate      = (manualRate ?? data.profitAnalysis.referralRate) / 100;
                    const refFee    = Math.max(price * rate, 0.30);
                    const fbaFee    = data.profitAnalysis.fbaFee ?? 0;
                    const storage   = data.profitAnalysis.storageFee ?? 0;
                    const inbound   = data.profitAnalysis.inboundPlacementFee ?? 0;
                    const totalFees = refFee + fbaFee + storage + inbound;
                    if (data.profitAnalysis.fbaFee == null) return "Weight needed for FBA fee";
                    const net    = price - totalFees - flags.estCogs;
                    const margin = price > 0 ? ((net / price) * 100).toFixed(1) : "0";
                    const roi    = flags.estCogs > 0 ? ((net / flags.estCogs) * 100).toFixed(0) : null;
                    return roi ? `Margin ${margin}% · ROI ${roi}%` : `Margin ${margin}%`;
                  })()}
                />
              </div>

              {/* ── Summary strip ─────────────────────────────────────── */}
              <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Total Amazon Fees</p>
                  <p className="font-semibold text-destructive">
                    {(() => {
                      const price    = data.pricing.sellingPrice ?? data.pricing.medianBuyBox ?? 0;
                      const rate     = (manualRate ?? data.profitAnalysis.referralRate) / 100;
                      const refFee   = Math.max(price * rate, 0.30);
                      const fbaFee   = data.profitAnalysis.fbaFee ?? 0;
                      const storage  = data.profitAnalysis.storageFee ?? 0;
                      const inbound  = data.profitAnalysis.inboundPlacementFee ?? 0;
                      return data.profitAnalysis.fbaFee != null
                        ? `-${fmtMoney(refFee + fbaFee + storage + inbound)}`
                        : "—";
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Break-even Price</p>
                  <p className="font-semibold">
                    {(() => {
                      const price   = data.pricing.sellingPrice ?? data.pricing.medianBuyBox ?? 0;
                      const rate    = (manualRate ?? data.profitAnalysis.referralRate) / 100;
                      const refFee  = Math.max(price * rate, 0.30);
                      const fbaFee  = data.profitAnalysis.fbaFee ?? 0;
                      const storage = data.profitAnalysis.storageFee ?? 0;
                      const inbound = data.profitAnalysis.inboundPlacementFee ?? 0;
                      return data.profitAnalysis.fbaFee != null
                        ? fmtMoney(refFee + fbaFee + storage + inbound + flags.estCogs)
                        : "—";
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Est. Monthly Revenue</p>
                  <p className="font-semibold">{data.metrics.monthlyRevenue ? fmtMoney(data.metrics.monthlyRevenue) : "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Est. Sales / Month</p>
                  <p className="font-semibold">{fmtNum(data.metrics.monthlySalesEstimate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Manual Input Fields (per PDF spec — fields Keepa cannot provide) ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                Manual Input Fields
                <Badge variant="outline" className="text-[10px]">User-entered</Badge>
              </CardTitle>
              <CardDescription>
                These fields cannot be auto-fetched. Verify each manually before scoring.
                Hazmat is auto-detected and shown as a badge above.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Hazmat auto-detected notice */}
              {data.isHazmat && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
                  <ShieldAlert className="h-4 w-4 text-destructive shrink-0" />
                  <span><strong className="text-destructive">Hazmat auto-detected.</strong> This product will be automatically rejected — no manual override needed.</span>
                </div>
              )}

              {/* Section A: Hard-reject flags */}
              <div>
                <p className="text-xs font-semibold text-destructive mb-2 uppercase tracking-wide">
                  Hard Reject Checks — any "Yes" below = REJECT
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <ToggleRow
                    label="IP Complaint on record"
                    sub="Any IP complaint filed against this listing?"
                    value={flags.ipComplaint}
                    onChange={(v) => updateFlag("ipComplaint", v)}
                    danger={flags.ipComplaint}
                    rejectIf
                  />
                  <ToggleRow
                    label="Authenticity complaint history"
                    sub="Any past authenticity complaint?"
                    value={flags.authenticityComplaint}
                    onChange={(v) => updateFlag("authenticityComplaint", v)}
                    danger={flags.authenticityComplaint}
                    rejectIf
                  />
                  <ToggleRow
                    label="Gated category / brand"
                    sub="Is this gated for your account? (gated = reject)"
                    value={flags.gated}
                    onChange={(v) => updateFlag("gated", v)}
                    danger={flags.gated}
                    rejectIf
                  />
                  <ToggleRow
                    label="Listing is active"
                    sub="Is the product listing currently live?"
                    value={flags.listingActive}
                    onChange={(v) => updateFlag("listingActive", v)}
                    danger={!flags.listingActive}
                    rejectIf
                    invertLogic
                  />
                  <ToggleRow
                    label="Buy Box exists"
                    sub="Is there an active Buy Box on this listing?"
                    value={flags.buyBoxExists}
                    onChange={(v) => updateFlag("buyBoxExists", v)}
                    danger={!flags.buyBoxExists}
                    rejectIf
                    invertLogic
                  />
                </div>
              </div>

              <Separator />

              {/* Section B: Scoring flags */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Scoring Checks — affect points (not hard reject)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <ToggleRow
                    label="Seasonal product"
                    sub="Is demand highly seasonal? (seasonal = lose 10 pts)"
                    value={flags.seasonal}
                    onChange={(v) => updateFlag("seasonal", v)}
                    danger={flags.seasonal}
                  />
                  <ToggleRow
                    label="Buy Box rotates"
                    sub="Does Buy Box rotate among multiple sellers?"
                    value={flags.buyBoxRotates}
                    onChange={(v) => updateFlag("buyBoxRotates", v)}
                    danger={!flags.buyBoxRotates}
                    invertLogic
                  />
                  <ToggleRow
                    label="No aggressive repricers"
                    sub="Are sellers using aggressive repricing bots?"
                    value={flags.noAggressiveRepricers}
                    onChange={(v) => updateFlag("noAggressiveRepricers", v)}
                    danger={!flags.noAggressiveRepricers}
                    invertLogic
                  />
                  <ToggleRow
                    label="Seller rotation is stable"
                    sub="How often do sellers change? (unstable = lose 5 pts)"
                    value={flags.sellerRotationStable}
                    onChange={(v) => updateFlag("sellerRotationStable", v)}
                    danger={!flags.sellerRotationStable}
                    invertLogic
                  />
                  <ToggleRow
                    label="Storage fee = Low / Medium"
                    sub="Is the storage fee impact low or medium?"
                    value={flags.storageFeeLowOrMedium}
                    onChange={(v) => updateFlag("storageFeeLowOrMedium", v)}
                    danger={!flags.storageFeeLowOrMedium}
                    invertLogic
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button onClick={calculate} variant="hero" size="lg" className="w-full sm:w-auto px-10">
                  Calculate Score
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ── Score Verdict ─────────────────────────────────────────────── */}
          {score && <VerdictPanel score={score} />}

          {/* ── Charts (90-day data) ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Selling Price — Last 90 Days" description="Buy Box price with 90-day median reference line">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data.series.price.map((p) => ({ date: fmtDate(p.t), value: p.v }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                    formatter={(v: any) => [`$${Number(v).toFixed(2)}`, "Price"]}
                  />
                  {data.pricing.medianBuyBox && (
                    <ReferenceLine
                      y={data.pricing.medianBuyBox}
                      stroke="hsl(var(--primary))"
                      strokeDasharray="6 3"
                      strokeOpacity={0.7}
                      label={{ value: `90d median $${data.pricing.medianBuyBox.toFixed(2)}`, position: "insideTopRight", fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    />
                  )}
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="BSR / Sales Rank — Last 90 Days" description="Lower = better rank. Negative trend = improving.">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data.series.rank.map((p) => ({ date: fmtDate(p.t), value: p.v }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} reversed tickFormatter={(v) => v.toLocaleString()} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                    formatter={(v: any) => [Number(v).toLocaleString(), "BSR"]}
                  />
                  {data.metrics.avgRank90 && (
                    <ReferenceLine
                      y={data.metrics.avgRank90}
                      stroke="hsl(var(--accent))"
                      strokeDasharray="6 3"
                      strokeOpacity={0.7}
                      label={{ value: `90d avg ${data.metrics.avgRank90.toLocaleString()}`, position: "insideTopRight", fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    />
                  )}
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Reviews — Last 90 Days" description="Cumulative review count">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.series.reviews.map((p) => ({ date: fmtDate(p.t), value: p.v }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Score Breakdown" description="Points earned vs maximum per criterion (run Calculate Score first)">
              {score ? (
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart
                    data={score.criteria.map((c) => ({
                      subject: `#${c.criteriaNum}`,
                      A: c.earned,
                      fullMark: c.weight,
                    }))}
                  >
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" fontSize={9} />
                    <Radar name="Score" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.35} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                      formatter={(v: any, _: any, props: any) => {
                        const c = score.criteria.find((x) => `#${x.criteriaNum}` === props?.payload?.subject);
                        return [`${v}/${c?.weight ?? "?"} — ${c?.label ?? ""}`, "Score"];
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
                  Run "Calculate Score" to see breakdown.
                </div>
              )}
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

// Auto-fetched stat tile
const AutoStat = ({
  label, value, auto, trend, note,
}: { label: string; value: string; auto?: boolean; trend?: number | null; note?: string }) => {
  const trendColor = trend == null ? "" : trend > 0 ? "text-emerald-400" : trend < 0 ? "text-destructive" : "";
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/20 p-2.5">
      {auto && <span className="mt-0.5 shrink-0 text-[9px] rounded bg-primary/20 text-primary px-1 font-medium uppercase">auto</span>}
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground leading-none mb-0.5">{label}</p>
        <p className={`text-sm font-semibold truncate ${trendColor}`}>{value}</p>
        {note && <p className="text-[9px] text-muted-foreground">{note}</p>}
      </div>
    </div>
  );
};

// Profit breakdown cell
const ProfitCell = ({
  label, sub, value, negative, highlight, warn,
}: { label: string; sub?: string; value: string; negative?: boolean; highlight?: boolean; warn?: boolean }) => (
  <div className={`rounded-lg border p-3 ${highlight ? "border-primary/40 bg-primary/5" : warn ? "border-amber-500/30 bg-amber-500/5" : "border-border/60 bg-muted/20"}`}>
    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className={`text-sm font-bold mt-0.5 ${highlight ? "text-primary" : negative ? "text-destructive" : warn ? "text-amber-400" : ""}`}>{value}</p>
    {sub && <p className="text-[9px] text-muted-foreground mt-0.5">{sub}</p>}
  </div>
);

// Manual toggle row with descriptor
const ToggleRow = ({
  label, sub, value, onChange, danger, rejectIf, invertLogic,
}: {
  label: string; sub?: string; value: boolean; onChange: (v: boolean) => void;
  danger?: boolean; rejectIf?: boolean; invertLogic?: boolean;
}) => (
  <div className={`rounded-lg border p-3 transition-colors ${danger ? "border-destructive/40 bg-destructive/5" : "border-border/60 bg-muted/20"}`}>
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-sm font-medium leading-none">{label}</p>
        {sub && <p className="text-[10px] text-muted-foreground mt-1 leading-snug">{sub}</p>}
        {rejectIf && (
          <span className="inline-block mt-1 text-[9px] rounded bg-destructive/15 text-destructive px-1.5 py-0.5 uppercase tracking-wide font-medium">
            {invertLogic ? "No = REJECT" : "Yes = REJECT"}
          </span>
        )}
      </div>
      <Switch checked={value} onCheckedChange={onChange} className="shrink-0 mt-0.5" />
    </div>
  </div>
);

// Verdict panel
const VerdictPanel = ({ score }: { score: ScoreResult }) => {
  const style = decisionStyles[score.decision];
  const Icon  = style.icon;
  return (
    <Card className={`border ${style.border}`}>
      <CardContent className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${style.bg} shrink-0`}>
            <Icon className={`h-7 w-7 ${style.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-3">
              <h3 className={`font-display text-2xl font-bold ${style.text}`}>{score.decision}</h3>
              {!score.rejected && (
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{score.total}</span>/{score.maxTotal} pts
                  &nbsp;({score.pct}%)
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{score.explanation}</p>

            {/* Rejection reasons */}
            {score.rejected && score.rejectionReasons.length > 0 && (
              <div className="mt-3 space-y-1">
                {score.rejectionReasons.map((r) => (
                  <div key={r} className="flex items-center gap-2 text-sm text-destructive">
                    <XCircle className="h-3.5 w-3.5 shrink-0" /> {r}
                  </div>
                ))}
              </div>
            )}

            {/* Profit summary */}
            {!score.rejected && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                <MiniStat label="Selling Price" value={`$${score.sellingPrice.toFixed(2)}`} />
                <MiniStat label="Net Profit / Unit" value={score.profit != null ? `$${score.profit.toFixed(2)}` : "—"} positive={score.profit != null && score.profit > 0} />
                <MiniStat label="ROI" value={score.roi != null ? `${score.roi.toFixed(0)}%` : "—"} positive={score.roi != null && score.roi >= 20} />
                <MiniStat label="Profit Margin" value={score.margin != null ? `${score.margin.toFixed(0)}%` : "—"} positive={score.margin != null && score.margin >= 15} />
                <MiniStat label="Referral Fee" value={`$${score.referralFee.toFixed(2)}`} />
                <MiniStat label="FBA Fee" value={score.fbaFee != null ? `$${score.fbaFee.toFixed(2)}` : "—"} />
                <MiniStat label="Break-even" value={score.breakEven != null ? `$${score.breakEven.toFixed(2)}` : "—"} />
              </div>
            )}
          </div>
        </div>

        {/* Criteria breakdown */}
        {!score.rejected && score.criteria.length > 0 && (
          <>
            <Separator className="my-4" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Criterion-by-Criterion Breakdown
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
              {score.criteria.map((c) => (
                <div
                  key={c.key}
                  className={`flex items-center justify-between rounded-md border px-3 py-2 text-xs ${
                    c.passed ? "border-emerald-500/20 bg-emerald-500/5" : "border-border/60 bg-muted/20"
                  }`}
                >
                  <span className="flex items-center gap-1.5 min-w-0">
                    {c.passed
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      : <XCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                    <span className={`truncate ${c.tier === "high" ? "font-medium" : ""}`}>
                      <span className="text-muted-foreground mr-1">#{c.criteriaNum}</span>
                      {c.label}
                    </span>
                  </span>
                  <span className="font-mono text-muted-foreground ml-2 shrink-0">
                    {c.earned}/{c.weight}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const MiniStat = ({ label, value, positive }: { label: string; value: string; positive?: boolean }) => (
  <div className="rounded-lg border border-border/60 bg-muted/20 p-2.5">
    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className={`text-sm font-semibold ${positive === false ? "text-destructive" : positive === true ? "text-emerald-400" : ""}`}>
      {value}
    </p>
  </div>
);

const ChartCard = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm">{title}</CardTitle>
      <CardDescription className="text-xs">{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export default ProductResearch;
