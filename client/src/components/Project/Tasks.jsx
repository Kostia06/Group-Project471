"use client";
import { useState, useEffect } from "react";
import { apiFetch, cn } from "@/lib/utils";
import { taskStruct, statusColors, fetchTasksSpeed } from "@/lib/consts";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { IoInformationCircleOutline } from "react-icons/io5";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useGlobalContext } from "@/containers/GlobalContext";


const Task = ({ task, i, tasks, setTasks }) => {
    const [color, setColor] = useState(statusColors[task.status]);

    const handleChangeStatus = async () => {
        const newStatus = task.status === "Pending" ? "In Progress" : task.status === "In Progress" ? "Completed" : "Pending";
        task.status = newStatus;
        await apiFetch('/tasks/update', { method: "POST", body: JSON.stringify(task) });
        let updatedTasks = [...tasks];
        updatedTasks[i] = task;
        setTasks(updatedTasks);
        setColor(statusColors[task.status]);
    }

    return (
        <div className="w-full h-full flex items-center p-2 space-x-2">
            <div>
                <button onClick={handleChangeStatus} className={
                    cn(
                        `rounded-full w-4 h-4`,
                        color === "red" && `bg-red-500`,
                        color === "yellow" && `bg-yellow-500`,
                        color === "green" && `bg-green-500`
                    )
                }
                />
            </div>
            <div className="flex flex-col mx-1 h-full w-full">
                <h1 className="text-xl truncate">{task.name}</h1>
                <p className="text-sm px-1 truncate">{task.description}</p>
            </div>
        </div>
    )

}




export default function Tasks() {
    const { currentProject } = useGlobalContext();
    const [tasks, setTasks] = useState([]);
    const [taskInfo, setTaskInfo] = useState(taskStruct);
    // Fetch tasks every second
    useEffect(() => {
        const fetchTasks = async () => {
            const lastTaskId = tasks.length != 0 ? tasks[tasks.length - 1].id : -1;
            const res = await apiFetch(`/tasks/getFromProject/${currentProject}/${lastTaskId}`, { method: "GET" });
            if (res.new)
                setTasks(res.data);
        };
        const interval = setInterval(fetchTasks, fetchTasksSpeed);
        return () => clearInterval(interval);
    }, [currentProject, tasks]);
    // Create a new task
    const handleCreateTask = async () => {
        if (!taskInfo.name)
            return toast("Please enter a task name");

        taskInfo.projectId = currentProject;
        setTaskInfo(taskInfo);
        await apiFetch("/tasks/create", { method: "POST", body: JSON.stringify(taskInfo) });
        // reset the task info
        setTaskInfo(taskStruct);
    }

    return (
        <Popover>
            <PopoverTrigger>
                <IoInformationCircleOutline className="w-10 h-10 m-2" />
            </PopoverTrigger>
            <PopoverContent className="w-96 h-fit p-2">
                <h1 className="text-3xl text-center p-2">All tasks</h1>
                <Separator className="h-2" />
                <ScrollArea className="w-full m-2 min-h-32 h-full flex flex-col">
                    {tasks.map((task, i) => (<Task task={task} key={i} i={i} tasks={tasks} setTasks={setTasks} />))}
                    {tasks.length === 0 && (
                        <div className="text-3xl text-center w-full h-32 flex items-center justify-center">
                            No tasks, Yet!
                        </div>
                    )}
                </ScrollArea>
                <div className="flex flex-col w-full">
                    <div className="flex items-center w-full">
                        <Input
                            className="color-input rounded-r-none"
                            placeholder="Task Name"
                            onChange={(e) => setTaskInfo({ ...taskInfo, name: e.target.value })}
                        />
                        <button onClick={handleCreateTask} className="btn rounded-l-none">
                            Add Task
                        </button>
                    </div>
                    <Textarea
                        className="w-full"
                        placeholder="Description"
                        onChange={(e) => setTaskInfo({ ...taskInfo, description: e.target.value })}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}
