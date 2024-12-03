"use client";
import { avatarColors } from "@/lib/consts";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "@/components/ui/separator";
import Avatar from '@/components/boringAvatars/index.js';
import { useGlobalContext } from '@/containers/GlobalContext';

export default function JoinedProjects({ projects }) {
    const { setCurrentProject } = useGlobalContext();
    return (
        <ScrollArea className="h-full">
            {projects.map((project, i) => {
                return (
                    <button
                        key={i}
                        className="group p-3 flex flex-col w-full h-20 overflow-hidden"
                        onClick={() => setCurrentProject(project.id)}
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
            })}
        </ScrollArea>
    )
}
