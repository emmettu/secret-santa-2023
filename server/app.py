from fastapi import FastAPI, WebSocket

class RoomManager():

    def __init__(self):
        self.rooms = {}
        self.client_rooms = {}

    def add_room(self, room_id):
        self.rooms[room_id] = {}

    def join_room(self, client_id, room_id, socket):
        print(f"client: {client_id} added to room: {room_id}")
        if room_id not in self.rooms:
            self.rooms[room_id] = {}
        self.rooms[room_id][client_id] = socket
        self.client_rooms[client_id] = room_id
    
    async def broadcast_room(self, client_id, message):
        room_id = self.client_rooms[client_id]
        for _, socket in self.rooms[room_id].items():
            await socket.send_bytes(message)

app = FastAPI()

room_manager = RoomManager()

@app.websocket("/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_json(mode="binary")

        match data:
            case { "client_id": client_id, "room_id": room_id }:
                room_manager.join_room(client_id, room_id, websocket)
            case { "guess": guess, "client_id": client_id }:
                await room_manager.broadcast_room(client_id, guess)

