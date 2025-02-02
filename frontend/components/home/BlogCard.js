import Link from "next/link";
import { FaRegComment, FaRegCalendarAlt, FaRegHeart } from "react-icons/fa";

export default function BlogCard({ blog }) {
  if (!blog) return null; // Eğer blog verisi yoksa hiçbir şey render etme

  return (
    <Link href={`/blog/${blog.id}`} className="block">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col gap-4 cursor-pointer hover:shadow-lg transition-shadow">
        {/* Üst Kısım: Yazar Bilgisi */}
        <div className="flex items-center gap-3">
          <img
            src={blog.authorImage || "/icons/profile.svg"}
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer"
          />
          <span className="text-md text-gray-800 font-medium">
            {blog.author}
          </span>
        </div>

        {/* Başlık */}
        <h2 className="text-xl font-semibold text-gray-900">{blog.title}</h2>

        {/* Açıklama (Eğer açıklama yoksa alternatif metin) */}
        <p className="text-gray-600 text-lg leading-relaxed line-clamp-3 overflow-hidden">
          {blog.description ? blog.description : "No description available."}
        </p>

        {/* Çizgi */}
        <hr className="border-gray-300" />

        {/* Alt Bilgi: Tarih, Yorum, Beğeni, Etiketler */}
        <div className="flex justify-between items-center text-md text-gray-500">
          <div className="flex items-center gap-6">
            {/* Tarih */}
            <div className="flex items-center gap-2">
              <FaRegCalendarAlt className="text-lg" />
              <span>{blog.date}</span>
            </div>
            
            {/* Yorum */}
            <div className="flex items-center gap-2">
              <FaRegComment className="text-lg" />
              <span>{blog.comments}</span>
            </div>

            {/* Beğeni (Kalp İkonu) */}
            <div className="flex items-center gap-2">
              <FaRegHeart className="text-lg cursor-pointer hover:text-red-500 transition" />
              <span>{blog.likes || 0}</span>
            </div>
          </div>

          {/* Etiketler */}
          <div className="flex gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-md font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
