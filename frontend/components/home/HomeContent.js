import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLatestBlogs, fetchPopularBlogs } from "@/redux/slices/blogSlice"; 
import Sidebar from "./Sidebar";
import Header from "./Header";
import BlogCard from "./BlogCard";
import CategoryList from "./CategoryList";
import Tags from "./Tags";

export default function HomeContent() {
  const [activeTab, setActiveTab] = useState("Latest"); 
  const dispatch = useDispatch();
  
  const { latestBlogs, popularBlogs, blogs, selectedCategories, selectedTags, searchedBlogs, loading } = useSelector((state) => state.blog);

  // Filtreleme mantığı: Eğer arama veya kategori/tag seçimi varsa, ilgili blogları göster.
  const displayedBlogs =
    searchedBlogs.length > 0
      ? searchedBlogs
      : selectedCategories.length > 0
      ? blogs
      : selectedTags.length > 0
      ? blogs
      : activeTab === "Latest"
      ? latestBlogs
      : popularBlogs;

  // Sekmeye göre API çağrısı
  useEffect(() => {
    if (selectedCategories.length > 0) {
      return; // Kategori seçilmişse, latest ve popular çağrılmasın
    }
    
    if (activeTab === "Latest") {
      dispatch(fetchLatestBlogs());
    } else if (activeTab === "Popular") {
      dispatch(fetchPopularBlogs());
    }
  }, [activeTab, selectedCategories, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sabit Header */}
      <div className="fixed top-0 w-full bg-white dark:bg-gray-800 z-50">
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
                  activeTab === tab 
                    ? "text-primary font-semibold" 
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {tab}
              </span>
              {/* Seçili sekmede alt çizgiler */}
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
          {loading ? (
            <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
          ) : (
            <div className="space-y-6">
              {displayedBlogs.length > 0 ? (
                displayedBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-400">No blogs found.</p>
              )}
            </div>
          )}
        </main>

        {/* Sabit Sağ Sidebar */}
        <aside className="w-72 p-6 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 fixed right-0 top-[67px] h-[calc(100vh-4rem)] z-50">
          <div className="space-y-6">
            <CategoryList />
            <Tags />
          </div>
        </aside>
      </div>
    </div>
  );
}
