"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import { useGlobalContext } from '@/containers/GlobalContext';
import { apiFetch, colors } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { IoMdAdd } from "react-icons/io";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Avatar from '@/components/boringAvatars/index.js';
import Project from './project';

export default function ProjectsPage() {
    const { user, currentProject, setCurrentProject } = useGlobalContext();
    const [project, setProject] = useState([]);
    const [projects, setProjects] = useState([]);
    const [searchProjects, setSearchProjects] = useState([]);
    const [projectName, setProjectName] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        setProject(currentProject);
    }, [currentProject])

    useEffect(() => {
        const fetchProjects = async () => {
            const res = await apiFetch(`/projects/getFromUser/${user.id}`, { method: "GET" });
            setProjects(res.data);
        }
        if (user)
            fetchProjects();
    }, [user])

    useEffect(() => {
        const fetchProjects = async () => {
            const res = await apiFetch(`/projects/find/${search}`, { method: "GET" });
            setSearchProjects(res.data);
        }
        if (search)
            fetchProjects();
    }, [search])

    const handleCreateProject = async () => {
        if (!projectName)
            return toast("Please enter a project name");
        if (!user)
            return toast("Please log in to create a project");
        const res = await apiFetch(`/projects/create`, { method: "POST", body: JSON.stringify({ name: projectName, owner: user.id, users: [user.id] }) });
        setProjects([...projects, res.data]);
        setProjectName("");
        toast(res.message);
    }

    return (
        <div className="flex w-full h-full overflow-hidden">
            <div className="h-full w-80 border-r-2 dark:border-zinc-800 border-sec">
                <div className="flex items-center w-full justify-evenly border-b-2 dark:border-zinc-800 border-sec h-20">
                    <h1 className="text-2xl">Projects</h1>
                    <Popover>
                        <PopoverTrigger className="btn border-0 w-12 h-12 p-2">
                            <IoMdAdd className="w-full h-full" />
                        </PopoverTrigger>
                        <PopoverContent className="w-72 h-full flex flex-col items-center space-y-4">
                            <Avatar className="w-16 h-16" name={projectName} variant="marble" colors={colors} />
                            <h1 className="text-2xl p-2">Create a new Project</h1>
                            <Input
                                className="color-input"
                                placeholder="Project Name"
                                onChange={(e) => setProjectName(e.target.value)}
                            />

                            <button className="btn" onClick={handleCreateProject}>
                                Create
                            </button>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="w-full max-h-32 flex flex-col">
                    <Input
                        className="border-x-0 rounded-none focus-visible:ring-0"
                        placeholder=" Search"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <ScrollArea className="max-h-full min-h-0 w-full">
                        {searchProjects.map((project, i) => {
                            const handleJoin = async () => {
                                const res = await apiFetch(`/projects/join/${project.id}/${user.id}`, { method: "GET" });
                                setProjects([...projects, res.data]);
                                setCurrentProject(project.id);
                                setSearch("");
                                toast(res.message);
                            }
                            return (
                                <button
                                    key={i}
                                    className="group p-3 flex flex-col w-full h-20 overflow-hidden"
                                    onClick={handleJoin}
                                >
                                    <div className="flex">
                                        <Avatar name={project.name} className="w-16 h-16 group-hover:scale-[9] smooth duration-1000" colors={colors} variant="marble" />
                                        <div className="w-full h-full flex items-center justify-center">
                                            <h1 className="font-bold">{project.name}</h1>
                                        </div>
                                    </div>
                                    <Separator className="h-2 rounded-full dark:bg-zinc-800 bg-sec" />
                                </button>
                            )
                        })}
                    </ScrollArea>
                </div>
                <ScrollArea className="h-full">
                    {projects.map((project, i) => {

                        return (
                            <button
                                key={i}
                                className="group p-3 flex flex-col w-full h-20 overflow-hidden"
                                onClick={() => setCurrentProject(project.id)}
                            >
                                <div className="flex">
                                    <Avatar name={project.name} className="w-16 h-16 group-hover:scale-[9] smooth duration-1000" colors={colors} variant="marble" />
                                    <div className="w-full h-full flex items-center justify-center">
                                        <h1 className="font-bold">{project.name}</h1>
                                    </div>
                                </div>
                                <Separator className="h-2 rounded-full dark:bg-zinc-800 bg-sec" />
                            </button>
                        )
                    })}
                </ScrollArea>
            </div>
            {(project === -1 || project === undefined)
                ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center text-4xl text-prime">
                        <h1>Join any Project!</h1>
                        <Avatar name="John" className="absolute top-2 left-2 w-40 h-40 avatar scale-125 hover:scale-150" colors={colors} />
                        <Avatar name="Rayan" className="absolute bottom-5 left-2 w-24 h-24 avatar" colors={colors} />
                        <Avatar name="Bob" className="absolute bottom-1/2 right-6 w-32 h-32 avatar" colors={colors} />
                        <div className="mask mask-star absolute w-16 h-16 bg-yellow-400 left-1/2 translate-x-20 top-3 -rotate-45 hover:scale-150 hover:rotate-90 smooth" />
                        <div className="mask mask-star absolute w-24 h-24 bg-yellow-400 left-20 bottom-1/2 -rotate-45 hover:scale-150 hover:rotate-90 smooth" />
                        <div className="mask mask-star absolute w-32 h-32 bg-yellow-400 bottom-24 rotate-45 hover:scale-150 hover:rotate-90 smooth" />
                    </div>
                )
                : (
                    <Project />
                )
            }


        </div >
    )

}




