"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Link from "next/link";
import { PRICING_PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-heading">Simple pricing</h2>
          <p className="mt-4 text-text-body">Start free, upgrade when you&apos;re ready.</p>
          <div className="mt-6 inline-flex items-center gap-3 p-1 rounded-xl bg-background border border-border">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                !annual && "bg-primary text-white"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                annual && "bg-primary text-white"
              )}
            >
              Annual
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "p-8 rounded-3xl border bg-card transition-all",
                plan.popular
                  ? "border-primary shadow-lg scale-[1.02]"
                  : "border-border shadow-md hover:shadow-lg"
              )}
            >
              {plan.popular && (
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-bold text-text-heading mt-2">{plan.name}</h3>
              <p className="mt-4 text-4xl font-bold text-text-heading">
                ${annual ? plan.price.annual : plan.price.monthly}
                <span className="text-base font-normal text-text-muted">
                  {plan.price.monthly === 0 ? "" : annual ? "/yr" : "/mo"}
                </span>
              </p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-body">
                    <Check className="w-4 h-4 text-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={cn(
                  "mt-8 block text-center py-3 rounded-xl font-semibold transition-all",
                  plan.popular
                    ? "bg-accent text-text-heading hover:shadow-md"
                    : "bg-primary text-white hover:shadow-md"
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
