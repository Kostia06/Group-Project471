"use client";
import { useGlobalContext } from "@/containers/GlobalContext";
import { FaArrowRightLong } from "react-icons/fa6";

const loggedIn = (user, setUser) => {
    return (
        <>
            <h1>logged in</h1>
        </>
    )
}



const logIn = () => {
    const redirectToLoginUp = () => {

    }




    return (
        <>
            <button className="px-6 py-1 bg-prime rounded-full " onClick={redirectToLoginUp}>
                Login
            </button>

        </>
    )
}





export default function NavBar() {
    const { user, setUser, theme, changeTheme, clearLocalStorage } = useGlobalContext();
    const debug = false;


    const toggleTheme = () => {
        themeMode();
    }

    return (
        <div className="fixed top-4 left-4 flex items-center space-x-4">
            {user ? loggedIn(user, setUser) : logIn()}

            {debug &&
                <button className="bg-red" onClick={clearLocalStorage}>
                    clear local storage
                </button>
            }

            <input type="checkbox" className="theme-toggle" onClick={changeTheme} />
        </div>
    );
}


