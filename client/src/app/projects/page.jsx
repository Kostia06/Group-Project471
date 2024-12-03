"use client"
import { useState, useEffect } from 'react';
import { useGlobalContext } from '@/containers/GlobalContext';
import { apiFetch } from '@/lib/utils';
import { avatarColors } from "@/lib/consts";
import Avatar from '@/components/boringAvatars/index.js';
import Project from '@/components/Project/Project';
import CreateProject from '@/components/Project/CreateProject';
import SearchProjects from '@/components/Project/SearchProjects';
import JoinedProjects from '@/components/Project/JoinedProjects';

const NoProjectSelected = () => {
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center text-4xl text-prime">
            <h1>Join any Project!</h1>
            <Avatar name="John" className="absolute top-2 left-2 w-40 h-40 avatar scale-125 hover:scale-150" colors={avatarColors} />
            <Avatar name="Rayan" className="absolute bottom-5 left-2 w-24 h-24 avatar" colors={avatarColors} />
            <Avatar name="Bob" className="absolute bottom-1/2 right-6 w-32 h-32 avatar" colors={avatarColors} />
            <div className="mask mask-star absolute w-16 h-16 bg-yellow-400 left-1/2 translate-x-20 top-3 -rotate-45 hover:scale-150 hover:rotate-90 smooth" />
            <div className="mask mask-star absolute w-24 h-24 bg-yellow-400 left-20 bottom-1/2 -rotate-45 hover:scale-150 hover:rotate-90 smooth" />
            <div className="mask mask-star absolute w-32 h-32 bg-yellow-400 bottom-24 rotate-45 hover:scale-150 hover:rotate-90 smooth" />
        </div>

    )
}

export default function ProjectsPage() {
    const { user, currentProject } = useGlobalContext();
    const [project, setProject] = useState([]);
    const [projects, setProjects] = useState([]);

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
        else
            setProjects([]);
    }, [user])


    return (
        <div className="flex w-full h-full overflow-hidden">
            <div className="h-full w-80 border-r-2 dark:border-zinc-800 border-sec">
                <div className="flex items-center w-full justify-evenly border-b-2 dark:border-zinc-800 border-sec h-20">
                    <h1 className="text-2xl">Projects</h1>
                    <CreateProject projects={projects} setProjects={setProjects} />
                </div>
                <SearchProjects projects={projects} setProjects={setProjects} />
                <JoinedProjects projects={projects} setProjects={setProjects} />
            </div>
            {(project === -1 || project === undefined)
                ? (<NoProjectSelected />)
                : (<Project />)
            }
        </div >
    )
}




