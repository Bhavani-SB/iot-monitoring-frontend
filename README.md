# IoT Pro Dashboard - Frontend

A real-time, responsive React.js web application designed to visualize telemetry data and manage alerts from multiple IoT sensors.

## 🌟 Key Features
- **Real-time Dashboard View**: Displays the latest sensor readings (Temperature, Humidity, etc.) with dynamic status cards. 
- **Dynamic Threshold Highlighting**: Cards automatically turn **Red** when a sensor reading breaches its predefined safety limit (e.g., Humidity > 80%).
- **Live Telemetry Charts**: Interactive line charts powered by `Recharts` to visualize data trends over time.
- **Alert Management Page**: A dedicated view to list all historical violations, showing timestamps, topics, and specific violated parameters.
- **Acknowledge System**: Built-in functionality to acknowledge and clear active alerts.
- **Raw Data Logs**: A detailed tabular view of all incoming sensor packets with:
  - **Topic-wise Filtering**: Quickly isolate data from specific devices (e.g., Bedroom vs Garage).
  - **Pagination**: Efficiently navigate through large datasets.

## 🛠️ Tech Stack
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS for responsive design.
- **Visualization**: Recharts for live telemetry graphs.
- **Icons**: Lucide-React for intuitive navigation.
- **Notifications**: React-Toastify for real-time popup alert messages.

## 📂 Project Structure
- `src/App.jsx`: Main application logic containing the dashboard, alerts, and raw data views.
- `package.json`: Project dependencies and scripts.
- `postcss.config.js` & `tailwind.config.js`: Configuration for styling and utility classes.

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine.
- Backend API running at `http://localhost:8000`.

### Installation
1. Clone this repository:
   ```bash
   git clone <your-frontend-repo-url>
   cd iot-monitoring-frontend
2.Install dependencies:
Bash
npm install

3.Start the development server:
Bash
npm run dev
