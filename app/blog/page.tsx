import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const posts = [
  {
    slug: "calm-productivity",
    title: "The Science of Calm Productivity",
    excerpt: "Why reducing visual noise helps you get more done with less stress.",
    date: "May 20, 2026",
  },
  {
    slug: "time-blocking-guide",
    title: "A Beginner's Guide to Time Blocking",
    excerpt: "How to build a realistic daily schedule that you'll actually follow.",
    date: "May 15, 2026",
  },
  {
    slug: "focus-sessions",
    title: "Maximizing Deep Work with Focus Sessions",
    excerpt: "Tips for getting the most out of Pomodoro-style focus blocks.",
    date: "May 10, 2026",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar variant="marketing" />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-text-heading">Blog</h1>
        <p className="mt-4 text-text-body">Insights on calm, intentional productivity.</p>
        <div className="mt-12 space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all"
            >
              <p className="text-sm text-text-muted">{post.date}</p>
              <h2 className="text-xl font-semibold text-text-heading mt-2">
                <Link href="#" className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-text-body">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
