import { useState } from "react";
import { FaImages } from "react-icons/fa";
import { IoReturnUpBackOutline } from "react-icons/io5";

export default function Modal({ post, onClose }) {
  // Seçilen blogun bilgilerini state'e çekiyoruz
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.description || ""); // ✅ Description bilgisini getiriyoruz
  const [selectedCategories, setSelectedCategories] = useState(
    post?.categories || []
  );
  const [tags, setTags] = useState(post?.tags || []);
  const [newTag, setNewTag] = useState("");

  const categories = ["Technology", "Education", "Other", "Travel", "Science"];

  // Kategori seçimini yönetmek için fonksiyon
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Yeni etiket ekleme fonksiyonu
  const addTag = () => {
    if (newTag.trim() !== "" && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleSave = () => {
    console.log("Updated Post:", { title, content, selectedCategories, tags });
    onClose(); // Kaydettikten sonra modalı kapat
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
          <span className="text-primary">Update Post</span>
        </div>

        {/* Başlık Alanı */}
        <label className="text-gray-700 font-semibold text-sm">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mt-1 mb-4 text-black focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
        />

        {/* Kategoriler */}
        <label className="text-gray-700 font-semibold text-sm">
          Categories
        </label>
        <div className="grid grid-cols-3 gap-y-3 text-gray-700 mt-1 mb-4 text-sm">
          {["Technology", "Education", "Other", "Travel", "Science"].map(
            (category) => (
              <label key={category} className="flex items-center gap-2 w-fit">
                <input
                  type="checkbox"
                  className="form-checkbox text-purple-500"
                />
                <span>{category}</span>
              </label>
            )
          )}
        </div>

        {/* Tags Bölümü */}
        <label className="text-gray-700 font-semibold text-sm">Tags</label>
        <div className="flex flex-wrap items-center gap-2 mt-1 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-secondary border border-gray-300 rounded-full text-sm text-white"
            >
              {tag}
            </span>
          ))}

          {/* Yeni Etiket Ekleme Alanı */}
          <div className="flex items-center gap-1">
            <button
              onClick={addTag}
              className="bg-white text-black border border-gray-400 px-2 py-1 rounded-md transition text-sm flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* İçerik Alanı */}
        <label className="text-gray-700 font-semibold text-sm">Text</label>
        <textarea
          value={content} // ✅ Postun description'u burada
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mt-1 mb-4 h-32 text-black focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
        ></textarea>

<div className="flex items-center justify-between w-full mt-6 px-4">
          {/* Galeri Butonu */}
          <button className="flex items-center justify-center w-12 h-12 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-100 transition">
            <FaImages className="text-xl" /> {/* İkonun boyutunu artırdık */}
            
          </button>


          {/* Save Butonu (Tam Ortalanmış) */}
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
