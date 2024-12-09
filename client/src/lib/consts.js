
const speed = 400
export const fetchMessageSpeed = speed
export const fetchPostSpeed = speed
export const fetchCommentsSpeed = speed
export const fetchTasksSpeed = speed

export const avatarColors = ["#ff1178", "#bc13fe", "#fff205", "#Ff5c00", "#7cff01", "#2323ff", "#00cdac", "#C8A2C8"]

export const fileSize = 5 * 1024 * 1024 // 5MB

export const statusColors = {
    "Pending": "red",
    "In Progress": "yellow",
    "Completed": "green",
};

export const taskStruct = {
    id: -1,
    name: "",
    date: 0.0,
    description: "",
    projectId: -1,
    status: "Pending",
}

export const messageStruct = {
    id: -1,
    fromUser: -1,
    files: [],
    description: "",
    date: "",
    projectId: -1,
}

export const tagStruct = {
    values: [],
    postId: -1,
    projectId: -1,
}

export const userReqStruct = {
    "Email is unique": true,
    "Username is unique": true,
    "Must not contain profanity": true,
    "Must be at least 3 characters": true,
}

export const passReqStruct = {
    "Must be at least 1 letter": false,
    "Must be at least 1 number": false,
    "Must be at least 12 characters": false,
    "Passwords must match": false,
}

export const signUpStruct = {
    "username": "", "email": "",
    "name": "", "socials": [],
    "password": "", "password2": "",
    "role": "Developer",
}

export const logInStruct = {
    query: "",
    password: ""
}

export const postStruct = {
    name: "",
    description: "",
    owner: -1,
    connectProjectId: "",
}

export const roleDataStruct = {
    id: -1,
    technologies: [],
    companies: [],
}

export const commentStruct = {
    description: "",
    fromUser: -1,
    postId: -1,
}


