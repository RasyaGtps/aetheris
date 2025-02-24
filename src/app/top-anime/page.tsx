"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faStar, 
  faPlay,
  faCalendar,
  faClock 
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/components/nav/Navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AnimeList from "@/components/AnimeList";
import HeaderMenu from "@/components/Utilities/HeaderMenu";
import { ThreeDots } from "react-loading-indicators";

interface Anime {
  mal_id: number;
  title: string;
  images: {
    webp: {
      image_url: string;
      large_image_url: string;
    };
  };
  score: number;
  genres: {
    mal_id: number;
    name: string;
  }[];
  episodes: number;
  duration: string;
  aired: {
    string: string;
  };
}

export default function TopAnime() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "all", name: "All", endpoint: "top/anime" },
    { id: "upcoming", name: "Upcoming", endpoint: "seasons/upcoming" },
    { id: "airing", name: "Airing", endpoint: "top/anime?filter=airing" },
    { id: "movie", name: "Movie", endpoint: "top/anime?type=movie" },
    { id: "tv", name: "TV Series", endpoint: "top/anime?type=tv" },
  ];

  const fetchAnimes = async (endpoint: string) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.jikan.moe/v4/${endpoint}`);
      const data = await response.json();
      
      const seenIds = new Set();
      const uniqueAnimes = data.data.filter((anime: Anime) => {
        if (!seenIds.has(anime.mal_id)) {
          seenIds.add(anime.mal_id);
          return true;
        }
        return false;
      });
      
      setAnimes(uniqueAnimes);
    } catch (error) {
      console.error("Error fetching anime:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (currentTab) {
      fetchAnimes(currentTab.endpoint);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="pt-24 px-4 md:px-8 pb-8">
        {/* Navigation */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <ThreeDots
              color="#3b82f6"
              size="large"
              text=""
              textColor=""
            />
          </div>
        ) : (
          <AnimeList api={animes} />
        )}
      </div>
    </div>
  );
} 