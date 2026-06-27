import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Trash from "./pages/Trash";
import Week from "./pages/Week";

import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import MainLayout from "./layouts/MainLayout";
import toast from "react-hot-toast";

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 100,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -100,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      {children}
    </motion.div>
  );
}
function App() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [syncStatus, setSyncStatus] = useState(
    navigator.onLine ? "online" : "offline",
  );
  //setup init and update theme
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const token = localStorage.getItem("token");
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");

    toast.success("Logged out");

    navigate("/login");
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          element={
            <MainLayout
              theme={theme}
              setTheme={setTheme}
              logout={logout}
              syncStatus={syncStatus}
            />
          }
        >
          <Route
            path="/login"
            element={
              <PageWrapper>
                <Login theme={theme} />
              </PageWrapper>
            }
          />

          <Route
            path="/register"
            element={
              <PageWrapper>
                <Register theme={theme} />
              </PageWrapper>
            }
          />

          <Route
            path="/"
            element={
              token ? (
                <PageWrapper>
                  <Home
                    theme={theme}
                    syncStatus={syncStatus}
                    setSyncStatus={setSyncStatus}
                  />
                </PageWrapper>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/trash"
            element={
              token ? (
                <PageWrapper>
                  <Trash theme={theme} />
                </PageWrapper>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/week"
            element={
              token ? (
                <PageWrapper>
                  <Week theme={theme} />
                </PageWrapper>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
