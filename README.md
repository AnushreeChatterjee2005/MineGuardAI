# MineGuardAI

MineGuardAI is an advanced, AI-powered platform designed for the real-time prediction and prevention of rockfall incidents in mining operations. It provides mine safety professionals with a comprehensive dashboard to monitor environmental conditions, visualize risk zones, and receive predictive forecasts to enhance operational safety.

## Key Features

*   **AI-Powered Risk Mapping:** Utilizes a machine learning model trained on geological and environmental data to generate detailed, color-coded risk maps. These maps visualize low, medium, and high-risk zones within a mine site, enabling targeted safety measures.
*   **Predictive Forecasting:** Employs an AI model to forecast the probability of rockfall events within a specific timeframe. The forecast includes confidence levels and highlights the key contributing factors, such as heavy rainfall or ground displacement.
*   **Real-time Environmental Monitoring:** Integrates with sensors to provide a live feed of critical environmental data, including rainfall, ground displacement, temperature, and pore pressure.
*   **Intelligent Alert System:** Automatically generates and displays alerts for high-risk conditions, critical forecast changes, or anomalous sensor readings, ensuring that safety personnel are notified of potential dangers immediately.
*   **Secure & Intuitive Dashboard:** A modern, web-based dashboard built with React and Convex provides a centralized view of all risk data. It features secure user authentication and allows for the management of multiple mine sites.

## Technology Stack

*   **Frontend:** React, TypeScript, Vite, Tailwind CSS
*   **Backend:** Convex (Real-time Database, Serverless Functions, Authentication)
*   **Machine Learning:** Python, Scikit-learn, Pandas, NumPy, Rasterio

## Project Structure

The repository is organized into three main directories:

*   `src/`: Contains the React frontend application, including all components for the dashboard, map visualization, and data panels.
*   `convex/`: Houses the Convex backend logic, including the database schema, data models, queries, mutations, and AI-powered server-side actions.
*   `ML_model/`: Includes the Python scripts for the machine learning model. This covers data generation, model training (`RandomForestClassifier`), and a demonstration of predicting risk on Digital Elevation Model (DEM) data.

## Getting Started

### Prerequisites

*   Node.js and npm
*   Python 3.x
*   A Convex account ([https://convex.dev](https://convex.dev))

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/anushreechatterjee2005/mineguardai.git
    cd mineguardai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Convex:**
    *   Log in to your Convex account and create a new project.
    *   In the project settings, find your Deployment URL.
    *   Create a `.env.local` file in the root of the repository and add your deployment URL:
        ```
        VITE_CONVEX_URL=https://<your-project-name>.convex.cloud
        ```

4.  **Deploy the backend:**
    Push the database schema and backend functions to your Convex project.
    ```bash
    npx convex dev
    ```
    This command will also watch for changes and automatically update your deployment. Keep it running in a separate terminal.

5.  **Seed the database (Optional):**
    To populate your project with sample data for demonstration, run the following command in a new terminal:
    ```bash
    npx convex run seedData:setupDemo
    ```

6.  **Run the frontend:**
    Start the Vite development server for the React application.
    ```bash
    npm run dev:frontend
    ```
    The application will be available at `http://localhost:5173`. You can also run both frontend and backend concurrently with `npm run dev`.

## Machine Learning Model

The core of the predictive capability lies in the machine learning model located in the `ML_model/` directory.

*   **`training_dataset.py`**: This script generates a synthetic dataset (`training_dataset.csv`) with features like `elevation`, `slope_deg`, `rainfall_mm`, `displacement`, and `pore_pressure`. It assigns risk labels based on predefined rules to simulate real-world conditions.
*   **`train_model.py`**: This script uses the generated dataset to train a `RandomForestClassifier`. The trained model is then serialized and saved as `risk_model.pkl`.
*   **`test_dem_predict_smooth.py`**: A complete pipeline demonstrating the model's application. It performs the following steps:
    1.  Downloads a public Digital Elevation Model (DEM) tile.
    2.  Calculates slope from the elevation data.
    3.  Applies the trained `risk_model.pkl` to predict rockfall risk for each pixel.
    4.  Aggregates and smooths the predictions to create clear, segmented risk zones.
    5.  Visualizes the final risk map using `matplotlib`, similar to the one displayed on the dashboard.
