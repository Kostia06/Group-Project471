import json
import os 
import uuid

dir_path = os.path.dirname(os.path.realpath(__file__))
db_path = dir_path + "/static/db.json"    
uploads_path = dir_path + "/static/uploads/"

struct = {
    "users": [],
    "posts": [],
    "projects": [],
    "comments": [],
    "messages": []
}

def createDB():
    with open(db_path, "w") as f:
        json.dump(struct, f)

def loadDB():       
    try:
        with open(db_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        createDB()
        return loadDB()

def saveDB(data):
    with open(db_path, "w") as f:
        json.dump(data, f)


def upload_file(file_content):
    id = str(uuid.uuid4())
    filename = uploads_path + id
    print(filename)
    with open(filename, "w") as f:
        json.dump(file_content, f)
    return id

def load_file(file_id):
    filename = uploads_path + file_id
    with open(filename, "r") as f:
        return json.load(f)