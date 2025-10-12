from flask import Flask, request, jsonify
from flask_cors import CORS
from jarvis_model import responder

app = Flask(__name__)
CORS(app)

# Variável global para o estado do som
is_muted = False


@app.route("/pergunta", methods=["POST"])
def pergunta():
    dados = request.json
    texto_usuario = dados.get("texto", "")
    resposta = responder(texto_usuario)
    return jsonify({"resposta": resposta})


@app.route("/set_mute", methods=["POST"])
def set_mute():
    """Rota para mutar/desmutar o Jarvis"""
    global is_muted
    dados = request.json
    is_muted = dados.get("muted", False)
    print("🔇 Modo mudo:", is_muted)
    return jsonify({"muted": is_muted})


@app.route("/get_mute", methods=["GET"])
def get_mute():
    """Rota opcional — o frontend pode perguntar se está mutado"""
    global is_muted
    return jsonify({"muted": is_muted})


def falar(texto):
    """Exemplo — só fala se não estiver mutado"""
    global is_muted
    if is_muted:
        print("(mutado) Jarvis:", texto)
        return
    print("Jarvis:", texto)
    # Aqui você colocaria o código de fala (ex: gTTS ou pyttsx3)


if __name__ == "__main__":
    app.run(debug=True)


