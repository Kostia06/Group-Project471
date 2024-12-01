"use client";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "@/containers/GlobalContext";
import { apiFetch, fileSize, colors } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FaFileUpload, FaFile } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { toast } from "sonner";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Image from "next/image";
import { IoInformationCircleOutline } from "react-icons/io5";
import Avatar from "@/components/boringAvatars/index.js";
import { ScrollArea } from "@radix-ui/react-scroll-area";

// Component for File Options
const FileOptions = ({ message, setMessage }) => {
    return (
        <Popover>
            <PopoverTrigger className="flex items-center justify-center">
                <h1 className="absolute text-xl text-white dark:text-black opacity-90 -left-7 z-10">
                    {message?.files.length ? message.files.length : ""}
                </h1>
                {message?.files?.map((_, i) => {
                    const x = 4 * i;
                    const opacity = 1 - i / message.files.length;
                    return (
                        <FaFile
                            key={`file-icon-${i}`}
                            className="w-8 h-8 absolute -left-10"
                            style={{ transform: `translateX(-${x}px) translateY(${x}px)`, opacity }}
                        />
                    );
                })}
            </PopoverTrigger>
            <PopoverContent className="h-fit">
                <h1 className="text-2xl">Files</h1>
                <div className="flex justify-evenly flex-wrap w-full h-full">
                    {message.files.map((file, i) => {
                        const name = file.name.length > 20 ? file.name.slice(0, 20) + "..." : file.name;

                        const handleRemove = () => {
                            const updatedFiles = [...message.files];
                            updatedFiles.splice(i, 1);
                            setMessage({ ...message, files: updatedFiles });
                        };

                        return (
                            <button
                                key={`file-${i}`}
                                className="w-fit h-fit mx-3 my-1 p-1 relative text-lg group flex items-center justify-center"
                                onClick={handleRemove}
                            >
                                <IoMdClose className="group-hover:text-red-500 smooth" />
                                {name}
                            </button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
};

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
);

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
);

// Message Component
const Message = ({ user, message, index }) => {
    const side = message.fromUser === user?.id ? "chat chat-end p-2" : "chat chat-start m-2";
    const time = message.date.split(" ")[1];
    const [fromUser, setFromUser] = useState({});


    const handleGetFromUser = async () => {
        const res = await apiFetch(`/users/getById/${message.fromUser}`, { method: "GET" });
        setFromUser(res.data);
    }

    useEffect(() => {
        handleGetFromUser();
    }, []);


    return (
        <div key={index} className={side}>
            {message.fromUser !== user.id && (
                <>
                    <div className="chat-header">
                        <h1 className="font-bold text-lg">{fromUser.username}</h1>
                    </div>
                    <Avatar
                        name={fromUser.username}
                        className="chat-image w-14 h-14"
                        colors={colors}
                    />
                </>
            )}
            <div className="chat-bubble bg-zinc-800 text-2xl">
                <div className="w-fit h-fit bg-opacity-50 bg-zinc-800 flex items-end">
                    {message.files.map((file, j) => (
                        <div key={`file-${j}`} className={side}>
                            {file.type.includes("image") ? <MessageImage file={file} /> : <MessageFile file={file} />}
                        </div>
                    ))}

                </div>
                {message.description}
            </div>


            <p className="chat-footer text-lg">{time}</p>
        </div>
    );
};

// Main Project Component
export default function Project() {
    const { user, currentProject } = useGlobalContext();
    const [messages, setMessages] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [message, setMessage] = useState({
        fromUser: user?.id,
        toUser: "",
        project: user?.project,
        files: [],
        description: "",
        date: "",
        projectId: -1,
    });


    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const lastMessageId = messages.length ? messages[messages.length - 1].id : -1;
                const res = await apiFetch(`/messages/getFromProject/${currentProject}/${lastMessageId}`, { method: "GET" });
                if (res.new)
                    setMessages(res.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        if (currentProject) fetchMessages();
        const interval = setInterval(fetchMessages, 500);

        return () => clearInterval(interval);
    }, []);

    const handleFile = async (e) => {
        const newFiles = [...message.files];
        const filePromises = [];

        for (const file of e.target.files) {
            if (file.size > fileSize) {
                toast(`File "${file.name}" too large`);
                return;
            }

            if (newFiles.length >= 5) {
                toast("Max 5 files per message");
                return;
            }

            filePromises.push(
                new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () =>
                        resolve({ name: file.name, size: file.size, type: file.type, content: reader.result });
                    reader.onerror = () => toast(`Failed to read file "${file.name}"`);
                    file.type.startsWith("image/") || file.type.startsWith("video/")
                        ? reader.readAsDataURL(file)
                        : reader.readAsText(file);
                })
            );
        }

        try {
            const processedFiles = await Promise.all(filePromises);
            setMessage({ ...message, files: [...newFiles, ...processedFiles] });
        }
        catch (error) {
            toast(error.message || "Failed to process files");
        }
    };

    const handleMessage = async (e) => {
        if (e.key !== "Enter") return;

        message.description = e.target.value;
        setMessage(message);

        if (!message.description && !message.files.length) {
            toast("Please enter a message");
            return;
        }

        const d = new Date();
        const updatedMessage = {
            ...message,
            date: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`,
            projectId: currentProject,
        };

        try {
            await apiFetch("/messages/create", { method: "POST", body: JSON.stringify(updatedMessage) });
            setMessage({ ...message, description: "", files: [], date: "" });
            e.target.value = "";
        } catch (error) {
            toast("Failed to send message");
        }
    };

    return (
        <div className="flex flex-col w-full h-full">
            <div className="w-full h-14 flex items-center justify-end">
                <Popover>
                    <PopoverTrigger>
                        <IoInformationCircleOutline className="w-10 h-10 m-2" />
                    </PopoverTrigger>
                    <PopoverContent className="w-96 h-96 p-2">
                        <h1 className="text-3xl text-center">All tasks</h1>
                        <ScrollArea className="w-full h-full flex">
                            {tasks.map((task, i) => (
                                <div key={`task-${i}`} className="w-full h-20 flex items-center justify-center">
                                    <h1 className="text-2xl">{task.name}</h1>
                                </div>
                            ))}
                        </ScrollArea>

                    </PopoverContent>
                </Popover>
            </div>
            <div className="w-full h-full flex flex-col-reverse overflow-y-auto space-y-5">
                {messages.map((message, i) => (
                    <Message key={`msg-${i}`} user={user} message={message} index={i} />
                ))}
            </div>
            <div className="w-full h-24 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                    <FileOptions message={message} setMessage={setMessage} />
                    <Input
                        className="color-input min-w-80"
                        placeholder="Message"
                        onKeyDown={handleMessage}
                    />
                    <input id="file" type="file" className="hidden" onChange={handleFile} multiple />
                    <label htmlFor="file" className="m-2 cursor-pointer">
                        <FaFileUpload className="w-8 h-8" />
                    </label>
                </div>
            </div>
        </div>
    );
}

