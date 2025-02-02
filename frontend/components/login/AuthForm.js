import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { loginUser, registerUser } from "@/redux/slices/authSlice";

export default function AuthForm({ type }) {
  const isLogin = type === "login";
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      const result = await dispatch(loginUser({ email: formData.email, password: formData.password }));

      if (result.payload) {
        // Kullanıcı rolüne göre yönlendirme
        if (result.payload.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/home");
        }
      }
    } else {
      await dispatch(registerUser(formData));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 sm:px-10">
      <div className="flex w-full max-w-[1200px] items-center justify-center gap-0 flex-col lg:flex-row">
        {/* Form Kutusu */}
        <div className="w-full max-w-md bg-white border border-gray-300 rounded-[40px] p-12 shadow-lg">
          <h2 className="text-4xl font-bold text-purple-900 mb-10 text-center">
            {isLogin ? "Sign in to Postopia" : "Sign up to Postopia"}
          </h2>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                name="username"
                placeholder="Name"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-[#F8F9FF] border border-gray-200 rounded-full mb-4 focus:outline-none focus:ring-1 focus:ring-purple-300 text-sm text-black placeholder-gray-400"
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-[#F8F9FF] border border-gray-200 rounded-full mb-4 focus:outline-none focus:ring-1 focus:ring-purple-300 text-sm text-black placeholder-gray-400"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-[#F8F9FF] border border-gray-200 rounded-full mb-8 focus:outline-none focus:ring-1 focus:ring-purple-300 text-sm text-black placeholder-gray-400"
              required
            />

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#9747FF] text-white py-4 rounded-full hover:bg-purple-600 transition text-lg font-bold"
              disabled={loading}
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-lg text-gray-600 text-center">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              href={isLogin ? "/register" : "/login"}
              className="text-purple-900 text-lg font-semibold hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </Link>
          </p>
        </div>

        {/* Sağ Taraftaki İllüstrasyon (Tablet ve Mobilde Gizleniyor) */}
        <div className="hidden lg:block w-[700px]">
          <img
            src="/images/login.svg"
            alt="Auth Illustration"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
