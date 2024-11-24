"use client";
import { useGlobalContext } from "@/containers/GlobalContext";
import { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import Avatar from "@/components/boringAvatars/index.js"
import { colors } from "@/lib/utils"
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
    // password requirments 
    const [passReq, setPassReq] = useState(
        { "Must contain at least 1 letter": false, },
        { "Must contain at least 1 number": false, },
        { "Must contain at least 12 characters": false }
    );




    return (
        <>
            <h1>logged in</h1>
        </>
    )
}



const logIn = () => {
    const inputCSS = `
        w-60 h-12
        placeholder:text-lg
        placeholder:text-opacity-40
        focus:border-prime dark:focus:border-prime
        border-slate-300 dark:border-white
        focus:border-2 border-2
        focus-visible:ring-0
        peer 
    `;



    return (
        <Dialog>
            <DialogTrigger className="px-6 py-1 bg-prime rounded-full">
                Login
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center">
                <DialogHeader>
                    <DialogTitle className="text-center text-4xl py-4">
                        Login
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <Input className={inputCSS} placeholder="username" />
                </div>
                <div>
                    <Input className={inputCSS} placeholder="password" type="password" />
                </div>
                <button className="smooth hover:text-prime text-lg font-bold">
                    Login
                </button>
                <DialogFooter className="w-full flex items-end ">
                    <button className=" smooth hover:text-prime font-bold">
                        Create Account
                    </button>
                </DialogFooter>
                <Avatar name="Sunwoo" className="absolute -top-2 -left-2 w-16 h-16" colors={colors} />
                <Avatar name="Divya" className="absolute bottom-5 left-2 w-16 h-16 " colors={colors} />
                <Avatar name="Kostia" className="absolute bottom-1/2 right-6 w-16 h-16" colors={colors} />
                <div className="mask mask-star absolute w-8 h-8 bg-yellow-400 left-1/2 translate-x-8 top-6 -rotate-45"></div>
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

            <input type="checkbox" className="toggle dark:[--tglbg:black] [--tglbg:white] border-0 bg-prime hover:bg-prime outline  outline-offset-2  dark:outline-white outline-black outline-2 toggle-md" onClick={changeTheme} />
        </div>
    );
}


