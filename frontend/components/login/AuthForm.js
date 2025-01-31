import Link from "next/link";

export default function AuthForm({ type }) {
  const isLogin = type === "login";

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 sm:px-10">
      <div className="flex w-full max-w-[1200px] items-center justify-center gap-0 flex-col lg:flex-row">
        {/* Form Kutusu */}
        <div className="w-full max-w-md bg-white border border-gray-300 rounded-[40px] p-12 shadow-lg">
          <h2 className="text-4xl font-bold text-purple-900 mb-10 text-center">
            {isLogin ? "Sign in to Postopia" : "Sign up to Postopia"}
          </h2>

          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              className="w-full px-6 py-4 bg-[#F8F9FF] border border-gray-200 rounded-full mb-4 focus:outline-none focus:ring-1 focus:ring-purple-300 text-sm text-black placeholder-gray-400"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full px-6 py-4 bg-[#F8F9FF] border border-gray-200 rounded-full mb-4 focus:outline-none focus:ring-1 focus:ring-purple-300 text-sm text-black placeholder-gray-400"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-6 py-4 bg-[#F8F9FF] border border-gray-200 rounded-full mb-8 focus:outline-none focus:ring-1 focus:ring-purple-300 text-sm text-black placeholder-gray-400"
          />

          <button className="w-full bg-[#9747FF] text-white py-4 rounded-full hover:bg-purple-600 transition text-lg font-bold">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>

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
