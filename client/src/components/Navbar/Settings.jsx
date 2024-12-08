"use client";
import { useState, useEffect } from "react";
import { useGlobalContext } from '@/containers/GlobalContext';
import { Input } from '@/components/ui/input';
import { handleUsername, handleRequirments, handlePassword, handlePassword2, handleEmail } from "./utils"
import { apiFetch, cn } from '@/lib/utils';
import Avatar from '@/components/boringAvatars/index.js'
import { toast } from "sonner"
import { avatarColors, userReqStruct, passReqStruct, roleDataStruct } from "@/lib/consts";
import { IoMdClose } from "react-icons/io";
import SaveButton from "./SaveButton";

export const SettingsProfile = ({ setOpen }) => {
    const { user, setUser, setCurrentProject, changeTheme } = useGlobalContext();
    const [newUser, setNewUser] = useState(user);

    useEffect(() => {
        setNewUser(user);
    }, [user])


    // Requirments for username
    const [userReq, setUserReq] = useState(userReqStruct);
    // Fetch usernames and emails
    const [usernames, setUsernames] = useState([]);
    const [emails, setEmails] = useState([]);
    const [avatarBounce, setAvatarBounce] = useState(false);

    useEffect(() => {
        const fetchUsernamesAndEmails = async () => {
            // fetch usernames
            const res1 = await apiFetch("/users/getByKey/username", { method: "GET" })
            setUsernames(res1.data);
            // fetch emails
            const res2 = await apiFetch("/users/getByKey/email", { method: "GET" })
            setEmails(res2.data);
        }
        fetchUsernamesAndEmails();
    }, [])

    if (!user)
        return null;

    const handleSignOut = () => {
        toast("Signed Out");
        setUser(null);
        setCurrentProject(-1);
        setOpen(false);
    }

    const handleDelete = async () => {
        const res = await apiFetch(`/users/delete/${user.id}`, { method: "GET" });
        setUser(null);
        setOpen(false);
        toast(res.message);
    }

    return (
        <div className="flex flex-col w-full h-full items-center justify-center space-y-5">
            <div className="flex w-full  items-center justify-evenly">
                <div className="flex flex-col">
                    <Input
                        className="color-input"
                        placeholder={user.username}
                        onFocus={() => setAvatarBounce(true)}
                        onBlur={() => setAvatarBounce(false)}
                        onChange={(e) => handleUsername(e, userReq, setUserReq, newUser, setNewUser, usernames)}
                    />
                    {handleRequirments(userReq, true)}
                    <Input
                        className="color-input"
                        placeholder={user.email}
                        type="email"
                        onChange={(e) => handleEmail(e, userReq, setUserReq, newUser, setNewUser, emails)}
                    />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Avatar name={newUser.username} className={cn("w-32 h-32 avatar", avatarBounce && "animate-bounce duration-1000")} colors={avatarColors} />
                </div>
            </div>
            <div className="flex items-center justify-evenly w-full">
                <button className="btn" onClick={handleSignOut}>
                    Sign Out
                </button>
                <button className="btn" onClick={handleDelete}>
                    Delete Account
                </button>
            </div>
            <SaveButton newUser={newUser} setUser={setUser} user={user} changeTheme={changeTheme} req={{}} />
        </div >
    )
}

export const SettingsAccount = () => {
    const { user, setUser, changeTheme } = useGlobalContext();
    const [newUser, setNewUser] = useState(user);
    const [userRoleData, setUserRoleData] = useState(roleDataStruct);
    const [newUserRoleData, setNewUserRoleData] = useState(roleDataStruct);
    const [social, setSocial] = useState("")
    const [tech, setTech] = useState("")
    const [comp, setComp] = useState("")

    useEffect(() => setNewUser(user), [user])
    useEffect(() => {
        const fetchUserRoleData = async () => {
            const res = await apiFetch(`/users/get/roleData/${newUser.id}`, { method: "GET" });
            if (res.data.length === 0)
                return
            setUserRoleData(res.data[0]);
            setNewUserRoleData(res.data[0]);
        }
        fetchUserRoleData();
    }, [user])

    // Rerquirments for password
    const [passReq, setPassReq] = useState(passReqStruct);

    if (!newUser || !newUserRoleData)
        return null;


    const handleSocialLink = (e) => {
        if (e.key !== "Enter")
            return;
        if (newUser.socials.length >= 5)
            return toast("You can only have 5 social links")
        if (!social)
            return toast("Please enter a link");
        try {
            new URL(social);
        }
        catch {
            return toast("Please enter a valid link");
        }
        setNewUser({ ...newUser, socials: [...newUser.socials, social] })
        setSocial("")
        e.target.value = ""
    }

    const handleAddTechnology = (e) => {
        if (e.key !== "Enter")
            return;
        if (newUserRoleData.technologies.length >= 5)
            return toast("You can only have 5 technologies")
        if (!tech)
            return toast("Please enter a technology");
        setNewUserRoleData({ ...newUserRoleData, technologies: [...newUserRoleData.technologies, tech] })
        setTech("")
        e.target.value = ""
    }

    const handleAddCompany = (e) => {
        if (e.key !== "Enter")
            return;
        if (newUserRoleData.companies.length >= 5)
            return toast("You can only have 5 companies")
        if (!comp)
            return toast("Please enter a company");
        setNewUserRoleData({ ...newUserRoleData, companies: [...newUserRoleData.companies, comp] })
        setComp("")
        e.target.value = ""
    }


    return (
        <div className="flex flex-col w-full h-full items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="w-full flex space-x-2">
                    <div className="flex flex-col w-full">
                        <Input
                            className="color-input"
                            placeholder={user.name}
                            type="text"
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        />
                        <div className="flex flex-col w-full">
                            {newUser.role === "Developer"
                                ? (
                                    <Input
                                        className="color-input"
                                        type="number"
                                        min={0}
                                        onChange={(e) => setNewUserRoleData({ ...newUserRoleData, yearsOfExperience: e.target.value })}
                                        placeholder={`Years of Experience: ${newUserRoleData.yearsOfExperience}`}
                                    />
                                )
                                : (
                                    <Input
                                        className="color-input"
                                        type="text"
                                        onChange={(e) => setNewUserRoleData({ ...newUserRoleData, industry: e.target.value })}
                                        placeholder={`Industry ${newUserRoleData.industry}`}
                                    />
                                )
                            }
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-full">
                        <Input
                            className="color-input"
                            placeholder="password"
                            type="password"
                            onChange={(e) => handlePassword(e, setPassReq, newUser, setNewUser)}
                        />
                        <Input
                            className="color-input"
                            placeholder="Confirm password"
                            type="password"
                            onChange={(e) => handlePassword2(e, setPassReq, newUser, setNewUser)}
                        />
                        {handleRequirments(passReq, true)}
                    </div>

                </div>
                <div className="flex w-full items-center space-x-2">
                    <div className="w-full h-full">
                        <div className="flex w-full">
                            <Input
                                className="color-input"
                                placeholder="Social Link"
                                type="text"
                                onChange={(e) => setSocial(e.target.value)}
                                onKeyDown={(e) => handleSocialLink(e)}
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            {newUser.socials.map((social, i) => (
                                <Link key={i} i={i} social={social} newUser={newUser} setNewUser={setNewUser} />
                            ))}
                        </div>
                    </div>
                    {newUser.role === "Developer"
                        ? (
                            <div className="w-full h-full">
                                <div className="flex w-full">
                                    <Input
                                        className="color-input"
                                        placeholder="Technologies"
                                        type="text"
                                        onChange={(e) => setTech(e.target.value)}
                                        onKeyDown={(e) => handleAddTechnology(e)}
                                    />
                                </div>
                                <div className="flex flex-col w-full h-full">
                                    {newUserRoleData.technologies.map((name, i) => (
                                        <Technologies key={i} name={name} setData={setNewUserRoleData} data={newUserRoleData} />
                                    ))}
                                </div>
                            </div>
                        )
                        : (
                            <div className="w-full h-full">
                                <div className="flex w-full">
                                    <Input
                                        className="color-input"
                                        placeholder="Companies"
                                        type="text"
                                        onChange={(e) => setComp(e.target.value)}
                                        onKeyDown={(e) => handleAddCompany(e)}
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    {newUserRoleData.companies.map((name, i) => (
                                        <Companies key={i} name={name} setData={setNewUserRoleData} data={newUserRoleData} />
                                    ))}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <SaveButton
                newUser={newUser}
                user={user} setUser={setUser}
                newUserRoleData={newUserRoleData}
                userRoleData={userRoleData}
                setUserRoleData={setUserRoleData}
                changeTheme={changeTheme}
                req={passReq} reqChanged={newUser.password !== user.password}
            />
        </div >
    )
}

const Technologies = ({ name, data, setData }) => {
    const handleRemove = () => {
        const array = data.technologies.filter((tech) => tech !== name)
        setData({ ...data, technologies: array });
    }
    return (
        <div className="flex items-center text-lg">
            <button className="hover:text-red-500 smooth" onClick={() => handleRemove()}>
                <IoMdClose />
            </button>
            {name}
        </div>
    )
}

const Companies = ({ name, data, setData }) => {
    const handleRemove = () => {
        const array = data.companies.filter((comp) => comp !== name)
        setData({ ...data, companies: array });
    }
    return (
        <div className="flex items-center text-lg">
            <button className="hover:text-red-500 smooth" onClick={() => handleRemove()}>
                <IoMdClose />
            </button>
            {name}
        </div>
    )
}

const Link = ({ social, i, newUser, setNewUser }) => {
    const parsedUrl = new URL(social);
    const name = parsedUrl.hostname
    const handleRemove = () => {
        newUser.socials.splice(i, 1)
        setNewUser({ ...newUser });
    }
    return (
        <div className="flex items-center text-lg">
            <button className="hover:text-red-500 smooth" onClick={() => handleRemove()}>
                <IoMdClose />
            </button>
            <a href={social} className="hover:text-blue-500 smooth">
                {name}
            </a>
        </div>
    )
}
