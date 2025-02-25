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
import { Commet } from "react-loading-indicators";

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
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const tabs = [
    { id: "all", name: "All", endpoint: "top/anime?page=1" },
    { id: "upcoming", name: "Upcoming", endpoint: "seasons/upcoming?page=1" },
    { id: "airing", name: "Airing", endpoint: "top/anime?filter=airing&page=1" },
    { id: "movie", name: "Movie", endpoint: "top/anime?type=movie&page=1" },
    { id: "tv", name: "TV Series", endpoint: "top/anime?type=tv&page=1" },
  ];

  const fetchAnimes = async (endpoint: string, isLoadMore = false, currentPage = page) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const pageParam = endpoint.replace("page=1", `page=${currentPage}`);
      
      const response = await fetch(`https://api.jikan.moe/v4/${pageParam}`);
      const data = await response.json();

      const uniqueAnimes = new Map();
      
      if (isLoadMore) {
        animes.forEach(anime => {
          uniqueAnimes.set(anime.mal_id, anime);
        });
      }

      data.data.forEach((anime: Anime) => {
        if (!uniqueAnimes.has(anime.mal_id)) {
          uniqueAnimes.set(anime.mal_id, anime);
        }
      });

      const finalAnimes = Array.from(uniqueAnimes.values());
      setAnimes(finalAnimes);
    } catch (error) {
      console.error("Error fetching anime:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (currentTab) {
      fetchAnimes(currentTab.endpoint, true, nextPage);
    }
  };

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (currentTab) {
      setPage(1);
      fetchAnimes(currentTab.endpoint, false, 1);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="pt-24 px-4 md:px-8 pb-8">
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
            <Commet
              color="#3b82f6"
              size="medium"
              text=""
              textColor=""
            />
          </div>
        ) : (
          <>
            <AnimeList api={animes} />
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loadingMore ? (
                  <Commet color="#ffffff" size="small" text="" textColor="" />
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 