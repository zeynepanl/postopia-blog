import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { FiSearch, FiCalendar, FiMoreVertical } from "react-icons/fi";
import { fetchUsers, deleteUser, blockUser, makeAdmin } from "@/redux/slices/usersSlice";

export default function Users() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const { token } = useSelector((state) => state.auth);
  const [dropdownVisible, setDropdownVisible] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchUsers(token));
    }
  }, [dispatch, token]);

  const handleDelete = (id) => {
    dispatch(deleteUser({ id, token }));
  };

  const handleBlock = (id, block) => {
    dispatch(blockUser({ id, block, token }));
  };

  const handleMakeAdmin = (id) => {
    dispatch(makeAdmin({ id, token }));
  };

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

            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 bg-white text-gray-700 hover:bg-gray-50">
              <span className="text-sm">08.01.2025 - 28.01.2025</span>
              <FiCalendar size={20} />
            </div>
          </div>

          {loading && (
            <p className="text-center text-gray-600">Kullanıcılar yükleniyor...</p>
          )}

          {error && (
            <p className="text-center text-red-500">{error}</p>
          )}

          {!loading && !error && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="px-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-4 font-bold text-primary text-lg">
                        User ID
                      </th>
                      <th className="text-left py-4 font-bold text-primary text-lg">
                        Name
                      </th>
                      <th className="text-left py-4 font-bold text-primary text-lg">
                        Role
                      </th>
                      <th className="text-left py-4 font-bold text-primary text-lg">
                        E-mail
                      </th>
                      <th className="text-left py-4 font-bold text-primary text-lg">
                        Reg. Date
                      </th>
                      <th className="text-right py-4 font-bold text-primary text-lg">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr
                        key={user._id || index}
                        className="border-b border-gray-50 hover:bg-gray-50 relative"
                      >
                        <td className="py-4 text-gray-900 font-medium">
                          {user._id}
                        </td>
                        <td className="py-4 text-gray-900">{user.username}</td>
                        <td className="py-4 text-gray-900">{user.role}</td>
                        <td className="py-4 text-gray-500">{user.email}</td>
                        <td className="py-4 text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-right relative">
                          <button
                            className="text-gray-700 bg-white hover:text-gray-600"
                            onClick={() =>
                              setDropdownVisible(
                                dropdownVisible === index ? null : index
                              )
                            }
                          >
                            <FiMoreVertical size={20} />
                          </button>

                          {dropdownVisible === index && (
                            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                              <ul className="py-1 text-gray-700">
                                <li
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleBlock(user._id, true)}
                                >
                                  Block
                                </li>
                                <li
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleBlock(user._id, false)}
                                >
                                  Unblock
                                </li>
                                <li
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleDelete(user._id)}
                                >
                                  Delete
                                </li>
                                <li
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleMakeAdmin(user._id)}
                                >
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
          )}
        </div>
      </div>
    </div>
  );
}
