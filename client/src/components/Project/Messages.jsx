"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/utils";
import { useGlobalContext } from "@/containers/GlobalContext";
import { avatarColors } from "@/lib/consts";
import { FaFile } from "react-icons/fa";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Image from "next/image";
import Avatar from "@/components/boringAvatars/index.js";


// Component for rendering a file
const MessageFile = ({ file }) => (
    <a
        href={file.content}
        download={file.name}
        className="text-center text-2xl flex *:text-blue-500 *:underline space-x-2"
    >
        <FaFile className="w-8 h-8" />
        <h1>{file.name}</h1>
    </a>
)


// Component for rendering an image
const MessageImage = ({ file }) => (
    <Popover>
        <PopoverTrigger>
            <Image src={file.content} alt={file.name} width={0} height={0} className="w-24 h-auto" />
        </PopoverTrigger>
        <PopoverContent className="w-96 h-96 p-2">
            <a href={file.content} download={file.name}>
                <Image src={file.content} alt={file.name} layout="fill" objectFit="contain" />
            </a>
        </PopoverContent>
    </Popover>
)

// Component for all files 
const MessageFiles = ({ files, side }) => (
    <div className="w-fit h-fit bg-opacity-50 flex items-end">
        {files.map((file, j) => (
            <div key={`file-${j}`} className={side}>
                {file.type.includes("image") ? <MessageImage file={file} /> : <MessageFile file={file} />}
            </div>
        ))}
    </div>
)


// Message Component
const Message = ({ message }) => {
    const { user } = useGlobalContext();
    const [fromUser, setFromUser] = useState({});
    const handleGetFromUser = async () => {
        const res = await apiFetch(`/users/getById/${message.fromUser}`, { method: "GET" });
        setFromUser(res.data);
    }
    useEffect(() => { handleGetFromUser() }, []);

    if (!user)
        return null;

    const side = message.fromUser === user.id ? "chat chat-end p-2" : "chat chat-start m-2";
    const time = message.date.split(" ")[1];
    return (
        <div className={side}>
            {message.fromUser !== user.id && (
                <>
                    <div className="chat-header">
                        <h1 className="font-bold text-lg">{fromUser.username}</h1>
                    </div>
                    <Avatar
                        name={fromUser.username}
                        className="chat-image w-14 h-14"
                        colors={avatarColors}
                    />
                </>
            )}
            <div className="chat-bubble text-2xl">
                <MessageFiles files={message.files} side={side} />
                {message.description}
            </div>
            <p className="chat-footer text-lg">{time}</p>
        </div>
    );
};

export default function Messages({ messages }) {
    return (
        <div className="flex flex-col w-full h-full">
            {messages.map((message, i) => (
                <Message message={message} key={i} />
            ))}
        </div>
    );
}
