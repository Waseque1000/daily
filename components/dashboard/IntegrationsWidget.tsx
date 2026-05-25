"use client";

import {
  Calendar,
  Mail,
  FileText,
  MessageSquare,
  Code2,
  Check,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useAppStore } from "@/store/store";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Calendar,
  Mail,
  FileText,
  MessageSquare,
  Github: Code2,
  Trello: FileText,
};

export function IntegrationsWidget() {
  const integrations = useAppStore((s) => s.integrations);
  const toggleIntegration = useAppStore((s) => s.toggleIntegration);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-text-heading mb-6">Integrations</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {integrations.map((integration) => {
          const Icon = iconMap[integration.icon] ?? Calendar;
          return (
            <div
              key={integration.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-heading text-sm">{integration.name}</p>
                <p className="text-xs text-text-muted flex items-center gap-1">
                  {integration.connected ? (
                    <>
                      <Check className="w-3 h-3 text-success" /> Connected
                    </>
                  ) : (
                    "Not connected"
                  )}
                </p>
              </div>
              <Button
                variant={integration.connected ? "outline" : "primary"}
                size="sm"
                onClick={() => toggleIntegration(integration.id)}
              >
                {integration.connected ? "Manage" : "Connect"}
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
