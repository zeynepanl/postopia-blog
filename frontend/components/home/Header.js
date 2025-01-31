import { FaUserCircle, FaRegMoon, FaSearch } from "react-icons/fa";


export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="px-8 h-16 flex items-center justify-between">
        
        {/* Solda: Profil ikonu ve Ay ikonu */}
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-3xl text-gray-700" />
          <FaRegMoon className="text-2xl text-black" />
        </div>

        {/* Orta: Sekmeler */}
        <div className="flex items-center gap-8">
          {/* Latest (aktif) */}
          <span className="text-primary border-b-2 border-primary pb-1 cursor-pointer">
            Latest
          </span>
          {/* Popular (pasif) */}
          <span className="text-black cursor-pointer hover:text-gray-600">
            Popular
          </span>
        </div>

        {/* Sağ: Arama ve Postopia */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-48 bg-gray-50 rounded-full text-sm focus:outline-none shadow-sm"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch />
            </span>
          </div>
          <span className="text-4xl font-semibold text-primary">
            Postopia
          </span>
        </div>

      </div>
    </header>
  );
}
