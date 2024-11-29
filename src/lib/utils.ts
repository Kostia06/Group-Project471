import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { API } from "./env"

export const colors = ["#ff1178", "#bc13fe", "#fff205", "#Ff5c00", "#7cff01", "#2323ff", "#00cdac", "#C8A2C8"]


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function apiFetch(subDir: string, options: RequestInit = {}) {
    const url = API + subDir
    return fetch(url, { headers: { "Content-Type": "application/json" }, ...options })
        .then(res => res.json())
        // .then(data => console.log(data))
        .catch(error => console.error(`Error fetching ${url}`, error))
}


