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
        self.guess = None

class Room:
    def __init__(self):
        self.clients = {}
        self.scraper = WikiScraper()
        self.countries = RandomCountry()
        self.load_random_country()
        self.current_page = "guess"

    def load_random_country(self):
        self.current_country = self.countries.pick()
        print(f"page is: {self.current_country.name}")
        self.scraper.init_page(self.current_country.name)
        self.current_hints = "\n".join([self.scraper.get_random_paragraph() for _ in range(PARAGRAPHS)])

    async def add_client(self, client_id, name, websocket):
        self.clients[client_id] = Client(name, websocket)

        clients = [c.name for c in list(self.clients.values())]
        await self.send_state_update(client_id)
        await self.broadcast({ "standings": self.get_standings() })

    async def send_state_update(self, client_id):
        message = self.build_state_update()
        await self.send_message(client_id, message)

    def get_standings(self):
        print([client.guess for client in self.clients.values()])
        standings = [{ "name": client.name, "score": client.score, "guessed": client.guess is not None } for client in self.clients.values()]
        return standings

    def build_state_update(self):
        countries = [{ "id": c.id, "name": c.name } for c in self.countries.all()]
        clients = [c.name for c in list(self.clients.values())]
        standings = self.get_standings()

        return { "countries": countries, "hint": self.current_hints, "clients": clients, "standings": standings, "page": self.current_page }

    async def queue_next_round(self):
        [c.reset() for c in self.clients.values()]
        self.load_random_country()
        await sleep(10)

        self.current_page = "guess"
        for id in self.clients.keys():
            await self.send_state_update(id)

    async def with_delay(function, delay):
        await sleep(delay)
        await function()

    async def score_round(self):
        scores = { id: self.score_guess(client.guess) for id, client in self.clients.items() }

        for id, score in scores.items():
            self.clients[id].score += score

        self.current_page = "results"
        result_response = { id: { "score": scores[id], "name": client.name, "guess": client.guess.name, "lat": client.guess.latlong[0], "long": client.guess.latlong[1] } for id, client in self.clients.items() }
        answer_response = { "name": self.current_country.name, "lat": self.current_country.latlong[0], "long": self.current_country.latlong[1] }
        await self.broadcast({ "results":  result_response, "answer": answer_response, "page": self.current_page })
        create_task(self.queue_next_round())

    async def receive_guess(self, client_id, guess):
        self.clients[client_id].guess = self.countries.from_id(guess)
        
        guesses_made = len([c.guess for c in self.clients.values() if c.guess is not None])
        guesses_left = len(self.clients) - guesses_made

        if guesses_left == 0:
            create_task(self.score_round())
        else:
            await self.broadcast({ "standings": self.get_standings() })

    async def chat(self, client_id, message):
        chat_request = { "message": message, "name": self.clients[client_id].name }
        await self.broadcast({ "chat": chat_request })

    async def broadcast(self, message):
        for _, client in self.clients.items():
            await client.socket.send_json(message)

    async def send_message(self, client_id, message):
        await self.clients[client_id].socket.send_json(message)

    async def remove_client(self, client_id):
        self.clients.pop(client_id)
        await self.broadcast({ "standings": self.get_standings() })

    def score_guess(self, guess):
        if guess is None:
            return 0
        current_id = self.current_country.id
        return self.countries.score(current_id, guess.id)
