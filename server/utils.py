import json

def createDB():
    with open("db.json", "w") as f:
        json.dump({"users": []}, f)

def loadDB():
    try:
        with open("db.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        createDB()
        return loadDB()

def saveDB(data):
    with open("db.json", "w") as f:
        json.dump(data, f)

