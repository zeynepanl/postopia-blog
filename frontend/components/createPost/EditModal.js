import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBlog } from "../../redux/slices/blogSlice"; 
import { fetchTags, addTagAPI } from "../../api/tagAPI"; 
import { fetchCategories } from "../../redux/slices/categorySlice"; 
import { FaImages } from "react-icons/fa";
import { IoReturnUpBackOutline } from "react-icons/io5";

export default function EditModal({ post, onClose }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.category); 
  const [availableTags, setAvailableTags] = useState([]);

  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [selectedCategories, setSelectedCategories] = useState(
    Array.isArray(post?.categories) 
      ? post.categories.map((cat) => (typeof cat === "object" ? cat._id : cat))
      : []
  );
  const [selectedTags, setSelectedTags] = useState(
    Array.isArray(post?.tags) 
      ? post.tags.map((t) => (typeof t === "object" ? t._id : t))
      : []
  );

  const [newTag, setNewTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);

  
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
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

 
  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
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

  
  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedBlog = {
      id: post._id,
      title,
      content,
      categories: selectedCategories,
      tags: selectedTags,
    };

    dispatch(updateBlog({ blogData: updatedBlog, token }))
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
        <div className="flex items-center text-purple-700 font-semibold text-lg mb-4">
          <button onClick={onClose} className="mr-2 p-2 bg-white text-black rounded-full transition">
            <IoReturnUpBackOutline />
          </button>
          <span className="text-primary">Update Post</span>
        </div>

        <form onSubmit={handleUpdate}>
          <label className="text-gray-700 font-semibold text-sm">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mt-1 mb-4 text-black"
            required
          />

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

          <label className="text-gray-700 font-semibold text-sm">Tags</label>
          <div className="flex flex-wrap items-center gap-2 mt-1 mb-4">
            {availableTags.map(tag => (
              <button
                key={tag._id}
                type="button"
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag._id) ? "bg-purple-400 text-white" : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => toggleTag(tag._id)}
              >
                {tag.name}
              </button>
            ))}

            {!showTagInput && (
              <button
                type="button"
                onClick={() => setShowTagInput(true)}
                className="bg-white text-black border border-gray-400 px-3 py-1 rounded-md transition text-sm"
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
                className="border border-gray-300 p-2 rounded text-sm text-black"
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

          <label className="text-gray-700 font-semibold text-sm">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mt-1 mb-4 h-32 text-black"
            placeholder="Update your post content..."
            required
          ></textarea>

          <div className="flex items-center justify-between w-full mt-6 px-4">
            <button className="flex items-center justify-center w-12 h-12 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-100 transition">
              <FaImages className="text-xl" />
            </button>
            <div className="flex-1 flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-400 text-white rounded-lg font-semibold hover:bg-purple-500 transition"
              >
                Update Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
