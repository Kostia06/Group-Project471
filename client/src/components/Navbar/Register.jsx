"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useGlobalContext } from '@/containers/GlobalContext';
import { Input } from '@/components/ui/input';
import { handleUsername, handlePassword, handlePassword2, handleEmail, handleRequirments, meetRequirments } from "./utils"
import { colors, apiFetch } from '@/lib/utils';
import Avatar from '@/components/boringAvatars/index.js';
import { toast } from "sonner"

// LogIn Section of Register Page
export const RegisterLogIn = () => {
    const { user, setUser } = useGlobalContext();
    // Login info
    const [loginInfo, setLoginInfo] = useState({
        "id": "",
        "password": "",
    });

    const handleLogin = async () => {
        if (!meetRequirments(loginInfo)) {
            toast("Please fill out all fields");
            return
        }
        const res = await apiFetch("/users/login", { method: "POST", body: JSON.stringify(loginInfo) });
        toast(res.message);
        if (res.status === "success")
            setUser(res.data);

    }

    return (
        <div className="flex flex-col w-full h-full items-center justify-center">
            <Input
                className="color-input"
                placeholder="username or email"
                onChange={(e) => { setLoginInfo({ ...loginInfo, id: e.target.value }) }}
            />
            <Input
                className="color-input"
                placeholder="password"
                type="password"
                onChange={(e) => { setLoginInfo({ ...loginInfo, password: e.target.value }) }}
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
export const RegisterSignUp = () => {
    const { user, setUser } = useGlobalContext();
    // Sign up info
    const [signUpInfo, setSignUpInfo] = useState({
        "username": "", "email": "",
        "name": "", "socials": [],
        "password": "", "password2": "",
        "role": "Developer",
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
    const handleCheckbox = (role) => {
        setSignUpInfo((prevUser) => ({ ...signUpInfo, role: prevUser.role === role ? null : role }));
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

        delete signUpInfo.password2;
        const res = await apiFetch("/users/signup", { method: "POST", body: JSON.stringify(signUpInfo) });
        setUser(res.data);
        toast(res.message);
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
            <div>
                <Avatar name={signUpInfo.username} className="w-20 h-20 avatar" colors={colors} />
            </div>
            <div className="w-full flex items-center justify-evenly">
                <div>
                    <input
                        id="D" type="checkbox"
                        className="hidden peer"
                        checked={signUpInfo?.role === "Developer"}
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
                        checked={signUpInfo?.role === "Entrepreneur"}
                        onChange={() => handleCheckbox("Entrepreneur")}
                    />
                    <label className="btn" htmlFor="E">
                        Entrepreneur
                    </label>
                </div>
            </div>
            <div>
                <Input
                    className="color-input min-w-96"
                    placeholder="Full Name"
                    onChange={(e) => setSignUpInfo({ ...signUpInfo, name: e.target.value })}
                />
                <div className="flex space-x-3">
                    <div className="flex flex-col">
                        <Input
                            className="color-input"
                            placeholder="email" type="email"
                            onChange={(e) => handleEmail(e, userReq, setUserReq, signUpInfo, setSignUpInfo, emails)}
                        />
                        <Input
                            className="color-input"
                            placeholder="username"
                            onChange={(e) => handleUsername(e, userReq, setUserReq, signUpInfo, setSignUpInfo, usernames)}
                        />
                        {handleRequirments(userReq, true)}
                    </div>
                    <div className="flex flex-col">
                        <Input
                            placeholder="password"
                            className="color-input"
                            type="password"
                            onChange={(e) => handlePassword(e, setPassReq, signUpInfo, setSignUpInfo)}
                        />
                        <Input
                            className="color-input"
                            placeholder="Confirm password"
                            type="password"
                            onChange={(e) => handlePassword2(e, setPassReq, signUpInfo, setSignUpInfo)}
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

