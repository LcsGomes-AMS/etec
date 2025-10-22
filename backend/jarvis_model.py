from google import genai
import os

# Inicializa o cliente Gemini (usa variável de ambiente GOOGLE_API_KEY)
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def conversar_jarvis(pergunta: str) -> str:
    """
    Envia a pergunta do usuário para o modelo Gemini e retorna a resposta.
    """
    try:
        resposta = genai.models.generate_content(
            model="gemini-1.5-flash",  # modelo rápido e gratuito
            contents=f"Você é Jarvis, um assistente inteligente e prestativo. Responda de forma natural e útil: {pergunta}"
        )
        return resposta.output_text
    except Exception as e:
        print("Erro ao conectar com o modelo:", e)
        return "Desculpe, houve um problema ao processar sua solicitação."
