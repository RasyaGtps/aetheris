import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-heebo',
});

export const metadata: Metadata = {
  title: "Aetheris",
  description: "Anime",
  icons: {
    icon: '/aetheriss.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="icon" 
          href="/aetheriss.png" 
          type="image/png" 
        />
      </head>
      <body className={heebo.className}>
        {children}
      </body>
    </html>
  );
}
