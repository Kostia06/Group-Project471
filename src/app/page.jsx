"use client";
import React from "react";
import { useGlobalContext } from "@/containers/GlobalContext";
import { Input } from "@/ui/input"

export default function Home() {
    const { user, setUser } = useGlobalContext();
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <h1 className="text-sky-500 font-bold text-3xl">
                {user}
            </h1>
            <Input onChange={(e) => setUser(e.target.value)} className="w-62" placeholder="User" />

        </div>
    );
}
