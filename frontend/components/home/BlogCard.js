import Link from "next/link";
import { FaRegComment, FaRegCalendarAlt, FaRegHeart } from "react-icons/fa";

export default function BlogCard({ blog }) {
  if (!blog) return null;

  // Yazar Bilgisi
  const authorName = blog.author?.username || "Unknown Author";
  // Profil resmi backend’den gelmiyorsa sabit bir görsel kullan
  const authorImage = "/icons/profile.svg";

  // İçerik önizlemesi (örnek: ilk 100 karakter)
  const contentPreview = blog.content
    ? blog.content.substring(0, 100) + "..."
    : "No content available.";

  // Tarih - MongoDB'de createdAt varsa
  const dateString = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString()
    : "Unknown date";

  // Beğeni sayısı (eğer blog.likes bir array ise)
  const likeCount = Array.isArray(blog.likes) ? blog.likes.length : 0;

  // Yorum sayısı yoksa, sabit 0 gösterebilirsin veya comment alanı varsa oradan çek
  const commentCount = 0;

  // Etiketler - populate ile blog.tags[i].name gelebilir
  const tags = Array.isArray(blog.tags)
    ? blog.tags.map((tagObj) => (tagObj.name ? tagObj.name : tagObj))
    : [];

  return (
    // Eğer blog._id ile dinamik sayfaya gideceksen:
    <Link href={`/blog/${blog._id}`} className="block">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col gap-4 cursor-pointer hover:shadow-lg transition-shadow">
        
        {/* Üst Kısım: Yazar Bilgisi */}
        <div className="flex items-center gap-3">
          <img
            src={authorImage}
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer"
          />
          <span className="text-md text-gray-800 font-medium">
            {authorName}
          </span>
        </div>

        {/* Başlık */}
        <h2 className="text-xl font-semibold text-gray-900">{blog.title}</h2>

        {/* İçerik (Önizleme) */}
        <p className="text-gray-600 text-lg leading-relaxed line-clamp-3 overflow-hidden">
          {contentPreview}
        </p>

        <hr className="border-gray-300" />

        {/* Alt Bilgi: Tarih, Yorum, Beğeni, Etiketler */}
        <div className="flex justify-between items-center text-md text-gray-500">
          <div className="flex items-center gap-6">
            {/* Tarih */}
            <div className="flex items-center gap-2">
              <FaRegCalendarAlt className="text-lg" />
              <span>{dateString}</span>
            </div>
            {/* Yorum (Şu an sabit 0) */}
            <div className="flex items-center gap-2">
              <FaRegComment className="text-lg" />
              <span>{commentCount}</span>
            </div>
            {/* Beğeni */}
            <div className="flex items-center gap-2">
              <FaRegHeart className="text-lg cursor-pointer hover:text-red-500 transition" />
              <span>{likeCount}</span>
            </div>
          </div>

          {/* Etiketler */}
          <div className="flex gap-2">
            {tags.map((tagName, index) => (
              <span
                key={index}
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-md font-medium"
              >
                {tagName}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
