import { useState } from "react";
import BlogCard from "@/components/home/BlogCard"; // Blog kart bileşeni
import { blogData } from "@/data/blogs"; // Blog verileri
import { FiMoreVertical } from "react-icons/fi";
import Sidebar from "@/components/home/Sidebar";
import Header from "@/components/home/Header";
import Modal from "@/components/createPost/Modal";


export default function CreatePost() {
  const [posts, setPosts] = useState(blogData);
  const [menuOpen, setMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = (postId) => {
    setMenuOpen(menuOpen === postId ? null : postId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
        <Header />
      </div>

      <div className="flex pt-20">
        {/* Sidebar */}
        <Sidebar />

        {/* Ana İçerik */}
        <main className="flex-1 mx-auto max-w-6xl px-16">
          {/* Create New Post Butonu */}
          <button
            onClick={() => setIsModalOpen(true)} 
          className="px-6 py-3 border border-gray-300 bg-white text-black font-semibold rounded-full transition mb-8">
            Create New Post +
          </button>

          {/* My Posts Başlığı */}
          <h2 className="text-gray-900 font-semibold text-lg mb-6">My Posts</h2>

          {/* Blog Kartları (Sade Görünüm) */}
          <div className="space-y-8">
            {posts.map((post) => (
              <div key={post.id} className="relative">
                {/* More Butonu (Sağ Üst Köşeye Sabitlendi) */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => toggleMenu(post.id)}
                    className="p-0 rounded-full transition"
                  >
                    <FiMoreVertical className="text-2xl bg-white rounded-full text-gray-700" />
                  </button>

                  {/* Açılır Menü */}
                  {menuOpen === post.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg">
                      <button className="block px-4 py-2 text-gray-700 bg-white w-full">
                        Delete Post
                      </button>
                      <button className="block px-4 py-2 text-gray-700 bg-white w-full">
                        Edit Post
                      </button>
                    </div>
                  )}
                </div>

                {/* Blog Kartı */}
                <BlogCard blog={post} />
              </div>
            ))}
          </div>
        </main>
      </div>
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
