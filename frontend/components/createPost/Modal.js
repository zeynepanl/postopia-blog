import { useState } from "react";
import { FaImages } from "react-icons/fa";
import { IoReturnUpBackOutline } from "react-icons/io5";

export default function Modal({ onClose }) {
  const [tags, setTags] = useState([
    "Travel",
    "Art",
    "Tourism",
    "Vacation Guide",
    "Explore",
  ]);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim() !== "" && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
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

        {/* Başlık Alanı */}
        <label className="text-gray-700 font-semibold text-sm">Title</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded mt-1 mb-4 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
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

        {/* Tag Alanı */}
        <label className="text-gray-700 font-semibold text-sm">Tags</label>
        {/* Tags Bölümü */}
        <label className="text-gray-700 font-semibold text-sm">Tags</label>
        <div className="flex flex-wrap items-center gap-2 mt-1 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bggray-100 border border-gray-300 rounded-full text-sm text-gray-600"
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
          className="w-full border border-gray-300 p-2 rounded mt-1 mb-4 h-32 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
          placeholder=""
        ></textarea>

        <div className="flex items-center justify-between w-full mt-6 px-4">
          {/* Galeri Butonu */}
          <button className="flex items-center justify-center w-12 h-12 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-100 transition">
            <FaImages className="text-xl" /> {/* İkonun boyutunu artırdık */}
            
          </button>

          {/* Publish Post Butonu (Tam Ortalanmış) */}
          <div className="flex-1 flex justify-center">
            <button className="px-6 py-2 bg-purple-400 text-white rounded-lg font-semibold hover:bg-purple-500 transition">
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
