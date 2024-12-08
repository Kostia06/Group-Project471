from faker import Faker 
from random import randint, shuffle 
from routes.users import create_user, create_admin, update_role_data 
from models import User, Admin, Developer, Entrepreneur


fake = Faker()
creators = [
    {
        "id": 0,
        "username": "Kos",
        "role": "Developer",
        "name": "Kostiantyn Ilnytskyi",
        "email": "ilnkostia@gmail.com",
        "password": "password123",
    },
    {
        "id": 1,
        "username": "Divya",
        "role": "Entrepreneur",
        "name": "Divya Sree Lakshmi Gude",
        "email": "gudedivya2909@gmail.com",
        "password": "password123",
    },
    {
        "id": 2,
        "username": "Sunwoo",
        "role": "Developer",
        "name": "Sunwoo Back",
        "email": "sunwoo.back@ucalgary.ca", 
        "password": "password123",
    },
]

admin_role_data = [
    {
        "id": 0,
        "username": "Kos",
        "email": "ilnkostia@gmail.com"
    },
    {
        "id": 1,
        "username": "Divya",
        "email": "gudedivya2909@gmail.com"
    },
    {
        "id": 2,
        "username": "Sunwoo",
        "email": "sunwoo.back@ucalgary.ca"
    }
]


technologies = [
    "Python", "JavaScript", "Java", "C#", "C++", 
    "HTML", "CSS", "React", "Node.js", "Django", 
    "MySQL", "PostgreSQL", "MongoDB", "Docker", "Kubernetes", 
    "AWS", "TensorFlow", "PyTorch", "Git", "GitHub"
]

industries = [
    "Healthcare", "Finance", "Education", "Retail", "Agriculture",
]

names = []

def generateDB():
    users = []
    users += generateAdmins()
    users += generateUsers()
    for user, roleData in users:
        create_user(user)
        update_role_data(user.id, roleData)


def generateAdmins():
    users = []
    for i, user in enumerate(creators):
        if user["name"] in names:
            continue
        admin = {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
        }
        user = User(**user)
        roleData = None 
        if user.role == "Entrepreneur": 
            roleData = Entrepreneur(**admin_role_data[i])
        else: 
            roleData = Developer(**admin_role_data[i])
        create_admin(Admin(**admin))
        users.append((user, roleData))
        names.append(user.name)
    return users

def generateUsers():
    users = []
    userNum = 30
    for _ in range(userNum):
        user = generateUser()
        roleData = None 
        if user.role == "Developer":
            roleData = Developer(**generateEntrepreneur(user))
        else:
            roleData = Entrepreneur(**generateDeveloper(user))
        users.append((user, roleData))
    return users

def generateDeveloper(user):
    role = {}
    role["id"] = user.id
    role["yearsOfExperience"] = randint(0, 20)
    role["technologies"] = technologies.copy()
    shuffle(role["technologies"])
    role["technologies"] = role["technologies"][:randint(1, len(technologies))]
    return role 

def generateEntrepreneur(user):
    role = {}
    role["id"] = user.id
    role["industry"] = industries[randint(0, len(industries) - 1)]
    role["companies"] = [
        fake.company(), fake.company(), fake.company(), fake.company(), fake.company()
    ]
    shuffle(role["companies"])
    role["companies"] = role["companies"][:randint(1, 5)]
    return role

def generateUser():
    user = {}
    name = fake.name()
    while name in names:
        name = fake.name()
    user["name"] = name
    user["username"] = user["name"].lower().replace(" ", "_")
    user["email"] = f"{user["username"]}@{fake.free_email_domain()}"
    user["password"] = "password"
    user["isAdmin"] = False
    user["id"] = -1
    user["socials"] = [
        f"https://instagram.com/{user["username"]}/",
        f"https://github.com/{user["username"]}/",
        f"https://twitter.com/{user["username"]}/",
        f"https://linkedin.com/in/{user["username"]}/",
        f"https://indeed.com/{user["username"]}/",
    ] 
    shuffle(user["socials"])
    user["socials"] = user["socials"][:randint(1, 5)]
    # Dev or Entrepreneur 
    user["role"] = ["Developer", "Entrepreneur"][randint(0, 1)]
    return User(**user)




if __name__ == "__main__":
    generateDB()
