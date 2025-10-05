from pymongo import MongoClient
import certifi
import os

# -----------------------------
# MongoDB Atlas connection
# -----------------------------
MONGO_URI = "mongodb+srv://prachivernekar00_db_user:Pra04%40Vk@cluster0.6fy7lm0.mongodb.net/nasa_db?retryWrites=true&w=majority&appName=Cluster0"

# Create client with TLS and certifi CA bundle
client = MongoClient(MONGO_URI, tls=True, tlsCAFile=certifi.where())

# Select database
db = client["nasa_data"]

# Optional: test connection
try:
    print("Databases:", client.list_database_names())
    print("✅ MongoDB connection successful")
except Exception as e:
    print("❌ MongoDB connection failed:", e)
