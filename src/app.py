import asyncio
import json
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from sse_starlette.sse import EventSourceResponse
import time
from .utils import get_sys_vitals

app = FastAPI()


@app.get("/api")
async def root():
    return {"message": "It Works!"}


@app.get("/api/serverinfo")
async def sysinfo():
    return get_sys_vitals()


# active_connections_set = set()


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        exist: WebSocket = self.active_connections.get(client_id)
        if exist:
            await exist.close()  # you want to disconnect connected client.
            self.active_connections[client_id] = websocket
            # await websocket.close()  # reject new user with the same ID already exist
        else:
            self.active_connections[client_id] = websocket

    def disconnect(self, websocket: WebSocket, client_id: str):
        self.active_connections.pop(client_id)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)

    async def broadcast_sys_info(self, message: dict):
        for connection in self.active_connections.values():
            await connection.send_json(message)


manager = ConnectionManager()

STREAM_DELAY = 0.5
status_stream_retry_timeout = 30000


@app.get("/sys_info")
async def message_stream(request: Request):
    def new_messages():
        # Add logic here to check for new messages
        # data = get_sys_vitals
        pass

    async def event_generator():
        while True:
            # If client closes connection, stop sending events
            if await request.is_disconnected():
                break

            # Checks for new messages and return them to client if any
            # if new_messages():
            # yield get_sys_vitals()
            yield {
                "event": "update",
                "retry": status_stream_retry_timeout,
                "data": json.dumps(get_sys_vitals()),
            }

            await asyncio.sleep(STREAM_DELAY)

    return EventSourceResponse(event_generator())


# @app.websocket("/ws/{client_id}")
# async def websocket_client_endpoint(websocket: WebSocket, client_id: int):
#     await manager.connect(websocket, client_id)
#     # active_connections_set.add(websocket)
#     try:
#         while True:
#             # time.sleep(0.2)
#             await manager.broadcast_sys_info(get_sys_vitals())
#             data = await websocket.receive_text()
#     except WebSocketDisconnect:
#         manager.disconnect(websocket, client_id)
#         await manager.broadcast(f"Client #{client_id} left the chat")


# @app.on_event("shutdown")
# async def shutdown():
#     for websocket in active_connections_set:
#         await websocket.close(code=1001)


app.mount("/", StaticFiles(directory="static", html=True), name="static")
