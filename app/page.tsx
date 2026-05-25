import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar variant="marketing" />
      <main>
        <Hero />
        <Features />
        <section className="py-16 px-4 border-y border-border bg-card/30">
          <p className="text-center text-sm text-text-muted uppercase tracking-widest mb-8">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-40">
            {["Notion", "Linear", "Slack", "Figma", "Vercel", "Stripe"].map((name) => (
              <span key={name} className="text-xl font-bold text-text-heading">
                {name}
              </span>
            ))}
          </div>
        </section>
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
