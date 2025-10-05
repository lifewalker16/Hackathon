import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
import joblib

# Load processed data
features = pd.read_csv('scripts/python_ml/features.csv')
target = pd.read_csv('scripts/python_ml/target.csv').squeeze()


# Split into train/test
X_train, X_test, y_train, y_test = train_test_split(
    features, target, test_size=0.2, random_state=42
)

# Train model with class balancing
clf = RandomForestClassifier(n_estimators=200, random_state=42)

clf.fit(X_train, y_train)

# Evaluate
y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred, target_names=['C', 'M', 'X']))

# Save model
joblib.dump(clf, 'scripts/python_ml/flare_intensity_model.pkl')
print("✅ Model trained and saved as flare_intensity_model.pkl")

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(6, 5))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=['C', 'M', 'X'],
            yticklabels=['C', 'M', 'X'])
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix - Solar Flare Classification")
plt.tight_layout()
plt.savefig("scripts/python_ml/confusion_matrix.png")
print("📊 Confusion matrix saved as confusion_matrix.png")
