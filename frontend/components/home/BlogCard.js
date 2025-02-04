import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toggleBlogLike } from "@/redux/slices/blogSlice";
import { FaRegComment, FaRegCalendarAlt, FaRegHeart, FaHeart } from "react-icons/fa";
import { useState } from "react";

export default function BlogCard({ blog }) {
  if (!blog) return null;

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // UI'de anlık güncelleme için local state
  const [isLiked, setIsLiked] = useState(blog.likes?.includes(token?.userId));
  const [likeCount, setLikeCount] = useState(blog.likes?.length || 0);

  // Yazar Bilgisi
  const authorName = blog.author?.username || "Unknown Author";
  const authorImage = "/icons/profile.svg";

  // İçerik önizlemesi
  const contentPreview = blog.content
    ? blog.content.substring(0, 100) + "..."
    : "No content available.";

  // Tarih bilgisi
  const dateString = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString()
    : "Unknown date";

  // Yorum sayısı
  const commentCount = Array.isArray(blog.comments) ? blog.comments.length : 0;

  // Etiketler
  const tags = Array.isArray(blog.tags)
    ? blog.tags.map((tagObj) => (tagObj.name ? tagObj.name : tagObj))
    : [];

  // **Beğeni butonu işlevi**
  const handleLike = async (e) => {
    e.preventDefault(); // Sayfa yönlendirmesini engelle
    e.stopPropagation(); // Link tıklanmasını engelle

    if (!token) {
      console.warn("Beğeni işlemi için giriş yapmalısınız!");
      return;
    }

    console.log(`Beğeni API'ye gidiyor: Blog ID -> ${blog._id}`);
    dispatch(toggleBlogLike({ blogId: blog._id, token }));

    // UI'de anında değişiklik yap
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <Link href={`/blog/${blog._id}`} className="block">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col gap-4 cursor-pointer hover:shadow-lg transition-shadow relative">
        
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

        {/* Alt Bilgi: Tarih, Yorum, Beğeni */}
        <div className="flex justify-between items-center text-md text-gray-500">
          <div className="flex items-center gap-6">
            {/* Tarih */}
            <div className="flex items-center gap-2">
              <FaRegCalendarAlt className="text-lg" />
              <span>{dateString}</span>
            </div>

            {/* Yorum Sayısı */}
            <div className="flex items-center gap-2">
              <FaRegComment className="text-lg" />
              <span>{commentCount}</span>
            </div>

            {/* Beğeni Butonu */}
            <button 
              type="button" 
              onClick={handleLike} 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              {isLiked ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="text-gray-400 hover:text-red-500 transition" />
              )}
              <span>{likeCount}</span>
            </button>
          </div>
        </div>

        {/* 📌 Etiketler (Sağ Alt Köşeye Taşındı) */}
        <div className="absolute bottom-4 right-4 flex gap-2">
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
    </Link>
  );
}
