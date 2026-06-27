import SyncStatus from "./SyncStatus";
import { Link } from "react-router-dom";

function Header({ theme, setTheme, logout, syncStatus, showLogout = false }) {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 rounded-2xl shadow-sm border ${
        theme === "dark"
          ? "bg-[#111827] border-gray-800"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center gap-4">
        <img
          src="/pwa-192.png"
          alt="Tasky Logo"
          className="w-15 h-15 rounded-xl shadow"
        />
        <div>
          <h1 className="flex items-center text-3xl font-semibold tracking-tight">
            Tasky
            <SyncStatus syncStatus={syncStatus} />
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Organize your tasks cleanly and efficiently
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
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
        <Link
          to="/week"
          className={`px-4 py-2 rounded-xl transition ${
            theme === "dark"
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          📅 Week
        </Link>
        <Link
          to="/trash"
          className={`px-4 py-2 rounded-xl transition ${
            theme === "dark"
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-gray-200 hover:bg-gray-300"
          }
  `}
        >
          🗑 Trash
        </Link>

        {showLogout && (
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition active:scale-95"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
