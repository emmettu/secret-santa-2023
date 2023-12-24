from wiki import WikiScraper
from random_country import RandomCountry
from asyncio import create_task, sleep

PARAGRAPHS = 3

class Client:
    def __init__(self, name, socket):
        self.name = name
        self.socket = socket
        self.score = 0
        self.guess = None
    
    def reset(self):
        guess = None

class Room:
    def __init__(self):
        self.clients = {}
        self.scraper = WikiScraper()
        self.countries = RandomCountry()
        self.load_random_country()

    def load_random_country(self):
        self.current_country = self.countries.pick()
        print(f"page is: {self.current_country.name}")
        self.scraper.init_page(self.current_country.name)
        self.current_hints = "\n".join([self.scraper.get_random_paragraph() for _ in range(PARAGRAPHS)])

    async def add_client(self, client_id, name, websocket):
        self.clients[client_id] = Client(name, websocket)

        clients = [c.name for c in list(self.clients.values())]
        await self.broadcast({ "clients": clients })

    def build_state_update(self):
        countries = [{ "id": c.id, "name": c.name } for c in self.countries.all()]
        clients = [c.name for c in list(self.clients.values())]

        return { "countries": countries, "hint": self.current_hints, "clients": clients }

    async def send_state_update(self, client_id):
        message = self.build_state_update()
        await self.send_message(client_id, message)

    async def queue_next_round(self):
        [c.reset() for c in self.clients.values()]
        self.load_random_country()
        await sleep(10)
        await self.broadcast({ "page": "guess" })

    async def score_round(self):
        scores = { id: { "score": self.score_guess(client.guess), "name": client.name, "guess": client.guess.name } for id, client in self.clients.items() }
        await self.broadcast({ "results":  scores, "answer": self.current_country.name })
        create_task(self.queue_next_round())

    async def receive_guess(self, client_id, guess):
        self.clients[client_id].guess = self.countries.from_id(guess)
        guesses_left = len([c.guess for c in self.clients.values() if c.guess is None])

        if guesses_left == 0:
            create_task(self.score_round())

    async def broadcast(self, message):
        for _, client in self.clients.items():
            await client.socket.send_json(message)

    async def send_message(self, client_id, message):
        await self.clients[client_id].socket.send_json(message)

    def remove_client(self, client_id):
        self.clients.pop(client_id)

    def score_guess(self, guess):
        if guess is None:
            return 0
        current_id = self.current_country.id
        return self.countries.score(current_id, guess.id)
