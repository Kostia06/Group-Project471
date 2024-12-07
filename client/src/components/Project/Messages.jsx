"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/utils";
import { useGlobalContext } from "@/containers/GlobalContext";
import { avatarColors } from "@/lib/consts";
import { FaFile } from "react-icons/fa";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Image from "next/image";
import Avatar from "@/components/boringAvatars/index.js";

const ArraySocials = ({ socials }) => (
    <div className="flex flex-col py-2">
        {socials && socials.map((social, i) => {
            const parsedUrl = new URL(social);
            const name = parsedUrl.hostname
            return (
                <a key={i} href={data} className="text-xs">
                    {name}
                </a>
            )
        })}
    </div>
)


const ArrayCompanies = ({ companies }) => (
    <div className="flex flex-col py-2">
        {companies && companies.map((data, i) => (
            <h1 key={i} className="text-xs">
                {data}
            </h1>
        ))}
    </div>

)

const ArrayTechnologies = ({ technologies }) => (
    <div className="flex flex-col py-2">
        {technologies && technologies.map((data, i) => (
            <h1 key={i} className="text-xs">
                {data}
            </h1>
        ))}
    </div>
)


// Component for message from other 
const MessageFromOther = ({ fromUser, fromUserRoleData }) => (
    <>
        <div className="chat-header">
            <h1 className="font-bold text-lg">{fromUser.username}</h1>
        </div>
        <Popover>
            <PopoverTrigger className="chat-image">
                <Avatar
                    name={fromUser.username}
                    className="w-14 h-14"
                    colors={avatarColors}
                />
            </PopoverTrigger>
            <PopoverContent className="w-full h-full flex flex-col">
                <div className="flex flex-col items-center min-h-2">
                    <h1 className="font-bold text-3xl">
                        {fromUser.username}
                    </h1>
                    <p className="text-sm">({fromUser.role})</p>
                </div>
                <div className="flex items-center min-h-32 p-2">
                    <div className="flex flex-col min-h-32 w-full p-2">
                        <h1 className="text-xl">Socials</h1>
                        <ArraySocials socials={fromUser?.socials} />
                    </div>
                    <div className="flex flex-col min-h-32 w-full p-2">
                        <h1 className="text-xl">
                            {fromUser.role == "Developer" ? "Technologies" : "Companies"}
                        </h1>
                        {fromUser.role == "Developer"
                            ? <ArrayTechnologies technologies={fromUserRoleData?.technologies} />
                            : <ArrayCompanies companies={fromUserRoleData?.companies} />
                        }
                    </div>
                </div>
            </PopoverContent>
        </Popover >
    </>
)


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
const MessageFiles = ({ files, side }) => {
    return (
        <div className="w-fit h-fit bg-opacity-50 flex items-end">
            {files.map((file, j) => (
                <div key={`file-${j}`} className={side}>
                    {file.type.includes("image") ? <MessageImage file={file} /> : <MessageFile file={file} />}
                </div>
            ))}
        </div>
    )
}


// Message Component
const Message = ({ message }) => {
    const { user } = useGlobalContext();
    const [fromUser, setFromUser] = useState({});
    const [fromUserRoleData, setFromUserRoleData] = useState({});



    useEffect(() => {
        const handleGetFromUser = async () => {
            const res = await apiFetch(`/users/getByKey/id/${message.fromUser}`, { method: "GET" });
            setFromUser(res.data);
        }
        if (message)
            handleGetFromUser()
    }, [message]);

    useEffect(() => {
        const fetchUserRoleData = async () => {
            const res = await apiFetch(`/users/get/roleData/${fromUser.id}`, { method: "GET" });
            setFromUserRoleData(res.data);
        }
        if (fromUser?.id != null)
            fetchUserRoleData();
    }, [fromUser])

    if (!user || !fromUser || !fromUserRoleData)
        return null;

    const side = message.fromUser === user.id ? "chat chat-end p-2" : "chat chat-start m-2";
    const time = message.date.split(" ")[1];
    return (
        <div className={side}>
            {message.fromUser !== user.id && (
                <MessageFromOther fromUser={fromUser} fromUserRoleData={fromUserRoleData} />
            )}
            <div className="chat-bubble text-2xl">
                <MessageFiles files={message.files} side={side} />
                {message.description}
            </div>
            <p className="chat-footer text-lg">{time}</p>
        </div >
    );
};

export default function Messages({ messages }) {
    return (
        <div className="flex flex-col-reverse w-full h-full">
            {messages.map((message, i) => (
                <Message message={message} key={i} />
            ))}
        </div>
    );
}
