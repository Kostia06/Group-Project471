from fastapi import APIRouter
try:
    from app.utils import saveDB, loadDB 
    from app.models import Tag
except:
    from utils import saveDB, loadDB 
    from models import Tag

router = APIRouter()

@router.post("/tags/create")
async def create_tag(tag: Tag):
    db = loadDB()
    tag = tag.dict()
    tag["id"] = len(db["tags"])
    db["tags"].append(tag)
    saveDB(db)
    return {"status": "success", "message": "Tag successfully created"}
