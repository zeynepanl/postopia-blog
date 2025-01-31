import { FaUserCircle, FaRegHeart, FaRegComment, FaRegCalendarAlt } from "react-icons/fa";

export default function BlogCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 flex flex-col gap-4">
      {/* Üst Kısım: Yazar Bilgisi & Beğeni */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-3xl text-gray-600" />
          <span className="text-sm text-gray-800 font-medium">Zeynep Anlayışlı</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <FaRegHeart className="text-lg" />
          <span className="text-sm font-medium"></span>
        </div>
      </div>

      {/* Başlık */}
      <h2 className="text-xl font-semibold text-gray-900">
        Your Ultimate Guide to Stress-Free Travel
      </h2>

      {/* Açıklama */}
      <p className="text-gray-600 text-sm leading-relaxed">
        Say goodbye to travel hassles and hello to smooth adventures. From packing
        tips to finding the best deals, this guide will help you make the most of
        your journey with ease...
      </p>

      {/* Çizgi */}
      <hr className="border-gray-300" />

      {/* Alt Bilgi: Tarih, Yorum, Etiketler */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaRegCalendarAlt className="text-lg" />
            <span>27.01.2025</span>
          </div>
          <div className="flex items-center gap-2">
            <FaRegComment className="text-lg" />
            <span>21</span>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            Travel
          </span>
          <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            Travel
          </span>
        </div>
      </div>
    </div>
  );
}