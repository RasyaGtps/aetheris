'use client'
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faStar, 
  faPlay, 
  faCalendar, 
  faClock, 
  faSearch, 
  faBars,
  faDragon
} from "@fortawesome/free-solid-svg-icons";

// Tipe data untuk anime
interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    }
  };
  score: number;
  episodes: number;
  duration: string;
  genres: {
    name: string;
    mal_id: number;
  }[];
  aired: {
    from: string;
    to: string | null;
    prop: {
      from: {
        day: number;
        month: number;
        year: number;
      };
      to: {
        day: number | null;
        month: number | null;
        year: number | null;
      };
    };
    string: string;
  };
}

export default function Home() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.jikan.moe/v4/seasons/now?sfw')
      .then(res => res.json())
      .then(data => {
        setAnimes(data.data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <nav className="bg-gray-800 fixed w-full z-10 top-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faDragon} className="text-blue-500 text-2xl mr-2" />
              <span className="text-white font-bold text-xl">Aetheris</span>
            </div>
            
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari anime..."
                    className="bg-gray-700 text-white px-4 py-2 rounded-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>
            
            <div className="md:hidden">
              <button className="text-gray-400 hover:text-white">
                <FontAwesomeIcon icon={faBars} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 px-4 md:px-8">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Anime Musim Ini
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {animes.map(anime => (
            <div key={anime.mal_id} className="bg-gray-800 rounded-lg overflow-hidden transform hover:scale-105 transition duration-300">
              <div className="relative aspect-[3/4]">
                <img 
                  src={anime.images.jpg.large_image_url} 
                  alt={anime.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-0 right-0 bg-blue-600 px-2 py-1 m-1 rounded-full flex items-center gap-1 text-xs">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                  <span>{anime.score || "N/A"}</span>
                </div>
              </div>

              <div className="p-2">
                <h2 className="text-sm font-bold mb-2 line-clamp-1 text-white">
                  {anime.title}
                </h2>
                
                {/* Genre Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {anime.genres.slice(0, 2).map(genre => (
                    <span 
                      key={genre.mal_id}
                      className="text-[10px] px-2 py-0.5 bg-blue-600 text-white rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faPlay} className="text-[10px]" />
                    <span>{anime.episodes || "?"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                    <span>{anime.duration.split(" ")[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faCalendar} className="text-[10px]" />
                    <span>
                      {anime.aired?.prop?.from ? 
                        `${anime.aired.prop.from.day}/${anime.aired.prop.from.month}/${anime.aired.prop.from.year}` 
                        : "TBA"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
