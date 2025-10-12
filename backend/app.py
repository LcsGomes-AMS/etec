from flask import Flask, request, jsonify
from flask_cors import CORS
from backend.jarvis_model import responder


app = Flask(__name__)
CORS(app)


@app.route("/pergunta", methods=["POST"])
def pergunta():
    dados = request.json
    texto_usuario = dados.get("texto", "")
    resposta = responder(texto_usuario)
    return jsonify({"resposta": resposta})


if __name__ == "__main__":
    app.run(debug=True)




