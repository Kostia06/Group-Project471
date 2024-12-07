from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from .routes import users
from .routes import projects
from .routes import posts
from .routes import tags

def create_app():
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],  # List of allowed origins
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["Content-Type", "Authorization"],
    )
    app.include_router(users.router, tags=["users"])
    app.include_router(projects.router, tags=["projects", "tasks", "messages"])
    app.include_router(posts.router, tags=["posts", "comments", "tags"])
    app.include_router(tags.router, tags=["tags"])
    return app

if __name__ == "__main__":
    app = create_app()
    uvicorn.run("app.__main__:create_app", host="127.0.0.1", port=5000, reload=True)

