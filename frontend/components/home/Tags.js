import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTags } from "@/redux/slices/tagSlice"; 
import { fetchBlogsByTags, setSelectedTags } from "@/redux/slices/blogSlice"; 

export default function Tags() {
  const dispatch = useDispatch();
  const tags = useSelector((state) => state.tag.tags);
  const selectedTags = useSelector((state) => state.blog.selectedTags) || []; 
  const loading = useSelector((state) => state.tag.loading);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const toggleTag = (tag) => {
    let updatedTags;
    if (selectedTags.includes(tag)) {
      updatedTags = selectedTags.filter((t) => t !== tag);
    } else {
      updatedTags = [...selectedTags, tag];
    }

    console.log("Redux Seçili Etiketler:", updatedTags);

    dispatch(setSelectedTags(updatedTags)); 
    dispatch(fetchBlogsByTags({ tags: updatedTags }));
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-primary mb-4">Popular Tags</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag.name); 
            return (
              <button
                key={tag._id}
                onClick={() => toggleTag(tag.name)}
                className={`px-3 py-1 text-sm rounded-full transition-all ${
                  isSelected
                    ? "bg-purple-600 text-white font-semibold" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
