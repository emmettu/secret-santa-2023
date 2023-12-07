from fastapi import FastAPI, WebSocket

app = FastAPI()
@app.websocket("/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_json(mode="binary")
        await websocket.send_bytes(f"Message text was: {data}")

