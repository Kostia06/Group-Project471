"use client";
import { useState, useEffect } from "react";
import { useGlobalContext } from "@/containers/GlobalContext";
import { apiFetch } from "@/lib/utils";
import { avatarColors } from "@/lib/consts";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "@/components/ui/separator";
import Avatar from "@/components/boringAvatars/index.js";

const Project = ({ projects, setProjects, setSearch, project }) => {
    const { user, setCurrentProject } = useGlobalContext();
    const handleJoin = async () => {
        const res = await apiFetch(`/projects/join/${project.id}/${user.id}`, { method: "GET" });
        if (!res.joined)
            setProjects([...projects, res.data]);
        setCurrentProject(project.id);
        setSearch("");
        toast(res.message);
    }
    return (
        <button
            className="group p-3 flex flex-col w-full h-20 overflow-hidden"
            onClick={handleJoin}
        >
            <div className="flex">
                <Avatar name={project.name} className="w-16 h-16 group-hover:scale-[9] smooth duration-1000" colors={avatarColors} variant="marble" />
                <div className="w-full h-full flex items-center justify-center">
                    <h1 className="font-bold">{project.name}</h1>
                </div>
            </div>
            <Separator className="h-2 rounded-full dark:bg-zinc-800 bg-sec" />
        </button>
    )
}


export default function SearchProjects({ projects, setProjects }) {
    const [search, setSearch] = useState("");
    const [searchProjects, setSearchProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const res = await apiFetch(`/projects/find/${search}`, { method: "GET" });
            setSearchProjects(res.data);
        }
        if (search)
            fetchProjects();
    }, [search])


    const handleSearch = (e) => {
        setSearch(e.target.value);
        if (!e.target.value)
            setSearchProjects([]);
    }

    return (

        <div className="w-full max-h-32 flex flex-col">
            <Input
                className="border-x-0 rounded-none focus-visible:ring-0"
                placeholder=" Search"
                onChange={handleSearch}
            />
            <ScrollArea className="max-h-full min-h-0 w-full">
                {searchProjects.map((project, i) => (
                    <Project key={i} projects={projects} setProjects={setProjects} project={project} setSearch={setSearch} />
                ))}
            </ScrollArea>
        </div>
    )
}
