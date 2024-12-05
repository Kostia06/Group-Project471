"use client"
import { useState, useEffect } from "react"
import { useGlobalContext } from '@/containers/GlobalContext'
import { avatarColors } from "@/lib/consts"
import { apiFetch, cn } from '@/lib/utils'
import Avatar from '@/components/boringAvatars/index.js'
import { Input } from '@/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from "sonner";

const ArraySocials = ({ socials }) => (
    <div className="flex flex-col py-2">
        {socials && socials.map((social, i) => {
            const parsedUrl = new URL(social);
            const name = parsedUrl.hostname
            return (
                <a key={i} href={data} className="text-xs">
                    {name}
                </a>
            )
        })}
    </div>
)

const ArrayCompanies = ({ companies }) => (
    <div className="flex flex-col py-2">
        {companies && companies.map((data, i) => (
            <h1 key={i} className="text-xs">
                {data}
            </h1>
        ))}
    </div>

)

const ArrayTechnologies = ({ technologies }) => (
    <div className="flex flex-col py-2">
        {technologies && technologies.map((data, i) => (
            <h1 key={i} className="text-xs">
                {data}
            </h1>
        ))}
    </div>
)


// Component for message from other 
const MessageFromOther = ({ user }) => {
    const [userRoleData, setUserRoleData] = useState({});
    const [isBanned, setIsBanned] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setUserRoleData(await handleFetchRoleData());
            setIsBanned(await handleisBanned());
        }
        fetch();
    }, [user])

    const handleBanToggle = async () => {
        console.log(user)
        if (user.isAdmin)
            return toast("You can't ban an admin");
        const res = await apiFetch(`/users/banToggle/${user.id}`, { method: "GET" });
        setIsBanned(!isBanned);
    }

    const handleFetchRoleData = async () => {
        const res = await apiFetch(`/users/get/roleData/${user.id}`, { method: "GET" });
        return res.data;
    }

    const handleisBanned = async () => {
        const res = await apiFetch(`/users/isBanned/${user.id}`, { method: "GET" });
        return res.banned;
    }



    return (
        <Popover>
            <PopoverTrigger>
                <div className={cn(
                    "flex items-center justify-center  w-fit h-fit py-2 px-4 m-2 rounded-lg space-x-4",
                    isBanned ? "bg-prime bg-opacity-60" : "dark:bg-zinc-800 bg-sec"
                )}>
                    <Avatar name={user.username} className="w-14 h-14" colors={avatarColors} />
                    <h1 className="text-lg">{user.username}</h1>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-full h-full flex flex-col">
                <div className="flex flex-col items-center min-h-2">
                    <h1 className="font-bold text-3xl">
                        {user.username}
                    </h1>
                    <p className="text-sm">({user.role})</p>
                </div>
                <div className="flex items-center min-h-32 p-2">
                    <div className="flex flex-col min-h-32 w-full p-2">
                        <h1 className="text-xl">Socials</h1>
                        <ArraySocials socials={user?.socials} />
                    </div>
                    <div className="flex flex-col min-h-32 w-full p-2">
                        <h1 className="text-xl">
                            {user.role == "Developer" ? "Technologies" : "Companies"}
                        </h1>
                        {user.role == "Developer"
                            ? <ArrayTechnologies technologies={userRoleData?.technologies} />
                            : <ArrayCompanies companies={userRoleData?.companies} />
                        }
                    </div>
                </div>
                <button
                    className="w-full rounded-lg border-prime border-2 p-2 hover:bg-prime hover:text-white smooth"
                    onClick={handleBanToggle}
                >
                    {isBanned ? "Unban" : "Ban"}
                </button>
            </PopoverContent>
        </Popover >
    )
}

export default function AdminPage() {
    const { user } = useGlobalContext();

    const [users, setUsers] = useState([]);

    const handleSearch = async (e) => {
        if (e.target.value === "")
            return setUsers([]);
        const res = await apiFetch(`/users/search/${e.target.value}`, { method: "GET" });
        setUsers(res.data);
    }
    return (
        <div className="w-full h-full flex flex-wrap items-start justify-start">
            {users.map((user, i) => (<MessageFromOther key={i} user={user} />))}
            <div className="absolute bottom-2 right-4">
                <Input
                    className="color-input"
                    type="text"
                    placeholder="Search for user"
                    onChange={handleSearch}
                />
            </div>
        </div>
    )
}
