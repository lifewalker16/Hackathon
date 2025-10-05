from mongo_connection import db

flares_collection = db["flares"]

for flare in flares_collection.find().limit(5):
    print(flare)
