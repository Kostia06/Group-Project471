"use client";
import { useGlobalContext } from "@/containers/GlobalContext";


export default function NavBar() {
    const { user, setUser, theme, themeMode } = useGlobalContext();


    return (
        <nav className="fixed top-0 left-0 flex items-center">
        </nav>
    );
}


