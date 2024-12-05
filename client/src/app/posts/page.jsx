"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/utils'
import { useGlobalContext } from '@/containers/GlobalContext'
import { fetchPostSpeed } from '@/lib/consts'
import CreatePost from '@/components/Posts/CreatePost'
import Posts from '@/components/Posts/Posts'

export default function PostsPage() {
    const { user } = useGlobalContext()
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            const lastPostId = posts.length ? posts[posts.length - 1].id : -1
            const res = await apiFetch(`/posts/getAll/${lastPostId}`, { method: "GET" });
            if (res.new)
                setPosts(res.data);
        }
        const interval = setInterval(fetchPosts, fetchPostSpeed);
        return () => clearInterval(interval);
    }, [])


    return (
        <div className="flex flex-col w-full h-full">
            {user?.id != -1 && (<CreatePost />)}
            <Posts posts={posts} setPosts={setPosts} />
        </div>
    )
}
