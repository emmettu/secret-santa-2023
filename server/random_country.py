import random

class RandomCountry:
    
    def __init__(self):
        self.countries = []
        with open("./config/country-coord.csv", "r") as csv:
            lines = csv.read().strip("\n").split("\n")[1:]
            for line in lines:
                country_name = line.split(",")[0]
                self.countries.append(country_name)

    def pick(self):
        return random.choice(self.countries)


if __name__ == "__main__":
    print(RandomCountry().pick())
