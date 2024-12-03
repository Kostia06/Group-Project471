"use client";
import { FaFile } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";


const RemoveFileButton = ({ file, i }) => {
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

}

const CollectFiles = ({ message }) => {
    message.files.map((_, i) => {
        const x = 4 * i;
        const opacity = 1 - i / message.files.length;
        return (
            <FaFile
                key={`file-icon-${i}`}
                className="w-8 h-8 absolute -left-10"
                style={{ transform: `translateX(-${x}px) translateY(${x}px)`, opacity }}
            />
        );
    })
}



// Component for File Options
export default function FileOptions({ message }) {
    return (
        <Popover>
            <PopoverTrigger className="flex items-center justify-center">
                <h1 className="absolute text-xl text-white dark:text-black opacity-90 -left-7 z-10">
                    {message?.files.length ? message.files.length : ""}
                </h1>
                <CollectFiles message={message} />
            </PopoverTrigger>
            <PopoverContent className="h-fit">
                <h1 className="text-2xl">Files</h1>
                <div className="flex justify-evenly flex-wrap w-full h-full">
                    {message.files.map((file, i) => { <RemoveFileButton file={file} i={i} /> })}
                </div>
            </PopoverContent>
        </Popover>
    );
};
