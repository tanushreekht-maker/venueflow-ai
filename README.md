# VenueFlow AI

VenueFlow AI is a smart venue assistant for large sporting events. This app provides attendees with information regarding crowd movement, gates, food stalls, restrooms, parking, and first aid for a seeded venue: "MetroArena".

## Technology Stack
- **Backend:** Python, Flask
- **AI Integration:** Google Gemini API (`gemini-1.5-flash`)
- **Frontend:** HTML, CSS, JavaScript (Mobile-friendly, no external CSS frameworks)
- **Deployment:** Docker, Google Cloud Run

## Prerequisites
- Docker (optional, for containerized run)
- Python 3.11+ (for local development)
- A Google Gemini API Key. Get one from Google AI Studio.

## Local Setup

1. Clone this repository or copy the files.
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Set your Gemini API key as an environment variable (or create a `.env` file in the root directory):
   ```bash
   export GEMINI_API_KEY="your_api_key_here"
   ```
4. Run the Flask application:
   ```bash
   python app.py
   ```
5. Open your browser and navigate to `http://localhost:8080`.

## Docker & Google Cloud Run

To build and run with Docker locally:
```bash
docker build -t venueflow-ai .
docker run -p 8080:8080 -e GEMINI_API_KEY="your_api_key_here" venueflow-ai
```

To deploy to Google Cloud Run:
1. Make sure you have the Google Cloud SDK installed and authenticated.
2. Build and submit your container image to Google Container Registry or Artifact Registry.
3. Deploy the image to Cloud Run, ensuring you set the `GEMINI_API_KEY` as a secret or environment variable during deployment.

## Features
- Contextual understanding of the MetroArena layout.
- Real-time chat interface.
- `/health` endpoint for uptime monitoring.
