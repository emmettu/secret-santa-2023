from fastapi import BackgroundTasks, FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.requests import Request
from room import Room
from time import sleep
import asyncio

class RoomManager():

    def __init__(self):
        self.rooms = {}
        self.client_rooms = {}
        self.client_connections = {}

    def add_room(self, room_id):
        self.rooms[room_id] = Room(room_id)

    async def next_paragraph(self, room_id):
        await self.rooms[room_id].next_paragraph()

    async def join_room(self, client_id, name, room_id, socket):
        print(f"client: {client_id} added to room: {room_id}")
        if room_id not in self.rooms:
            self.add_room(room_id)
        await self.rooms[room_id].add_client(client_id, name, socket)
        self.client_rooms[client_id] = room_id
        self.client_connections[socket] = client_id

    async def start_game(self, client_id):
        room_id = self.client_rooms[client_id]
        await self.rooms[room_id].start_game()
    
    async def receive_guess(self, client_id, message):
        room_id = self.client_rooms[client_id]
        print(f"Sending message: {message} in room: {room_id}")
        await self.rooms[room_id].receive_guess(client_id, message)

    async def chat(self, client_id, message):
        room_id = self.client_rooms[client_id]
        print(f"Sending message: {message} in room: {room_id}")
        await self.rooms[room_id].chat(client_id, message)

    async def receive_guess(self, client_id, message):
        room_id = self.client_rooms[client_id]
        print(f"Sending message: {message} in room: {room_id}")
        await self.rooms[room_id].receive_guess(client_id, message)

    async def send_state_update(self, client_id):
        room_id = self.client_rooms[client_id]
        print(f"Sending update")
        await self.rooms[room_id].send_state_update(client_id)

    async def disconnect(self, socket):
        if socket not in self.client_connections:
            return

        client_id = self.client_connections[socket]
        room_id = self.client_rooms[client_id]

        await self.rooms[room_id].remove_client(client_id)
        self.client_connections.pop(socket)
        self.client_rooms.pop(client_id)

        print(f"Removed client_id: {client_id}")

app = FastAPI(title="app")

room_manager = RoomManager()

async def next_paragraph(room_id):
    sleep(5)
    await room_manager.next_paragraph(room_id)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, background_tasks: BackgroundTasks):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            match data:
                case { "clientId": client_id, "name": name, "roomId": room_id }:
                    await room_manager.join_room(client_id, name, room_id, websocket)
                case { "guess": guess, "clientId": client_id }:
                    await room_manager.receive_guess(client_id, guess)
                case { "update": client_id }:
                    await room_manager.send_state_update(client_id)
                case { "clientId": client_id, "message": message }:
                    await room_manager.chat(client_id, message)
                case { "clientId": client_id, "start": _ }:
                    await room_manager.start_game(client_id)
    except WebSocketDisconnect:
        await room_manager.disconnect(websocket)

app.mount("/", StaticFiles(directory="./static", html=True), name="static")

