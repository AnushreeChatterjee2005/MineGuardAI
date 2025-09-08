# training_dataset.py
import pandas as pd
import numpy as np

# Number of samples
n_samples = 5000

data = pd.DataFrame({
    "elevation": np.random.uniform(100, 1500, n_samples),
    "slope_deg": np.random.uniform(0, 60, n_samples),
    "rainfall_mm": np.random.uniform(800, 2000, n_samples),
    "temperature_C": np.random.uniform(15, 40, n_samples),
    "displacement": np.random.uniform(0, 10, n_samples),
    "strain": np.random.uniform(0, 0.02, n_samples),
    "pore_pressure": np.random.uniform(0, 200, n_samples),
})

# Assign synthetic risk labels
def assign_risk(row):
    if row["slope_deg"] > 35 and row["rainfall_mm"] > 1500 and row["displacement"] > 3:
        return 2  # High risk
    elif row["slope_deg"] > 20 and row["rainfall_mm"] > 1200:
        return 1  # Medium risk
    else:
        return 0  # Low risk

data["risk"] = data.apply(assign_risk, axis=1)

# Save dataset
data.to_csv("training_dataset.csv", index=False)
print("✅ Training dataset saved! Shape:", data.shape)
print(data["risk"].value_counts())