import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Comments, CreateComment } from "./Comments";
import { avatarColors } from "@/lib/consts";
import Avatar from '@/components/boringAvatars/index.js';

const Post = ({ post }) => {
    return (
        <Dialog>
            <DialogTrigger className="flex flex-col min-w-32 min-h-20 max-w-96 max-h-96 dark:bg-zinc-900 bg-sec rounded-lg m-2">
                <h1 className="text-xl text-center m-2">
                    {post.name}
                </h1>
                <div className="w-full h-full text-xs p-4">
                    {post.description}
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
        <div className="flex flex-wrap items-start justify-start gap-4">
            {posts.map((post, index) => (<Post key={index} post={post} />))}
        </div>
    )
}

