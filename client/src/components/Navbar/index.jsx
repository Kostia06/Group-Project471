"use client";
import { useState, useEffect } from "react";
import { useGlobalContext } from '@/containers/GlobalContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { avatarColors } from "@/lib/consts";
import Avatar from '@/components/boringAvatars/index.js';
import { SettingsProfile, SettingsAccount } from "./Settings"
import { RegisterSignUp, RegisterLogIn } from "./Register"
import { FaFolder } from "react-icons/fa";
import { BsPostcard } from "react-icons/bs";
import { IoIosLogIn } from "react-icons/io";
import { MdAdminPanelSettings } from "react-icons/md";

export default function NavBar() {
    const { user } = useGlobalContext();
    const [open, setOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    // pages
    const [currPage, setCurrPage] = useState(0);
    const pages = [
        {
            tittle: "Sign Up / Log In",
            trigger: <h1 className="btn rounded-full w-16 h-16 p-2"><IoIosLogIn className="w-full h-full" /></h1>,
            tabs: [
                { name: "Log In", component: <RegisterLogIn setOpen={setOpen} /> },
                { name: "Sign Up", component: <RegisterSignUp setOpen={setOpen} /> },
            ],
        },
        {
            tittle: "Settings",
            trigger: <Avatar name={user?.username} className="w-16 h-16 m-2 avatar" colors={avatarColors} />,
            tabs: [
                { name: "Profile", component: <SettingsProfile setOpen={setOpen} /> },
                { name: "Account", component: <SettingsAccount /> },
            ],
        }
    ]

    const links = [
        { icon: <FaFolder className="w-full h-full dark:text-white text-slate-400" />, name: "/projects" },
        { icon: <BsPostcard className="w-full h-full dark:text-white text-slate-400" />, name: "/posts" },
    ];

    // Change the pages based on if the user if login or not
    useEffect(() => {
        if (user) {
            setCurrPage(1);
            setIsAdmin(user.isAdmin);
            return
        }
        setCurrPage(0);
        setIsAdmin(false);

    }, [user])


    return (
        <div className="flex flex-col items-center space-y-5 h-full p-2 border-r-2 dark:border-zinc-800 border-sec">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                    {pages[currPage].trigger}
                </DialogTrigger>
                <DialogContent className="h-[95dvh] w-[90dvh]">
                    <DialogHeader className="absolute w-full flex items-center top-7">
                        <DialogTitle className="w-full text-center text-5xl">
                            {pages[currPage].tittle}
                        </DialogTitle>
                    </DialogHeader>
                    <Tabs className="flex flex-col items-center w-full h-full">
                        {pages[currPage].tabs.map(({ name, component }, index) => {
                            return (
                                <TabsContent className="w-full h-full" value={name} key={index}>
                                    {component}
                                </TabsContent>
                            )
                        })}
                        <TabsList className="absolute bottom-0 m-2 py-6 px-2">
                            {pages[currPage].tabs.map(({ name }, index) => {
                                return (
                                    <TabsTrigger value={name} key={index} className="text-lg font-bold">
                                        {name}
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>
                    </Tabs>
                    <Avatar name="Sunwoo" className="absolute -top-2 -left-2 w-16 h-16 avatar scale-125 hover:scale-150" colors={avatarColors} />
                    <Avatar name="Divya" className="absolute bottom-5 left-2 w-16 h-16 avatar" colors={avatarColors} />
                    <Avatar name="Kostia" className="absolute bottom-1/3 right-1 w-16 h-16 scale-75 avatar" colors={avatarColors} />
                    <div className="mask mask-star absolute w-8 h-8 bg-yellow-400 left-1/2 translate-x-20 top-3 -rotate-45 hover:scale-150 hover:rotate-90 smooth" />
                </DialogContent>
            </Dialog>
            {links.map(({ icon, name }, index) => {
                return (
                    <a key={index} href={name} className="btn p-2 flex items-center justify-center rounded-lg w-14 h-14">
                        {icon}
                    </a>
                )
            })}
            {isAdmin && (
                <a href="/admin" className="btn p-2 flex items-center justify-center rounded-lg w-14 h-14">
                    <MdAdminPanelSettings className="w-full h-full dark:text-white text-slate-400" />
                </a>
            )}
        </div >
    );
}
