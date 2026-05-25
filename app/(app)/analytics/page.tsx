"use client";

import { ProductivityStats } from "@/components/dashboard/ProductivityStats";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-heading">Analytics</h1>
        <p className="text-text-body mt-1">Weekly and monthly productivity insights.</p>
      </div>
      <ProductivityStats />
    </div>
  );
}
