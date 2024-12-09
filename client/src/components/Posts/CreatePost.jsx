import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useGlobalContext } from "@/containers/GlobalContext";
import { postStruct, tagStruct } from "@/lib/consts";
import { apiFetch } from "@/lib/utils";
import { toast } from "sonner"



export default function CreatePost() {
    const { user } = useGlobalContext();
    const [post, setPost] = useState(postStruct);
    const [tag, setTag] = useState(tagStruct);
    // connectProjectId

    const handleCreatePost = async () => {
        if (!user)
            return toast("Please log in to create a post");
        if (!post.name)
            return toast("Please enter a post name");
        setPost({ ...post, owner: user.id });
        setTag({ ...tag, postId: post.id });
        const res = await apiFetch(`/posts/create`, { method: "POST", body: JSON.stringify(post) });
        tag.postId = res.id;
        setTag(tag);
        await apiFetch(`/tags/create`, { method: "POST", body: JSON.stringify(tag) });
        setPost(postStruct);
        toast(res.message);
    }

    const handleTags = (e) => {
        if (e.target.value === "")
            setTag({ ...tag, values: [] });
        else
            setTag({ ...tag, values: e.target.value.split(" ") });
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
                <div className="flex flex-col w-full h-fit space-y-2">
                    <div className="flex items-center w-full p-0">
                        <Input
                            className="color-input rounded-r-none border-r-0 "
                            placeholder="Post Name"
                            onChange={(e) => setPost({ ...post, name: e.target.value })}
                        />
                        <button
                            className="btn rounded-l-none border-l-0 p-1"
                            onClick={handleCreatePost}
                        >
                            Create Post
                        </button>
                    </div>
                    <Input
                        className="color-input min-w-full"
                        placeholder="Tags"
                        onChange={handleTags}
                    />
                    <div className="flex flex-wrap">
                        {tag.values.map((tag, i) => (
                            <h1 key={i} className="px-2 dark:bg-zinc-800 bg-senc rounded-lg">
                                #{tag}
                            </h1>
                        ))}
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
