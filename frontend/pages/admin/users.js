import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { useState } from "react";
import { FiSearch, FiCalendar, FiMoreVertical } from "react-icons/fi";

export default function Users() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(null);

  const users = [
    { id: 128574, name: "Alice", role: "Admin", email: "alice@gmail.com", date: "22.01.2025" },
    { id: 128574, name: "Alice", role: "User", email: "alice@gmail.com", date: "22.01.2025" },
    { id: 128574, name: "Alice", role: "User", email: "alice@gmail.com", date: "22.01.2025" },
    { id: 128574, name: "Alice", role: "User", email: "alice@gmail.com", date: "22.01.2025" },
  ];

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <div className="fixed top-0 left-0 w-full bg-white z-50 h-16 flex items-center">
          <Header />
        </div>

        <div className="ml-52 mt-16 flex-1 bg-[#F9FAFB] min-h-screen p-8">
          {/* Top Controls */}
          <div className="flex items-center justify-between mb-8">
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

            {/* Date Range */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 bg-white text-gray-700 hover:bg-gray-50">
              <span className="text-sm">08.01.2025 - 28.01.2025</span>
              <FiCalendar size={20} />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="px-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-4 font-bold text-primary text-lg">User ID</th>
                    <th className="text-left py-4 font-bold text-primary text-lg">Name</th>
                    <th className="text-left py-4 font-bold text-primary text-lg">Role</th>
                    <th className="text-left py-4 font-bold text-primary text-lg">E-mail</th>
                    <th className="text-left py-4 font-bold text-primary text-lg">Reg. Date</th>
                    <th className="text-right py-4 font-bold text-primary text-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 text-gray-900 font-medium">{user.id}</td>
                      <td className="py-4 text-gray-900">{user.name}</td>
                      <td className="py-4 text-gray-900">{user.role}</td>
                      <td className="py-4 text-gray-500">{user.email}</td>
                      <td className="py-4 text-gray-500">{user.date}</td>
                      <td className="py-4 relative text-right">
                        <button
                          className="text-gray-700 bg-white hover:text-gray-600"
                          onClick={() =>
                            setDropdownVisible(dropdownVisible === index ? null : index)
                          }
                        >
                          <FiMoreVertical size={20} />
                        </button>

                        {dropdownVisible === index && (
                          <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <ul className="py-1 text-gray-700">
                              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                Block
                              </li>
                              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                Delete
                              </li>
                              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700">
                                Make Admin
                              </li>
                            </ul>
                          </div>
                        )}
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
