import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBlog } from "../../redux/slices/blogSlice";
import { fetchTags, addTagAPI } from "../../api/tagAPI";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { FaImages } from "react-icons/fa";
import { IoReturnUpBackOutline } from "react-icons/io5";
import TextEditor from "./TextEditor"; 

export default function Modal({ onClose }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.blog);
  const { categories } = useSelector((state) => state.category);
  const fileInputRef = useRef(null);

  const [titleContent, setTitleContent] = useState("");
  const [bodyContent, setBodyContent] = useState("");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (token) {
      if (categories.length === 0) {
        dispatch(fetchCategories());
      }
      fetchTags(token)
        .then(setAvailableTags)
        .catch(error => console.error("Etiketleri alırken hata:", error));
    }
  }, [token, dispatch, categories.length]);

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const addTag = async () => {
    if (newTag.trim() !== "" && !availableTags.some(tag => tag.name === newTag)) {
      try {
        const response = await addTagAPI(newTag, token);
        if (response.success) {
          setAvailableTags([...availableTags, response.tag]);
          setSelectedTags([...selectedTags, response.tag._id]);
          setNewTag("");
          setShowTagInput(false);
        }
      } catch (error) {
        console.error("Etiket eklenirken hata:", error);
      }
    }
  };

  const handleImageSelect = (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert("Dosya boyutu 5MB'dan küçük olmalıdır.");
          return;
        }
        if (!file.type.startsWith("image/")) {
          alert("Lütfen sadece resim dosyası seçin.");
          return;
        }
        setSelectedImage(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        e.target.value = "";
      }
    } catch (error) {
      console.error("Resim seçme hatası:", error);
      alert("Resim seçilirken bir hata oluştu.");
    }
  };

  const handleGalleryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", titleContent);
      formData.append("content", bodyContent);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      if (selectedCategories.length > 0) {
        formData.append("categories", JSON.stringify(selectedCategories));
      }
      if (selectedTags.length > 0) {
        formData.append("tags", JSON.stringify(selectedTags));
      }
      // FormData kontrolü (opsiyonel)
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      await dispatch(addBlog({ blogData: formData, token }));
      setTitleContent("");
      setBodyContent("");
      setSelectedImage(null);
      setImagePreview(null);
      setSelectedCategories([]);
      setSelectedTags([]);
      onClose();
    } catch (error) {
      console.error("Blog oluşturma hatası:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-[600px] w-[700px] relative overflow-y-auto">
        <div className="flex items-center text-purple-700 dark:text-purple-300 font-semibold text-lg mb-4">
          <button onClick={onClose} className="mr-2 p-2 bg-white dark:bg-gray-700 text-black dark:text-white rounded-full transition">
            <IoReturnUpBackOutline />
          </button>
          <span className="text-primary">Create New Post</span>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="text-gray-700 dark:text-gray-200 font-semibold text-sm">Title</label>
          <div className="mb-4">
            <TextEditor
              value={titleContent} 
              onChange={setTitleContent}
              placeholder="Enter your post content here..."
            />
          </div>

          <label className="text-gray-700 dark:text-gray-200 font-semibold text-sm">Categories</label>
          <div className="grid grid-cols-3 gap-y-3 text-gray-700 dark:text-gray-200 mt-1 mb-4 text-sm">
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

          <label className="text-gray-700 dark:text-gray-200 font-semibold text-sm">Tags</label>
          <div className="flex flex-wrap items-center gap-2 mt-1 mb-4">
            {availableTags.map(tag => (
              <button
                key={tag._id}
                type="button"
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag._id)
                    ? "bg-purple-400 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                }`}
                onClick={() =>
                  setSelectedTags(prev =>
                    prev.includes(tag._id)
                      ? prev.filter(t => t !== tag._id)
                      : [...prev, tag._id]
                  )
                }
              >
                {tag.name}
              </button>
            ))}

            {!showTagInput && (
              <button
                type="button"
                onClick={() => setShowTagInput(true)}
                className="bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-400 dark:border-gray-600 px-3 py-1 rounded-md transition text-sm"
              >
                +
              </button>
            )}
          </div>

          {showTagInput && (
            <div className="flex items-center gap-1 mb-4">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 p-2 rounded text-sm text-black dark:text-white dark:bg-gray-700"
                placeholder="Add tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-purple-400 text-white px-3 py-1 rounded-lg text-sm"
              >
                Add
              </button>
            </div>
          )}

          <label className="text-gray-700 dark:text-gray-200 font-semibold text-sm">Content</label>
          <div className="mb-4">
            <TextEditor
              value={bodyContent} 
              onChange={setBodyContent}
              placeholder="Enter your post content here..."
            />
          </div>

          {imagePreview && (
            <div className="relative mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 w-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />

          <div className="flex items-center justify-between w-full mt-6 px-4">
            <button
              type="button"
              onClick={handleGalleryClick}
              className="flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
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
