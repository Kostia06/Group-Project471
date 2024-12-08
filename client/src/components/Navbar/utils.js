import { cn } from "@/lib/utils"
import { isProfane } from "@/lib/bad-words";

export const meetRequirments = (arr) => {
    for (const key in arr)
        if (!arr[key])
            return false;
    return true;
}


export const handlePassword = (e, setPassReq, info, setInfo) => {
    setInfo({ ...info, password: e.target.value });
    const target = e.target.value;
    setPassReq({
        "Must be at least 1 letter": target.match(/[a-z]/) !== null,
        "Must be at least 1 number": target.match(/[0-9]/) !== null,
        "Must be at least 10 characters": target.length >= 10,
        "Passwords must match": target === info.password2,
    });
}

export const handlePassword2 = (e, setPassReq, info, setInfo) => {
    setInfo({ ...info, password2: e.target.value });
    const target = e.target.value;
    setPassReq({
        "Must be at least 1 letter": info.password.match(/[a-z]/) !== null,
        "Must be at least 1 number": info.password.match(/[0-9]/) !== null,
        "Must be at least 10 characters": info.password.length >= 10,
        "Passwords must match": info.password === target,
    });
}

export const handleUsername = (e, userReq, setUserReq, info, setInfo, usernames) => {
    setInfo({ ...info, username: e.target.value });
    const target = e.target.value;
    setUserReq({
        ...userReq,
        "Username is unique": !usernames?.includes(target),
        "Must not contain profanity": !isProfane(target),
        "Must be at least 3 characters": target.length >= 3,
    })
}

export const handleEmail = (e, userReq, setUserReq, info, setInfo, emails) => {
    setInfo({ ...info, email: e.target.value });
    const target = e.target.value;
    setUserReq({
        ...userReq,
        "Email is unique": !emails.includes(target),
    })
}


export const handleRequirments = (arr, side = false) => {
    return (
        <div className={cn("flex flex-col", side ? "items-start" : "items-end")} >
            {
                Object.keys(arr).map((key, i) => {
                    const color = arr[key] ? "text-green-500" : "text-red-500";
                    return (<h1 key={i} className={cn(color, "text-xs")}>{key}</h1>)
                })
            }
        </div >
    )
}

