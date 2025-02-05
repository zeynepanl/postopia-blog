import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slices/categorySlice";
import { fetchBlogsByCategory, setSelectedCategories } from "@/redux/slices/blogSlice";
export default function CategoryList() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);
  const selectedCategories = useSelector((state) => state.blog.selectedCategories) || []; 
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleToggle = (category) => {
    let updatedCategories;
    if (selectedCategories.includes(category)) {
      updatedCategories = selectedCategories.filter((c) => c !== category);
    } else {
      updatedCategories = [...selectedCategories, category];
    }
  
    console.log("Güncellenen Kategoriler:", updatedCategories); 
  
    dispatch(setSelectedCategories(updatedCategories));
    dispatch(fetchBlogsByCategory({ categories: updatedCategories }));
  };
  

  return (
    <div>
      <h3 className="text-lg font-semibold text-primary mb-4">Categories</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category._id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.name)}
                onChange={() => handleToggle(category.name)}
                className="w-4 h-4 rounded border-gray-300 focus:ring-0 checked:bg-primary checked:border-primary"
              />
              <span
                className={`transition-all ${
                  selectedCategories.includes(category.name)
                    ? "text-primary font-semibold"
                    : "text-gray-500"
                }`}
              >
                {category.name}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
