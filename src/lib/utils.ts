import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const colors = ["#ff1178", "#fe0000", "#fff205", "#01fff4", "#7cff01"]


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

