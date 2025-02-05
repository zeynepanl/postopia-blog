import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTags } from "@/redux/slices/tagSlice"; 
import { fetchBlogsByTags, setSelectedTags } from "@/redux/slices/blogSlice"; 

export default function Tags() {
  const dispatch = useDispatch();
  const tags = useSelector((state) => state.tag.tags) || []; // 🔥 Boş array vererek map hatasını önledik
  const selectedTags = useSelector((state) => state.blog.selectedTags) || []; 
  const loading = useSelector((state) => state.tag.loading);

  // Redux'tan gelen veriyi kontrol et
  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  useEffect(() => {
    console.log("🔥 Redux'tan Gelen Etiketler:", tags);
  }, [tags]); // Redux güncellenince log bas

  const toggleTag = (tag) => {
    let updatedTags;
    if (selectedTags.includes(tag)) {
      updatedTags = selectedTags.filter((t) => t !== tag);
    } else {
      updatedTags = [...selectedTags, tag];
    }

    console.log("🎯 Güncellenmiş Seçili Etiketler:", updatedTags);

    dispatch(setSelectedTags(updatedTags)); 
    dispatch(fetchBlogsByTags({ tags: updatedTags })); 
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-primary mb-4">Popular Tags</h3>
      {loading ? (
        <p>Loading...</p>
      ) : tags.length === 0 ? ( // Eğer hiç etiket yoksa mesaj göster
        <p className="text-gray-500">No tags found.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag.name);
            return (
              <button
                key={tag._id}
                onClick={() => toggleTag(tag.name)}
                className={`px-3 py-1 text-sm rounded-full border transition-all ${
                  isSelected
                    ? "bg-purple-600 text-white font-semibold border-purple-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-400"
                }`}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
