import { FaPen, FaHeart, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-56 p-6 border-r border-gray-200 flex flex-col justify-between bg-white">
      {/* Menü Butonları */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-gray-900 hover:text-[#6941C6] cursor-pointer">
          <FaPen className="text-lg" />
          <span className="text-sm font-medium">Write Blog</span>
        </div>
        <div className="flex items-center gap-3 text-gray-900 hover:text-[#6941C6] cursor-pointer">
          <FaHeart className="text-lg" />
          <span className="text-sm font-medium">Favorites</span>
        </div>
      </div>

      {/* Çıkış Butonu */}
      <div className="flex items-center gap-3 text-gray-600 hover:text-[#6941C6] cursor-pointer">
        <FaSignOutAlt className="text-lg" />
        <span className="text-sm font-medium">Log Out</span>
      </div>
    </div>
  );
}
