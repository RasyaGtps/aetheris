import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faPlay,
  faCalendar,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

interface AnimeProps {
  api: {
    mal_id: number;
    title: string;
    title_english: string | null;
    images: {
      jpg: {
        large_image_url: string;
      };
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
  }[];
}

export default function AnimeList({ api }: AnimeProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {api.map((anime) => (
        <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id}>
          <div className="bg-gray-800 rounded-lg overflow-hidden transform hover:scale-105 transition duration-300">
            <div className="relative aspect-[3/4]">
              <img 
                src={anime.images.jpg.large_image_url} 
                alt={anime.title_english || anime.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-0 right-0 bg-blue-600 px-2 py-1 m-1 rounded-full flex items-center gap-1 text-xs">
                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                <span>{anime.score || "N/A"}</span>
              </div>
            </div>
            <div className="p-3">
              <h2 className="text-sm font-bold mb-2 line-clamp-2 text-white">
                {anime.title_english || anime.title}
              </h2>
              <div className="flex flex-wrap gap-1 mb-3">
                {anime.genres.map((genre) => (
                  <span 
                    key={`${anime.mal_id}-${genre.mal_id}`} 
                    className="text-[10px] px-2 py-0.5 bg-blue-600 text-white rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-400 mt-auto">
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faPlay} className="text-[10px]" />
                  <span>Total Episodes: {anime.episodes || "?"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                  <span>Duration: {anime.duration.split(" ")[0]} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faCalendar} className="text-[10px]" />
                  <span>
                    Release Date:{" "}
                    {anime.aired?.prop?.from
                      ? `${anime.aired.prop.from.day}/${anime.aired.prop.from.month}/${anime.aired.prop.from.year}`
                      : "TBA"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 