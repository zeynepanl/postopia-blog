import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BlogCard from "./BlogCard";
import CategoryList from "./CategoryList";
import Tags from "./Tags";
import { blogData } from "@/data/blogs"; // Blog verilerini içeri aktar

export default function HomeContent() {
  const [activeTab, setActiveTab] = useState("Latest");

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Sabit Header */}
      <div className="fixed top-0 w-full bg-white z-50">
        <Header />
      </div>

      {/* Header'in altında sekmeler */}
      <div className="pt-20 flex justify-center ">
        <div className="flex items-center gap-12">
          {["Latest", "Popular"].map((tab) => (
            <div key={tab} className="relative cursor-pointer">
              <span
                onClick={() => setActiveTab(tab)}
                className={`text-xl transition-all ${
                  activeTab === tab ? "text-primary font-semibold" : "text-gray-700"
                }`}
              >
                {tab}
              </span>

              {/* Alt Çizgiler (Seçildiğinde Gözüken Çift Çizgi) */}
              {activeTab === tab && (
                <div className="absolute left-0 w-full mt-2">
                  <div className="w-full h-[2px] bg-primary"></div>
                  <div className="w-full h-[2px] bg-primary mt-[1px]"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="flex pt-6">
        {/* Sol Sidebar */}
        <Sidebar />

        {/* Ana İçerik Alanı */}
        <main className="flex-1 mx-auto max-w-6xl ml-64 mr-80">
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
