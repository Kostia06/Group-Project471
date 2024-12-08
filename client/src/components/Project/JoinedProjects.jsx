"use client";
import { useState, useEffect } from "react";
import { avatarColors } from "@/lib/consts";
import { apiFetch } from "@/lib/utils";
import Avatar from '@/components/boringAvatars/index.js';
import { useGlobalContext } from '@/containers/GlobalContext';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

const Project = ({ project }) => {
    const [tags, setTags] = useState([]);
    const { setCurrentProject } = useGlobalContext();

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

    return (
        <HoverCard>
            <HoverCardTrigger>
                <button
                    className="group p-3 flex flex-col w-full h-20 overflow-hidden border-b-2 dark:border-zinc-800 border-sec"
                    onClick={() => setCurrentProject(project.id)}
                >
                    <div className="flex flex-col h-full w-full">
                        <div className="flex h-full w-full">
                            <Avatar name={project.name} className="w-16 h-16 group-hover:scale-[9] smooth duration-1000" colors={avatarColors} variant="marble" />
                            <div className="w-full h-full flex items-center justify-center">
                                <h1 className="font-bold">{project.name}</h1>
                            </div>
                        </div>

                    </div>
                </button>
            </HoverCardTrigger>
            <HoverCardContent>
                <div className="flex flex-wrap overflow-y-scroll w-full h-full">
                    {tags.map((tag, i) => (
                        <div key={i} className="m-1 p-1 bg-sec dark:bg-zinc-800 rounded-lg text-small">
                            #{tag}
                        </div>
                    ))}
                </div>
            </HoverCardContent>
        </HoverCard>
    )

}

export default function JoinedProjects({ projects }) {
    return (
        <div className="h-full overflow-y-scroll">
            {projects.map((project, i) => <Project key={i} project={project} />)}
        </div>
    )
}
