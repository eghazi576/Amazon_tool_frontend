import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const Stub = ({ icon: Icon, title, desc }: any) => (
  <div className="container mx-auto p-4 sm:p-6 lg:p-8">
    <div className="mb-6">
      <h1 className="font-display text-2xl sm:text-3xl font-bold">{title}</h1>
      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
    </div>
    <Card>
      <CardHeader>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant mb-2">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle>Coming soon</CardTitle>
        <CardDescription>This section is being built. The Product Research page is fully functional today.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Use Product Research from the sidebar to look up an ASIN and run an FBA viability check.
      </CardContent>
    </Card>
  </div>
);

export const AIInsights = () => (
  <Stub icon={Sparkles} title="AI Insights" desc="Conversational analysis on your tracked products." />
);

// Settings is no longer a stub -- it is the account-deletion page.
// See src/pages/dashboard/Settings.tsx
