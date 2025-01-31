import { FaSearch } from "react-icons/fa";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="px-8 h-16 flex items-center justify-between">
        {/* Solda: Profil ikonu ve Ay ikonu */}
        <div className="flex items-center gap-5">
          <img
            src="/icons/profile.svg"
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer"
          />
          <img
            src="/icons/dark.svg"
            alt="Dark Mode"
            className="w-6 h-6 cursor-pointer"
          />
        </div>

        {/* Orta: Sekmeler */}
        <div className="flex items-center gap-24">
          {/* Latest (aktif) */}
          <span className="text-black text-xl  cursor-pointer">Latest</span>
          {/* Popular (pasif) */}
          <span className="text-black cursor-pointer text-xl">Popular</span>
        </div>

        {/* Sağ: Arama ve Postopia */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-48 bg-gray-50 rounded-full text-sm shadow-sm 
             focus:gray-50 focus:ring-1 focus:border-gray-50 text-black placeholder-gray-400"
            />

            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch />
            </span>
          </div>
          <span className="text-4xl font-semibold text-primary">Postopia</span>
        </div>
      </div>
    </header>
  );
}
