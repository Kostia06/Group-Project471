import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const colors = ["#ff1178", "#bc13fe", "#fff205", "#Ff5c00", "#7cff01", "#2323ff", "#00cdac", "#C8A2C8"]


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

