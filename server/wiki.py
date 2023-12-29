import requests
import re
from parsel import Selector
import random
import editdistance

WIKI_URL = "https://en.wikipedia.org/wiki"

CHARACTER_MIN = 120

REDACT_CHARACTER_MIN = 4

REDACT_THRESHOLD = 0.75

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
        banned_words = set()
        name_word_length = len(page_name.split())
        name_length = len(page_name)
        words = paragraph.split()
        for index, _ in enumerate(words[0:-name_word_length]):
            window = words[index:index + name_word_length]
            phrase = " ".join(window)
            if editdistance.eval(phrase.lower(), page_name.lower()) / name_length < REDACT_THRESHOLD:
                banned_words.add(phrase)
        
        length_sorted_words = sorted(list(banned_words), key=len, reverse=True)
        for word in length_sorted_words:
            paragraph = paragraph.replace(word, "[redacted]")
        return paragraph

if __name__ == "__main__":
    scraper = WikiScraper()
    scraper.init_page("Mali")

    print(scraper.get_random_paragraph())
