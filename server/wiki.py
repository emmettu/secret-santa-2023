import requests
import re
from parsel import Selector
import random
import editdistance

WIKI_URL = "https://en.wikipedia.org/wiki"

CHARACTER_MIN = 120

REDACT_CHARACTER_MIN = 4

# REDACT_THRESHOLD = 0.75
REDACT_THRESHOLD = 6

class WikiScraper():

    def __init__(self):
        with open("./config/word_ranks.txt", "r") as word_rank_txt:
            words = word_rank_txt.read().splitlines()
            self.word_ranks = {}
            for index, word in enumerate(words):
                self.word_ranks[word] = index

    def init_page(self, page):
        html = requests.get(f"{WIKI_URL}/{page}").text
        selector = Selector(text=html)

        paragraphs = selector.css("p")
        paragraphs = [p.xpath("string()").get() for p in paragraphs]
        paragraphs = [p for p in paragraphs if len(p) > CHARACTER_MIN]

        paragraphs = [re.sub("\[.*?\]", "", p) for p in paragraphs]
        self.paragraphs = paragraphs

        self.redact_idf()


    def get_random_paragraph(self):
        return random.choice(self.paragraphs)

    def redact_idf(self):
        page_word_counts = {}
        for paragraph in self.paragraphs:
            for word in paragraph.split():
                token = self.tokenize(word)
                page_word_counts[token] = 1 if token not in page_word_counts else page_word_counts[token] + 1

        page_word_ranks = sorted(list(page_word_counts.keys()), key=lambda w: page_word_counts[w], reverse=True)
        self.page_word_ranks = {}

        for index, word in enumerate(page_word_ranks):
            self.page_word_ranks[word] = index
        
        for index, paragraph in enumerate(self.paragraphs):
            banned_words = set()
            clean_words = []
            for word in paragraph.split():
                token = self.tokenize(word)
                
                if len(token) <= 1:
                    continue

                trp = (self.word_ranks[token] + 1) / len(self.word_ranks) if token in self.word_ranks else 1
                drp = (self.page_word_ranks[token] + 1) / len(self.page_word_ranks) if token in self.page_word_ranks else 1

                importance = trp * (1 / drp)
                clean_words.append(word if importance < REDACT_THRESHOLD else "[redacted]")

            self.paragraphs[index] = " ".join(clean_words) + "\n"


    def tokenize(self, word):
        fn = lambda x: x.isalpha() or x == "."
        return "".join(filter(fn, word)).lower()

if __name__ == "__main__":
    scraper = WikiScraper()
    scraper.init_page("Germany")
    print(scraper.get_random_paragraph())

