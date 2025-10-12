from openai import OpenAI
from datetime import datetime


# Cria o cliente — precisa da sua chave de API
client = OpenAI(api_key="")  # substitua pela sua chave real


def responder(texto_usuario):
    texto = texto_usuario.lower()


    # Comando local: informar hora
    if "hora" in texto or "que horas" in texto:
        hora_atual = datetime.now().strftime("%H:%M:%S")
        return f"Agora são {hora_atual}."
   
    # Você pode adicionar mais comandos locais aqui
    # elif "data" in texto:
    #     ...


    # Caso nenhum comando local seja detectado, usa a API da OpenAI
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # pode usar "gpt-3.5-turbo" se quiser algo mais leve
            messages=[
                {"role": "system", "content": "Você é Jarvis, um assistente virtual educado, inteligente e prestativo."},
                {"role": "user", "content": texto_usuario}
            ],
            temperature=0.7
        )


        # Extrai a resposta
        resposta = response.choices[0].message.content
        return resposta


    except Exception as e:
        print("Erro ao conectar com o modelo:", e)
        return "Desculpe, houve um problema ao processar sua solicitação."




# Teste rápido
if __name__ == "__main__":
    while True:
        pergunta = input("Você: ")
        print("Jarvis:", responder(pergunta))




