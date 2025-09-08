# train_model.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load training dataset
data = pd.read_csv("training_dataset.csv")

X = data.drop(columns=["risk"])
y = data["risk"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# Evaluate
acc = model.score(X_test, y_test)
print("✅ Model trained. Accuracy:", acc)

# Save model
joblib.dump(model, "risk_model.pkl")
print("💾 Model saved as risk_model.pkl")