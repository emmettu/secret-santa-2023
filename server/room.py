from wiki import WikiScraper

class Room:
    
    def __init__(self):
        self.clients = {}
        self.scraper = WikiScraper()
        self.scraper.init_page("Micronesia")
        self.current_hint = self.scraper.get_random_paragraph()

    async def add_client(self, client_id, websocket):
        self.clients[client_id] = websocket

        hint_response = {"hint": self.current_hint}
        await websocket.send_json(hint_response)
    
    async def broadcast(self, message):
        for _, socket in self.clients.items():
            await socket.send_json(message)

    def send_message(self, client_id, message):
        self.clients[client_id].send_json(message)

    def remove_client(self, client_id):
        self.clients.pop(client_id)
