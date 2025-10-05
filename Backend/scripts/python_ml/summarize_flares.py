import pandas as pd
from datetime import datetime, timedelta, timezone
import requests
import json
import subprocess
import sys
from sqlalchemy import create_engine

# -------------------------
# Hugging Face API Setup
# -------------------------
API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
API_TOKEN = "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"  # replace with your Hugging Face token
headers = {"Authorization": f"Bearer {API_TOKEN}"}

def summarize_text(text, max_len=130, min_len=50):
    """Summarize text using Hugging Face API with error handling"""
    payload = {"inputs": text, "parameters": {"max_length": max_len, "min_length": min_len}}
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=20)
        response.raise_for_status()
        result = response.json()
        if isinstance(result, list) and "summary_text" in result[0]:
            return result[0]["summary_text"]
        print("Unexpected API response:", result)
        return text
    except requests.RequestException as e:
        print("Hugging Face API request failed:", e)
        return text
    except ValueError as e:
        print("Hugging Face API returned invalid JSON:", e, response.text)
        return text

# -------------------------
# Connect to database using SQLAlchemy (warning-free with pandas)
# -------------------------
DB_USER = "root"
DB_PASS = "kali16"
DB_HOST = "localhost"
DB_NAME = "nasa_data"

engine = create_engine(f"mysql+mysqlconnector://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}")

# -------------------------
# 1️⃣ Daily/Weekly Summary
# -------------------------
def daily_weekly_summary():
    now = datetime.now(timezone.utc)
    last_week = now - timedelta(days=7)

    query = f"""
        SELECT beginTime, classType
        FROM flares
        WHERE beginTime BETWEEN '{last_week.strftime("%Y-%m-%d %H:%M:%S")}' 
                            AND '{now.strftime("%Y-%m-%d %H:%M:%S")}'
    """
    df = pd.read_sql(query, engine)

    if df.empty:
        return "No solar flares were recorded in the last 7 days."

    total = len(df)
    df["mainClass"] = df["classType"].str[0]
    class_counts = df["mainClass"].value_counts().to_dict()

    # Strongest flare
    class_order = {"C": 1, "M": 2, "X": 3}
    df["classValue"] = df["mainClass"].map(class_order)
    strongest = df.sort_values(["classValue", "beginTime"], ascending=[False, False]).iloc[0]
    strongest_time = pd.to_datetime(strongest["beginTime"]).strftime("%B %d at %H:%M UTC")

    text = (
        f"In the last 7 days, {total} solar flares were recorded: "
        + ", ".join([f"{v} of class {k}" for k, v in class_counts.items()])
        + f". The strongest flare occurred on {strongest_time} with class {strongest['mainClass']}."
    )

    return summarize_text(text)

# -------------------------
# 2️⃣ Prediction Summary
# -------------------------
def prediction_summary():
    tomorrow = datetime.now(timezone.utc) + timedelta(days=1)
    features = {
        "duration": 12.0,  # placeholder, replace with real features
        "hour": tomorrow.hour,
        "day_of_year": tomorrow.timetuple().tm_yday
    }

    try:
        result = subprocess.run(
            [sys.executable, "scripts/python_ml/predict_flare.py", json.dumps(features)],
            capture_output=True,
            text=True,
            check=True
        )
        pred_output = json.loads(result.stdout)
        pred_class = pred_output.get("prediction", "C")
    except Exception as e:
        return f"Prediction failed: {e}"

    text = f"Based on the model, the most likely flare tomorrow is class {pred_class}, expected in the afternoon."
    return summarize_text(text, max_len=60, min_len=30)

# -------------------------
# 3️⃣ Historical Trend Summary
# -------------------------
def historical_trends():
    now = datetime.now(timezone.utc)
    last_30 = now - timedelta(days=30)

    query = f"""
        SELECT beginTime, classType
        FROM flares
        WHERE beginTime >= '{last_30.strftime("%Y-%m-%d %H:%M:%S")}'
    """
    df = pd.read_sql(query, engine)

    if df.empty:
        return "No solar flare activity recorded in the past 30 days."

    total = len(df)
    df["mainClass"] = df["classType"].str[0]
    class_counts = df["mainClass"].value_counts().to_dict()

    # Strongest flare
    class_order = {"C": 1, "M": 2, "X": 3}
    df["classValue"] = df["mainClass"].map(class_order)
    strongest = df.sort_values(["classValue", "beginTime"], ascending=[False, False]).iloc[0]
    strongest_time = pd.to_datetime(strongest["beginTime"]).strftime("%B %d at %H:%M UTC")

    text = (
        f"Over the past 30 days, {total} solar flares were recorded: "
        + ", ".join([f"{v} of class {k}" for k, v in class_counts.items()])
        + f". The strongest flare was class {strongest['mainClass']} on {strongest_time}."
    )

    return summarize_text(text)

# -------------------------
# Main
# -------------------------
if __name__ == "__main__":
    result = {
        "weekly_summary": daily_weekly_summary(),
        "prediction_summary": prediction_summary(),
        "historical_trends": historical_trends()
    }
    print(json.dumps(result, indent=2))
