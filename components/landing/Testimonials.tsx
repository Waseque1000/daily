"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "FlowDay transformed how I plan my mornings. I finally feel in control instead of reactive.",
    name: "Sarah Chen",
    role: "Product Designer",
    company: "Stripe",
  },
  {
    quote: "The focus mode and time blocking together are magic. My deep work hours doubled in two weeks.",
    name: "Marcus Webb",
    role: "Engineering Lead",
    company: "Linear",
  },
  {
    quote: "Finally a productivity app that doesn't add stress. The calm UI makes planning feel peaceful.",
    name: "Elena Rodriguez",
    role: "Founder",
    company: "Daybreak Studio",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-text-heading mb-12">Loved by calm planners</h2>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 rounded-3xl bg-card border border-border shadow-md"
            >
              <Quote className="w-8 h-8 text-primary/40 mx-auto mb-4" />
              <p className="text-lg text-text-heading italic">&ldquo;{testimonials[index].quote}&rdquo;</p>
              <div className="mt-6">
                <p className="font-semibold text-text-heading">{testimonials[index].name}</p>
                <p className="text-sm text-text-muted">
                  {testimonials[index].role} at {testimonials[index].company}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
              className="p-2 rounded-xl border border-border hover:bg-background"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
              className="p-2 rounded-xl border border-border hover:bg-background"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
