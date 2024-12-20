import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Comments, CreateComment } from "./Comments";
import { apiFetch } from "@/lib/utils";
import { useEffect, useState } from "react";

const Post = ({ post }) => {
    const [tags, setTags] = useState([]);
    useEffect(() => {
        const fetchTags = async () => {
            const res = await apiFetch(`/posts/get/tags/${post.id}`);
            if (res.data.length !== 0)
                setTags(res.data[0].values);
            else
                setTags([]);
        }
        fetchTags();
    }, [post])

    return (
        <Dialog>
            <DialogTrigger className="flex flex-col min-w-32 min-h-20 max-w-96 max-h-96 dark:bg-zinc-900 bg-sec rounded-lg m-2">
                <h1 className="text-xl text-center m-4">
                    {post.name}
                </h1>
                {post.description && (
                    <div className="w-full h-full text-xs text-start p-4 bg-zinc-800 rounded-b-lg">
                        {post.description}
                    </div>
                )}
                <div className="flex flex-wrap w-full h-fit">
                    {tags.map((tag, i) => (
                        <div key={i} className="m-1 p-1 bg-sec dark:bg-zinc-800 rounded-lg">
                            #{tag}
                        </div>
                    ))}
                </div>
            </DialogTrigger>
            <DialogContent className="">
                <DialogTitle className="text-2xl text-center">
                    {post.name}
                </DialogTitle>
                <Tabs>
                    <TabsContent value="Details">
                        <div className="w-full h-full text-sm p-4 bg-sec dark:bg-zinc-900 rounded-lg my-2">
                            {post.description}
                        </div>
                        <div className="flex flex-wrap w-full h-fit">
                            {tags.map((tag, i) => (
                                <div key={i} className="m-1 p-1 bg-sec dark:bg-zinc-800 rounded-lg">
                                    #{tag}
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="Comments">
                        <Comments postId={post.id} />
                        <CreateComment postId={post.id} />
                    </TabsContent>
                    <div className="w-full flex items-center justify-center py-4">
                        <TabsList className="absolute bottom-0 m-2 py-6 px-2">
                            <TabsTrigger value="Details" className="text-lg font-bold">
                                Details
                            </TabsTrigger>
                            <TabsTrigger value="Comments" className="text-lg font-bold">
                                Comments
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog >
    )
}




export default function Posts({ posts, setPosts }) {
    return (
        <div className="flex flex-wrap items-start justify-start overflow-y-scroll gap-4">
            {posts.map((post, index) => (<Post key={index} post={post} />))}
        </div>
    )
}

