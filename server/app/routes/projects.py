from app.utils import saveDB, loadDB, upload_file, load_file
from flask import Blueprint, request, jsonify 
from rapidfuzz import process

projects_bp = Blueprint("projects", __name__)


@projects_bp.route("/create", methods=["POST"])
def handle_create_project():
    data = request.get_json()
    db = loadDB()
    id = len(db["projects"])
    data["id"] = id
    db["projects"].projects_bpend(data)
    saveDB(db)
    return jsonify({"status": "success","message": "Project successfully created", "data": data})


@projects_bp.route("/create", methods=["POST"])
def handle_project_create():
    db = loadDB()
    id = len(db["projects"])
    data = request.get_json()
    data["id"] = id
    db["projects"].projects_bpend(data)
    saveDB(db)
    return jsonify({"status": "success","message": "Project successfully created", "data": data})

@projects_bp.route("/update", methods=["POST"])
def handle_update_project():
    data = request.get_json()
    db = loadDB()
    db["projects"][data.get("id")] = data
    saveDB(db)
    return jsonify({"status": "success","message": "Project updated"})

@projects_bp.route("/find/<value>", methods=["GET"])
def handle_find_project(value):
    db = loadDB()
    projects = db["projects"]
    projectNames = [project["name"] for project in projects]
    results = process.extract(value, projectNames, limit=10)
    results = [projects[result[2]] for result in results]
    return jsonify({"status": "success","data": results})

@projects_bp.route("/join/<projectId>/<userId>", methods=["GET"])
def handle_join_project(projectId, userId):
    db = loadDB()
    projectId = int(projectId)
    userId = int(userId)
    for project in db["projects"]:
        if project["id"] == projectId:
            project["users"].projects_bpend(userId)
            saveDB(db)
            return jsonify({"status": "success","message": "User successfully joined project", "data": db["projects"][projectId]})
    return jsonify({"status": "error","message": "Project not found", "data": db["projects"][projectId]})


@projects_bp.route("/getFromUser/<id>", methods=["GET"])
def handle_get_projects_from_user(id):
    db = loadDB()
    projects = []
    id = int(id)
    for project in db["projects"]:
        if id in project["users"]:
            projects.append(project)
    return jsonify({"status": "success","data": projects})

