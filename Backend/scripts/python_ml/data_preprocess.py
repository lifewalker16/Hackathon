import pandas as pd
import mysql.connector
from imblearn.over_sampling import SMOTE  # ✅ SMOTE
import os

# --------------------------
# Connect to MySQL DB
# --------------------------
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="kali16",
    database="nasa_data"
)

# --------------------------
# Fetch flare data
# --------------------------
df = pd.read_sql("SELECT * FROM flares", conn)

# --------------------------
# Convert datetime
# --------------------------
df['beginTime'] = pd.to_datetime(df['beginTime'])
df['peakTime'] = pd.to_datetime(df['peakTime'])

# --------------------------
# Feature engineering
# --------------------------
df['duration'] = (df['peakTime'] - df['beginTime']).dt.total_seconds() / 60
df['hour'] = df['beginTime'].dt.hour
df['day_of_year'] = df['beginTime'].dt.dayofyear

# Extract first letter of classType (C, M, X)
df['classLetter'] = df['classType'].str[0]

# Map C, M, X to numeric
df['classLabel'] = df['classLetter'].map({'C': 0, 'M': 1, 'X': 2})

# Drop rows where classLabel is NaN
df = df.dropna(subset=['classLabel'])

# --------------------------
# Select features and target
# --------------------------
features = df[['duration', 'hour', 'day_of_year']]
target = df['classLabel']

# --------------------------
# Apply SMOTE to balance classes
# --------------------------
smote = SMOTE(random_state=42)
features_res, target_res = smote.fit_resample(features, target)

print(f"Before SMOTE: {target.value_counts().to_dict()}")
print(f"After SMOTE: {pd.Series(target_res).value_counts().to_dict()}")

# --------------------------
# Save processed data
# --------------------------
os.makedirs('scripts/python_ml', exist_ok=True)
features_res.to_csv('scripts/python_ml/features.csv', index=False)
pd.Series(target_res).to_csv('scripts/python_ml/target.csv', index=False)

print("✅ Data preprocessing complete. Features and target saved with SMOTE applied.")
