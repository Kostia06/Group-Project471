"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/utils'
import { useGlobalContext } from '@/containers/GlobalContext'
import CreatePost from '@/components/Posts/CreatePost'
import Posts from '@/components/Posts/Posts'

export default function PostsPage() {
    const { user } = useGlobalContext()
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await apiFetch(`/posts/getAll`, { method: "GET" });
            setPosts(res.data);
        }
        const interval = setInterval(fetchPosts, 1000);
        return () => clearInterval(interval);
    }, [])


    return (
        <div className="flex flex-col w-full h-full">
            {user?.id != -1 && (<CreatePost />)}
            <Posts posts={posts} setPosts={setPosts} />
        </div>
    )
}
