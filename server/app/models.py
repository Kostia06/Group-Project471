from typing import List
from pydantic import BaseModel, EmailStr 

class User(BaseModel):
    name: str = ""
    username: str = ""
    email: EmailStr = ""
    password: str = ""
    role: str = "Developer"
    isAdmin: bool = False
    id: int = -1
    socials: List[str] = []

class Project(BaseModel):
    name: str = "" 
    owner: int = -1
    users: List[int] = []
    id: int = -1

class Login(BaseModel):
    query: str = ""
    password: str = ""

class Developer(BaseModel):
    id: int = -1
    yearsOfExperience: int = 0
    technologies: List[str] = []

class Entrepreneur(BaseModel):
    id: int = -1
    industry: str = ""
    companies: List[str] = []

class Tag(BaseModel):
    values: List[str] = []
    postId: int = -1
    projectId: int = -1

class Task(BaseModel):
    name: str = ""
    date: str = ""
    description: str = ""
    projectId: int = -1
    status: str = "Pending"

class Message(BaseModel):
    fromUser: int = -1
    project: str = ""
    files: List[str] = []
    description: str = ""
    date: str = ""
    projectId: int = -1

class Post(BaseModel):
    name: str = ""
    description: str = ""
    owner: int = -1
    connectProjectId: str = ""

class Comment(BaseModel):
    description: str = ""
    fromUser: int = -1
    postId: int = -1

class Admin(BaseModel):
    id: int = -1
    username: str = ""
    email: EmailStr = ""
