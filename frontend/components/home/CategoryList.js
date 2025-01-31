export default function CategoryList() {
    const categories = ["Technology", "Travel", "Education", "Science"];
  
    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                disabled
                className="w-4 h-4 rounded border-gray-300 text-gray-300 transition-all hover:text-[#9747FF]"
              />
              <span className="text-gray-500 transition-all hover:text-[#9747FF]">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  }