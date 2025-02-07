import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toggleBlogLike, deleteBlog } from "@/redux/slices/blogSlice";
import {
  FaRegComment,
  FaRegCalendarAlt,
  FaRegHeart,
  FaHeart,
} from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { useState } from "react";
import DOMPurify from "dompurify";

export default function BlogCard({ blog, isMyPost, onEdit }) {
  if (!blog) return null;

  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  // UI'de anlık güncelleme için local state
  const [isLiked, setIsLiked] = useState(blog.likes?.includes(user?._id));
  const [likeCount, setLikeCount] = useState(blog.likes?.length || 0);
  const [menuOpen, setMenuOpen] = useState(false);

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
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      console.warn("Beğeni işlemi için giriş yapmalısınız!");
      return;
    }

    dispatch(toggleBlogLike({ blogId: blog._id, token }));

    // UI'de anında değişiklik yap
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  // **Silme işlemi**
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      console.warn("Silme işlemi için giriş yapmalısınız!");
      return;
    }

    dispatch(deleteBlog({ blogId: blog._id, token }));
  };

  return (
    <div className="relative">
      {/* Blog Kartı */}
      <Link href={`/blog/${blog._id}`} className="block">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col gap-4 cursor-pointer hover:shadow-lg transition-shadow relative">
          {/* Üst Kısım: Yazar Bilgisi */}
          <div className="flex items-center gap-3">
            <img
              src={authorImage}
              alt="Profile"
              className="w-8 h-8 rounded-full cursor-pointer"
            />
            <span className="text-md text-gray-800 dark:text-gray-200 font-medium">
              {authorName}
            </span>
          </div>

          <h2
            className="text-2xl font-bold text-black dark:text-white leading-tight line-clamp-2 break-words"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.title) }}
          ></h2>

          <div
            className="text-lg text-gray-800 dark:text-gray-300 leading-relaxed line-clamp-3 break-words"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(contentPreview),
            }}
          ></div>

          <hr className="border-gray-300 dark:border-gray-600" />

          {/* Alt Bilgi: Tarih, Yorum, Beğeni */}
          <div className="flex justify-between items-center text-md text-gray-500 dark:text-gray-400">
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
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-300 hover:text-red-500 transition"
              >
                {isLiked ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-500 dark:text-gray-300 hover:text-red-500 transition" />
                )}
                <span>{likeCount}</span>
              </button>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2">
            {tags.map((tagName, index) => (
              <span
                key={index}
                className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-100 px-3 py-1 rounded-full text-md font-medium"
              >
                {tagName}
              </span>
            ))}
          </div>
        </div>
      </Link>

      {/* **Sadece My Posts İçin: Üç Nokta Menüsü** */}
      {isMyPost && (
        <div className="absolute top-4 right-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-0 rounded-full transition"
          >
            <FiMoreVertical className="text-2xl bg-white dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              <button
                onClick={handleDelete}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 w-full"
              >
                Delete Post
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(blog);
                }}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 w-full"
              >
                Edit Post
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
