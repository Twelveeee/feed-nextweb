import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import ThemeProviderWrapper from "@/components/providers/ThemeProviderWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "feed-nextweb",
  description: "基于 Next.js 构建的现代化 RSS 阅读器，支持响应式设计、数据分组和安全代理",
  keywords: ["RSS", "Feed Reader", "Next.js", "阅读器", "feed-nextweb"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'system';
                  const root = document.documentElement;
                  
                  if (theme === 'dark') {
                    root.classList.add('dark');
                    root.classList.remove('light');
                  } else if (theme === 'light') {
                    root.classList.add('light');
                    root.classList.remove('dark');
                  } else {
                    // system
                    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (isDark) {
                      root.classList.add('dark');
                      root.classList.remove('light');
                    } else {
                      root.classList.add('light');
                      root.classList.remove('dark');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProviderWrapper>
          {children}
          {gaId && <GoogleAnalytics gaId={gaId} />}
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
