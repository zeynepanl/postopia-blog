export default function Tags() {
    // Görselde "Travel" 3 kez tekrar ediyor, sonra "Art" ve yine "Travel" 2 kez. Toplam 6 etiket.
    const tags = ["Travel", "Travel", "Travel", "Art", "Travel", "Travel"];
  
    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Popular tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-all hover:bg-[#6B46C1] hover:text-white cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }
  