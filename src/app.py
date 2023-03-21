from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
import time
from .utils import get_sys_vitals

app = FastAPI()


@app.get("/api")
async def root():
    return {"message": "It Works!"}


@app.get("/api/serverinfo")
async def sysinfo():
    return get_sys_vitals()


active_connections_set = set()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections_set.add(websocket)
    while True:
        try:
            time.sleep(0.2)
            await websocket.send_json(get_sys_vitals())
        except WebSocketDisconnect:
            pass


@app.on_event("shutdown")
async def shutdown():
    for websocket in active_connections_set:
        await websocket.close(code=1001)


app.mount("/", StaticFiles(directory="static", html=True), name="static")
