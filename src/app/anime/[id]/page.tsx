'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faStar, 
  faPlay, 
  faCalendar, 
  faClock,
  faVideo,
  faTelevision,
  faBook,
  faGlobe,
  faUsers,
  faHeart,
  faRankingStar,
  faCirclePlay,
  faMusic,
  faCompactDisc,
  faBuilding,
  faMicrophone,
  faTheaterMasks,
  faIndustry,
  faFilm,
  faPlayCircle,
  faCalendarDays,
  faDragon,
  faGun,
  faFaceSmile,
  faPerson,
  faWandSparkles,
  faSkull,
  faRobot,
  faUserNinja,
  faMagnifyingGlass,
  faVolleyball,
  faBaby,
  faGhost,
  faUserSecret,
  faCar,
  faFighter,
  faSchool,
  faSpaceShuttle,
  faGamepad
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/components/nav/Navbar";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import Link from "next/link";

interface AnimeDetail {
  mal_id: number;
  title: string;
  title_english: string;
  title_japanese: string;
  synopsis: string;
  background: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  trailer: {
    url: string;
    embed_url: string;
  };
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  status: string;
  episodes: number;
  duration: string;
  rating: string;
  genres: {
    mal_id: number;
    name: string;
  }[];
  type: string;
  source: string;
  season: string;
  year: number;
  broadcast: {
    string: string;
  };
  producers: {
    mal_id: number;
    name: string;
  }[];
  studios: {
    mal_id: number;
    name: string;
  }[];
  theme: {
    openings: string[];
    endings: string[];
  };
  streaming: {
    name: string;
    url: string;
  }[];
  members: number;
  favorites: number;
}

interface Character {
  character: {
    mal_id: number;
    name: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
  };
  role: string;
  voice_actors: {
    person: {
      name: string;
    };
    language: string;
  }[];
}

interface Episode {
  mal_id: number;
  title: string | null;
  title_japanese: string | null;
  title_romanji: string | null;
  aired: string | null;
  score: number | null;
  filler: boolean;
  recap: boolean;
}

const getGenreInfo = (genreName: string) => {
  const genreMap: { [key: string]: { icon: any; color: string } } = {
    'Action': { icon: faGun, color: 'text-red-400' },
    'Adventure': { icon: faUserNinja, color: 'text-green-400' },
    'Comedy': { icon: faFaceSmile, color: 'text-yellow-400' },
    'Drama': { icon: faTheaterMasks, color: 'text-purple-400' },
    'Fantasy': { icon: faDragon, color: 'text-blue-400' },
    'Horror': { icon: faSkull, color: 'text-gray-400' },
    'Mystery': { icon: faMagnifyingGlass, color: 'text-indigo-400' },
    'Romance': { icon: faHeart, color: 'text-pink-400' },
    'Sci-Fi': { icon: faRobot, color: 'text-cyan-400' },
    'Slice of Life': { icon: faPerson, color: 'text-orange-400' },
    'Sports': { icon: faVolleyball, color: 'text-emerald-400' },
    'Supernatural': { icon: faWandSparkles, color: 'text-violet-400' },
    'School': { icon: faSchool, color: 'text-teal-400' },
    'Music': { icon: faMusic, color: 'text-rose-400' },
    'Kids': { icon: faBaby, color: 'text-lime-400' },
    'Demons': { icon: faGhost, color: 'text-amber-400' },
    'Thriller': { icon: faUserSecret, color: 'text-red-600' },
    'Cars': { icon: faCar, color: 'text-blue-600' },
    'Martial Arts': { icon: faFighter, color: 'text-orange-600' },
    'Space': { icon: faSpaceShuttle, color: 'text-purple-600' },
    'Game': { icon: faGamepad, color: 'text-green-600' },
  };

  return genreMap[genreName] || { icon: faTheaterMasks, color: 'text-gray-400' };
};

export default function AnimeDetail() {
  const params = useParams();
  const [animeDetail, setAnimeDetail] = useState<AnimeDetail | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const [detailRes, charactersRes, episodesRes] = await Promise.all([
          fetch(`https://api.jikan.moe/v4/anime/${params.id}/full`),
          fetch(`https://api.jikan.moe/v4/anime/${params.id}/characters`),
          fetch(`https://api.jikan.moe/v4/anime/${params.id}/episodes`)
        ]);

        const [detailData, charactersData, episodesData] = await Promise.all([
          detailRes.json(),
          charactersRes.json(),
          episodesRes.json()
        ]);

        setAnimeDetail(detailData.data);
        setCharacters(charactersData.data);
        setEpisodes(episodesData.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching anime data:', error);
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, [params.id]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBA";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading || !animeDetail) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="pt-24 px-4 md:px-8 pb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Anime Cover Image */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <img 
              src={animeDetail.images.jpg.large_image_url}
              alt={animeDetail.title_english || animeDetail.title}
              className="w-full rounded-lg shadow-lg"
            />
            
            {/* Trailer Button */}
            {animeDetail.trailer?.embed_url && (
              <a 
                href={animeDetail.trailer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
              >
                <FontAwesomeIcon icon={faCirclePlay} />
                Watch Trailer
              </a>
            )}
          </div>

          {/* Anime Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              {animeDetail.title_english || animeDetail.title}
            </h1>
            <h2 className="text-lg text-gray-400 mb-4">{animeDetail.title_japanese}</h2>
            
            {/* Anime Stats */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              {animeDetail.score && (
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                  <span className="text-white text-xl font-bold">{animeDetail.score}</span>
                  {animeDetail.scored_by && (
                    <span className="text-white">({animeDetail.scored_by.toLocaleString()} users)</span>
                  )}
                </div>
              )}
              {animeDetail.rank && (
                <div className="flex items-center gap-2 text-white">
                  <FontAwesomeIcon icon={faRankingStar} className="text-orange-400" />
                  <span>Rank #{animeDetail.rank}</span>
                </div>
              )}
              {animeDetail.members && (
                <div className="flex items-center gap-2 text-white">
                  <FontAwesomeIcon icon={faUsers} className="text-blue-400" />
                  <span>{animeDetail.members.toLocaleString()} members</span>
                </div>
              )}
              {animeDetail.favorites && (
                <div className="flex items-center gap-2 text-white">
                  <FontAwesomeIcon icon={faHeart} className="text-red-500" />
                  <span>{animeDetail.favorites.toLocaleString()} favorites</span>
                </div>
              )}
            </div>

            {/* Genres Section */}
            <div className="flex flex-wrap gap-3 mb-6">
              {animeDetail.genres.map((genre) => {
                const { icon, color } = getGenreInfo(genre.name);
                return (
                  <div
                    key={genre.mal_id}
                    className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full"
                  >
                    <FontAwesomeIcon 
                      icon={icon} 
                      className={`w-4 h-4 ${color}`}
                    />
                    <span className="text-white text-sm">{genre.name}</span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-white">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faTelevision} className="text-purple-400" />
                <span>Type: {animeDetail.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faBook} className="text-green-400" />
                <span>Source: {animeDetail.source}</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPlay} className="text-cyan-400" />
                <span>Episodes: {animeDetail.episodes}</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="text-amber-400" />
                <span>Duration: {animeDetail.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendar} className="text-pink-400" />
                <span>Season: {animeDetail.season} {animeDetail.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faGlobe} className="text-teal-400" />
                <span>Status: {animeDetail.status}</span>
              </div>
            </div>

            {/* Studios & Producers */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faFilm} className="text-indigo-400" />
                <h3 className="text-white font-bold">Studios:</h3>
                <span className="text-white">{animeDetail.studios.map(s => s.name).join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faIndustry} className="text-rose-400" />
                <h3 className="text-white font-bold">Producers:</h3>
                <span className="text-white">{animeDetail.producers.map(p => p.name).join(', ')}</span>
              </div>
            </div>

            {/* Theme Songs */}
            {(animeDetail.theme?.openings?.length > 0 || animeDetail.theme?.endings?.length > 0) && (
              <div className="mb-6">
                {animeDetail.theme.openings?.length > 0 && (
                  <div className="flex items-start gap-2 mb-2">
                    <FontAwesomeIcon icon={faMusic} className="text-violet-400 mt-1" />
                    <div>
                      <h3 className="text-white font-bold">Opening Theme:</h3>
                      {animeDetail.theme.openings.map((op, idx) => (
                        <p key={idx} className="text-white">{op}</p>
                      ))}
                    </div>
                  </div>
                )}
                {animeDetail.theme.endings?.length > 0 && (
                  <div className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faCompactDisc} className="text-fuchsia-400 mt-1" />
                    <div>
                      <h3 className="text-white font-bold">Ending Theme:</h3>
                      {animeDetail.theme.endings.map((ed, idx) => (
                        <p key={idx} className="text-white">{ed}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Synopsis */}
            <div className="mb-6">
              <h3 className="text-white font-bold mb-2">Synopsis:</h3>
              <p className="text-gray-300 leading-relaxed">{animeDetail.synopsis}</p>
            </div>

            {/* Streaming Platforms */}
            {animeDetail.streaming?.length > 0 && (
              <div>
                <h3 className="text-white font-bold mb-2">Available on:</h3>
                <div className="flex flex-wrap gap-2">
                  {animeDetail.streaming.map((platform, idx) => (
                    <a
                      key={idx}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition-colors"
                    >
                      {platform.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Characters Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Characters</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {characters.map(char => (
              <Link 
                href={`/character/${char.character.mal_id}`}
                key={char.character.mal_id} 
                className="bg-gray-800 rounded-lg p-4 hover:scale-105 transition-transform duration-300"
              >
                <div className="aspect-[3/4] mb-2 overflow-hidden rounded-lg">
                  <img 
                    src={char.character.images.jpg.image_url}
                    alt={char.character.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-medium text-sm line-clamp-2">
                    {char.character.name}
                  </h3>
                  <div className="flex items-center gap-1 text-white text-xs">
                    <FontAwesomeIcon icon={faTheaterMasks} className="text-emerald-400" />
                    <span>{char.role}</span>
                  </div>
                  {char.voice_actors?.length > 0 && (
                    <div className="flex items-center gap-1 text-white text-xs">
                      <FontAwesomeIcon icon={faMicrophone} className="text-red-400" />
                      <span>{char.voice_actors[0].person.name}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Episodes Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Episodes</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            {episodes.length > 0 ? (
              [...episodes].reverse().map(episode => (
                <div 
                  key={episode.mal_id}
                  className="p-4 border-b border-gray-700 last:border-0 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-white font-medium flex items-center gap-2">
                        <FontAwesomeIcon 
                          icon={faPlayCircle} 
                          className="text-blue-400 w-5 h-5"
                        />
                        <span className="text-blue-400">Episode {episode.mal_id}</span>
                        {episode.title}
                      </h3>
                      {episode.title_japanese && (
                        <p className="text-gray-400 text-sm mt-1 ml-7">
                          {episode.title_japanese}
                          {episode.title_romanji && ` (${episode.title_romanji})`}
                        </p>
                      )}
                      <p className="text-gray-400 text-sm mt-1 flex items-center gap-2 ml-7">
                        <FontAwesomeIcon 
                          icon={faCalendarDays} 
                          className="text-gray-500 w-4 h-4"
                        />
                        {formatDate(episode.aired)}
                      </p>
                      {(episode.filler || episode.recap) && (
                        <div className="flex gap-2 mt-1 ml-7">
                          {episode.filler && (
                            <span className="text-xs px-2 py-1 bg-yellow-600 text-white rounded flex items-center gap-1">
                              <FontAwesomeIcon icon={faVideo} className="w-3 h-3" />
                              Filler
                            </span>
                          )}
                          {episode.recap && (
                            <span className="text-xs px-2 py-1 bg-gray-600 text-white rounded flex items-center gap-1">
                              <FontAwesomeIcon icon={faFilm} className="w-3 h-3" />
                              Recap
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {episode.score && (
                      <div className="flex items-center gap-2 ml-4">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                        <span className="text-white">{episode.score.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400">
                No episodes information available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 