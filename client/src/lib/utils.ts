import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { API } from "./env"


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function apiFetch(url: string, options: RequestInit = {}) {
    try {
        return await fetch(`/api/${url}`, { headers: { "Content-Type": "application/json" }, ...options })
            .then(res => res.json())
    }
    catch (error) {
        return { status: "error", message: error, data: [] }
    }
}

