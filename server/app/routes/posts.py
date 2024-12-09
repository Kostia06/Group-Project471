from fastapi import APIRouter
try:
    from app.utils import saveDB, loadDB 
    from app.models import Post, Comment 
except:
    from utils import saveDB, loadDB 
    from models import Post, Comment

router = APIRouter()

@router.post("/posts/create")
async def create_post(post: Post):
    db = loadDB()
    post = post.dict()
    post["id"] = len(db["posts"])
    db["posts"].append(post)
    saveDB(db)
    return {"status": "success", "id": post["id"], "message": "Post successfully created"}

@router.post("/posts/create/comment")
async def create_comment(comment: Comment):
    db = loadDB()
    comment = comment.dict()
    comment["id"] = len(db["comments"])
    db["comments"].append(comment)
    saveDB(db)
    return {"status": "success", "message": "Comment successfully created"}

@router.get("/posts/get/comments/{postId}/{lastCommentId}")
async def get_comments(postId: int, lastCommentId: int):
    db = loadDB()
    comments = [comment for comment in db["comments"] if comment["postId"] == postId]
    if comments and lastCommentId == comments[-1]["id"]:
        return {"status": "success", "data": [], "new": False}
    return {"status": "success", "data": comments, "new": True}

@router.get("/posts/get/tags/{postId}")
async def get_tags(postId: int):
    db = loadDB()
    tags = [tag for tag in db["tags"] if tag["postId"] == postId]
    return {"status": "success", "data": tags}

@router.get("/posts/getAll/{lastPostId}")
async def get_all_posts(lastPostId: int):
    db = loadDB()
    posts = db["posts"]
    if posts and lastPostId == posts[-1]["id"]:
        return {"status": "success", "data": [], "new": False}
    return {"status": "success", "data": posts, "new": True}

