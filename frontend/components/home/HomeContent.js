import Sidebar from "./Sidebar";
import Header from "./Header";
import BlogCard from "./BlogCard";
import CategoryList from "./CategoryList";
import Tags from "./Tags";
import { blogData } from "@/data/blogs"; // Blog verilerini içeri aktar

export default function HomeContent() {
  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Sabit Header */}
      <div className="fixed top-0 w-full bg-white z-50">
        <Header />
      </div>

      <div className="flex pt-20">
        {/* Sol Sidebar */}
        <Sidebar />

        {/* Ana İçerik Alanı (Sol ve Sağ İçin Boşluk Eklendi) */}
        <main className="flex-1 mx-auto max-w-6xl ml-64 mr-80">
          {/* Blog Kartları */}
          <div className="space-y-6">
            {blogData.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </main>

        {/* Sabit Sağ Sidebar */}
        <aside className="w-72 p-6 bg-white border-l border-gray-200 fixed right-0 top-[67px] h-[calc(100vh-4rem)] z-50">
          <div className="space-y-6">
            <CategoryList />
            <Tags />
          </div>
        </aside>
      </div>
    </div>
  );
}
