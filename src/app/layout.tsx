import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "devroast",
  description: "get your code roasted brutally",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrainsMono.variable} font-mono bg-bg-page text-text-primary antialiased`}>
        <header className="w-full border-b border-border-primary py-4">
          <div className="mx-auto max-w-4xl px-8 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-accent-green italic tracking-tighter text-lg">
              <span>{">"} devroast</span>
            </div>
            <nav>
              <a href="/leaderboard" className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent-green transition-colors">
                Leaderboard
              </a>
            </nav>
          </div>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
