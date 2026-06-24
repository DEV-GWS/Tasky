function Header({ theme, setTheme, logout }) {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 rounded-2xl shadow-sm border ${
        theme === "dark"
          ? "bg-[#111827] border-gray-800"
          : "bg-white border-gray-200"
      }`}
    >
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Task Manager</h1>

        <p className="text-sm text-gray-500 mt-1">
          Organize your tasks cleanly and efficiently
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition active:scale-95"
        >
          Logout
        </button>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition active:scale-95 ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </div>
  );
}

export default Header;
