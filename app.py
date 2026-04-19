import os
import json
from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
from dotenv import load_dotenv

# Load env variables if .env exists (mostly for local development)
load_dotenv()

app = Flask(__name__)

# Configure Gemini
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

# Context for MetroArena
VENUE_CONTEXT = """
You are VenueFlow AI, a smart venue assistant for a large sporting event at "MetroArena".
Your job is to answer attendee questions concisely and politely. Keep responses relatively brief and suitable for reading on a mobile device.

Venue Information:
- Gates: There are 8 gates in total, labeled A through H.
- First Aid: There are 3 first aid stations.
- Food Stalls: There are 12 food stalls spread around the concourse.
- Restrooms: There are 4 major restroom blocks.
- Parking: The main parking lot is located near Gates A and B. A secondary lot is near Gate H.
- Crowd Movement: If someone asks about crowds or exiting, advise them to look for the nearest exit and follow staff instructions.

Respond as a helpful, friendly AI assistant.
"""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/chat', methods=['POST'])
def chat():
    if not api_key:
        return jsonify({"error": "Gemini API key not configured on server. Please contact support."}), 500

    data = request.json
    if not data or 'message' not in data:
        return jsonify({"error": "No message provided"}), 400

    user_message = data['message']
    history = data.get('history', [])

    try:
        model = genai.GenerativeModel('gemini-1.5-flash', system_instruction=VENUE_CONTEXT)
        
        # Start a chat session with history
        chat_session = model.start_chat(history=history)
        
        response = chat_session.send_message(user_message)
        
        # We also want to return the updated history so the frontend can maintain it
        updated_history = []
        for msg in chat_session.history:
            updated_history.append({
                "role": msg.role,
                "parts": [{"text": part.text} for part in msg.parts]
            })

        return jsonify({
            "response": response.text,
            "history": updated_history
        })
    except Exception as e:
        app.logger.error(f"Error during chat: {e}")
        return jsonify({"error": "Failed to get response from AI"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)), debug=True)
