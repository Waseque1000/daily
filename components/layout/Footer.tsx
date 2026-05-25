import Link from "next/link";
import { Logo } from "./Logo";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-text-body text-sm max-w-sm">
              A calm productivity workspace that combines tasks, calendar, and focus sessions into one seamless flow.
            </p>
            <div className="mt-6 flex gap-4">
              {["Twitter", "LinkedIn", "GitHub"].map((s) => (
                <span key={s} className="text-sm text-text-muted hover:text-primary cursor-pointer transition-colors">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-text-heading mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-text-body">
              <li><Link href="/features" className="hover:text-primary">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text-heading mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-text-body">
              <li><Link href="#" className="hover:text-primary">Privacy</Link></li>
              <li><Link href="#" className="hover:text-primary">Terms</Link></li>
              <li><Link href="#" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-muted" suppressHydrationWarning>
            © 2026 {APP_NAME}. All rights reserved.
          </p>
          <form className="flex gap-2 w-full sm:w-auto" action="#" method="post">
            <input
              type="email"
              placeholder="Subscribe to newsletter"
              className="flex-1 sm:w-64 px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Email for newsletter"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:shadow-md transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
