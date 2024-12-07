"use client";
import { useState, useEffect } from "react";
import { useGlobalContext } from "@/containers/GlobalContext";
import { apiFetch } from "@/lib/utils";
import { avatarColors } from "@/lib/consts";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import Avatar from "@/components/boringAvatars/index.js";

const Project = ({ projects, setProjects, setSearch, project }) => {
    const { user, setCurrentProject } = useGlobalContext();
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchTags = async () => {
            const res = await apiFetch(`/projects/get/tags/${project.id}`);
            if (res.data.length !== 0)
                setTags(res.data[0].values);
            else
                setTags([]);
        }
        fetchTags();
    }, [project])

    const handleJoin = async () => {
        const res = await apiFetch(`/projects/join/${project.id}/${user.id}`, { method: "GET" });
        if (!res.joined)
            setProjects([...projects, res.data]);
        setCurrentProject(project.id);
        setSearch("");
        toast(res.message);
    }


    return (
        <HoverCard>
            <HoverCardTrigger>
                <button
                    className="group p-3 flex flex-col w-full h-20 overflow-hidden border-b-2 dark:border-zinc-800 border-sec"
                    onClick={handleJoin}
                >
                    <div className="flex flex-col h-fit w-full">
                        <div className="flex h-fit w-full">
                            <Avatar name={project.name} className="w-16 h-16 group-hover:scale-[9] smooth duration-1000" colors={avatarColors} variant="marble" />
                            <div className="w-full h-full flex items-center justify-center">
                                <h1 className="font-bold">{project.name}</h1>
                            </div>
                        </div>

                    </div>
                </button>
            </HoverCardTrigger>
            <HoverCardContent>
                <div className="flex overflow-x-scroll w-full">
                    {tags.map((tag, i) => (
                        <div key={i} className="m-1 p-1 bg-sec dark:bg-zinc-800 rounded-lg">
                            #{tag}
                        </div>
                    ))}
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}


export default function SearchProjects({ projects, setProjects }) {
    const { user } = useGlobalContext();
    const [search, setSearch] = useState("");
    const [searchProjects, setSearchProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const res = await apiFetch(`/projects/find/${search}/${user.id}`, { method: "GET" });
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

        <div className="w-full max-h-32 flex flex-col overflow-y-scroll  border-b-2 border-zinc-800">
            <Input
                className="border-x-0 border-y-2 py-2 rounded-none focus-visible:ring-0"
                placeholder=" Search"
                onChange={handleSearch}
            />
            <div className="max-h-full min-h-0 w-full">
                {searchProjects.map((project, i) => (
                    <Project key={i} projects={projects} setProjects={setProjects} project={project} setSearch={setSearch} />
                ))}
            </div>
        </div>
    )
}
