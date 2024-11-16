"use client";
import React from "react";
import { useGlobalContext } from "@/containers/GlobalContext";


export default function Home() {
    const { user, userSet } = useGlobalContext();
    return (
        <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-sky-500 font-bold text-3xl">
                {user}
            </h1>
        </div>
    );
}
