import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogDetails } from "@/redux/slices/blogSlice";
import Header from "@/components/home/Header";
import Sidebar from "@/components/home/Sidebar";
import { FaRegCalendarAlt, FaBookOpen } from "react-icons/fa";
import SimilarPosts from "@/components/blog/SimilarPosts";
import { blogData } from "@/data/blogs";
import CommentSection from "@/components/blog/CommentSection";

export default function BlogDetail() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const { selectedBlog: blog, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogDetails(id));
    }
  }, [id, dispatch]);

  if (loading) return <p className="text-gray-500 text-center">Loading...</p>;

  if (error) {
    console.error("Blog detayları yüklenirken hata oluştu:", error);
    return <p className="text-red-500 text-center">{error.message || "Bir hata oluştu"}</p>;
  }

  if (!blog || typeof blog !== "object" || Array.isArray(blog)) {
    console.error("Geçersiz blog nesnesi:", blog);
    return <p className="text-gray-600 text-xl text-center">Blog not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 w-full bg-white z-50">
        <Header />
      </div>

      <div className="flex pt-20 container mx-auto px-8">
        <div className="w-52 hidden lg:block">
          <Sidebar />
        </div>

        <main className="flex-1 mx-auto max-w-5xl px-8">
          <div className="flex flex-col items-center text-center mb-6">
            <img
              src={blog.author?.profileImage || "/icons/profile.svg"}
              alt="Author"
              className="w-20 h-20 rounded-full mb-2"
            />
            <h2 className="text-xl font-semibold text-gray-900">{blog.author?.username}</h2>
            <p className="text-gray-500 text-lg">Author</p>
          </div>

          <div className="flex justify-center gap-2 mt-2">
            {blog.tags?.map((tag, index) => (
              <span key={index} className="bg-primary text-white px-3 py-1 rounded-full text-md">
                {tag.name}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900 mt-6">{blog.title}</h1>

          <div className="flex justify-center items-center gap-6 text-gray-600 text-md mt-3">
            <div className="flex items-center gap-1">
              <FaRegCalendarAlt className="text-lg" />
              <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Unknown date"}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaBookOpen className="text-lg" />
              <span>{blog.readTime} Mins Read</span>
            </div>
          </div>

          {blog.image && (
            <img src={blog.image} alt="Blog Image" className="rounded-xl mt-6 mx-auto w-full" />
          )}

          <p className="text-gray-700 text-xl mt-6 leading-relaxed">{blog.content}</p>

          {/* 📌 Eğer comments eksikse boş array olarak geçiriyoruz */}
          <CommentSection blogId={blog._id} comments={blog.comments || []} />

          <SimilarPosts currentBlog={blog} blogs={blogData} />
        </main>
      </div>
    </div>
  );
}
