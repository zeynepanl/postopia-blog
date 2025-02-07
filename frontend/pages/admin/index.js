import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "@/components/admin/Sidebar";
import StatsCard from "@/components/admin/StatsCard";
import CategoryGraph from "@/components/admin/CategoryGraph";
import BlogTrendGraph from "@/components/admin/BlogTrendGraph"; // Yeni eklenen bileşen
import Header from "../../components/admin/Header";
import { fetchDashboardData } from "@/redux/slices/dashboardSlice";
import DOMPurify from "dompurify";


export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { data, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (token) {
      dispatch(fetchDashboardData(token));
    }
  }, [dispatch, token]);

  if (loading) return <p>Loading dashboard data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 h-16 flex items-center">
        <Header />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Dashboard İçerik */}
      <main className="flex-1 p-8 mt-16 ml-52">
        {/* Üst Kısım - Grafik ve Kartlar */}
        <div className="flex gap-8 mb-8">
          {/* Sol taraf - Ziyaret Grafiği */}
          <div className="flex-[4]">
            <BlogTrendGraph data={data?.blogTrend} />
          </div>

          {/* Sağ taraf - İstatistik Kartları */}
          <div className="flex-1 space-y-4">
            <StatsCard title="Total Blogs" count={data?.totalBlogs} color="purple" />
            <StatsCard title="Total Users" count={data?.totalUsers} color="blue" />
            <StatsCard title="Total Comments" count={data?.totalComments} color="pink" />
            <StatsCard title="Blocked Users" count={data?.blockedUsers} color="red" />
          </div>
        </div>


        {/* Alt Kısım - Popüler İçerik ve Kategori Dağılımı */}
        <div className="grid grid-cols-2 gap-8">
          {/* Popüler İçerik */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-black mb-4">Most Popular</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-secondary">
                <span>Title</span>
                <span>Views</span>
              </div>
              <ul className="space-y-3">
                {data?.popularPosts?.slice(0, 5).map((post, index) => (
                  <li key={post._id || index} className="flex justify-between text-gray-700">
                  <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.title) }} />
                    <span>{post.views}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-4 justify-center mt-6">
                <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg">1 Month</button>
                <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg">6 Month</button>
                <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg">12 Month</button>
              </div>
            </div>
          </div>

          {/* Kategori Dağılımı */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-[300px] flex items-center justify-center">
              <CategoryGraph data={data?.categoryDistribution} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
