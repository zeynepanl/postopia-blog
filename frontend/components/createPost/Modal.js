import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBlog } from "../../redux/slices/blogSlice";
import axios from "axios";
import { FaImages } from "react-icons/fa";
import { IoReturnUpBackOutline } from "react-icons/io5";

export default function Modal({ onClose }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.blog);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]); // Backend'den çekilen kategoriler
  const [selectedCategories, setSelectedCategories] = useState([]); // Seçili kategoriler
  const [availableTags, setAvailableTags] = useState([]); // Backend'den çekilen etiketler
  const [selectedTags, setSelectedTags] = useState([]); // Seçilen etiketler
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (token) {
      axios
        .post("http://localhost:5000/api/categories/list", {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          setCategories(response.data);
        })
        .catch(error => console.error("Kategorileri alırken hata:", error));

      axios
        .post("http://localhost:5000/api/tags/list", {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setAvailableTags(response.data))
        .catch(error => console.error("Etiketleri alırken hata:", error));
    }
  }, [token]);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const addTag = () => {
    if (newTag.trim() !== "" && !availableTags.some(tag => tag.name === newTag)) {
      setAvailableTags([...availableTags, { _id: newTag, name: newTag }]);
      setNewTag("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBlog = {
      title,
      content,
      categories: selectedCategories,
      tags: selectedTags,
      date: new Date().toISOString(),
    };

    dispatch(addBlog({ blogData: newBlog, token }));
    console.log("Gönderilen Blog Verisi:", newBlog);

    setTitle("");
    setContent("");
    setSelectedTags([]);
    setSelectedCategories([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[550px] relative">
        {/* Başlık ve Kapatma Butonu */}
        <div className="flex items-center text-purple-700 font-semibold text-lg mb-4">
          <button
            onClick={onClose}
            className="mr-2 p-2 bg-white text-black rounded-full transition"
          >
            <IoReturnUpBackOutline />
          </button>
          <span className="text-primary">Create New Post</span>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Başlık Alanı */}
          <label className="text-gray-700 font-semibold text-sm">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mt-1 mb-4 text-black focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
            required
          />

          {/* Kategoriler (Checkbox Grid) */}
          <label className="text-gray-700 font-semibold text-sm">Categories</label>
          <div className="grid grid-cols-3 gap-y-3 text-gray-700 mt-1 mb-4 text-sm">
            {categories.map(category => (
              <label key={category._id} className="flex items-center gap-2 w-fit">
                <input
                  type="checkbox"
                  value={category._id}
                  checked={selectedCategories.includes(category._id)}
                  onChange={() => toggleCategory(category._id)}
                  className="form-checkbox text-purple-500"
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>

          {/* Etiketler */}
          <label className="text-gray-700 font-semibold text-sm">Tags</label>
          <div className="flex flex-wrap items-center gap-2 mt-1 mb-4">
            {availableTags.map(tag => (
              <button
                key={tag._id}
                type="button"
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag._id) ? "bg-purple-400 text-white" : "bg-gray-200 text-gray-700"
                }`}
                onClick={() =>
                  setSelectedTags(prev =>
                    prev.includes(tag._id) ? prev.filter(t => t !== tag._id) : [...prev, tag._id]
                  )
                }
              >
                {tag.name}
              </button>
            ))}
          </div>

          {/* Yeni Etiket Ekleme */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="border border-gray-300 p-2 rounded text-sm w-full"
              placeholder="Add tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-purple-500 text-white px-3 py-2 rounded-md transition text-sm"
            >
              +
            </button>
          </div>

          {/* İçerik Alanı */}
          <label className="text-gray-700 font-semibold text-sm mt-4">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mt-1 mb-4 h-32 text-black focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
            placeholder="Enter your post content here..."
            required
          ></textarea>

          {/* Butonlar */}
          <div className="flex items-center justify-between w-full mt-6 px-4">
            <button className="flex items-center justify-center w-12 h-12 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-100 transition">
              <FaImages className="text-xl" />
            </button>
            <div className="flex-1 flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-400 text-white rounded-lg font-semibold hover:bg-purple-500 transition"
                disabled={loading}
              >
                {loading ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
