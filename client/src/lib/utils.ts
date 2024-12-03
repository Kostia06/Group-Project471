import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { API } from "./env"


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function apiFetch(subDir: string, options: RequestInit = {}) {
    const url = API + subDir
    try {
        return await fetch(url, { headers: { "Content-Type": "application/json" }, mode: "cors", ...options })
            .then(res => res.json())
    }
    catch (error) {
        return { status: "error", message: error, data: [] }
    }
}

