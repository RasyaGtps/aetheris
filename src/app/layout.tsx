import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        {children}
      </body>
    </html>
  );
}
