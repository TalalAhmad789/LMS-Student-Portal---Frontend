import { useTheme } from "../hooks/useTheme";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {

    const { theme, setTheme } = useTheme();

    return (
        // <button
        //     onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        //     className="p-2 rounded-lg border"
        // >
        //     {theme === "dark" ? "🌙" : "☀️"}
        // </button>
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 
  bg-white dark:bg-gray-800 
  shadow-sm hover:shadow-md
  hover:bg-gray-100 dark:hover:bg-gray-700
  transition-colors duration-200"
        >
            {theme === "dark" ? (
                <FaMoon className="text-yellow-400 text-md" />
            ) : (
                <FaSun className="text-orange-500 text-md" />
            )}
        </button>

    );
}

export default ThemeToggle