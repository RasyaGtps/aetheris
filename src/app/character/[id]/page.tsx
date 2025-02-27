'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/nav/Navbar";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMicrophone, 
  faFilm,
  faUser,
  faLanguage,
  faGlobe,
  faFlag,
  faEarthAsia,
  faEarthEurope,
  faEarthAmericas
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface Character {
  mal_id: number;
  name: string;
  name_kanji: string | null;
  images: {
    jpg: {
      image_url: string;
    };
  };
  about: string;
}

interface AnimeRole {
  anime: {
    mal_id: number;
    title: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
  };
  role: string;
}

interface VoiceActor {
  person: {
    mal_id: number;
    name: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
  };
  language: string;
}

const getCountryInfo = (language: string) => {
  const countryMap: { [key: string]: { flag: string; name: string; color: string } } = {
    'Japanese': { 
      flag: '🇯🇵',
      name: 'Japan',
      color: 'text-red-400' 
    },
    'English': { 
      flag: '🇺🇸',
      name: 'United States',
      color: 'text-blue-400' 
    },
    'Korean': { 
      flag: '🇰🇷',
      name: 'Korea',
      color: 'text-purple-400' 
    },
    'French': { 
      flag: '🇫🇷',
      name: 'France',
      color: 'text-indigo-400' 
    },
    'German': { 
      flag: '🇩🇪',
      name: 'Germany',
      color: 'text-yellow-400' 
    },
    'Italian': { 
      flag: '🇮🇹',
      name: 'Italy',
      color: 'text-green-400' 
    },
    'Spanish': { 
      flag: '🇪🇸',
      name: 'Spain',
      color: 'text-orange-400' 
    },
    'Portuguese (BR)': { 
      flag: '🇧🇷',
      name: 'Brazil',
      color: 'text-pink-400' 
    },
    'Mandarin': { 
      flag: '🇨🇳',
      name: 'China',
      color: 'text-red-600' 
    },
    'Cantonese': { 
      flag: '🇭🇰',
      name: 'Hong Kong',
      color: 'text-yellow-600' 
    },
    'default': { 
      flag: '🌐',
      name: 'Other',
      color: 'text-gray-400' 
    }
  };

  return countryMap[language] || countryMap['default'];
};

export default function CharacterDetail() {
  const params = useParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [animeRoles, setAnimeRoles] = useState<AnimeRole[]>([]);
  const [voiceActors, setVoiceActors] = useState<VoiceActor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacterData = async () => {
      try {
        const [characterRes, animeRes, voicesRes] = await Promise.all([
          fetch(`https://api.jikan.moe/v4/characters/${params.id}/full`),
          fetch(`https://api.jikan.moe/v4/characters/${params.id}/anime`),
          fetch(`https://api.jikan.moe/v4/characters/${params.id}/voices`)
        ]);

        const [characterData, animeData, voicesData] = await Promise.all([
          characterRes.json(),
          animeRes.json(),
          voicesRes.json()
        ]);

        setCharacter(characterData.data);
        setAnimeRoles(animeData.data);
        setVoiceActors(voicesData.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching character data:', error);
        setLoading(false);
      }
    };

    fetchCharacterData();
  }, [params.id]);

  if (loading || !character) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="pt-24 px-4 md:px-8 pb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Character Image & Info */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <img 
              src={character.images.jpg.image_url}
              alt={character.name}
              className="w-full rounded-lg shadow-lg"
            />
            <div className="mt-4 bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faUser} className="text-blue-400" />
                <h2 className="text-xl font-bold text-white">{character.name}</h2>
              </div>
              {character.name_kanji && (
                <p className="text-gray-400 mb-4">{character.name_kanji}</p>
              )}
              {character.about && (
                <p className="text-gray-300 text-sm leading-relaxed">
                  {character.about}
                </p>
              )}
            </div>
          </div>

          <div className="flex-1">
            {/* Voice Actors Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faMicrophone} className="text-red-400" />
                Voice Actors
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {voiceActors.map((va, index) => {
                  const countryInfo = getCountryInfo(va.language);
                  return (
                    <Link 
                      href={`/voice-actor/${va.person.mal_id}`}
                      key={index}
                      className="bg-gray-800 rounded-lg p-4 hover:scale-105 transition-transform duration-300"
                    >
                      <div className="aspect-square mb-3 overflow-hidden rounded-lg">
                        <img 
                          src={va.person.images.jpg.image_url}
                          alt={va.person.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-white font-medium text-sm mb-2">
                        {va.person.name}
                      </h3>
                      <div className="flex items-center gap-2 bg-gray-700/50 rounded-full px-3 py-1.5">
                        <span className="text-base">{countryInfo.flag}</span>
                        <div className="flex flex-col">
                          <p className={`text-xs font-medium ${countryInfo.color}`}>
                            {countryInfo.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {va.language}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Anime Appearances Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faFilm} className="text-purple-400" />
                Anime Appearances
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {animeRoles.map((role, index) => (
                  <Link 
                    href={`/anime/${role.anime.mal_id}`}
                    key={index}
                    className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
                  >
                    <div className="aspect-[3/4]">
                      <img 
                        src={role.anime.images.jpg.image_url}
                        alt={role.anime.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-white text-sm font-medium line-clamp-2 mb-1">
                        {role.anime.title}
                      </h3>
                      <p className="text-blue-400 text-xs">
                        {role.role}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 