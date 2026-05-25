import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { StoreHydration } from "@/components/providers/StoreHydration";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { DataProvider } from "@/components/providers/DataProvider";
import { ProfileProvider } from "@/components/providers/ProfileProvider";
import { ToastContainer } from "@/components/common/Toast";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Calm Productivity`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_TAGLINE,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <StoreHydration>
          <AuthProvider>
            <DataProvider>
              <ProfileProvider>
                <ThemeProvider>
                  {children}
                  <ToastContainer />
                </ThemeProvider>
              </ProfileProvider>
            </DataProvider>
          </AuthProvider>
        </StoreHydration>
      </body>
    </html>
  );
}
