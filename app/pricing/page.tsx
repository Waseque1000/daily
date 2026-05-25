import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar variant="marketing" />
      <main className="pt-8">
        <div className="text-center px-4 py-12">
          <h1 className="text-4xl font-bold text-text-heading">Pricing</h1>
          <p className="mt-4 text-text-body">Choose the plan that fits your workflow.</p>
        </div>
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
