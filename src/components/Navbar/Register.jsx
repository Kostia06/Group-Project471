"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useGlobalContext } from '@/containers/GlobalContext';
import { Input } from '@/components/ui/input';
import { handleUsername, handlePassword, handlePassword2, handleEmail, handleRequirments, inputCSS, meetRequirments } from "./utils"
import { colors, apiFetch, cn } from '@/lib/utils';
import Avatar from '@/components/boringAvatars/index.js';
import { useToast } from "@/components/hooks/use-toast"

// LogIn Section of Register Page
export const RegisterLogIn = () => {
    const { user, setUser } = useGlobalContext();
    const { toast } = useToast()
    // Login info
    const [loginInfo, setLoginInfo] = useState({
        "id": "",
        "password": "",
    });

    const handleLogin = async () => {
        const res = await apiFetch("/users/login", { method: "POST", body: JSON.stringify(loginInfo) });
        toast({ description: res.message });
        if (res.status === "error")
            setUser(res.user);

    }

    return (
        <div className="flex flex-col w-full h-full items-center justify-center">
            <Input
                className={inputCSS}
                placeholder="username or email"
                onChange={(e) => { setLoginInfo({ ...loginInfo, id: e.target.value }) }}
            />
            <Input
                className={inputCSS}
                placeholder="password"
                type="password"
                onChange={(e) => { setLoginInfo({ ...loginInfo, password: e.target.value }) }}
            />
            <div className="w-full flex items-center justify-center mt-6">
                <button
                    className="smooth rounded-lg px-7 py-2 border-2 dark:border-white border-slate-300 dark:hover:bg-white hover:border-slate-300 hover:text-prime"
                    onClick={handleLogin}
                >
                    Log In
                </button>
            </div>

        </div>
    )
}


// SignUp Section of Register pages
export const RegisterSignUp = () => {
    const { user, setUser } = useGlobalContext();
    const { toast } = useToast()
    // Sign up info
    const [signUpInfo, setSignUpInfo] = useState({
        "username": "", "email": "",
        "name": "", "socials": [],
        "password": "", "password2": "",
    });
    // Requirments for password
    const [passReq, setPassReq] = useState({
        "Must be at least 1 letter": false,
        "Must be at least 1 number": false,
        "Must be at least 10 characters": false,
        "Passwords must match": false,
    });
    // Requirments for username
    const [userReq, setUserReq] = useState({
        "Email is unique": false,
        "Username is unique": false,
        "Must not contain profanity": true,
        "Must be at least 3 characters": false,
    });
    // Fetch usernames and emails
    const [usernames, setUsernames] = useState([]);
    const [emails, setEmails] = useState([]);
    useEffect(() => {
        const fetchUsernames = async () => {
            // fetch usernames
            const res1 = await apiFetch("/users/get/username", { method: "GET" })
            setUsernames(res1);
            // fetch emails
            const res2 = await apiFetch("/users/get/email", { method: "GET" })
            setEmails(res2);
        }
        fetchUsernames();
    }, [])
    const handleSignUp = async () => {
        // check if requirements are met
        if (!meetRequirments(userReq) || !meetRequirments(passReq)) {
            toast({ description: "Please fill out all fields" });
            return;
        }

        delete signUpInfo.password2;
        const res = await apiFetch("/users/signup", { method: "POST", body: JSON.stringify(signUpInfo) });
        toast({ description: res.message });
        setUser(res.user);
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
            <Avatar name={signUpInfo.username} className="w-20 h-20" colors={colors} />
            <div>
                <Input
                    className={cn(inputCSS, "min-w-96")}
                    placeholder="Full Name"
                    onChange={(e) => setSignUpInfo({ ...signUpInfo, name: e.target.value })}
                />
                <div className="flex space-x-3">
                    <div className="flex flex-col">
                        <Input
                            className={inputCSS}
                            placeholder="email" type="email"
                            onChange={(e) => handleEmail(e, userReq, setUserReq, signUpInfo, setSignUpInfo, emails)}
                        />
                        <Input
                            className={inputCSS}
                            placeholder="username"
                            onChange={(e) => handleUsername(e, userReq, setUserReq, signUpInfo, setSignUpInfo, usernames)}
                        />
                        {handleRequirments(userReq, true)}
                    </div>
                    <div className="flex flex-col">
                        <Input
                            placeholder="password"
                            className={inputCSS}
                            type="password"
                            onChange={(e) => handlePassword(e, setPassReq, signUpInfo, setSignUpInfo)}
                        />
                        <Input
                            className={inputCSS}
                            placeholder="Confirm password"
                            type="password"
                            onChange={(e) => handlePassword2(e, setPassReq, signUpInfo, setSignUpInfo)}
                        />
                        {handleRequirments(passReq, false)}
                    </div>

                </div>
            </div>
            <div className="w-full flex items-center justify-center">
                <button
                    className="smooth rounded-lg px-7 py-2 border-2 dark:border-white border-slate-300 dark:hover:bg-white hover:border-slate-300 hover:text-prime"
                    onClick={handleSignUp}
                >
                    Sign Up
                </button>
            </div>
        </div>
    )
}

