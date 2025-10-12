window.addEventListener("DOMContentLoaded", () => {


    // Elementos
    const statusEl = document.getElementById("status");
    const speakBtn = document.getElementById("speakBtn");
    const conversaEl = document.getElementById("conversa");
    const circleEl = document.querySelector(".circle");


    // Inicializa voz e reconhecimento
    const synth = window.speechSynthesis;
    let voices = [];
    function carregarVozes() {
        voices = synth.getVoices().filter(v => v.lang.includes("pt"));
    }
    synth.onvoiceschanged = carregarVozes;


    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;


    // Flag para controlar estado
    let ouvindo = false;


    // Função para falar
    function falar(texto) {
        synth.cancel();
        const fala = new SpeechSynthesisUtterance(texto);
        fala.voice = voices[0] || null;
        fala.lang = "pt-BR";
        fala.pitch = 0.2;
        fala.rate = 0.9;
        synth.speak(fala);
    }


    // Função para enviar comando ao backend
    async function enviarParaBackend(texto) {
        try {
            const res = await fetch("http://127.0.0.1:5000/pergunta", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ texto })
            });
            const data = await res.json();
            return data.resposta;
        } catch (err) {
            console.error(err);
            return "Erro ao conectar com o servidor Jarvis.";
        }
    }


    // Função para adicionar mensagem no histórico
    function mostrarConversa(mensagem) {
        const p = document.createElement("p");
        p.textContent = mensagem;
        conversaEl.appendChild(p);
        conversaEl.scrollTop = conversaEl.scrollHeight;
    }


    // Feedback visual e flag
    recognition.onstart = () => {
        statusEl.textContent = "Ouvindo...";
        circleEl.classList.add("active");
        ouvindo = true;
        speakBtn.disabled = true;
    };


    recognition.onend = () => {
        statusEl.textContent = "Aguardando comando...";
        circleEl.classList.remove("active");
        ouvindo = false;
        speakBtn.disabled = false;
    };


    recognition.onresult = async (event) => {
        const comando = event.results[0][0].transcript;
        mostrarConversa("Você: " + comando);
        const resposta = await enviarParaBackend(comando);
        mostrarConversa("Jarvis: " + resposta);
        falar(resposta);
    };


    // Botão dispara o reconhecimento
    speakBtn.addEventListener("click", () => {
        // Aborta qualquer reconhecimento ativo antes de iniciar
        if (ouvindo) {
            recognition.abort();
        }
        recognition.start();
    });


    // Inicialização
    statusEl.textContent = "Sistemas online. Jarvis pronto para ouvir.";
    setTimeout(() => falar("Sistemas online. Jarvis pronto para ouvir."), 1000);


});
recognition.onresult = async (event) => {
    const comando = event.results[0][0].transcript;
    responseEl.textContent = "Você disse: " + comando;
    const resposta = await enviarParaBackend(comando);
    responseEl.textContent = resposta;
    falar(resposta);
};




