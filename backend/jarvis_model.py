from google import genai
import os

# Inicializa o cliente Gemini com a variável de ambiente
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def conversar_jarvis(pergunta):
    try:
        # Conteúdo deve ser string simples (não lista de dicionários)
        resposta = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"Você é Jarvis, um assistente inteligente e prestativo. Responda: {pergunta}"
        )
        return resposta.text
    except Exception as e:
        print("Erro ao conectar com o modelo:", e)
        return "Desculpe, houve um problema ao processar sua solicitação."

if __name__ == "__main__":
    while True:
        entrada = input("Você: ")
        if entrada.lower() in ["sair", "exit", "quit"]:
            break
        resposta = conversar_jarvis(entrada)
        print("Jarvis:", resposta)
