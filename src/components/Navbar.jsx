"use client";
import { useGlobalContext } from "@/containers/GlobalContext";
import { FaArrowRightLong } from "react-icons/fa6";
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

const loggedIn = (user, setUser) => {
    return (
        <>
            <h1>logged in</h1>
        </>
    )
}



const logIn = () => {


    return (
        <Dialog>
            <DialogTrigger className="px-6 py-1 bg-prime rounded-full">
                Login
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center">
                <DialogHeader>
                    <DialogTitle className="text-center text-3xl">
                        Login
                    </DialogTitle>
                </DialogHeader>
                <Input className="w-60 placeholder:text-opacity-40 border-prime dark:border-prime border-2 " placeholder="username" />
                <Input className="w-60 placeholder:text-opacity-40  border-prime  dark:border-prime border-2" placeholder="password" />
            </DialogContent>

        </Dialog>
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


