from fastapi import APIRouter
try:
    from app.utils import saveDB, loadDB 
    from app.models import User, Login, Developer, Entrepreneur, Admin 
except:
    from utils import saveDB, loadDB 
    from models import User, Login, Developer, Entrepreneur, Admin
from typing import Union
from rapidfuzz import fuzz

router = APIRouter()

@router.get("/users/getByKey/{key}/{value}")
async def get_user_by_key(key, value):
    db = loadDB() 
    try:
        res = [u for u in db["users"] if str(u[key]) == value][0]
        return {"status": "success", "data": res}
    except IndexError:
        return {"status": "error", "message": "User not found"}

@router.get("/users/getByKey/{key}")
async def get_user_by_key(key):
    db = loadDB()
    res = [u[key] for u in db["users"]]
    return {"status": "success", "data": res}


@router.post("/users/create")
async def create_user(user: User):
    db = loadDB()
    user = user.dict()
    userId = len(db["users"])
    user["id"] = userId
    user["isAdmin"] = any([a for a in db["admins"] if a["id"] == userId])
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
async def login(login: Login):
    db = loadDB()
    login = login.dict()
    # loop through the users
    for user in db["users"]:
        # check if the user is found
        if user["username"] == login["query"] or user["email"] == login["query"]:
            # check if the password is correct
            if user["password"] == login["password"]:
                # check if the user is blacklisted
                if user["id"] in db["blackList"]:
                    return {"status": "error", "message": "User is blacklisted"}
                # check if the user is an admin
                return {"status": "success", "data": user, "message": "User logged in"}
    return {"status": "error", "message": "User not found"}

@router.post("/users/update")
async def update_user(user: User):
    db = loadDB()
    user = user.dict()
    for i in range(len(db["users"])):
        if db["users"][i]["id"] == user["id"]:
            db["users"][i] = user
    return {"status": "error", "message": "User not found"}

@router.get("/users/delete/{id}")
async def delete_user(id: int):
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
async def get_role_data(userId: int):
    db = loadDB()
    user = db["users"][userId]
    if user["role"] == "Developer":
        items = [d for d in db["developers"] if d["id"] == userId]
        return {"status": "success", "data": items}
    items = [e for e in db["entrepreneurs"] if e["id"] == userId]
    return {"status": "success", "data": items}

@router.post("/users/update/roleData/{userId}")
async def update_role_data(userId: int, roleData: Union[Developer, Entrepreneur]):
    db = loadDB()
    user = db["users"][userId]
    roleData = roleData.dict()
    if user["role"] == "Developer":
        for i in range(len(db["developers"])):
            if db["developers"][i]["id"] == userId:
                db["developers"][i] = roleData
    else:
        for i in range(len(db["entrepreneurs"])):
            if db["entrepreneurs"][i]["id"] == userId:
                db["entrepreneurs"][i] = roleData
    saveDB(db)
    return {"status": "success", "message": "Role data updated"}

@router.get("/users/search/{query}")
async def search_user(query: str):
    db = loadDB()
    res = []
    for u in db["users"]:
        for key, value in u.items():
            if key == "id":
                continue 
            if key == "isAdmin" and value:
                value = "isAdmin"
            elif key == "isAdmin" and not value:
                continue
            score = fuzz.ratio(query, value)
            if score >= 45:
                res.append(u)
                break
    return {"status": "success", "data": res}

@router.get("/users/isBanned/{userId}")
async def is_banned(userId: int):
    db = loadDB()
    return {"status": "success", "data": userId in db["blackList"]}

@router.get("/users/banToggle/{userId}")
async def ban_toggle(userId: int):
    db = loadDB()
    if userId in db["blackList"]:
        db["blackList"].remove(userId)
    else:
        db["blackList"].append(userId)
    saveDB(db)
    return {"status": "success", "message": "User banned status toggled"}

@router.post("/users/create/admin")
async def create_admin(admin: Admin):
    db = loadDB()
    admin = admin.dict()
    adminId = len(db["admins"])
    admin["id"] = adminId
    db["admins"].append(admin)
    saveDB(db)
    return {"status": "success", "message": "Admin successfully created"}
