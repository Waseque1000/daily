"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, CalendarPlus } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useAppStore } from "@/store/store";
import { AI_SUGGESTED_PROMPTS } from "@/lib/constants";
import { generateId } from "@/lib/utils";
import type { AIMessage } from "@/types";
import { cn } from "@/lib/utils";

export function AIAssistant({ compact = false }: { compact?: boolean }) {
  const messages = useAppStore((s) => s.aiMessages);
  const addAIMessage = useAppStore((s) => s.addAIMessage);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: AIMessage = {
      id: generateId(),
      role: "user",
      content: text.trim(),
    };
    addAIMessage(userMsg);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      addAIMessage({
        id: generateId(),
        role: "assistant",
        content: data.reply,
        suggestions: data.suggestions?.map((s: string, i: number) => ({
          id: `s-${i}`,
          text: s,
        })),
      });
    } catch {
      addAIMessage({
        id: generateId(),
        role: "assistant",
        content:
          "Here's a suggested plan for your day:\n\n• 9:00–10:30 — Deep work on top priority\n• 10:30 — Short break\n• 11:00 — Team standup\n• 14:00–15:30 — Focus block for API work\n• 16:00 — Email & admin tasks",
        suggestions: [
          { id: "1", text: "Add 9:00 AM focus block to calendar" },
          { id: "2", text: "Schedule lunch break at 12:30 PM" },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn("flex flex-col", compact ? "h-[400px]" : "h-[500px]")}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-text-heading">AI Assistant</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
        {messages.length === 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-text-muted">Try asking:</p>
            {AI_SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="block w-full text-left px-3 py-2 rounded-xl bg-background text-sm text-text-body hover:bg-primary/5 hover:text-primary transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "max-w-[90%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap",
                  msg.role === "user"
                    ? "ml-auto bg-primary text-white"
                    : "bg-secondary/10 text-text-heading"
                )}
              >
                {msg.content}
                {msg.suggestions && (
                  <div className="mt-3 space-y-2">
                    {msg.suggestions.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg bg-card border border-border"
                      >
                        <span className="text-xs">{s.text}</span>
                        <Button variant="ghost" size="sm" className="!px-2 !py-1 text-xs">
                          <CalendarPlus className="w-3 h-3" /> Add
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {loading && (
          <div className="flex gap-1 px-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary animate-pulse-soft"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me to plan your day..."
          className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="AI assistant input"
        />
        <Button type="submit" disabled={loading} aria-label="Send message">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </Card>
  );
}
