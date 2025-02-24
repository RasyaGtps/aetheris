"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopAnimeNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Semua",
      href: "/top-anime",
    },
    {
      name: "Airing",
      href: "/top-anime/airing",
    },
    {
      name: "Upcoming",
      href: "/top-anime/upcoming",
    },
    {
      name: "Movie",
      href: "/top-anime/movie",
    },
    {
      name: "TV Series",
      href: "/top-anime/tv",
    },
  ];

  return (
    <nav className="flex space-x-4 mb-6 overflow-x-auto pb-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
            pathname === item.href
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
} 