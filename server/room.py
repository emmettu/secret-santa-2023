from wiki import WikiScraper
from random_country import RandomCountry

class Room:
    
    def __init__(self):
        self.clients = {}
        self.scraper = WikiScraper()
        self.page = RandomCountry().pick()
        print(f"page is: {self.page}")
        self.scraper.init_page(self.page)
        self.current_hint = self.scraper.get_random_paragraph()

    async def add_client(self, client_id, websocket):
        self.clients[client_id] = websocket

        hint_response = {"hint": self.current_hint}
        await websocket.send_json(hint_response)
        await self.broadcast({ "clients": list(self.clients.keys()) })

    async def receive_guess(self, client_id, guess):
        socket = self.clients[client_id]
        if guess.lower() == self.page.lower():
            await socket.send_json({ "correct": True })
        else:
            await socket.send_json({ "correct": False })
    
    async def broadcast(self, message):
        for _, socket in self.clients.items():
            await socket.send_json(message)

    def send_message(self, client_id, message):
        self.clients[client_id].send_json(message)

    def remove_client(self, client_id):
        self.clients.pop(client_id)

    async def next_paragraph(self):
        self.current_hint = self.scraper.get_random_paragraph()
        await self.broadcast({ "hint": self.current_hint })
