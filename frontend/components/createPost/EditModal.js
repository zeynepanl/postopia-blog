import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateBlog } from "@/redux/slices/blogSlice"; 
import { FaImages } from "react-icons/fa";
import { IoReturnUpBackOutline } from "react-icons/io5";

export default function EditModal({ post, onClose }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // Mevcut blog verisi -> local state
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [selectedCategories, setSelectedCategories] = useState(
    Array.isArray(post?.categories)
      ? post.categories.map((cat) => (typeof cat === "object" ? cat._id : cat))
      : []
  );
  const [tags, setTags] = useState(
    Array.isArray(post?.tags)
      ? post.tags.map((t) => (typeof t === "object" ? t._id : t))
      : []
  );

  // Tüm kategori & etiket listeleri
  const [allCategories, setAllCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);

  // Yeni etiket ismi
  const [newTag, setNewTag] = useState("");

  // Kategori & Etiketleri DB'den çek
  useEffect(() => {
    if (token) {
      axios
        .post("http://localhost:5000/api/categories/list", {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setAllCategories(res.data); 
        })
        .catch((err) => console.error("Kategori çekme hatası:", err));

      axios
        .post("http://localhost:5000/api/tags/list", {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setAllTags(res.data); 
        })
        .catch((err) => console.error("Etiket çekme hatası:", err));
    }
  }, [token]);

  // Kategori seçimi (ID bazlı)
  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  // Etiket seçimi (ID bazlı)
  const toggleTag = (tagId) => {
    setTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  // Yeni etiket oluşturma -> DB'ye kaydet, dönen _id'yi ekle
  const addTag = async () => {
    if (!newTag.trim()) return;
    try {
      // BACKEND'DE /api/tags/create gibi bir endpoint olduğunu varsayıyoruz
      const res = await axios.post(
        "http://localhost:5000/api/tags/create",
        { name: newTag },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Dönen yanıt: { tag: { _id, name, ... } }
      const createdTag = res.data.tag;

      // Tüm etiket listesine ekle
      setAllTags((prev) => [...prev, createdTag]);
      // Seçili etiketlerin ID listesine ekle
      setTags((prev) => [...prev, createdTag._id]);
      // Input'u temizle
      setNewTag("");
    } catch (error) {
      console.error("Yeni etiket oluşturulurken hata:", error);
    }
  };

  // Kaydet butonu
  const handleSave = () => {
    const blogData = {
      id: post._id,
      title,
      content,
      categories: selectedCategories,
      tags,
    };

    dispatch(updateBlog({ blogData, token }))
      .unwrap()
      .then(() => {
        console.log("Post updated successfully!");
        onClose();
      })
      .catch((err) => {
        console.error("Error updating post:", err);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[550px] relative">
        {/* Başlık/Kapat */}
        <div className="flex items-center text-purple-700 font-semibold text-lg mb-4">
          <button
            onClick={onClose}
            className="mr-2 p-2 bg-white text-black rounded-full transition"
          >
            <IoReturnUpBackOutline />
          </button>
          <span className="text-primary">Update Post</span>
        </div>

        {/* Title */}
        <label className="text-gray-700 font-semibold text-sm">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mt-1 mb-4 text-black"
        />

        {/* Kategoriler */}
        <label className="text-gray-700 font-semibold text-sm">Categories</label>
        <div className="grid grid-cols-3 gap-y-3 text-gray-700 mt-1 mb-4 text-sm">
          {allCategories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 w-fit">
              <input
                type="checkbox"
                className="form-checkbox text-purple-500"
                checked={selectedCategories.includes(cat._id)}
                onChange={() => toggleCategory(cat._id)}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>

        {/* Etiketler */}
        <label className="text-gray-700 font-semibold text-sm">Tags</label>
        <div className="flex flex-wrap items-center gap-2 mt-1 mb-4">
          {allTags.map((t) => (
            <button
              key={t._id}
              type="button"
              onClick={() => toggleTag(t._id)}
              className={`px-3 py-1 rounded-full text-sm ${
                tags.includes(t._id) ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {t.name}
            </button>
          ))}

          {/* Yeni Etiket Ekleme */}
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="border border-gray-300 p-2 rounded text-sm text-black"
              placeholder="Add Tag"
            />
            <button
              onClick={addTag}
              className="bg-white text-black border border-gray-400 px-2 py-1 rounded-md transition text-sm flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Content */}
        <label className="text-gray-700 font-semibold text-sm">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mt-1 mb-4 h-32 text-black"
        />

        {/* Alt Kısım: Galeri + Save */}
        <div className="flex items-center justify-between w-full mt-6 px-4">
          <button className="flex items-center justify-center w-12 h-12 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-100 transition">
            <FaImages className="text-xl" />
          </button>
          <div className="flex-1 flex justify-center">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
