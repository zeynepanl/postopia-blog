import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { useState } from "react";
import { FiSearch, FiFilter, FiCalendar, FiEdit, FiTrash } from "react-icons/fi";

export default function BlogManagement() {
  const [filterOpen, setFilterOpen] = useState(false);
  const categories = [
    { name: "Travel", count: 120 },
    { name: "Technology", count: 120 },
    { name: "Art", count: 120 },
    { name: "Education", count: 120 },
  ];

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar />

      <div className="flex-1">
        <div className="fixed top-0 left-0 w-full bg-white z-50 h-16 flex items-center">
          <Header />
        </div>

        {/* Main Content */}
        <div className="ml-52 mt-16 flex-1 bg-[#F9FAFB] min-h-screen p-8">
          {/* Top Controls */}
          <div className="flex items-center justify-between mb-8 relative">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-[400px] px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-600 bg-white text-gray-700 pl-10"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiSearch size={20} />
              </span>
            </div>

            <div className="flex items-center gap-3 relative">
              {/* Filter Button */}
              <button
                className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <span className="text-sm">Filter by</span>
                <FiFilter size={16} />
              </button>

              {/* Dropdown Menüsü (Sadece Görünüm) */}
              {filterOpen && (
                <div className="absolute top-full mt-2 left-0 w-36 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <button className="w-full px-4 py-2 text-gray-900 bg-white hover:bg-gray-200">Category</button>
                  <button className="w-full px-4 py-2 text-gray-900 bg-white hover:bg-gray-200">Post</button>
                  <button className="w-full px-4 py-2 text-gray-900 bg-white hover:bg-gray-200">Comment</button>
                </div>
              )}

              {/* Date Range */}
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 bg-white text-gray-700 hover:bg-gray-50">
                <span className="text-sm">08.01.2023 - 28.01.2023</span>
                <FiCalendar size={20} />
              </div>
            </div>
          </div>

          {/* Categories Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            {/* Table Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <button className="text-primary bg-white border border-gray-300 font-medium">
                New Category +
              </button>
            </div>

            {/* Table Content */}
            <div className="px-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-4 font-bold text-primary text-lg">
                      Category
                    </th>
                    <th className="text-left py-4 font-bold text-primary text-lg">
                      Number of blog
                    </th>
                    <th className="text-right py-4 font-bold text-primary text-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 text-gray-900 font-medium">{category.name}</td>
                      <td className="py-4 text-gray-500">{category.count}</td>
                      <td className="py-4">
                        <div className="flex justify-end gap-3">
                          <button className="text-gray-700 bg-white hover:text-gray-600">
                            <FiEdit size={20} />
                          </button>
                          <button className="text-gray-700 bg-white hover:text-gray-600">
                            <FiTrash size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
