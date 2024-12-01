from app.utils import saveDB, loadDB, upload_file, load_file
from flask import Blueprint, request, jsonify 

user_bp = Blueprint("users", __name__)

@user_bp.route("/get/<key>", methods=["GET"])
def handle_get_users(key):
    db = loadDB()
    try:
        usernames = [user[key] for user in db["users"]]
    except KeyError:
        return jsonify({"status": "error", "message": "Invalid key"})
    return jsonify({"status": "success","data": usernames})


@user_bp.route("/signup", methods=["POST"])
def handle_add_user():
    data = request.get_json()
    db = loadDB()
    id = len(db["users"])
    data["id"] = id
    db["users"].user_bpend(data)
    saveDB(db)
    return jsonify({"status": "success","message": "User successfully created", "data": data})


# add some messures from preventing same api address to be used
@user_bp.route("/login", methods=["POST"])
def handle_login():
    data = request.get_json()
    db = loadDB()
    for user in db["users"]:
        if user["username"] == data["id"] or user["email"] == data["id"]:
            if user["password"] == data["password"]:
                return jsonify({"status": "success","data": user, "message": "User logged in"})
            return jsonify({"status": "error","message": "Invalid password"})
    return jsonify({"status": "error","message": "User not found"})

@user_bp.route("/update", methods=["POST"])
def handle_update_user():
    data = request.get_json()
    db = loadDB()
    db["users"][data.get("id")] = data
    saveDB(db)
    return jsonify({"status": "success","message": "User updated"})


@user_bp.route("/delete/<id>", methods=["GET"])
def handle_delete_user(key):
    db = loadDB()
    db["users"] = [user for user, id in enumerate(db["users"]) if id != key]
    saveDB(db)
    return jsonify({"status": "success","status": "success"})


@user_bp.route("/getById/<id>", methods=["GET"])
def handle_get_user(id):
    db = loadDB()
    id = int(id)
    user = db["users"][id]
    return jsonify({"status": "success","data": user})
