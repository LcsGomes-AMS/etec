from google import genai
import os

# Inicializa o cliente Gemini
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def conversar_jarvis(pergunta: str) -> str:
    """
    Envia a pergunta do usuário para o modelo Gemini e retorna a resposta.
    """
    try:
        resposta = client.models.generate_content(
            model="gemini-1.5-flash",  # modelo rápido
            contents=f"Você é Jarvis, um assistente inteligente e prestativo. Responda de forma natural e útil: {pergunta}"
        )
        return getattr(resposta, "text", getattr(resposta, "output_text", "Sem resposta"))
    except Exception as e:
        print("Erro ao conectar com o modelo:", e)
        return "Desculpe, houve um problema ao processar sua solicitação."
