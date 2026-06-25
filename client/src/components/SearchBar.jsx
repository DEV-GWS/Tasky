import { useEffect, useRef } from "react";

function SearchBar({ search, setSearch, sort, setSort, theme }) {
  const searchRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/") {
        e.preventDefault();

        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <div
      className={`p-5 rounded-2xl border flex flex-col md:flex-row gap-3 ${
        theme === "dark"
          ? "bg-[#111827] border-gray-800"
          : "bg-white border-gray-200"
      }`}
    >
      <input
        type="text"
        placeholder="Search tasks... ( / )"
        value={search}
        ref={searchRef}
        onChange={(e) => setSearch(e.target.value)}
        className={`flex-1 p-3 rounded-lg outline-none transition ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      />

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className={`p-3 rounded-lg outline-none transition ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <option value="manual">Manual</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="priority">Priority</option>
        <option value="dueDate">Due Date</option>
      </select>
    </div>
  );
}

export default SearchBar;
