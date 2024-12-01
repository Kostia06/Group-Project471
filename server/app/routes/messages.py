from app.utils import saveDB, loadDB, upload_file, load_file
from flask import Blueprint, request, jsonify 

messages_bp = Blueprint("messages", __name__)

@messages_bp.route("/create", methods=["POST"])
def handle_send_message():
    data = request.get_json()
    db = loadDB()
    id = len(db["messages"])
    data["id"] = id
    for i, file in enumerate(data.get("files", [])):
        data["files"][i] = upload_file(file)
    db["messages"].append(data)
    saveDB(db)
    return jsonify({"status": "success","message": "Message successfully sent"})

@messages_bp.route("/getFromProject/<projectId>/<lastMessageId>", methods=["GET"])
def handle_get_messages_from_project(projectId, lastMessageId):
    db = loadDB()
    id = int(projectId)
    lastMessageId = int(lastMessageId)
    messages = [message for message in db["messages"] if message["projectId"] == id]
    if lastMessageId == messages[-1]["id"]:
        return jsonify({"status": "success","data": [],"new": False})

    for message in messages:
        for i, file in enumerate(message.get("files", [])):
            message["files"][i] = load_file(file)
    return jsonify({"status": "success","new": True ,"data": messages[::-1]})
