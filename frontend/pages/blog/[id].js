import { useRouter } from "next/router";
import Image from "next/image";
import Header from "@/components/home/Header";
import Sidebar from "@/components/home/Sidebar";
import { blogData } from "@/data/blogs"; // Blog verilerini içe aktar
import { FaRegCalendarAlt, FaBookOpen } from "react-icons/fa";

export default function BlogDetail() {
  const router = useRouter();
  const { id } = router.query;

  if (!router.isReady) return null; // Sayfa henüz yüklenmediyse beklet

  // Blog verisini `blogData` içinden bul
  const blog = blogData.find((b) => b.id === id);

  if (!blog) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-xl">
        Blog not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sabit Header */}
      <Header />

      <div className="flex pt-20">
        {/* Sol Sidebar */}
        <Sidebar />

        {/* Ana İçerik */}
        <main className="flex-1 mx-auto max-w-3xl px-4">
          {/* Yazar Bilgisi */}
          <div className="flex flex-col items-center text-center mb-6">
            <img
              src={blog.authorImage || "/icons/profile.svg"}
              alt="Author"
              className="w-20 h-20 rounded-full mb-2"
            />
            <h2 className="text-lg font-semibold text-gray-900">{blog.author}</h2>
            <p className="text-gray-500 text-sm">Author</p>
          </div>

          {/* Kategoriler */}
          <div className="flex justify-center gap-2 mt-2">
            {blog.tags.map((tag, index) => (
              <span key={index} className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          {/* Blog Başlığı */}
          <h1 className="text-3xl font-bold text-center text-gray-900 mt-6">{blog.title}</h1>

          {/* Tarih ve Okuma Süresi */}
          <div className="flex justify-center items-center gap-6 text-gray-600 text-sm mt-3">
            <div className="flex items-center gap-1">
              <FaRegCalendarAlt className="text-lg" />
              <span>{blog.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaBookOpen className="text-lg" />
              <span>{blog.readTime} Mins Read</span>
            </div>
          </div>

          {/* Blog Resmi (Eğer resim varsa göster) */}
          {blog.image && (
            <Image
              src={blog.image}
              alt="Blog Image"
              width={800}
              height={400}
              className="rounded-xl mt-6 mx-auto"
              unoptimized
            />
          )}

          {/* Blog İçeriği */}
          <p className="text-gray-700 mt-6 leading-relaxed">{blog.description}</p>

          
        </main>
      </div>
    </div>
  );
}
