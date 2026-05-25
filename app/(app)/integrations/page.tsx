"use client";

import { IntegrationsWidget } from "@/components/dashboard/IntegrationsWidget";

export default function IntegrationsPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-text-heading">Integrations</h1>
        <p className="text-text-body mt-1">Connect your favorite tools and services.</p>
      </div>
      <IntegrationsWidget />
    </div>
  );
}
