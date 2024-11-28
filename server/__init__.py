from flask import Flask, request, jsonify 
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route("/api/get_usernames", methods=["GET"])
def handle_get_users():
    return jsonify({"usernames": ["Alice", "Bob", "Charlie"]})

@app.route("/api/add_user", methods=["POST"])
def handle_add_user():
    return jsonify({"success": True})


@app.route("api/delete_user", methods=["DELETE"])
def handle_delete_user():
    return jsonify({"success": True})


if __name__ == "__main__": 
    app.run(debug=True)
