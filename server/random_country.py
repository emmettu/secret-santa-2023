import random
import math


class Country:
    def __init__(self, id, name, latlong):
        self.id = id
        self.name = name
        self.latlong = latlong

#1   Country,Alpha-2 code,Alpha-3 code,Numeric code,Latitude (average),Longitude (average)
class RandomCountry:
    def __init__(self):
        self.countries = {}
        with open("./config/country-coord.csv", "r") as csv:
            lines = csv.read().strip("\n").split("\n")[1:]
            for line in lines:
                name, id ,_, _, lat, long = line.split(",")
                country = Country(id, name, (float(lat), float(long)))
                self.countries[id] = country

    def pick(self):
        choices = list(self.countries.values())
        return random.choice(choices)

    def all(self):
        return self.countries.values()

    def from_id(self, id):
        return self.countries[id]

    def distance(self, id1, id2):
        lat1, long1 = self.countries[id1].latlong
        lat2, long2 = self.countries[id2].latlong    

        print(lat1, long1)
        print(lat2, long2)

        val = math.sin(math.radians(lat1))*math.sin(math.radians(lat2))+math.cos(math.radians(lat1))*math.cos(math.radians(lat2))*math.cos(math.radians(long2-long1))
        return math.acos(min(val, 1.0))*6371

    def score(self, id1, id2):
        distance = self.distance(id1, id2)
        score = 5000 * 10 ** (-distance/ 2000)

        return math.ceil(score)


if __name__ == "__main__":
    print(RandomCountry().pick())
