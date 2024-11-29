"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useGlobalContext } from '@/containers/GlobalContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { colors } from '@/lib/utils';
import Avatar from '@/components/boringAvatars/index.js';
import { SettingsProfile, SettingsAccount, SettingsEducation } from "./Settings"
import { RegisterSignUp, RegisterLogIn } from "./Register"


export default function NavBar() {
    const { user, setUser } = useGlobalContext();


    // pages
    const [currPage, setCurrPage] = useState(0);
    const pages = [
        {
            tittle: "Sign Up / Log In",
            trigger: <h1 className="px-6 py-1 bg-prime rounded-full">Log In</h1>,
            tabs: [
                { name: "Log In", component: <RegisterLogIn /> },
                { name: "Sign Up", component: <RegisterSignUp /> },
            ],
        },
        {
            tittle: "Settings",
            trigger: <Avatar name={user?.username} className="w-16 h-16" colors={colors} />,
            tabs: [
                { name: "Profile", component: <SettingsProfile /> },
                { name: "Account", component: <SettingsAccount /> },
                { name: "Education", component: <SettingsEducation /> },
            ],
        }
    ]

    useEffect(() => {
        if (user)
            setCurrPage(1);
        else
            setCurrPage(0);
    }, [user])


    return (
        <div className="absolute top-4 left-4 flex items-center" >
            <Dialog>
                <DialogTrigger>
                    {pages[currPage].trigger}
                </DialogTrigger>
                <DialogContent className="h-5/6">
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
                        <TabsList className="absolute bottom-0 m-2 py-6 px-2 bg-blue-200">
                            {pages[currPage].tabs.map(({ name }, index) => {
                                return (
                                    <TabsTrigger value={name} key={index} className="text-lg font-bold">
                                        {name}
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>
                    </Tabs>
                    <Avatar name="Sunwoo" className="absolute -top-2 -left-2 w-16 h-16" colors={colors} />
                    <Avatar name="Divya" className="absolute bottom-5 left-2 w-16 h-16 " colors={colors} />
                    <Avatar name="Kostia" className="absolute bottom-1/2 right-6 w-16 h-16" colors={colors} />
                    <div className="mask mask-star absolute w-8 h-8 bg-yellow-400 left-1/2 translate-x-20 top-3 -rotate-45" />
                </DialogContent>
            </Dialog>
        </div >
    );
}
