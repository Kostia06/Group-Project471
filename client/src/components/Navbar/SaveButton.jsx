"use client";
import { meetRequirments } from "./utils"
import { apiFetch } from '@/lib/utils';
import { toast } from "sonner"


export default function SaveButton({ newUser, user, newUserRoleData, userRoleData, setUserRoleData, setUser, changeTheme, req, reqChanged }) {
    const handleSave = async () => {
        // check if requirements are met 
        if (!meetRequirments(req) && reqChanged)
            return toast("Please fill out all fields");
        if (newUser === user && newUserRoleData === userRoleData)
            return toast("No changes made");
        if (newUser !== user) {
            await apiFetch("/users/update", { method: "POST", body: JSON.stringify(newUser) });
            setUser(newUser);
        }
        if (newUserRoleData !== userRoleData) {
            await apiFetch(`/users/update/roleData/${user.id}`, { method: "POST", body: JSON.stringify(newUserRoleData) });
            setUserRoleData(newUserRoleData);
        }
        toast("User Updated");
    }
    return (
        <div className="absolute bottom-3 right-2 flex items-center justify-start w-fit *:mx-2">
            <button
                className="hover:text-prime smooth rounded-full border-2 dark:border-white dark:hover:bg-white border-sec hover:bg-sec py-1 px-3"
                onClick={handleSave}
            >
                Save
            </button>
            <input
                type="checkbox"
                className="toggle dark:[--tglbg:black] [--tglbg:white] border-0 bg-prime hover:bg-prime outline outline-offset-2 dark:outline-white outline-slate-300 outline-2 toggle-md"
                onClick={changeTheme}
            />
        </div>

    )
}
