import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { commentStruct, fetchCommentsSpeed, avatarColors } from '@/lib/consts';
import { useGlobalContext } from '@/containers/GlobalContext';
import { apiFetch } from '@/lib/utils';
import { clean } from '@/lib/bad-words';
import { toast } from 'sonner';
import Avatar from '@/components/boringAvatars/index.js';


const Comment = ({ comment }) => {
    const [fromUser, setFromUser] = useState(null);
    useEffect(() => {
        const fetchFromUser = async () => {
            const res = await apiFetch(`/users/getById/${comment.fromUser}`, { method: "GET" });
            setFromUser(res.data);
        }
        fetchFromUser();
    }, [])
    if (!fromUser)
        return <></>;

    return (
        <div className="flex space-x-2 bg-sec dark:bg-zinc-900 w-fit p-2 my-2 rounded-lg">
            <Avatar name={fromUser.username} className="w-8 h-8" colors={avatarColors} />
            <div className="flex flex-col">
                <h1 className="text-xl">{fromUser.username}</h1>
                <h1 className="text-sm m-1">{comment.description}</h1>
            </div>
        </div>
    )
}


export const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    useEffect(() => {
        const fetchComments = async () => {
            const lastCommentId = comments.length ? comments[comments.length - 1].id : 0;
            const res = await apiFetch(`/posts/get/comments/${postId}/${lastCommentId}`, { method: "GET" });
            if (res.new)
                setComments(res.data);
        }
        const interval = setInterval(fetchComments, fetchCommentsSpeed);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="w-full min-h-32 max-h-96 overflow-y-scroll">
            {comments.map((comment, i) => (
                <Comment key={i} comment={comment} />
            ))}
        </div>
    )
}

export const CreateComment = ({ postId }) => {
    const [comment, setComment] = useState(commentStruct);
    const { user } = useGlobalContext();

    const handleCreateComment = async (e) => {
        if (e.key !== "Enter")
            return;

        comment.description = e.target.value;
        setComment(comment);

        if (!comment.description && !comment.files.length)
            return toast("Please enter a comment");

        const updatedComment = {
            ...comment,
            fromUser: user.id,
            postId: postId,
            description: clean(comment.description),
        };

        try {
            await apiFetch("posts/create/comment", { method: "POST", body: JSON.stringify(updatedComment) });
            setComment(commentStruct);
            e.target.value = "";
        }
        catch (error) {
            toast("Failed to send comment");
        }
    };

    return (
        <div className="flex w-full items-center justify-center">
            <Input
                placeholder="Comment"
                type="text"
                className="color-input"
                onKeyDown={handleCreateComment}
            />
        </div>
    )
}
