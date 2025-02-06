import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { FiSearch, FiFilter, FiCalendar, FiEdit, FiTrash } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slices/categorySlice";
import { fetchBlogs } from "@/redux/slices/blogSlice";
import { fetchAllComments } from "@/redux/slices/commentSlice"; // Yeni thunk
import { comment } from "postcss";

export default function BlogManagement() {
  const dispatch = useDispatch();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Category");

  const { categories, loading: catLoading, error: catError } = useSelector(
    (state) => state.category
  );
  const { blogs, loading: postLoading, error: postError } = useSelector(
    (state) => state.blog
  );
  const { comments, loading: comLoading, error: comError } = useSelector(
    (state) => state.comment
  );

  // auth slice'dan token'ı çekiyoruz:
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (selectedFilter === "Category") {
      dispatch(fetchCategories(token));
    } else if (selectedFilter === "Post") {
      dispatch(fetchBlogs(token));
    } else if (selectedFilter === "Comment") {
      if (!token) {
        console.error("Token bulunamadı, lütfen giriş yapın.");
        return;
      }
      // Tüm yorumları çekmek için yeni thunk'u kullanıyoruz.
      dispatch(fetchAllComments({ token }));
    }
  }, [selectedFilter, dispatch, token]);

  const handleFilterSelect = (filterName) => {
    setSelectedFilter(filterName);
    setFilterOpen(false);
  };

  const renderTable = () => {
    if (selectedFilter === "Category") {
      if (catLoading) return <p>Loading Categories...</p>;
      if (catError) return <p>Error: {typeof catError === 'object' ? JSON.stringify(catError) : catError}</p>;
      return (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 font-bold text-primary text-lg">Category</th>
              <th className="text-left py-4 font-bold text-primary text-lg">Number of Blog</th>
              <th className="text-right py-4 font-bold text-primary text-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat._id || index} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-4 text-gray-900 font-medium">{cat.name}</td>
                <td className="py-4 text-gray-500">{cat.blogCount || 0}</td>
                <td className="py-4">
                  <div className="flex justify-end gap-3">
                    <button className="text-gray-700 bg-white hover:text-gray-600">
                      <FiEdit size={20} />
                    </button>
                    <button className="text-gray-700 bg-white hover:text-gray-600">
                      <FiTrash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (selectedFilter === "Comment") {
      if (comLoading) return <p>Loading Comments...</p>;
      if (comError)
        return (
          <p>
            Error:{" "}
            {typeof comError === "object" ? JSON.stringify(comError) : comError}
          </p>
        );
      return (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 font-bold text-primary text-lg">
                Comment ID
              </th>
              <th className="text-left py-4 font-bold text-primary text-lg">
                Author
              </th>
              <th className="text-left py-4 font-bold text-primary text-lg">
                Blog ID
              </th>
              <th className="text-left py-4 font-bold text-primary text-lg">
                Date
              </th>
              <th className="text-right py-4 font-bold text-primary text-lg">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {comments.map((com, index) => (
              <tr
                key={com._id || index}
                className="border-b border-gray-50 hover:bg-gray-50"
              >
                <td className="py-4 text-gray-900 font-medium">{com._id}</td>
                <td className="py-4 text-gray-900">{com.user?.username}</td>
                <td className="py-4 text-gray-500">{com.blog?._id}</td>
                <td className="py-4 text-gray-500">
                  {new Date(com.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4">
                  <div className="flex justify-end gap-3">
                    <button className="text-gray-700 bg-white hover:text-gray-600">
                      <FiEdit size={20} />
                    </button>
                    <button className="text-gray-700 bg-white hover:text-gray-600">
                      <FiTrash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    else if (selectedFilter === "Post") {
      if (postLoading) return <p>Loading Posts...</p>;
      if (postError)
        return <p>Error: {typeof postError === "object" ? JSON.stringify(postError) : postError}</p>;
      return (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 font-bold text-primary text-lg">Title</th>
              <th className="text-left py-4 font-bold text-primary text-lg">Author</th>
              <th className="text-left py-4 font-bold text-primary text-lg">Categories</th>
              <th className="text-left py-4 font-bold text-primary text-lg">Date</th>
              <th className="text-right py-4 font-bold text-primary text-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((post, index) => (
              <tr key={post._id || index} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-4 text-gray-900 font-medium">{post.title}</td>
                <td className="py-4 text-gray-900">{post.author?.username}</td>
                <td className="py-4 text-gray-500">
                  {post.categories && post.categories.length > 0
                    ? post.categories.map(cat => cat.name).join(", ")
                    : "N/A"}
                </td>
                <td className="py-4 text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4">
                  <div className="flex justify-end gap-3">
                    <button className="text-gray-700 bg-white hover:text-gray-600">
                      <FiEdit size={20} />
                    </button>
                    <button className="text-gray-700 bg-white hover:text-gray-600">
                      <FiTrash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <div className="fixed top-0 left-0 w-full bg-white z-50 h-16 flex items-center">
          <Header />
        </div>

        <div className="ml-52 mt-16 flex-1 bg-[#F9FAFB] min-h-screen p-8">
          <div className="flex items-center justify-between mb-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-[400px] px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-600 bg-white text-gray-700 pl-10"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiSearch size={20} />
              </span>
            </div>

            <div className="flex items-center gap-3 relative">
              <button
                className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <span className="text-sm">Filter by</span>
                <FiFilter size={16} />
              </button>

              {filterOpen && (
                <div className="absolute top-full mt-2 left-0 w-36 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => handleFilterSelect("Category")}
                    className="w-full px-4 py-2 text-gray-900 bg-white hover:bg-gray-200"
                  >
                    Category
                  </button>
                  <button
                    onClick={() => handleFilterSelect("Post")}
                    className="w-full px-4 py-2 text-gray-900 bg-white hover:bg-gray-200"
                  >
                    Post
                  </button>
                  <button
                    onClick={() => handleFilterSelect("Comment")}
                    className="w-full px-4 py-2 text-gray-900 bg-white hover:bg-gray-200"
                  >
                    Comment
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 bg-white text-gray-700 hover:bg-gray-50">
                <span className="text-sm">08.01.2023 - 28.01.2023</span>
                <FiCalendar size={20} />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">{selectedFilter} List</h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {renderTable()}
          </div>
        </div>
      </div>
    </div>
  );
}
