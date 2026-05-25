"use client";

import { motion } from "framer-motion";
import {
  CheckSquare,
  Clock,
  Zap,
  Sparkles,
  TrendingUp,
  Link,
  BellRing,
} from "lucide-react";
import { FEATURES } from "@/lib/constants";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  CheckSquare,
  Clock,
  Zap,
  Sparkles,
  TrendingUp,
  Link,
  BellRing,
};

export function Features() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-heading">
            Everything you need for a calm day
          </h2>
          <p className="mt-4 text-text-body max-w-2xl mx-auto">
            Reduce overwhelm with tools designed for clarity, not complexity.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, i) => {
            const Icon = icons[feature.icon];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-3xl bg-card border border-border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text-heading">{feature.title}</h3>
                <p className="mt-2 text-text-body">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
