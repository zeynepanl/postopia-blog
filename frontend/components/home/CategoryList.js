import { useState } from "react";

export default function CategoryList() {
  const categories = ["Technology", "Travel", "Education", "Science"];

  // Seçili kategorileri saklamak için state
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Checkbox değişim fonksiyonu
  const toggleCategory = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category) // Zaten seçiliyse kaldır
        : [...prevSelected, category] // Seçili değilse ekle
    );
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-primary mb-4">Categories</h3>
      <div className="space-y-3">
        {categories.map((category) => (
          <label key={category} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => toggleCategory(category)}
              className="w-4 h-4 rounded border-gray-300 focus:ring-0
                        checked:bg-primary checked:border-primary"
            />
            <span
              className={`transition-all ${
                selectedCategories.includes(category) ? "text-primary font-semibold" : "text-gray-500"
              }`}
            >
              {category}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
