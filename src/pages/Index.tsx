import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import GraphPreview from "@/components/landing/GraphPreview";
import HowItWorks from "@/components/landing/HowItWorks";
import Benefits from "@/components/landing/Benefits";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <GraphPreview />
        <HowItWorks />
        <Benefits />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
