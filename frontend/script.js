window.addEventListener("DOMContentLoaded", () => {
    const statusEl = document.getElementById("status");
    const speakBtn = document.getElementById("speakBtn");
    const conversaEl = document.getElementById("conversa");
    const circleEl = document.querySelector(".circle");
    const muteBtn = document.getElementById("muteBtn");
    const voltarBtn = document.getElementById("voltar");

    const synth = window.speechSynthesis;
    let voices = [];
    let isMuted = false;
    let ouvindo = false;

    function carregarVozes() {
        voices = synth.getVoices().filter(v => v.lang.includes("pt"));
    }
    carregarVozes();
    synth.onvoiceschanged = carregarVozes;

    function falar(texto) {
        if (isMuted) return;
        if (!voices.length) voices = synth.getVoices();
        const voz = voices.find(v => v.lang.includes("pt")) || voices[0];
        const fala = new SpeechSynthesisUtterance(texto);
        fala.voice = voz || null;
        fala.lang = "pt-BR";
        fala.pitch = 0.8;
        fala.rate = 1.0;
        synth.speak(fala);
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;

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

    function mostrarConversa(mensagem) {
        const p = document.createElement("p");
        p.textContent = mensagem;
        conversaEl.appendChild(p);
        conversaEl.scrollTop = conversaEl.scrollHeight;
    }

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

    speakBtn.addEventListener("click", () => {
        // Primeiro clique garante que o browser permite áudio
        if (!synth.speaking && !voices.length) {
            carregarVozes();
            falar("Sistemas online. Jarvis pronto para ouvir.");
        }

        if (ouvindo) recognition.abort();
        recognition.start();
    });

    muteBtn.addEventListener("click", () => {
        isMuted = !isMuted;
        muteBtn.textContent = isMuted ? "Ativar Som" : "🔇";
        if (isMuted) synth.cancel();
    });

    voltarBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    // Texto inicial na tela (sem falar ainda)
    const textoInicial = "Inicializando sistemas de voz e sensores neurais...";
    let i = 0;
    function digitar() {
        if (i < textoInicial.length) {
            statusEl.textContent += textoInicial.charAt(i);
            i++;
            setTimeout(digitar, 40);
        }
    }
    statusEl.textContent = "";
    digitar();
});
