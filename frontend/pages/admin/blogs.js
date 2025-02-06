import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { FiSearch, FiFilter, FiCalendar, FiEdit, FiTrash } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "@/redux/slices/categorySlice";
import { fetchBlogs, deleteBlog } from "@/redux/slices/blogSlice";
import { fetchAllComments, deleteComment } from "@/redux/slices/commentSlice";

// Import modals (if these are the same as for users)
import Modal from "@/components/createPost/Modal"; // New blog creation modal
import EditModal from "@/components/createPost/EditModal"; // Blog editing modal

export default function BlogManagement() {
  const dispatch = useDispatch();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Category");
  // New: State for the search term
  const [searchTerm, setSearchTerm] = useState("");

  const { categories, loading: catLoading, error: catError } = useSelector((state) => state.category);
  const { blogs, loading: postLoading, error: postError } = useSelector((state) => state.blog);
  const { comments, loading: comLoading, error: comError } = useSelector((state) => state.comment);

  // Admin blog modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBlogForEdit, setSelectedBlogForEdit] = useState(null);

  const { token } = useSelector((state) => state.auth);

  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // Fetch data based on the selected filter
  useEffect(() => {
    if (selectedFilter === "Category") {
      dispatch(fetchCategories());
    } else if (selectedFilter === "Post") {
      dispatch(fetchBlogs(token));
    } else if (selectedFilter === "Comment") {
      if (!token) {
        console.error("Token bulunamadı, lütfen giriş yapın.");
        return;
      }
      dispatch(fetchAllComments({ token }));
    }
  }, [selectedFilter, dispatch, token]);

  const handleFilterSelect = (filterName) => {
    setSelectedFilter(filterName);
    setFilterOpen(false);
    // Cleanup (e.g., close modals)
    setShowCreateModal(false);
    setSelectedBlogForEdit(null);
    // Also clear the search term
    setSearchTerm("");

    // If switching to category, clear category edit states
    if (filterName === "Category") {
      setEditCategoryId(null);
      setEditCategoryName("");
      setNewCategory("");
    }
  };

  // Category addition
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      dispatch(createCategory({ name: newCategory, token }));
      setNewCategory("");
    }
  };

  // Category update
  const handleUpdateCategory = (e) => {
    e.preventDefault();
    if (editCategoryName.trim() && editCategoryId) {
      dispatch(updateCategory({ id: editCategoryId, name: editCategoryName, token }));
      setEditCategoryId(null);
      setEditCategoryName("");
    }
  };

  // Category deletion
  const handleDeleteCategory = (id) => {
    if (window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) {
      dispatch(deleteCategory({ id, token }));
    }
  };

  // Blog deletion
  const handleDeleteBlog = (blogId) => {
    if (window.confirm("Bu blogu silmek istediğinize emin misiniz?")) {
      dispatch(deleteBlog({ blogId, token }));
    }
  };

  const handleDeleteComment = (commentId, blogId) => {
    if (window.confirm("Bu yorumu silmek istediğinize emin misiniz?")) {
      // In admin panel, every comment may not include the blog data. Pass blogId optionally.
      dispatch(deleteComment({ commentId, token, blogId }));
    }
  };

  const renderTable = () => {
    if (selectedFilter === "Category") {
      if (catLoading) return <p>Loading Categories...</p>;
      if (catError)
        return <p>Error: {typeof catError === "object" ? JSON.stringify(catError) : catError}</p>;

      // Filter: category name must include searchTerm
      const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
        <div>
          {/* Category add/update form */}
          {editCategoryId ? (
            <form onSubmit={handleUpdateCategory} className="mb-4 flex gap-2 text-black">
              <input
                type="text"
                placeholder="Edit category name"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                className="px-4 py-2 border rounded flex-1"
                required
              />
              <button type="submit" className="px-4 py-2 bg-secondary text-white rounded">
                Update
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-black rounded"
                onClick={() => {
                  setEditCategoryId(null);
                  setEditCategoryName("");
                }}
              >
                Cancel
              </button>
            </form>
          ) : (
            <form onSubmit={handleAddCategory} className="mb-4 flex gap-2 text-black">
              <input
                type="text"
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-4 py-2 border rounded flex-1"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-secondary text-white rounded"
                disabled={catLoading}
              >
                Add Category
              </button>
            </form>
          )}

          {/* Category list table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 font-bold text-primary text-lg">Category</th>
                <th className="text-left py-4 font-bold text-primary text-lg">Number of Blog</th>
                <th className="text-right py-4 font-bold text-primary text-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => (
                <tr key={cat._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900">{cat.name}</td>
                  <td className="py-4 px-4 text-gray-900">{cat.blogCount || 0}</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      className="mr-2 px-2 py-1 bg-white text-black rounded"
                      onClick={() => {
                        setEditCategoryId(cat._id);
                        setEditCategoryName(cat.name);
                      }}
                    >
                      <FiEdit size={20} />
                    </button>
                    <button
                      className="px-2 py-1 bg-white text-black rounded"
                      onClick={() => handleDeleteCategory(cat._id)}
                    >
                      <FiTrash size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    } else if (selectedFilter === "Comment") {
      if (comLoading) return <p>Loading Comments...</p>;
      if (comError)
        return <p>Error: {typeof comError === "object" ? JSON.stringify(comError) : comError}</p>;

      // Filter: search by comment ID, author name, or blog ID
      const filteredComments = comments.filter((com) => {
        const idMatch = com._id.toLowerCase().includes(searchTerm.toLowerCase());
        const userMatch = com.user?.username?.toLowerCase().includes(searchTerm.toLowerCase());
        const blogMatch = com.blog?._id?.toLowerCase().includes(searchTerm.toLowerCase());
        return idMatch || userMatch || blogMatch;
      });

      return (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 font-bold text-primary text-lg">Comment ID</th>
              <th className="text-left py-4 font-bold text-primary text-lg">Author</th>
              <th className="text-left py-4 font-bold text-primary text-lg">Blog ID</th>
              <th className="text-left py-4 font-bold text-primary text-lg">Date</th>
              <th className="text-right py-4 font-bold text-primary text-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComments.map((com, index) => (
              <tr key={com._id || index} className="border-b hover:bg-gray-50">
                <td className="py-4 text-gray-900 font-medium">{com._id}</td>
                <td className="py-4 text-gray-900">{com.user?.username}</td>
                <td className="py-4 text-gray-500">{com.blog?._id}</td>
                <td className="py-4 text-gray-500">{new Date(com.createdAt).toLocaleDateString()}</td>
                <td className="py-4">
                  <div className="flex justify-end gap-3">
                    <button
                      className="text-gray-700 bg-white hover:text-gray-600"
                      onClick={() => handleDeleteComment(com._id, com.blog?._id)}
                    >
                      <FiTrash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredComments.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No comments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      );
    } else if (selectedFilter === "Post") {
      if (postLoading) return <p>Loading Posts...</p>;
      if (postError)
        return <p>Error: {typeof postError === "object" ? JSON.stringify(postError) : postError}</p>;

      // Filter: search by post title, author name, or category names
      const filteredPosts = blogs.filter((post) => {
        const titleMatch = (post.title || "").toLowerCase().includes(searchTerm.toLowerCase());
        const authorMatch = (post.author?.username || "").toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch =
          post.categories &&
          post.categories.some((cat) => (cat.name || "").toLowerCase().includes(searchTerm.toLowerCase()));
        return titleMatch || authorMatch || categoryMatch;
      });

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
            {filteredPosts.map((post, index) => (
              <tr key={post._id || index} className="border-b hover:bg-gray-50">
                <td className="py-4 text-gray-900 font-medium">{post.title}</td>
                <td className="py-4 text-gray-900">{post.author?.username}</td>
                <td className="py-4 text-gray-500">
                  {post.categories && post.categories.length > 0
                    ? post.categories.map((cat) => cat.name).join(", ")
                    : "N/A"}
                </td>
                <td className="py-4 text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="py-4">
                  <div className="flex justify-end gap-3">
                    <button
                      className="text-gray-700 bg-white hover:text-gray-600"
                      onClick={() => setSelectedBlogForEdit(post)}
                    >
                      <FiEdit size={20} />
                    </button>
                    <button
                      className="text-gray-700 bg-white hover:text-gray-600"
                      onClick={() => handleDeleteBlog(post._id)}
                    >
                      <FiTrash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPosts.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No posts found.
                </td>
              </tr>
            )}
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
            <div className="relative w-[400px]">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-600 bg-white text-gray-700 pl-10"
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
                  <button onClick={() => handleFilterSelect("Category")} className="w-full px-4 py-2 text-gray-900 bg-white hover:bg-gray-200">
                    Category
                  </button>
                  <button onClick={() => handleFilterSelect("Post")} className="w-full px-4 py-2 text-gray-900 bg-white hover:bg-gray-200">
                    Post
                  </button>
                  <button onClick={() => handleFilterSelect("Comment")} className="w-full px-4 py-2 text-gray-900 bg-white hover:bg-gray-200">
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{selectedFilter} List</h2>
            {selectedFilter === "Post" && (
              <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-secondary text-white rounded">
                Add New Post
              </button>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {renderTable()}
          </div>
        </div>
      </div>
      {showCreateModal && <Modal onClose={() => setShowCreateModal(false)} />}
      {selectedBlogForEdit && <EditModal post={selectedBlogForEdit} onClose={() => setSelectedBlogForEdit(null)} />}
    </div>
  );
}
