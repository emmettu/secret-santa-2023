from wiki import WikiScraper
from random_country import RandomCountry
from asyncio import create_task, sleep

PARAGRAPHS = 3
ROUND_TIMER = 17
ROUNDS = 5

class Client:
    def __init__(self, name, socket):
        self.name = name
        self.socket = socket
        self.score = 0
        self.guess = None
    
    def reset(self):
        self.guess = None

    def full_reset(self):
        self.reset()
        self.score = 0

class Room:
    def __init__(self, name):
        self.name = name
        self.clients = {}
        self.scraper = WikiScraper()
        self.countries = RandomCountry()
        self.load_random_country()
        self.current_page = "lobby"
        self.round_counter = 1
        self.round_score = {}

    def reset(self):
        self.current_page = "guess"
        self.round_counter = 1
        self.round_score = {}
        [c.full_reset() for c in self.clients.values()]

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

    async def start_game(self):
        if self.round_counter > 1:
            self.reset()

        self.current_page = "guess"
        await self.broadcast_state_update()

    async def send_state_update(self, client_id):
        message = self.build_state_update()
        await self.send_message(client_id, message)

    def get_standings(self):
        standings = [{ "name": client.name, "score": client.score, "guessed": client.guess is not None } for client in self.clients.values()]
        return standings

    def build_state_update(self):
        countries = [{ "id": c.id, "name": c.name } for c in self.countries.all()]
        clients = [c.name for c in list(self.clients.values())]
        standings = self.get_standings()

        if self.current_page == "lobby":
            return { "standings": standings, "page": self.current_page, "room": self.name }
        elif self.current_page == "guess":
            return { "countries": countries, "hint": self.current_hints, "clients": clients, "standings": standings, "page": self.current_page, "round": self.round_counter }
        elif self.current_page == "results":
            return self.build_result_update()
        elif self.current_page == "final":
            return { "standings": standings, "page": self.current_page }

    async def queue_next_round(self):
        [c.reset() for c in self.clients.values()]
        self.load_random_country()

        await sleep(ROUND_TIMER)

        if self.round_counter < ROUNDS:
            self.round_counter += 1
            self.current_page = "guess"
        else:
            self.current_page = "final"

        await self.broadcast_state_update()

    async def broadcast_state_update(self):
        for id in self.clients.keys():
            await self.send_state_update(id)

    async def with_delay(function, delay):
        await sleep(delay)
        await function()

    async def score_round(self):
        self.round_score = { id: self.score_guess(client.guess) for id, client in self.clients.items() }

        for id, score in self.round_score.items():
            self.clients[id].score += score

        self.current_page = "results"
        await self.broadcast_state_update()

        create_task(self.queue_next_round())

    def build_result_update(self):
        result_response = { id: { "score": self.round_score[id], "name": client.name, "guess": client.guess.name, "lat": client.guess.latlong[0], "long": client.guess.latlong[1] } for id, client in self.clients.items() if client.guess is not None }
        answer_response = { "name": self.current_country.name, "lat": self.current_country.latlong[0], "long": self.current_country.latlong[1] }
        return { "results":  result_response, "answer": answer_response, "page": self.current_page }


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
