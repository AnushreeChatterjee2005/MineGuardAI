# test_dem_predict_smooth.py
import os, gzip, shutil, requests
import rasterio
import numpy as np
import pandas as pd
import joblib
import matplotlib.pyplot as plt
from scipy.ndimage import gaussian_filter
from matplotlib.colors import ListedColormap

# -------------------------------
# Step 1: Download & unzip DEM
# -------------------------------
url = "https://s3.amazonaws.com/elevation-tiles-prod/skadi/N21/N21E085.hgt.gz"
os.makedirs("DEM_data", exist_ok=True)
gz_path = "DEM_data/N21E085.hgt.gz"
dem_path = "DEM_data/N21E085.hgt"

if not os.path.exists(gz_path):
    r = requests.get(url, stream=True)
    with open(gz_path, 'wb') as f:
        f.write(r.content)
if not os.path.exists(dem_path):
    with gzip.open(gz_path, 'rb') as f_in, open(dem_path, 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)

# -------------------------------
# Step 2: Read DEM and compute slope
# -------------------------------
with rasterio.open(dem_path) as src:
    dem = src.read(1)
    transform = src.transform

xres = transform.a
yres = -transform.e
gy, gx = np.gradient(dem, yres, xres)
slope_deg = np.degrees(np.arctan(np.sqrt(gx**2 + gy**2)))

# -------------------------------
# Step 3: Downsample DEM (optional)
# -------------------------------
factor = 5
dem_ds = dem[::factor, ::factor]
slope_ds = slope_deg[::factor, ::factor]
rows, cols = dem_ds.shape

# -------------------------------
# Step 4: Flatten DEM & add synthetic variables
# -------------------------------
flat_data = pd.DataFrame({
    'row': np.arange(rows).repeat(cols),
    'col': np.tile(np.arange(cols), rows),
    'elevation': dem_ds.flatten(),
    'slope_deg': slope_ds.flatten(),
    'rainfall_mm': np.random.uniform(800, 2000, rows*cols),
    'temperature_C': np.random.uniform(20, 35, rows*cols),
    'displacement': np.random.uniform(0, 5, rows*cols),
    'strain': np.random.uniform(0, 0.01, rows*cols),
    'pore_pressure': np.random.uniform(0, 100, rows*cols),
})

# -------------------------------
# Step 5: Load trained ML model
# -------------------------------
model = joblib.load("risk_model.pkl")
features = ['elevation', 'slope_deg', 'rainfall_mm', 'temperature_C',
            'displacement', 'strain', 'pore_pressure']

flat_data['predicted_risk'] = model.predict(flat_data[features])

# -------------------------------
# Step 6: Reshape to 2D grid
# -------------------------------
risk_grid = flat_data['predicted_risk'].to_numpy().reshape(rows, cols)

# -------------------------------
# Step 7: Smooth the risk map
# -------------------------------
# Option 1: Aggregate in blocks (majority voting)
block_size = 5
new_rows, new_cols = rows // block_size, cols // block_size
risk_blocks = risk_grid[:new_rows*block_size, :new_cols*block_size] \
    .reshape(new_rows, block_size, new_cols, block_size)
risk_blocks = risk_blocks.transpose(0, 2, 1, 3).reshape(new_rows, new_cols, -1)
risk_blocks = np.apply_along_axis(lambda x: np.bincount(x).argmax(), 2, risk_blocks)

# Option 2: Apply Gaussian filter for smooth transitions
risk_smooth = gaussian_filter(risk_blocks.astype(float), sigma=1)

from matplotlib.colors import ListedColormap

from matplotlib.colors import ListedColormap

# -------------------------------
# Step 7: Aggregate into blocks (clear segments)
# -------------------------------
block_size = 10  # larger = smoother regions, smaller = more detail
new_rows, new_cols = rows // block_size, cols // block_size

# Reshape and take majority per block
risk_blocks = risk_grid[:new_rows*block_size, :new_cols*block_size] \
    .reshape(new_rows, block_size, new_cols, block_size)
risk_blocks = risk_blocks.transpose(0, 2, 1, 3).reshape(new_rows, new_cols, -1)
risk_blocks = np.apply_along_axis(lambda x: np.bincount(x).argmax(), 2, risk_blocks)

# -------------------------------
# Step 8: Plot with discrete colors
# -------------------------------
fig, ax = plt.subplots(figsize=(10, 8))

# Clear segment colors
cmap = ListedColormap(['#a8ddb5', '#feb24c', '#f03b20'])  # Green → Orange → Red

im = ax.imshow(risk_blocks, cmap=cmap, origin='upper')

# Colorbar
cbar = plt.colorbar(im, ax=ax, ticks=[0, 1, 2])
cbar.ax.set_yticklabels(["Safe", "Medium", "High"])
cbar.set_label("Rockfall Risk Level")

ax.set_title("Barbil Rockfall Risk Map (Segmented)")
ax.set_xlabel("Column Index")
ax.set_ylabel("Row Index")

plt.show()