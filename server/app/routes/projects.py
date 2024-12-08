from fastapi import APIRouter
try: 
    from app.utils import saveDB, loadDB, upload_file, load_file
    from app.models import Project, Task, Message
except:
    from utils import saveDB, loadDB, upload_file, load_file
    from models import Project, Task, Message
from rapidfuzz import process
import time

router = APIRouter()

@router.post("/projects/create")
def create_project(project: Project):
    db = loadDB()
    project = project.dict()
    project["id"] = len(db["projects"])
    db["projects"].append(project)
    saveDB(db)
    return {"status": "success", "message": "Project successfully created", "data": project}

@router.post("/projects/update")
def update_project(project: Project):
    db = loadDB()
    project = project.dict()
    db["projects"][project.get("id")] = project
    saveDB(db)
    return {"status": "success", "message": "Project updated"}

@router.get("/projects/find/{value}/{userId}")
def find_project(value: str, userId: int):
    db = loadDB()
    projects = db["projects"]
    projectNames = [project["name"] for project in projects]
    results = process.extract(value, projectNames, limit=10)
    results = [projects[result[2]] for result in results]
    results = [project for project in results if not userId in project["users"]]
    return {"status": "success", "data": results}

@router.get("/projects/join/{projectId}/{userId}")
def join_project(projectId: int, userId: int):
    db = loadDB()
    # get the project
    project = db["projects"][projectId]
    if userId in project["users"]:
        return {"status": "error", "joined": True, "message": "User already in project"}
    project["users"].append(userId)
    saveDB(db)
    return {"status": "success", "joined": False, "message": "User successfully joined project", "data": db["projects"][projectId]}


@router.get("/projects/getFromUser/{id}")
def get_projects_from_user(id: int):
    db = loadDB()
    projects = []
    for project in db["projects"]:
        if id in project["users"]:
            projects.append(project)
    return {"status": "success", "data": projects}

@router.get("/projects/getFromOwner/{id}")
def get_projects_from_owner(id: int):
    db = loadDB()
    projects = []
    for project in db["projects"]:
        if id == project["owner"]:
            projects.append(project)
    return {"status": "success", "data": projects}

@router.post("/tasks/create")
def create_task(task: Task):
    db = loadDB()
    task = task.dict()
    task["id"] = len(db["tasks"])
    task["date"] = time.time() + 86400
    db["tasks"].append(task)
    saveDB(db)
    return {"status": "success", "message": "Task successfully created"}

@router.get("/tasks/getFromProject/{projectId}/{lastTaskId}")
def get_tasks_from_project(projectId: int, lastTaskId: int):
    db = loadDB()
    tasks = []
    i = 0
    while i < len(db["tasks"]): 
        task = db["tasks"][i]
        # if task is completed and the due date is passed, remove it
        if task.get("date") <= time.time() and task.get("status") == "Completed":
            db["tasks"].remove(task)
        # if the task in the project, add it 
        elif task.get("projectId") == id:
            tasks.append(task)
        i += 1
    saveDB(db)
    # check if front end has to get updated based of lastTaskId
    if tasks and lastTaskId == tasks[-1]["id"]:
        return {"status": "success", "data": [], "new": False}
    return {"status": "success", "new": True, "data": tasks}

@router.post("/tasks/update")
def update_task(task: Task):
    db = loadDB()
    task = task.dict()
    db["tasks"][task.get("id")] = task
    if task.get("status") == "completed":
        # add the future due date by a day 
        db["tasks"][task.get("id")]["completedAt"] = time.time() + 86400
    saveDB(db)
    return {"status": "success", "message": "Task updated"}

@router.post("/messages/create")
def create_message(message: Message):
    db = loadDB()
    message = message.dict()
    message["id"] = len(db["messages"])
    message["date"] = time.time()
    for i, file in enumerate(message.get("files", [])):
        message["files"][i] = upload_file(file)
    db["messages"].append(message)
    saveDB(db)
    return {"status": "success", "message": "Message successfully sent"}

@router.get("/messages/getFromProject/{projectId}/{lastMessageId}")
def get_messages_from_project(projectId: int, lastMessageId: int):
    db = loadDB()
    messages = [message for message in db["messages"] if message["projectId"] == projectId]
    if messages and lastMessageId == messages[-1]["id"]:
        return {"status": "success", "data": [], "new": False}

    for message in messages:
        for i, file in enumerate(message.get("files", [])):
            message["files"][i] = load_file(file)
    return {"status": "success", "new": True, "data": messages[::-1]}

@router.get("/projects/get/tags/{projectId}")
def get_tags(projectId: int):
    db = loadDB()
    tags = [tag for tag in db["tags"] if tag["projectId"] == projectId]
    return {"status": "success", "data": tags}
