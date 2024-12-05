import { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useGlobalContext } from "@/containers/GlobalContext";
import { postStruct, avatarColors } from "@/lib/consts";
import { apiFetch } from "@/lib/utils";
import { toast } from "sonner"



export default function CreatePost() {
    const { user } = useGlobalContext();
    const [post, setPost] = useState(postStruct);
    // connectProjectId

    const handleCreatePost = async () => {
        if (!user)
            return toast("Please log in to create a post");
        if (!post.name)
            return toast("Please enter a post name");
        post.owner = user.id;
        const res = await apiFetch(`/posts/create`, { method: "POST", body: JSON.stringify(post) });
        setPost(postStruct);
        toast(res.message);
    }

    return (
        <Popover>
            <PopoverTrigger className="absolute top-0 right-0 p-2">
                <IoMdAdd className="text-4xl cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
                <h1 className="text-2xl text-center">
                    Create Post
                </h1>
                <div className="flex flex-col w-full space-y-4">
                    <div className="flex items-center w-full">
                        <Input
                            className="color-input rounded-r-none border-r-0"
                            placeholder="Task Name"
                            onChange={(e) => setPost({ ...post, name: e.target.value })}
                        />
                        <button
                            className="btn rounded-l-none border-l-0"
                            onClick={handleCreatePost}
                        >
                            Create Post
                        </button>
                    </div>
                    <Textarea
                        className="w-full"
                        placeholder="Description"
                        onChange={(e) => setPost({ ...post, description: e.target.value })}
                    />
                </div>
            </PopoverContent>
        </Popover>

    )

}
