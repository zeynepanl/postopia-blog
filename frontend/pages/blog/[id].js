import { useRouter } from "next/router";
import Image from "next/image";
import Header from "@/components/home/Header";
import Sidebar from "@/components/home/Sidebar";
import { blogData } from "@/data/blogs"; // Blog verilerini içe aktar
import { FaRegCalendarAlt, FaBookOpen } from "react-icons/fa";
import CommentSection from "@/components/blog/CommentSection";
import SimilarPosts from "@/components/blog/SimilarPosts";


export default function BlogDetail() {
  const router = useRouter();
  const { id } = router.query;

  if (!router.isReady) return null;

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
      <div className="fixed top-0 left-0 w-full bg-white z-50">
        <Header />
        </div>

      <div className="flex pt-20 container mx-auto px-8">
        {/* Sol Sidebar (Daha Dar Yapıldı) */}
        <div className="w-52 hidden lg:block">  
          <Sidebar />
        </div>

        {/* Ana İçerik (Daha Geniş Yapıldı) */}
        <main className="flex-1 mx-auto max-w-5xl px-8">  
          {/* Yazar Bilgisi */}
          <div className="flex flex-col items-center text-center mb-6">
            <img
              src={blog.authorImage || "/icons/profile.svg"}
              alt="Author"
              className="w-20 h-20 rounded-full mb-2"
            />
            <h2 className="text-xl font-semibold text-gray-900">
              {blog.author}
            </h2>
            <p className="text-gray-500 text-lg">Author</p>
          </div>

          {/* Kategoriler */}
          <div className="flex justify-center gap-2 mt-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-primary text-white px-3 py-1 rounded-full text-md"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Blog Başlığı */}
          <h1 className="text-3xl font-bold text-center text-gray-900 mt-6">
            {blog.title}
          </h1>

          {/* Tarih ve Okuma Süresi */}
          <div className="flex justify-center items-center gap-6 text-gray-600 text-md mt-3">
            <div className="flex items-center gap-1">
              <FaRegCalendarAlt className="text-lg" />
              <span>{blog.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaBookOpen className="text-lg" />
              <span>{blog.readTime} Mins Read</span>
            </div>
          </div>

          {/* Blog Resmi (Daha Geniş Yapıldı) */}
          {blog.image && (
            <Image
              src={blog.image}
              alt="Blog Image"
              width={1000}
              height={600}
              className="rounded-xl mt-6 mx-auto"
              unoptimized
            />
          )}

          {/* Blog İçeriği */}
          <p className="text-gray-700 text-xl mt-6 leading-relaxed">
            {blog.description}
          </p>

          {/* Yorum Alanı */}
          <CommentSection />

          {/* Benzer Postlar */}
          <SimilarPosts currentBlog={blog} blogs={blogData} />
        </main>
      </div>
    </div>
  );
}
