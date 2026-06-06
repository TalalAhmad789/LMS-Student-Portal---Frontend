import { useTheme } from "../contexts/ThemeContext";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    const isDark = theme === "dark" || theme === "black";

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <button onClick={toggleTheme} aria-label="Toggle Theme" className={`relative w-8 h-8 rounded-md flex items-center justify-center overflow-hidden transition-all duration-500 ease-in-out border shadow-lg hover:scale-105 active:scale-95 ${isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-gray-200"}`}>
            <div className={`absolute inset-0 transition-all duration-500 ${isDark ? "bg-gradient-to-br from-indigo-500/10 to-blue-500/10" : ""} `} />

            <HiOutlineSun
                size={18}
                className={`
                    absolute text-yellow-500
                    transition-all duration-500 ease-in-out
                    ${isDark
                        ? "opacity-0 rotate-180 scale-0"
                        : "opacity-100 rotate-0 scale-100"
                    }
                `}
            />

            <HiOutlineMoon
                size={18}
                className={`
                    absolute text-blue-400
                    transition-all duration-500 ease-in-out
                    ${isDark
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-180 scale-0"
                    }
                `}
            />
        </button>
    );
};

export default ThemeToggle;