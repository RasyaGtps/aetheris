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
import Navbar from "@/components/nav/Navbar";

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
      <Navbar />

      {/* Main Content */}
      <div className="pt-24 px-4 md:px-8 pb-8">
        <h1 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Current Season Anime
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
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

              <div className="p-3">
                <h2 className="text-sm font-bold mb-2 line-clamp-1 text-white">
                  {anime.title}
                </h2>
                
                {/* Genre Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {anime.genres.slice(0, 2).map(genre => (
                    <span 
                      key={genre.mal_id}
                      className="text-[10px] px-2 py-0.5 bg-blue-600 text-white rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-gray-400 mt-auto">
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
