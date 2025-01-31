import { useState } from "react";

export default function Tags() {
  // Etiket listesi
  const tags = ["Travel", "Health", "Sport", "Art", "Design", "Science"];
  
  // Seçilen etiketleri saklamak için state
  const [selectedTags, setSelectedTags] = useState([]);

  // Etiket seçme/toggle fonksiyonu
  const toggleTag = (tag) => {
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tag)
        ? prevSelected.filter((t) => t !== tag) // Eğer zaten seçiliyse kaldır
        : [...prevSelected, tag] // Seçili değilse ekle
    );
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-primary mb-4">Popular tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-all
                        ${selectedTags.includes(tag) 
                          ? "bg-primary text-white"  // Seçili ise primary ve beyaz
                          : "bg-gray-200 text-gray-700" // Seçilmemiş haldeyken gri
                        }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
