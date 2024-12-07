from fastapi import APIRouter
from app.utils import saveDB, loadDB 
from app.models import Tag
import json

router = APIRouter()

@router.post("/tags/create")
def create_tag(tag: Tag):
    db = loadDB()
    tag = tag.dict()
    tag["id"] = len(db["tags"])
    db["tags"].append(tag)
    saveDB(db)
    return {"status": "success", "message": "Tag successfully created"}
