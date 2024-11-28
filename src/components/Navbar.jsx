"use client";
import { useGlobalContext } from "@/containers/GlobalContext";
import { useState, useEffect } from "react";
import Avatar from "@/components/boringAvatars/index.js"
import { colors } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { isProfane } from "@/lib/bad-words"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const inputCSS = `
    w-full max-w-60 h-12 
    placeholder:text-lg placeholder:text-opacity-40 
    focus:border-prime dark:focus:border-prime border 
    border-slate-300 dark:border-white 
    focus:border-2 border-2 
    focus-visible:ring-0
    my-2
`;

const handlePassword = (e, setPassReq, setPassword) => {
    setPassword(e.target.value);
    const pass = e.target.value;
    const hasChar = pass.match(/[a-z]/) !== null;
    const hasNum = pass.match(/[0-9]/) !== null;
    const hasLength = pass.length >= 12;
    const newPassReq = {
        "Must be at least 1 letter": hasChar,
        "Must be at least 1 number": hasNum,
        "Must be at least 12 characters": hasLength,
        "Passwords must match": pass === password2,
    }
    setPassReq(newPassReq);
}

const handleUsername = async (e, setUserReq, setUsername) => {
    /*
        const res = await fetch(
            "http://127.0.0.1:5000/api/get_usernames",
            {
                method: "GET",
                headers: { "Content-Type": "application/json", }
            }
        );
        const data = await res.json();
        console.log(data)
    */
    const usernameArr = [];
    setUsername(e.target.value);
    const user = e.target.value;
    const hasLength = user.length >= 3;
    let hasProfane = false;
    if (isProfane(user))
        hasProfane = true;
    setUserReq({
        "Username already exists": usernameArr.includes(user),
        "Must not contain profanity": !hasProfane,
        "Must be at least 3 characters": hasLength,
    })
}

const handleRequirments = (arr) => {
    return (
        <div className="flex flex-col">
            {
                Object.keys(arr).map((key, i) => {
                    const color = arr[key] ? "text-green-500" : "text-red-500";
                    return (<h1 key={i} className={cn(color, "text-sm")}>{key}</h1>)
                })
            }
        </div>
    )
}



const LoggedInSection = () => {
    const { user, setUser, changeTheme } = useGlobalContext();
    const usernamesArr = [];
    const [userhtmlFormat, setUserhtmlFormat] = useState(true);
    const [userReq, setUserReq] = useState({
        "Username already exists": true,
        "Must not contain profanity": true,
        "Must be at least 3 characters": true,
    });
    const [passReq, setPassReq] = useState({
        "Must be at least 1 letter": false,
        "Must be at least 1 number": false,
        "Must be at least 12 characters": false,
        "Passwords must match": false,
    });

    const setUsername = (value) => setUser({ ...user, username: value });


    return (
        <Dialog>
            <DialogTrigger className="flex">
                {user.username}
            </DialogTrigger>
            <DialogContent className="h-5/6">
                <DialogHeader>
                    <DialogTitle className="w-full flex items-center justify-center text-4xl">
                        Edit Profile
                    </DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="account" className="flex flex-col items-center mb-4">
                    <TabsContent value="account" className="flex flex-col w-full ">
                        <div className="flex items-center justify-evenly">
                            <div className="flex flex-col">
                                <Input className={inputCSS} placeholder={user.username} onChange={(e) => handleUsername(e, setUserReq, setUsername)} />
                                {handleRequirments(userReq)}
                                <Input className={inputCSS} placeholder={user.email} type="email" />
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <Avatar name={user.username} className="w-32 h-32" colors={colors} />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="profile" className="flex flex-col w-full">
                        <div className="flex justify-evenly space-x-2">
                            <div className="flex flex-col items-center w-full">
                                <Input className={inputCSS} placeholder={user.firstName} />
                                <Input className={inputCSS} placeholder={user.middleName} />
                                <Input className={inputCSS} placeholder={user.lastName} />
                            </div>
                            <div className="flex flex-col items-center justify-end w-full">
                                <Input
                                    className={inputCSS}
                                    placeholder="password"
                                    type="password"
                                    onChange={(e) => handlePassword(e, setPassReq, setPassword)}
                                />
                                <Input
                                    className={inputCSS}
                                    placeholder="Confirm password"
                                    type="password"
                                    onChange={(e) => setPassword2(e.target.value)}
                                />
                                {handleRequirments(passReq)}
                                <div className="flex items-center justify-evenly w-full">
                                    <label htmlFor="theme" className="text-lg">Change Theme</label>
                                    <input
                                        id="theme"
                                        type="checkbox"
                                        className="toggle dark:[--tglbg:black] [--tglbg:white] border-0 bg-prime hover:bg-prime outline outline-offset-2 dark:outline-white outline-slate-300 outline-2 toggle-md"
                                        onClick={changeTheme}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsList className="absolute bottom-0 rounded-md m-2 py-6 px-2">
                        <TabsTrigger value="account" className="text-lg font-bold">
                            Account
                        </TabsTrigger>
                        <TabsTrigger value="profile" className="text-lg font-bold">
                            Profile
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


const SignInSection = () => {
    const { changeTheme } = useGlobalContext();
    const [createAccount, setCreateAccount] = useState(false);
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [passReq, setPassReq] = useState({
        "Must be at least 1 letter": false,
        "Must be at least 1 number": false,
        "Must be at least 12 characters": false,
        "Passwords must match": false,
    });
    const [userReq, setUserReq] = useState({
        "Username already exists": false,
        "Must not contain profanity": true,
        "Must be at least 3 characters": false,
    });


    const login = async () => {


    }
    const signUp = async () => {

    }

    return (
        <Dialog>
            <DialogTrigger className="px-6 py-1 bg-prime rounded-full">
                Login
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center justify-center h-5/6">
                <DialogHeader className="absolute top-10">
                    <DialogTitle className="text-center text-4xl smooth">
                        Register / Log In
                    </DialogTitle>
                </DialogHeader>
                <Tabs default="login" className="flex flex-col items-center w-full h-max">
                    <TabsContent value="login" className="flex flex-col items-center justify-center w-full h-full">
                        <Input
                            className={cn(inputCSS, "w-80")}
                            placeholder="username or email"
                            onChange={(e) => { setId(e.target.value) }}
                        />
                        <Input
                            className={cn(inputCSS, "w-80")}
                            placeholder="password"
                            type="password"
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                    </TabsContent>
                    <TabsContent value="signup" className="flex flex-col items-center w-full">
                        <Avatar name={username} className="w-20 h-20 mb-2" colors={colors} />
                        <div className="flex flex-col">
                            <div className="flex">
                                <Input
                                    className={cn(inputCSS, "max-w-full")}
                                    placeholder="Full Name"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="flex">
                                <div className="flex flex-col mr-2">
                                    <Input
                                        className={inputCSS}
                                        placeholder="email" type="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Input
                                        className={inputCSS}
                                        placeholder="username"
                                        onChange={(e) => handleUsername(e, setUserReq, setUsername)}
                                    />
                                    {handleRequirments(userReq)}
                                </div>
                                <div className="flex flex-col ml-2">
                                    <Input
                                        className={inputCSS}
                                        placeholder="password"
                                        type="password"
                                        onChange={(e) => handlePassword(e, setPassReq, setPassword)}
                                    />
                                    <Input
                                        className={inputCSS}
                                        placeholder="Confirm password"
                                        type="password"
                                        onChange={(e) => setPassword2(e.target.value)}
                                    />
                                    {handleRequirments(passReq)}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsList className="absolute bottom-0 rounded-md m-2 py-6 px-2">
                        <TabsTrigger value="login" className="text-lg font-bold">
                            Login
                        </TabsTrigger>
                        <TabsTrigger value="signup" className="text-lg font-bold">
                            Sign Up
                        </TabsTrigger>
                    </TabsList>
                </Tabs>


                <DialogFooter className="w-full flex items-end ">

                </DialogFooter>

                <Avatar name="Sunwoo" className="absolute -top-2 -left-2 w-16 h-16" colors={colors} />
                <Avatar name="Divya" className="absolute bottom-5 left-2 w-16 h-16 " colors={colors} />
                <Avatar name="Kostia" className="absolute bottom-1/2 right-6 w-16 h-16" colors={colors} />
                <div className="mask mask-star absolute w-8 h-8 bg-yellow-400 left-1/2 translate-x-20 top-3 -rotate-45" />

            </DialogContent >
        </Dialog >
    )
}





export default function NavBar() {
    const { user, setUser, changeTheme } = useGlobalContext();
    return (
        <div className="fixed top-4 left-4 flex items-center space-x-4" >
            {user ? LoggedInSection() : SignInSection()}
        </div >
    );
}


