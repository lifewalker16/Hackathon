# import sys
# import json
# import pandas as pd
# import joblib
# import ast

# # Load model
# model = joblib.load("scripts/python_ml/flare_intensity_model.pkl")

# # Read input
# if len(sys.argv) > 1:
#     features_input = sys.argv[1]
# else:
#     features_input = sys.stdin.read()

# if not features_input:
#     print(json.dumps({"error": "No features provided"}))
#     sys.exit(1)

# # Parse input safely
# try:
#     features_dict = json.loads(features_input)  # first try strict JSON
# except json.JSONDecodeError:
#     try:
#         # fallback for Python-style dict strings
#         features_dict = ast.literal_eval(features_input)
#     except Exception:
#         print(json.dumps({"error": "Invalid JSON input"}))
#         sys.exit(1)

# # Convert to DataFrame
# df = pd.DataFrame([features_dict])

# # Predict
# pred = model.predict(df)
# pred_class = ["C", "M", "X"][int(pred[0])]

# # Return prediction
# print(json.dumps({"prediction": pred_class}))


import sys
import pandas as pd
import joblib
import json

# --------------------------
# Load trained model
# --------------------------
MODEL_PATH = 'scripts/python_ml/flare_intensity_model.pkl'
try:
    clf = joblib.load(MODEL_PATH)
except FileNotFoundError:
    print(f"❌ Model not found at {MODEL_PATH}. Train the model first.")
    sys.exit(1)

# --------------------------
# Helper: Map numeric predictions back to class
# --------------------------
label_map = {0: 'C', 1: 'M', 2: 'X'}

# --------------------------
# Parse input features
# --------------------------
# Option 1: From command-line arguments
if len(sys.argv) == 4:
    try:
        duration = float(sys.argv[1])
        hour = int(sys.argv[2])
        day_of_year = int(sys.argv[3])
        input_data = pd.DataFrame([[duration, hour, day_of_year]],
                                  columns=['duration', 'hour', 'day_of_year'])
    except ValueError:
        print("❌ Invalid command-line arguments. Use: duration hour day_of_year")
        sys.exit(1)
# Option 2: From JSON stdin (for cloud integration)
else:
    try:
        json_input = json.load(sys.stdin)
        # Expecting: {"duration": 12.5, "hour": 14, "day_of_year": 278}
        input_data = pd.DataFrame([json_input], columns=['duration', 'hour', 'day_of_year'])
    except json.JSONDecodeError:
        print("❌ Invalid JSON input. Provide duration, hour, day_of_year.")
        sys.exit(1)

# --------------------------
# Predict
# --------------------------
prediction_num = clf.predict(input_data)[0]
prediction_class = label_map.get(prediction_num, "Unknown")

# --------------------------
# Output
# --------------------------
output = {
    "prediction_class": prediction_class,
    "prediction_numeric": int(prediction_num)
}

print(json.dumps(output))
