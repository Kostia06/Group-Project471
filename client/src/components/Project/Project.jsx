"use client";
import { useState, useEffect } from "react";
import { useGlobalContext } from "@/containers/GlobalContext";
import { apiFetch } from "@/lib/utils";
import { fileSize, messageStruct, fetchMessageSpeed } from "@/lib/consts";
import { Input } from "@/components/ui/input";
import { FaFileUpload } from "react-icons/fa";
import { toast } from "sonner";
import { clean } from "@/lib/bad-words";
import FileOptions from "@/components/Project/FileOptions";
import Messages from "@/components/Project/Messages";
import Tasks from "@/components/Project/Tasks";


// Main Project Component
export default function Project() {
    const { user, currentProject } = useGlobalContext();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState(messageStruct);
    // Fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            const lastMsId = messages.length ? messages[messages.length - 1].id : -1;
            const res = await apiFetch(`/messages/getFromProject/${currentProject}/${lastMsId}`, { method: "GET" });
            if (res.new)
                setMessages(res.data);
        };

        if (currentProject) fetchMessages();
        const interval = setInterval(fetchMessages, fetchMessageSpeed);

        return () => clearInterval(interval);
    }, []);


    const handleFile = async (e) => {
        const newFiles = [...message.files];
        const filePromises = [];
        for (const file of e.target.files) {
            // Limit file size
            if (file.size > fileSize)
                return toast(`File "${file.name}" too large`);
            // Limit to 5 files per message
            if (newFiles.length >= 5)
                return toast("Max 5 files per message");
            // Read file
            filePromises.push(
                new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve({ name: file.name, size: file.size, type: file.type, content: reader.result });
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

    const handleSendMessage = async (e) => {
        if (e.key !== "Enter")
            return;

        message.description = e.target.value;
        setMessage(message);

        if (!message.description && !message.files.length)
            return toast("Please enter a message");

        const updatedMessage = {
            ...message,
            fromUser: user.id,
            projectId: currentProject,
            description: clean(message.description),
        };

        try {
            await apiFetch("/messages/create", { method: "POST", body: JSON.stringify(updatedMessage) });
            setMessage({ ...message, description: "", files: [], date: "" });
            e.target.value = "";
        }
        catch (error) {
            toast("Failed to send message");
        }
    };




    return (
        <div className="flex flex-col w-full h-full">
            <div className="w-full h-14 flex items-center justify-end">
                <Tasks />
            </div>
            <div className="w-full h-full flex flex-col overflow-y-auto space-y-5">
                <Messages messages={messages} />
            </div>
            <div className="w-full h-24 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                    <FileOptions message={message} setMessage={setMessage} />
                    <Input
                        className="color-input min-w-80"
                        placeholder="Message"
                        onKeyDown={handleSendMessage}
                    />
                    <input id="file" type="file" className="hidden" onChange={handleFile} multiple />
                    <label htmlFor="file" className="m-2 cursor-pointer">
                        <FaFileUpload className="w-8 h-8" />
                    </label>
                </div>
            </div>
        </div >
    );
}

