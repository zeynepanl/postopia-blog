import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLatestBlogs, fetchPopularBlogs } from "@/redux/slices/blogSlice"; 
import Sidebar from "./Sidebar";
import Header from "./Header";
import BlogCard from "./BlogCard";
import CategoryList from "./CategoryList";
import Tags from "./Tags";
import { useRouter } from "next/router";

export default function HomeContent() {
  const [activeTab, setActiveTab] = useState("Latest"); 
  const dispatch = useDispatch();
  const { latestBlogs, popularBlogs, loading } = useSelector((state) => state.blog);

  // Sekmeye göre API çağrısı yap
  useEffect(() => {
    if (activeTab === "Latest") {
      dispatch(fetchLatestBlogs());
    } else if (activeTab === "Popular") {
      dispatch(fetchPopularBlogs());
    }
  }, [activeTab, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Sabit Header */}
      <div className="fixed top-0 w-full bg-white z-50">
        <Header />
      </div>

      {/* Header'in altında sekmeler */}
      <div className="pt-20 flex justify-center">
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
          {/* Yükleme İşlemi */}
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : (
            <div className="space-y-6">
              {/* Eğer "Latest" sekmesi seçiliyse Redux'tan gelen en son blogları göster */}
              {activeTab === "Latest"
                ? latestBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
                : popularBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
            </div>
          )}
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
