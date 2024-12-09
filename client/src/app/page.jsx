"use client";
import Avatar from '@/components/boringAvatars/index.js';
import { avatarColors } from "@/lib/consts";

export default function Home() {

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center text-4xl text-prime">
            <h1 className="text-5xl font-bold">Welcome to DevCollab</h1>
            <Avatar name="John" className="absolute top-2 left-2 w-40 h-40 avatar scale-125 hover:scale-150" colors={avatarColors} />
            <Avatar name="Rayan" className="absolute bottom-5 left-2 w-24 h-24 avatar" colors={avatarColors} />
            <Avatar name="Bob" className="absolute bottom-1/2 right-6 w-32 h-32 avatar" colors={avatarColors} />
            <div className="mask mask-star absolute w-16 h-16 bg-yellow-400 left-1/2 translate-x-20 top-3 -rotate-45 hover:scale-150 hover:rotate-90 smooth" />
            <div className="mask mask-star absolute w-24 h-24 bg-yellow-400 left-20 bottom-1/2 -rotate-45 hover:scale-150 hover:rotate-90 smooth" />
            <div className="mask mask-star absolute w-32 h-32 bg-yellow-400 bottom-24 rotate-45 hover:scale-150 hover:rotate-90 smooth" />
        </div>

    )
}
