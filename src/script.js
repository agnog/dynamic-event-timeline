
const startDate = new Date("2022-10-07T00:00:00");
let currentIndex = 0;
let autoPlayInterval;

const audio = document.getElementById("musica");
const playBtn = document.getElementById("playBtn");
const progressBar = document.getElementById("progressBar");
const videoElement = document.getElementById('meuVideo');

window.onload = function() {
    iniciarAutoplay();
    setInterval(updateTimer, 1000);
    updateTimer();
    setInterval(criarCoracao, 450);
};

async function verificarSenha() {
    const senhaDigitada = document.getElementById('inputSenha').value;
    const encoder = new TextEncoder();
    const data = encoder.encode(senhaDigitada);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const hashCorreto = "6f50c53bd3fe9f2a167b3b3da559d75fa20961f2a3a60be62a70fb102935adfa";

    if(hashHex === hashCorreto){
        document.getElementById('tela-login').style.display = 'none';
        document.getElementById('tela-aviso').style.display = 'flex';
    } else {
        alert("Senha incorreta! Tente a data do nosso início.");
    }
}

window.irParaLoading = function() {
    document.getElementById('tela-aviso').style.display = 'none';
    document.getElementById('tela-loading').style.display = 'flex';
    iniciarLoading(); 
};

function iniciarLoading() {
    let progresso = 0;
    const barra = document.getElementById('barra-progresso');
    const status = document.getElementById('status-loading');
    const frases = ["Carregando memórias...", "Sintonizando amor...", "Quase pronto!"];

    const intervalo = setInterval(() => {
        progresso += Math.random() * 20;
        if (progresso >= 100) {
            progresso = 100;
            clearInterval(intervalo);
            setTimeout(() => {
                document.getElementById('tela-loading').style.display = 'none';
                document.getElementById('tela-video').style.display = 'flex';
                // O vídeo está na pasta img
                videoElement.src = "img/seu-video.mp4"; 
                videoElement.play();
                iniciarControleVideo();
            }, 800);
        }
        barra.style.width = progresso + "%";
        if(progresso > 30) status.innerText = frases[0];
        if(progresso > 60) status.innerText = frases[1];
        if(progresso > 85) status.innerText = frases[2];
    }, 400);
}

function iniciarControleVideo(){
    const btn = document.getElementById("btnVideo");
    setTimeout(() => {
        if(btn){
            btn.innerText = "Continuar ❯";
            btn.onclick = finalizarVideo;
        }
    }, 13000); // Aparece após 13 segundos
}

window.pularVideo = function() { finalizarVideo(); };

function finalizarVideo() {
    videoElement.pause();
    document.getElementById('tela-video').style.display = 'none';
    const telaTransicao = document.getElementById('transicao-pos-video');
    telaTransicao.style.display = 'flex';

    setTimeout(() => {
        telaTransicao.style.opacity = '0';
        setTimeout(() => {
            telaTransicao.style.display = 'none';
            document.getElementById('conteudo-principal').style.display = 'block';
            if(audio) {
                audio.play().then(() => {
                    if(playBtn) playBtn.innerHTML = "⏸";
                }).catch(e => console.log("Erro ao tocar:", e));
            }
        }, 1000);
    }, 2500);
}


window.togglePlay = function() {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = "⏸";
    } else {
        audio.pause();
        playBtn.innerHTML = "▶";
    }
};

if (audio) {
    audio.addEventListener("timeupdate", () => {
        if (audio.duration) {
            const percentage = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = percentage + "%";
        }
    });
}

function updateTimer() {
    const now = new Date();
    const diff = now - startDate;

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44)) % 12;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) % 30;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const seconds = Math.floor(diff / 1000) % 60;

    if(document.getElementById("years")) {
        document.getElementById("years").innerText = years;
        document.getElementById("months").innerText = months;
        document.getElementById("days").innerText = days;
        document.getElementById("hours").innerText = hours;
        document.getElementById("minutes").innerText = minutes;
        document.getElementById("seconds").innerText = seconds;
    }
}

function atualizarSlider3D() {
    const items = document.querySelectorAll('.slide-item');
    items.forEach((item, index) => {
        item.classList.remove('active', 'prev-slide', 'next-slide');
        if (index === currentIndex) item.classList.add('active');
        else if (index === (currentIndex - 1 + items.length) % items.length) item.classList.add('prev-slide');
        else if (index === (currentIndex + 1) % items.length) item.classList.add('next-slide');
    });
}

window.manualMudarSlide = function(n) {
    const items = document.querySelectorAll('.slide-item');
    clearInterval(autoPlayInterval);
    currentIndex = (currentIndex + n + items.length) % items.length;
    atualizarSlider3D();
    iniciarAutoplay();
};

function iniciarAutoplay() {
    autoPlayInterval = setInterval(() => {
        const items = document.querySelectorAll('.slide-item');
        if (items.length > 0) {
            currentIndex = (currentIndex + 1) % items.length;
            atualizarSlider3D();
        }
    }, 3000);
}

function criarCoracao() {
    const heartContainer = document.querySelector(".hearts");
    if(!heartContainer) return;
    const coracao = document.createElement("div");
    coracao.classList.add("heart");
    coracao.innerHTML = "❤️";
    coracao.style.left = Math.random() * 100 + "vw";
    coracao.style.fontSize = (Math.random() * 20 + 20) + "px";
    coracao.style.animationDuration = (Math.random() * 3 + 4) + "s";
    heartContainer.appendChild(coracao);
    setTimeout(() => coracao.remove(), 7000);
}

window.mostrarEnvelope = function() {
    const envelope = document.getElementById("envelope");
    const btn = document.getElementById("btnMensagem");
    if(envelope) envelope.style.display = "block";
    if(btn) btn.style.display = "none";
    envelope.scrollIntoView({ behavior: 'smooth' });
};

window.toggleCarta = function() {
    document.getElementById("envelope").classList.toggle("aberto");
};