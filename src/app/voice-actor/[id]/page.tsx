'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faUser,
  faFilm,
  faTheaterMasks
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/components/nav/Navbar";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import Link from "next/link";

interface VoiceActor {
  name: string;
  given_name: string;
  family_name: string;
  alternate_names: string[];
  birthday: string | null;
  images: {
    jpg: {
      image_url: string;
    };
  };
  about: string;
}

interface VoiceRole {
  anime: {
    mal_id: number;
    title: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
  };
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
}

export default function VoiceActorDetail() {
  const params = useParams();
  const [voiceActor, setVoiceActor] = useState<VoiceActor | null>(null);
  const [roles, setRoles] = useState<VoiceRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoiceActorData = async () => {
      try {
        const [personRes, rolesRes] = await Promise.all([
          fetch(`https://api.jikan.moe/v4/people/${params.id}/full`),
          fetch(`https://api.jikan.moe/v4/people/${params.id}/voices`)
        ]);

        const [personData, rolesData] = await Promise.all([
          personRes.json(),
          rolesRes.json()
        ]);

        setVoiceActor(personData.data);
        setRoles(rolesData.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching voice actor data:', error);
        setLoading(false);
      }
    };

    fetchVoiceActorData();
  }, [params.id]);

  if (loading || !voiceActor) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="pt-24 px-4 md:px-8 pb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Voice Actor Info */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <img 
              src={voiceActor.images.jpg.image_url}
              alt={voiceActor.name}
              className="w-full rounded-lg shadow-lg"
            />
            <div className="mt-4 bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faMicrophone} className="text-red-400" />
                <h2 className="text-xl font-bold text-white">{voiceActor.name}</h2>
              </div>
              {voiceActor.alternate_names?.length > 0 && (
                <p className="text-gray-400 mb-2">
                  Also known as: {voiceActor.alternate_names.join(', ')}
                </p>
              )}
              {voiceActor.birthday && (
                <p className="text-gray-400 mb-2">
                  Birthday: {new Date(voiceActor.birthday).toLocaleDateString()}
                </p>
              )}
              {voiceActor.about && (
                <p className="text-gray-300 text-sm leading-relaxed mt-4">
                  {voiceActor.about}
                </p>
              )}
            </div>
          </div>

          {/* Voice Acting Roles */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FontAwesomeIcon icon={faTheaterMasks} className="text-purple-400" />
              Voice Acting Roles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role, index) => (
                <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="flex p-4 gap-4">
                    <Link 
                      href={`/anime/${role.anime.mal_id}`}
                      className="w-1/3 aspect-[3/4] flex-shrink-0"
                    >
                      <img 
                        src={role.anime.images.jpg.image_url}
                        alt={role.anime.title}
                        className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link 
                        href={`/anime/${role.anime.mal_id}`}
                        className="text-white font-medium hover:text-blue-400 transition-colors"
                      >
                        {role.anime.title}
                      </Link>
                      <div className="mt-2 flex items-start gap-2">
                        <Link 
                          href={`/character/${role.character.mal_id}`}
                          className="flex-shrink-0 w-12 h-12"
                        >
                          <img 
                            src={role.character.images.jpg.image_url}
                            alt={role.character.name}
                            className="w-full h-full object-cover rounded-full hover:scale-110 transition-transform duration-300"
                          />
                        </Link>
                        <div>
                          <Link 
                            href={`/character/${role.character.mal_id}`}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {role.character.name}
                          </Link>
                          <p className="text-xs text-gray-400">
                            {role.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 