from flask import Flask, request, jsonify 
from flask_cors import CORS
from utils import saveDB, loadDB

app = Flask(__name__)
CORS(
    app, 
    resources={r"/api/*": {"origins": "http://localhost:3000"}}, 
)

@app.route("/api/users/get/<key>", methods=["GET"])
def handle_get_users(key):
    print("Getting user with key", key)
    db = loadDB()
    usernames = [user[key] for user in db["users"]]
    return jsonify(usernames), 200

@app.route("/api/users/signup", methods=["POST"])
def handle_add_user():
    data = request.get_json()
    print("Adding user, ", data.get("username"))
    db = loadDB()
    id = len(db["users"])
    data["id"] = id
    db["users"].append(data)
    saveDB(db)
    return jsonify({"status": "success"})

# add some messures from preventing same api address to be used
@app.route("/api/users/login", methods=["POST"])
def handle_login():
    data = request.get_json()
    print("Logging in user, ", data.get("id"))
    db = loadDB()
    for user in db["users"]:
        if user["username"] == data["id"] or user["email"] == data["id"]:
            if user["password"] == data["password"]:
                return jsonify({"status": "success", "user": user, "message": "User logged in"})
            return jsonify({"status": "error", "message": "Invalid password"})
    return jsonify({"status": "error", "message": "User not found"})

@app.route("/api/users/update", methods=["POST"])
def handle_update_user():
    data = request.get_json()
    print("Updating user", data.get("id"))
    db = loadDB()
    db["users"][data.get("id")] = data
    saveDB(db)
    return jsonify({"status": "success", "message": "User updated"})


@app.route("/api/users/delete/<id>", methods=["GET"])
def handle_delete_user(key):
    db = loadDB()
    db["users"] = [user for user, id in enumerate(db["users"]) if id != key]
    saveDB(db)
    return jsonify({"status": "success"})

if __name__ == "__main__": 
    app.run(debug=True)
