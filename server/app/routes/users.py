from fastapi import APIRouter
from app.utils import saveDB, loadDB, admin_ids
from app.models import User, Login, Developer, Entrepreneur 
from typing import Union
import json
from rapidfuzz import fuzz

router = APIRouter()

@router.get("/users/getByKey/{key}/{value}")
def get_user_by_key(key, value):
    db = loadDB() 
    try:
        res = [u for u in db["users"] if str(u[key]) == value][0]
        return {"status": "success", "data": res}
    except IndexError:
        return {"status": "error", "message": "User not found"}


@router.post("/users/create")
def create_user(user: User):
    db = loadDB()
    user = user.dict()
    userId = len(db["users"])
    user["id"] = userId 
    user["isAdmin"] = userId in admin_ids
    db["users"].append(user)
    if user["role"] == "Developer": 
        db["developers"].append({
            "id": userId,
            "yearsOfExperience": 0,
            "technologies": [],
        })
    else:
        db["entrepreneurs"].append({
            "id": userId,
            "industry": "",
            "companies": [],
        })
    saveDB(db)
    return {"status": "success", "message": "User successfully created"}

@router.post("/users/login")
def login(login: Login):
    db = loadDB()
    login = login.dict()
    # loop through the users
    for user in db["users"]:
        # check if the user is found
        if user["username"] == login["query"] or user["email"] == login["query"]:
            # check if the password is correct
            if user["password"] == login["password"]:
                # check if the user is blacklisted
                if login["id"] in db["blackList"]:
                    return {"status": "error", "message": "User is blacklisted"}
                # check if the user is an admin
                user["isAdmin"] = False
                # if the user is an admin
                if user["id"] in admin_ids:
                    user["isAdmin"] = True
                return {"status": "success", "data": user, "message": "User logged in"}
    return {"status": "error", "message": "User not found"}

@router.post("/users/update")
def update_user(user: User):
    db = loadDB()
    data = user.dict()

    return {"status": "error", "message": "User not found"}

@router.get("/users/delete/{id}")
def delete_user(id: int):
    db = loadDB()
    role = db["users"][id]["role"]
    db["users"].pop(id)
    if role == "Developer":
        [db["developers"].pop(i) for i, d in enumerate(db["developers"]) if d["id"] == id]
    else:
        [db["entrepreneurs"].pop(i) for i, e in enumerate(db["entrepreneurs"]) if e["id"] == id]
    saveDB(db)
    return {"status": "success", "message": "User deleted"}

@router.get("/users/get/roleData/{userId}")
def get_role_data(userId: int):
    db = loadDB()
    user = db["users"][userId]
    if user["role"] == "Developer":
        return {"status": "success", "data": db["developers"][userId]}
    return {"status": "success", "data": db["entrepreneurs"][userId]}

@router.post("/users/update/roleData/{userId}")
def update_role_data(userId: int, roleData: Union[Developer, Entrepreneur]):
    db = loadDB()
    user = db["users"][userId]
    roleData = roleData.dict()
    if user["role"] == "Developer":
        db["developers"][userId].update(roleData)
    else:
        db["entrepreneurs"][userId].update(roleData)
    saveDB(db)
    return {"status": "success", "message": "Role data updated"}

@router.get("/users/search/{query}")
def search_user(query: str):
    db = loadDB()
    res = []
    for u in db["users"]:
        for key, value in u.items():
            if key == "id":
                continue 
            score = fuzz.ratio(query, value)
            if score >= 45:
                res.append(u)
    return {"status": "success", "data": res}

@router.get("/users/isBanned/{userId}")
def is_banned(userId: int):
    db = loadDB()
    return {"status": "success", "data": userId in db["blackList"]}

@router.get("/users/banToggle/{userId}")
def ban_toggle(userId: int):
    db = loadDB()
    if userId in db["blackList"]:
        db["blackList"].remove(userId)
    else:
        db["blackList"].append(userId)
    saveDB(db)
    return {"status": "success", "message": "User banned status toggled"}
