window.addEventListener("DOMContentLoaded", () => {
    // Elementos
    const statusEl = document.getElementById("status");
    const speakBtn = document.getElementById("speakBtn");
    const conversaEl = document.getElementById("conversa");
    const circleEl = document.querySelector(".circle");
    const muteBtn = document.getElementById("muteBtn");
    const voltarBtn = document.getElementById("voltar");

    // Botão voltar
    voltarBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    // --- Configura voz e reconhecimento ---
    const synth = window.speechSynthesis;
    let voices = [];
    let isMuted = false;
    let ouvindo = false;

    function carregarVozes() {
        voices = synth.getVoices().filter(v => v.lang.includes("pt"));
    }

    // Força carregar imediatamente
    carregarVozes();
    synth.onvoiceschanged = carregarVozes;

    // Função para falar
    function falar(texto) {
        if (isMuted) return;
        if (!voices.length) carregarVozes(); // recarrega se ainda não tem voz
        synth.cancel();

        const fala = new SpeechSynthesisUtterance(texto);
        fala.voice = voices[0] || null;
        fala.lang = "pt-BR";
        fala.pitch = 0.8;
        fala.rate = 1.0;
        synth.speak(fala);
    }

    // Configura reconhecimento de voz
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;

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

    // Mostra conversa na tela
    function mostrarConversa(mensagem) {
        const p = document.createElement("p");
        p.textContent = mensagem;
        conversaEl.appendChild(p);
        conversaEl.scrollTop = conversaEl.scrollHeight;
    }

    // Reconhecimento de voz
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

    // Botão de fala
    speakBtn.addEventListener("click", () => {
        if (ouvindo) recognition.abort();
        recognition.start();
    });

    // Botão mutar/desmutar
    muteBtn.addEventListener("click", () => {
        isMuted = !isMuted;
        muteBtn.textContent = isMuted ? "Ativar Som" : "Mutar";
        if (isMuted) synth.cancel();
    });

    // Inicialização
    statusEl.textContent = "Sistemas online. Jarvis pronto para ouvir.";
    setTimeout(() => falar("Sistemas online. Jarvis pronto para ouvir."), 1200);
});
