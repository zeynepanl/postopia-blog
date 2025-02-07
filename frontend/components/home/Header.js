import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSearchedBlogs, resetSearchResults } from "@/redux/slices/blogSlice";
import { FaSearch } from "react-icons/fa";

export default function Header() {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [theme, setTheme] = useState(() => {
    // Sunucu tarafında window olmayacağından, typeof kontrolü yapıyoruz.
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  // Tema değiştiğinde <html> elementine dark sınıfını ekleyip kaldır ve localStorage'a kaydet.
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    if (value.trim() === "") {
      dispatch(resetSearchResults());
    } else {
      dispatch(fetchSearchedBlogs({ title: value }));
    }
  };

  return (
    <header className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-8 h-16 flex items-center justify-between">
        {/* Solda: Profil ikonu ve Ay ikonu */}
        <div className="flex items-center gap-5">
          <img
            src="/icons/profile.svg"
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer"
          />
          <img
            src="/icons/dark.svg"
            alt="Dark Mode"
            className="w-6 h-6 cursor-pointer"
            onClick={toggleTheme}
          />
        </div>

        {/* Sağ: Arama ve Postopia */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchInput}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-48 bg-gray-50 dark:bg-gray-700 rounded-full text-sm shadow-sm focus:ring-1 focus:border-gray-50 dark:focus:border-gray-600 text-black dark:text-white placeholder-gray-400"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch />
            </span>
          </div>
          <span className="text-4xl font-semibold text-primary">Postopia</span>
        </div>
      </div>
    </header>
  );
}
