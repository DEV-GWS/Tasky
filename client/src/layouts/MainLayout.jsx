import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";

function MainLayout({ theme, setTheme, logout, syncStatus }) {
  const location = useLocation();
  const isAuthPage =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#0b0f19] text-white"
          : "bg-[#f6f7fb] text-gray-900"
      }`}
    >
      <div>
        <Header
          theme={theme}
          setTheme={setTheme}
          logout={logout}
          syncStatus={syncStatus}
          showLogout={!isAuthPage}
        />
        <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
