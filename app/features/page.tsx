import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Features } from "@/components/landing/Features";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar variant="marketing" />
      <main className="pt-8">
        <div className="text-center px-4 py-12">
          <h1 className="text-4xl font-bold text-text-heading">Features</h1>
          <p className="mt-4 text-text-body max-w-xl mx-auto">
            Everything you need to plan calmly, stay focused, and work with intention.
          </p>
        </div>
        <Features />
      </main>
      <Footer />
    </div>
  );
}
