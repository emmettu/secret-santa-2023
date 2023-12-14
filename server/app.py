from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from room import Room

class RoomManager():

    def __init__(self):
        self.rooms = {}
        self.client_rooms = {}
        self.client_connections = {}

    def add_room(self, room_id):
        self.rooms[room_id] = Room()

    async def join_room(self, client_id, room_id, socket):
        print(f"client: {client_id} added to room: {room_id}")
        if room_id not in self.rooms:
            self.add_room(room_id)
        await self.rooms[room_id].add_client(client_id, socket)
        self.client_rooms[client_id] = room_id
        self.client_connections[socket] = client_id
    
    async def broadcast_room(self, client_id, message):
        room_id = self.client_rooms[client_id]
        print(f"Sending message: {message} in room: {room_id}")
        await self.rooms[room_id].broadcast(message)

    def disconnect(self, socket):
        client_id = self.client_connections[socket]
        room_id = self.client_rooms[client_id]

        self.rooms[room_id].remove_client(client_id)
        self.client_connections.pop(socket)
        self.client_rooms.pop(client_id)

        print(f"Removed client_id: {client_id}")

app = FastAPI(title="app")

room_manager = RoomManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            match data:
                case { "clientId": client_id, "roomId": room_id }:
                    await room_manager.join_room(client_id, room_id, websocket)
                case { "guess": guess, "clientId": client_id }:
                    await room_manager.broadcast_room(client_id, guess)
    except WebSocketDisconnect:
        room_manager.disconnect(websocket)


app.mount("/", StaticFiles(directory="../react-app/build", html=True), name="static")

