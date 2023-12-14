import requests
import re
from parsel import Selector
import random

WIKI_URL = "https://en.wikipedia.org/wiki"

CHARACTER_MIN = 120

REDACT_CHARACTER_MIN = 4

class WikiScraper():

    def init_page(self, page):
        html = requests.get(f"{WIKI_URL}/{page}").text
        selector = Selector(text=html)

        paragraphs = selector.css("p")
        paragraphs = [p.xpath("string()").get() for p in paragraphs]
        paragraphs = [p for p in paragraphs if len(p) > CHARACTER_MIN]

        paragraphs = [re.sub("\[.*?\]", "", p) for p in paragraphs]

        paragraphs = [self.redact_paragraph(p, page) for p in paragraphs]

        self.paragraphs = paragraphs
        

    def get_random_paragraph(self):
        return random.choice(self.paragraphs)

    def redact_paragraph(self, paragraph, page_name):
        page_name = page_name.lower()
        banned_words = set()
        for word in paragraph.split():
            if word[:REDACT_CHARACTER_MIN].lower() == page_name[:REDACT_CHARACTER_MIN]:
                banned_words.add(word)
        for word in banned_words:
            paragraph = paragraph.replace(word, "[redacted]")
        return paragraph

if __name__ == "__main__":
    scraper = WikiScraper()
    scraper.init_page("Cambodia")

    print(scraper.get_random_paragraph())
