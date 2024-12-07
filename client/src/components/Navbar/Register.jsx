"use client";
import { useState, useEffect } from "react";
import { useGlobalContext } from '@/containers/GlobalContext';
import { Input } from '@/components/ui/input';
import { handleUsername, handlePassword, handlePassword2, handleEmail, handleRequirments, meetRequirments } from "./utils"
import { apiFetch } from '@/lib/utils';
import Avatar from '@/components/boringAvatars/index.js';
import { toast } from "sonner"
import { avatarColors, userReqStruct, passReqStruct, signUpStruct, logInStruct } from "@/lib/consts";

// LogIn Section of Register Page
export const RegisterLogIn = ({ setOpen }) => {
    const { setUser } = useGlobalContext();
    // Login info
    const [login, setLogin] = useState(logInStruct);

    const handleLogin = async () => {
        if (!meetRequirments(login)) {
            toast("Please fill out all fields");
            return
        }
        const res = await apiFetch("/users/login", { method: "POST", body: JSON.stringify(login) });
        toast(res.message);

        if (res.status === "success")
            setUser(res.data);
        setOpen(false);
    }

    return (
        <div className="flex flex-col w-full h-full items-center justify-center">
            <Input
                className="color-input"
                placeholder="username or email"
                onChange={(e) => { setLogin({ ...login, id: e.target.value }) }}
            />
            <Input
                className="color-input"
                placeholder="password"
                type="password"
                onChange={(e) => { setLogin({ ...login, password: e.target.value }) }}
            />
            <div className="w-full flex items-center justify-center mt-6">
                <button className="btn" onClick={handleLogin}>
                    Log In
                </button>
            </div>

        </div>
    )
}


// SignUp Section of Register pages
export const RegisterSignUp = ({ setOpen }) => {
    const { setUser } = useGlobalContext();
    // Sign up info
    const [signUp, setSignUp] = useState(signUpStruct);
    // Requirments for password
    const [passReq, setPassReq] = useState(passReqStruct);
    // Requirments for username
    const [userReq, setUserReq] = useState(userReqStruct);
    const handleCheckbox = (role) => {
        setSignUp((prevUser) => ({ ...signUp, role: prevUser.role === role ? null : role }));
    };
    // Fetch usernames and emails
    const [usernames, setUsernames] = useState([]);
    const [emails, setEmails] = useState([]);
    useEffect(() => {
        const fetchUsernames = async () => {
            // fetch usernames
            const res1 = await apiFetch("/users/get/username", { method: "GET" })
            setUsernames(res1.data);
            // fetch emails
            const res2 = await apiFetch("/users/get/email", { method: "GET" })
            setEmails(res2.data);
        }
        fetchUsernames();
    }, [])
    const handleSignUp = async () => {
        // check if requirements are met
        if (!meetRequirments(userReq) || !meetRequirments(passReq)) {
            toast("Please fill out all fields, correctly");
            return;
        }

        delete signUp.password2;
        const res = await apiFetch("/users/create", { method: "POST", body: JSON.stringify(signUp) });
        setUser(res.data);
        toast(res.message);
        setOpen(false);
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-2 p-4">
            <div>
                <Avatar name={signUp.username} className="w-20 h-20 avatar" colors={avatarColors} />
            </div>
            <div className="w-full flex items-center justify-evenly">
                <div>
                    <input
                        id="D" type="checkbox"
                        className="hidden peer"
                        checked={signUp?.role === "Developer"}
                        onChange={() => handleCheckbox("Developer")}
                    />
                    <label className="btn" htmlFor="D">
                        Developer
                    </label>
                </div>
                <div>
                    <input
                        id="E" type="checkbox"
                        className="hidden peer"
                        checked={signUp?.role === "Entrepreneur"}
                        onChange={() => handleCheckbox("Entrepreneur")}
                    />
                    <label className="btn" htmlFor="E">
                        Entrepreneur
                    </label>
                </div>
            </div>
            <div className="w-full flex flex-col items-center">
                <Input
                    className="color-input min-w-96"
                    placeholder="Full Name"
                    onChange={(e) => setSignUp({ ...signUp, name: e.target.value })}
                />
                <div className="flex space-x-3">
                    <div className="flex flex-col">
                        <Input
                            className="color-input"
                            placeholder="email" type="email"
                            onChange={(e) => handleEmail(e, userReq, setUserReq, signUp, setSignUp, emails)}
                        />
                        <Input
                            className="color-input"
                            placeholder="username"
                            onChange={(e) => handleUsername(e, userReq, setUserReq, signUp, setSignUp, usernames)}
                        />
                        {handleRequirments(userReq, true)}
                    </div>
                    <div className="flex flex-col">
                        <Input
                            placeholder="password"
                            className="color-input"
                            type="password"
                            onChange={(e) => handlePassword(e, setPassReq, signUp, setSignUp)}
                        />
                        <Input
                            className="color-input"
                            placeholder="Confirm password"
                            type="password"
                            onChange={(e) => handlePassword2(e, setPassReq, signUp, setSignUp)}
                        />
                        {handleRequirments(passReq, false)}
                    </div>

                </div>
            </div>
            <div className="w-full flex items-center justify-center">
                <button className="btn" onClick={handleSignUp}>
                    Sign Up
                </button>
            </div>

        </div>
    )
}

