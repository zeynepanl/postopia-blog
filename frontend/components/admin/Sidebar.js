import Link from "next/link";
import { FiUsers } from "react-icons/fi";
import { PiNotebook } from "react-icons/pi";
import { HiOutlineViewGrid } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";

export default function Sidebar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout()); // Redux store'dan çıkışı yap
    router.push("/login"); // Kullanıcıyı login sayfasına yönlendir
  };

  return (
    <div className="fixed left-0 top-16 w-56 h-[calc(100vh-4rem)] p-6 border-r border-gray-200 flex flex-col justify-between bg-white">
      {/* Menü Butonları */}
      <div className="space-y-6">
        {/* Dashboard */}
        <Link href="/admin" className="flex items-center gap-3 text-gray-900 font-medium hover:text-purple-600">
          <HiOutlineViewGrid className="w-5 h-5" />
          <span className="text-lg">Dashboard</span>
        </Link>

        {/* Blog Management */}
        <Link href="/admin/blogs" className="flex items-center gap-3 text-gray-900 hover:text-[#6941C6] font-medium">
          <PiNotebook className="w-5 h-5" />
          <span className="text-lg">Blog Management</span>
        </Link>

        {/* Users */}
        <Link href="/admin/users" className="flex items-center gap-3 text-gray-900 hover:text-[#6941C6] font-medium">
          <FiUsers className="w-5 h-5" />
          <span className="text-lg">Users</span>
        </Link>
      </div>

      {/* Çıkış Butonu */}
      <button 
        onClick={handleLogout} 
        className="flex items-center gap-3 bg-white text-gray-600 hover:text-[#6941C6] cursor-pointer"
      >
        <img src="/icons/logout.svg" alt="logout" className="w-6 h-6 cursor-pointer" />
        <span className="text-lg font-medium">Log Out</span>
      </button>
    </div>
  );
}
