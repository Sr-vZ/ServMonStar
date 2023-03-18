from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from src.utils import get_sys_vitals

app = FastAPI()
app.mount("/", StaticFiles(directory="static", html=True), name="static")


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/serverinfo")
async def sysinfo():
    return {"test": "123"}
