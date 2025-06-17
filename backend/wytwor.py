from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI
import uuid
import gspread
from datetime import datetime

app = Flask(__name__)
app.debug = True
CORS(app)

# Initialize OpenAI client properly
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Google Sheets auth
gc = gspread.service_account(filename='credentials.json')
sheets = {
    "chatbot1": gc.open("chatbot 1").sheet1,
    "chatbot2": gc.open("chatbot 2").sheet1,
    "chatbot3": gc.open("chatbot 3").sheet1,
}


# Load system prompt
def load_prompt(version):
    path = {
        "chatbot1": "chatbot1_ekspert.md",
        "chatbot2": "chatbot2.md",
        "chatbot3": "chatbot3_halucynujacy.md"
    }[version]
    with open(path, "r", encoding="utf-8") as file:
        return file.read()


# Starter prompt
starter_prompts = {
    "chatbot1":
    "Dzień dobry. Przeczytałem już opis przypadku oraz postawioną diagnozę. Z jakimi wątpliwościami się zgłaszasz? Czy są jakieś objawy, które Twoim zdaniem nie pasują do tej diagnozy?",
    "chatbot2":
    "Hej! No dobra, mamy tu jakąś diagnozę i opis, nie? Jak Ci się to wszystko klei? Co Ci się rzuca w oczy?",
    "chatbot3":
    "Witam. Mam już przed sobą dane pacjenta oraz diagnozę. Jakie kwestie chciałbyś wspólnie przeanalizować? Czy coś w tej diagnozie budzi Twoje zastrzeżenia?"
}


@app.route("/")
def hello():
    return "Backend działa!"


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    version = data.get("version")
    messages = data.get("messages", [])

    if not version or version not in sheets:
        return jsonify({"error": "Invalid chatbot version"}), 400

    if not messages:
        starter = starter_prompts.get(version, starter_prompts["chatbot1"])
        return jsonify({"reply": starter})

    # Wczytaj prompt systemowy + starter
    system_prompt = load_prompt(version)
    starter = starter_prompts[version]

    all_messages = [{
        "role": "system",
        "content": system_prompt
    }, {
        "role": "assistant",
        "content": starter
    }] + messages

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=all_messages,  # cała historia
            max_tokens=200)
        reply = response.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        print("BŁĄD W CHAT:", str(e))  # ← dodaj to
        return jsonify({"error": str(e)}), 500


@app.route("/export", methods=["POST"])
def export():
    data = request.json
    version = data.get("version")
    user_id = data.get("user_id", "unknown")
    messages = data.get("messages", [])

    if version not in sheets:
        return jsonify({"error": "Invalid chatbot version"}), 400

    sheet = sheets[version]
    conversation_id = str(uuid.uuid4())
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for msg in messages:
        sheet.append_row([
            conversation_id, version, user_id, msg["role"], msg["content"],
            msg.get("timestamp", timestamp)
        ])

    return jsonify({"status": "saved to Google Sheets"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
