from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from jarvis_model import conversar_jarvis

# Configura Flask com caminhos corretos para templates e static
app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static"
)
CORS(app)

# Variável global para mute
is_muted = False

# --- API ---
@app.route("/pergunta", methods=["POST"])
def pergunta():
    dados = request.json
    texto_usuario = dados.get("texto", "")
    resposta = conversar_jarvis(texto_usuario)
    return jsonify({"resposta": resposta})

@app.route("/set_mute", methods=["POST"])
def set_mute():
    global is_muted
    dados = request.json
    is_muted = dados.get("muted", False)
    return jsonify({"muted": is_muted})

@app.route("/get_mute", methods=["GET"])
def get_mute():
    global is_muted
    return jsonify({"muted": is_muted})

# --- Rotas HTML ---
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/index2")
def index2():
    return render_template("index2.html")

if __name__ == "__main__":
    app.run(debug=True)
