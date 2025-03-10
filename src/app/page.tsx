"use client";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faPlay,
  faCalendar,
  faClock,
  faChevronLeft,
  faChevronRight,
  faSearch,
  faXmark,
  faTheaterMasks,
  faDragon,
  faGun,
  faHeart,
  faSchool,
  faFaceSmile,
  faPerson,
  faWandSparkles,
  faSkull,
  faRobot,
  faUserNinja,
  faMagnifyingGlass,
  faVolleyball,
  faMusic,
  faBaby,
  faGhost,
  faUserSecret,
  faCar,
  faFighter,
  faSpaceShuttle,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/components/nav/Navbar";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import Link from "next/link";

interface Anime {
  mal_id: number;
  title: string;
  title_english: string | null;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
    webp: {
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
  trailer: {
    youtube_id: string;
    images: {
      maximum_image_url: string;
    };
  };
  status: string;
}

export default function Home() {
  const [featuredAnime, setFeaturedAnime] = useState<Anime | null>(null);
  const [ongoingAnime, setOngoingAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchFeaturedAnime = async () => {
    try {
      const response = await fetch('https://api.jikan.moe/v4/anime/57555/full');
      const data = await response.json();
      setFeaturedAnime(data.data);
    } catch (error) {
      console.error("Error fetching featured anime:", error);
    }
  };

  const fetchOngoingAnime = async () => {
    try {
      const response = await fetch('https://api.jikan.moe/v4/seasons/now?page=1');
      const data = await response.json();
      setOngoingAnime(data.data);
      setLoading(false);
      setAutoScroll(true);
    } catch (error) {
      console.error("Error fetching ongoing anime:", error);
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setLoading(true);

    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}&sfw=true&limit=24`);
      const data = await response.json();
      
      // Filter hasil pencarian untuk menghilangkan duplikasi
      const uniqueResults = data.data.filter((anime: Anime, index: number, self: Anime[]) =>
        index === self.findIndex((a) => a.mal_id === anime.mal_id)
      );
      
      setSearchResults(uniqueResults);
      setLoading(false);
    } catch (error) {
      console.error("Error searching anime:", error);
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setSearchResults([]);
  };

  useEffect(() => {
    setAutoScroll(true);
    fetchFeaturedAnime();
    fetchOngoingAnime();
  }, []);

  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;
    
    if (autoScroll && !loading && ongoingAnime.length > 0 && sliderRef.current) {
      scrollInterval = setInterval(() => {
        if (sliderRef.current) {
          const isAtEnd = 
            sliderRef.current.scrollLeft + sliderRef.current.offsetWidth >=
            sliderRef.current.scrollWidth;

          if (isAtEnd) {
            sliderRef.current.scrollLeft = 0;
          } else {
            sliderRef.current.scrollLeft += 1;
          }
        }
      }, 20);
    }

    return () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };
  }, [autoScroll, loading, ongoingAnime]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setAutoScroll(false);
    setIsDragging(true);
    setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setTimeout(() => setAutoScroll(true), 300);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setAutoScroll(true), 300);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setMoveCount(prev => prev + 1);
    
    if (!sliderRef.current) return;
    const x = e.pageX - (sliderRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = (direction: 'left' | 'right') => {
    setAutoScroll(false);
    
    if (!sliderRef.current) return;
    
    const scrollAmount = 500;
    const newScrollLeft = direction === 'left' 
      ? sliderRef.current.scrollLeft - scrollAmount
      : sliderRef.current.scrollLeft + scrollAmount;
      
    sliderRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    setTimeout(() => setAutoScroll(true), 300);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-900 pt-16">
        {/* Featured Anime Banner */}
        {featuredAnime && (
          <div className="relative h-[500px] w-full">
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${featuredAnime.trailer?.images?.maximum_image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
              <div className="relative h-full container mx-auto px-4 flex items-center z-10">
                <div className="flex gap-8">
                  {/* Poster Image */}
                  <div className="w-48 h-72 rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src={featuredAnime.images.jpg.large_image_url}
                      alt={featuredAnime.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Anime Info */}
                  <div>
                    <div className="inline-block px-2 py-1 bg-yellow-400 text-black text-sm font-bold rounded mb-4">
                      Upcoming
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                      {featuredAnime.title}
                    </h1>
                    <div className="flex gap-2">
                      {featuredAnime.genres.map((genre, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ongoing Anime Section with Search */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {isSearching ? 'Search Results' : 'Ongoing Anime'}
            </h2>
            
            {/* Search Form */}
            <form 
              onSubmit={handleSearch}
              className="flex gap-2"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anime..."
                  className="bg-gray-800 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-[300px]"
                />
                <button 
                  type="button"
                  onClick={isSearching ? handleClearSearch : handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon 
                    icon={isSearching ? faXmark : faSearch} 
                    className={`w-4 h-4 ${isSearching ? 'hover:text-red-500' : ''}`}
                  />
                </button>
              </div>
            </form>
          </div>

          {/* Anime Grid/Slider */}
          <div className="relative group">
            {!isSearching && (
              <>
                {/* Navigation buttons (only show for ongoing anime) */}
                <button 
                  onClick={() => handleScroll('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleScroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Content Container */}
            <div 
              ref={sliderRef}
              className={`w-full ${!isSearching ? 'overflow-x-auto cursor-grab active:cursor-grabbing' : ''} select-none scrollbar-hide relative`}
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
              {...(!isSearching ? {
                onMouseDown: handleMouseDown,
                onMouseLeave: handleMouseLeave,
                onMouseEnter: () => setIsHovered(true),
                onMouseUp: handleMouseUp,
                onMouseMove: handleMouseMove,
              } : {})}
            >
              <div className={`${isSearching ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'flex gap-4 pb-4'}`} 
                   style={!isSearching ? { minWidth: "max-content" } : undefined}>
                {(isSearching ? searchResults : ongoingAnime).map((anime, index) => (
                  <Link 
                    href={`/anime/${anime.mal_id}`} 
                    key={`${anime.mal_id}-${index}`}
                    className={`${isSearching ? '' : 'w-[250px] flex-shrink-0'}`}
                    onClick={(e) => {
                      if (isDragging) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <div 
                      className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
                      onMouseEnter={() => setAutoScroll(false)}
                      onMouseLeave={() => setTimeout(() => setAutoScroll(true), 300)}
                    >
                      <div className="relative">
                        <div className="aspect-[3/4]">
                          <img 
                            src={anime.images.webp.large_image_url}
                            alt={anime.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Rating Badge */}
                        <div className="absolute top-2 right-2 bg-blue-600/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                          <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                          <span>{anime.score?.toFixed(2) || "N/A"}</span>
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        <h3 className="text-white text-sm font-medium line-clamp-2">
                          {anime.title_english || anime.title}
                        </h3>
                        <div className="flex flex-col gap-1 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faClock} className="w-4" />
                            <span>{anime.episodes} Episodes • {anime.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faCalendar} className="w-4" />
                            <span>{new Date(anime.aired.from).getFullYear()}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {anime.genres.slice(0, 3).map((genre) => (
                              <div
                                key={genre.mal_id}
                                className="bg-blue-600 px-2 py-1 rounded-full text-white text-xs"
                              >
                                {genre.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
