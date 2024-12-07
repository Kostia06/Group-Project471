"use client"
import { useState } from 'react';
import { avatarColors, tagStruct } from "@/lib/consts";
import { IoMdAdd } from "react-icons/io";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import Avatar from '@/components/boringAvatars/index.js';
import { toast } from "sonner";
import { apiFetch } from "@/lib/utils";
import { useGlobalContext } from '@/containers/GlobalContext';

export default function CreateProject({ projects, setProjects }) {
    const { user } = useGlobalContext();
    const [projectName, setProjectName] = useState("");
    const [tag, setTag] = useState(tagStruct);

    const handleCreateProject = async () => {
        if (!projectName)
            return toast("Please enter a project name");
        if (!user)
            return toast("Please log in to create a project");
        const res = await apiFetch(`/projects/create`, { method: "POST", body: JSON.stringify({ name: projectName, owner: user.id, users: [user.id] }) });
        tag.projectId = res.data.id;
        setTag({ ...tag, projectId: res.data.id });
        await apiFetch(`/tags/create`, { method: "POST", body: JSON.stringify(tag) });
        setProjects([...projects, res.data]);
        setProjectName("");
        setTag(tagStruct);
        toast(res.message);
    }



    const handleTags = (e) => {
        if (e.target.value === "") {
            tag.values = []
            setTag({ ...tag });
            return
        }
        tag.values = e.target.value.split(" ")
        setTag({ ...tag });
    }



    return (
        <Popover>
            <PopoverTrigger className="btn border-0 w-12 h-12 p-2">
                <IoMdAdd className="w-full h-full" />
            </PopoverTrigger>
            <PopoverContent className="w-72 h-full flex flex-col items-center space-y-4">
                <Avatar className="w-16 h-16" name={projectName} variant="marble" colors={avatarColors} />
                <h1 className="text-2xl p-2">Create a new Project</h1>
                <Input
                    className="color-input"
                    placeholder="Project Name"
                    onChange={(e) => setProjectName(e.target.value)}
                />
                <Input
                    className="color-input min-w-full"
                    placeholder="Tags"
                    onChange={handleTags}
                />
                <div className="flex flex-wrap space-x-2">
                    {tag.values.map((tag, i) => (
                        <h1 key={i} className="px-2 dark:bg-zinc-800 bg-senc rounded-lg">
                            #{tag}
                        </h1>
                    ))}
                </div>
                <button className="btn" onClick={handleCreateProject}>
                    Create
                </button>
            </PopoverContent>
        </Popover>
    )
}
