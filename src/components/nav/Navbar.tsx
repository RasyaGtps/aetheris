import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 fixed w-full z-10 top-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/aetheriss.png" 
                alt="Aetheris Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-white font-bold text-xl font-heebo uppercase">AETHERIS</span>
            </Link>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/top-anime"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Top Anime
              </Link>
              <Link
                href="/genres"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Genres
              </Link>
              <Link
                href="/schedule"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Schedule
              </Link>
            </div>
          </div>

          <div className="w-[120px]"></div>
        </div>
      </div>
    </nav>
  );
} 