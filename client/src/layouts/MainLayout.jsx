import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";

function MainLayout({ theme, setTheme, logout, syncStatus }) {
  const location = useLocation();
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#0b0f19] text-white"
          : "bg-[#f6f7fb] text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <Header
          theme={theme}
          setTheme={setTheme}
          logout={logout}
          syncStatus={syncStatus}
          showLogout={location.pathname === "/"}
        />

        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
