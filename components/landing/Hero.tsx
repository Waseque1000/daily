"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { APP_TAGLINE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-[48px] font-bold text-text-heading leading-tight max-w-4xl mx-auto"
        >
          Plan your day without feeling{" "}
          <span className="text-primary">overwhelmed.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-6 text-lg sm:text-xl text-text-body max-w-2xl mx-auto"
        >
          {APP_TAGLINE} A calm productivity workspace that combines tasks, calendar, and focus sessions into one seamless flow.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-text-heading font-semibold rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            Start Free <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary text-primary font-semibold rounded-2xl hover:bg-primary hover:text-white transition-all">
            <Play className="w-5 h-5" /> Watch Demo
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-3xl border border-border shadow-premium overflow-hidden bg-card mx-auto max-w-5xl">
            <div className="bg-background p-4 sm:p-8">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="h-3 w-24 bg-primary/20 rounded-full" />
                  <div className="h-16 bg-card rounded-2xl shadow-sm border border-border p-3">
                    <div className="h-2 w-32 bg-text-heading/20 rounded mb-2" />
                    <div className="h-2 w-20 bg-text-muted/30 rounded" />
                  </div>
                  <div className="h-16 bg-card rounded-2xl shadow-sm border border-border" />
                  <div className="h-16 bg-card rounded-2xl shadow-sm border border-border opacity-60" />
                </div>
                <div className="hidden sm:block">
                  <div className="h-full min-h-[200px] bg-primary/5 rounded-2xl border border-primary/10 p-4 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-4 border-primary/30 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">25:00</span>
                    </div>
                    <div className="absolute top-4 left-4 right-4 space-y-2">
                      {[9, 11, 14].map((h) => (
                        <div
                          key={h}
                          className="h-8 rounded-lg bg-primary/20"
                          style={{ marginLeft: `${(h - 9) * 20}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
