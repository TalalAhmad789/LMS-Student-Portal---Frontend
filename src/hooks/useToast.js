import { useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";
import { useTheme } from "../contexts/ThemeContext";
import Swal from "sweetalert2";

export const useToast = () => {
    const getTheme = () => {
        if (document.documentElement.classList.contains("dark")) return "dark";
        return "light";
    };

    const [theme, setTheme] = useState(getTheme);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setTheme(getTheme());
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    const isDark = theme === "dark";

    const showSuccessToast = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: isDark ? "dark" : "light",
            transition: Bounce,
        });
    };

    const showErrorToast = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: isDark ? "dark" : "light",
            transition: Bounce,
        });
    };

    const showConfimationToast = async (CBT) => {
        return await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: CBT,
            theme: isDark ? "dark" : "light"
        });
    }

    return { showSuccessToast, showErrorToast, showConfimationToast };
};