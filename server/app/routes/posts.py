from fastapi import APIRouter
from app.utils import saveDB, loadDB 
from app.models import Post, Comment 
import json

router = APIRouter()

@router.post("/posts/create")
def create_post(post: Post):
    db = loadDB()
    post = post.dict()
    post["id"] = len(db["posts"])
    db["posts"].append(post)
    saveDB(db)
    return {"status": "success", "message": "Post successfully created"}

@router.post("/posts/create/comment")
def create_comment(comment: Comment):
    db = loadDB()
    comment = comment.dict()
    comment["id"] = len(db["comments"])
    db["comments"].append(comment)
    saveDB(db)
    return {"status": "success", "message": "Comment successfully created"}

@router.get("/posts/get/comments/{postId}/{lastCommentId}")
def get_comments(postId: int, lastCommentId: int):
    db = loadDB()
    comments = [comment for comment in db["comments"] if comment["postId"] == postId]
    if comments and lastCommentId == comments[-1]["id"]:
        return {"status": "success", "data": [], "new": False}
    return {"status": "success", "data": comments, "new": True}

@router.get("/posts/get/tags/{postId}")
def get_tags(postId: int):
    db = loadDB()
    tags = [tag for tag in db["tags"] if tag["postId"] == postId]
    return {"status": "success", "data": tags}

@router.get("/posts/getAll/{lastPostId}")
def get_all_posts(lastPostId: int):
    db = loadDB()
    posts = db["posts"]
    if posts and lastPostId == posts[-1]["id"]:
        return {"status": "success", "data": [], "new": False}
    return {"status": "success", "data": posts, "new": True}

