import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function Header() {
  const [activeTab, setActiveTab] = useState("Latest");

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
          {["Latest", "Popular"].map((tab) => (
            <div key={tab} className="relative cursor-pointer">
              <span
                onClick={() => setActiveTab(tab)}
                className={`text-xl transition-all ${
                  activeTab === tab ? "text-primary font-semibold" : "text-black"
                }`}
              >
                {tab}
              </span>

              {/* Alt Çizgiler (Seçildiğinde Gözüken Çift Çizgi) */}
              {activeTab === tab && (
                <div className="absolute left-0 w-full mt-4">
                  <div className="w-full h-[1px] bg-primary mt-[1px]"></div>
                  <div className="w-full h-[1px] bg-primary mt-[1px]"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sağ: Arama ve Postopia */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-48 bg-gray-50 rounded-full text-sm shadow-sm 
             focus:ring-1 focus:border-gray-50 text-black placeholder-gray-400"
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
