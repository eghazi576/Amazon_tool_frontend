import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Boxes, TrendingUp, Activity, DollarSign } from "lucide-react";

const Overview = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Welcome back 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Research Amazon products, score viability, and uncover brand opportunities.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={Activity} label="Lookups today" value="—" />
        <KpiCard icon={TrendingUp} label="Avg. score" value="—" />
        <KpiCard icon={DollarSign} label="Approved" value="—" />
        <KpiCard icon={Boxes} label="Brands tracked" value="—" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ActionCard
          to="/dashboard/research"
          icon={Search}
          title="Product Research"
          desc="Enter an ASIN, fetch live Keepa data, score viability."
          cta="Analyze a product"
        />
        <ActionCard
          to="/dashboard/brand"
          icon={Boxes}
          title="Brand Intelligence"
          desc="Aggregated insights across a brand's catalog."
          cta="Explore brands"
        />
        <ActionCard
          to="/dashboard/ai"
          icon={Sparkles}
          title="AI Insights"
          desc="Ask questions, get recommendations on your products."
          cta="Open AI"
        />
      </div>
    </div>
  );
};

const KpiCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const ActionCard = ({ to, icon: Icon, title, desc, cta }: any) => (
  <Card className="hover:border-primary/40 transition-smooth">
    <CardHeader>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant mb-2">
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <CardTitle className="text-base">{title}</CardTitle>
      <CardDescription>{desc}</CardDescription>
    </CardHeader>
    <CardContent>
      <Button asChild variant="hero" size="sm" className="w-full">
        <Link to={to}>{cta}</Link>
      </Button>
    </CardContent>
  </Card>
);

export default Overview;
