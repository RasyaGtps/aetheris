import Navbar from "@/components/nav/Navbar";
import TopAnimeNav from "@/components/nav/TopAnimeNav";

async function getTopAnime() {
  const res = await fetch("https://api.jikan.moe/v4/top/anime");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default async function TopAnimePage() {
  const data = await getTopAnime();

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Main Content */}
      <div className="pt-24 px-4 md:px-8 pb-8">
        <h1 className="text-3xl font-bold text-white mb-8">Top Anime</h1>
        
        <TopAnimeNav />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {data.data.map((anime: any) => (
            <div key={anime.mal_id} className="bg-gray-800 rounded-lg overflow-hidden transform hover:scale-105 transition duration-300">
              <div className="relative aspect-[3/4]">
                <img
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-0 right-0 bg-blue-600 px-2 py-1 m-1 rounded-full flex items-center gap-1 text-xs">
                  <span>{anime.score || "N/A"}</span>
                </div>
              </div>

              <div className="p-3">
                <h2 className="text-sm font-bold mb-2 line-clamp-1 text-white">
                  {anime.title}
                </h2>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {anime.genres.slice(0, 2).map((genre: any) => (
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
                    <span>Episodes: {anime.episodes || "?"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{anime.type || "Unknown"}</span>
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