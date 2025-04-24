import { Engine } from "@babylonjs/core";
import Game from "./game";
import imagePortail from "../assets/images/image4.png";

let canvas;
let engine;
let game;
let audioBackground;
let ambientSounds = [];

const babylonInit = async () => {
    canvas = document.getElementById("renderCanvas");
    engine = new Engine(canvas, false, {
        adaptToDeviceRatio: true,
        antialias: true
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });

    // Initialiser et jouer la musique de fond avec système audio amélioré
    initAudioSystem();
    
    // Ajout d'un écran de chargement avant le menu principal
    showLoadingScreen(() => {
        showMainMenu();
    });
};

const initAudioSystem = () => {
    // Musique d'ambiance principale
    audioBackground = new Audio();
    audioBackground.src = "https://example.com/path-to-your-ambient-music.mp3";
    audioBackground.loop = true;
    audioBackground.volume = 0.4;
    
    // Sons d'ambiance supplémentaires pour une atmosphère plus immersive
    const ambientSoundsList = [
        { url: "https://example.com/path-to-ambient-sound1.mp3", volume: 0.2 },
        { url: "https://example.com/path-to-ambient-sound2.mp3", volume: 0.15 }
    ];
    
    // Créer des éléments audio pour les sons d'ambiance
    ambientSoundsList.forEach(sound => {
        const audio = new Audio();
        audio.src = sound.url;
        audio.loop = true;
        audio.volume = sound.volume;
        ambientSounds.push(audio);
    });
    
    // Activer l'audio lors de l'interaction utilisateur
    document.addEventListener('click', () => {
        if (audioBackground.paused) {
            audioBackground.play().catch(e => console.log("Lecture audio automatique empêchée : Interaction utilisateur nécessaire"));
            ambientSounds.forEach(sound => sound.play().catch(e => console.log("Lecture audio ambiante empêchée")));
        }
    }, { once: true });
};

const showLoadingScreen = (callback) => {
    const loadingScreen = document.createElement("div");
    loadingScreen.id = "loadingScreen";
    loadingScreen.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #000510 0%, #001a36 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 20;
    `;
    
    // Logo holographique animé
    const logoContainer = document.createElement("div");
    logoContainer.style.cssText = `
        position: relative;
        width: 150px;
        height: 150px;
        margin-bottom: 40px;
    `;
    
    // Créer un SVG pour le logo
    logoContainer.innerHTML = `
        <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; filter: drop-shadow(0 0 10px #00ccff);">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#00ccff" stroke-width="2" />
            <path d="M30,50 L70,50 M50,30 L50,70" stroke="#00ccff" stroke-width="2" stroke-linecap="round" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="#00ccff" stroke-width="1.5" stroke-dasharray="5,3" />
        </svg>
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle, transparent 30%, #000510 100%); animation: pulse 2s infinite ease-in-out;"></div>
    `;
    
    const loadingText = document.createElement("div");
    loadingText.innerText = "INITIALISATION DU PORTAIL INTERSTELLAIRE";
    loadingText.style.cssText = `
        font-family: 'Orbitron', sans-serif;
        font-size: 24px;
        color: #00ccff;
        margin-bottom: 30px;
        text-shadow: 0 0 10px rgba(0, 204, 255, 0.5);
    `;
    
    const progressContainer = document.createElement("div");
    progressContainer.style.cssText = `
        width: 300px;
        height: 10px;
        background: rgba(0, 40, 80, 0.5);
        border: 1px solid #00ccff;
        border-radius: 5px;
        position: relative;
        overflow: hidden;
    `;
    
    const progressBar = document.createElement("div");
    progressBar.style.cssText = `
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #00ccff, #66e0ff);
        box-shadow: 0 0 15px #00ccff;
        transition: width 3s cubic-bezier(0.165, 0.84, 0.44, 1);
    `;
    
    // Éléments décoratifs pour l'écran de chargement
    const decorElements = document.createElement("div");
    decorElements.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
    `;
    
    // Lignes de grille animées
    decorElements.innerHTML = `
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 30%; 
                    background: linear-gradient(0deg, rgba(0, 204, 255, 0.1) 0%, transparent 100%);
                    transform: perspective(500px) rotateX(60deg);
                    background-image: linear-gradient(90deg, rgba(0, 204, 255, 0.2) 1px, transparent 1px),
                                      linear-gradient(rgba(0, 204, 255, 0.2) 1px, transparent 1px);
                    background-size: 40px 40px;"></div>
    `;
    
    progressContainer.appendChild(progressBar);
    loadingScreen.appendChild(decorElements);
    loadingScreen.appendChild(logoContainer);
    loadingScreen.appendChild(loadingText);
    loadingScreen.appendChild(progressContainer);
    document.body.appendChild(loadingScreen);
    
    // Ajouter des styles pour l'animation
    const style = document.createElement("style");
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 0.8; filter: brightness(1); }
            50% { opacity: 1; filter: brightness(1.3); }
        }
    `;
    document.head.appendChild(style);
    
    // Simulation du chargement
    setTimeout(() => {
        progressBar.style.width = "100%";
    }, 100);
    
    // Messages de chargement en lien avec la mission scientifique
    const loadingMessages = [
        "CALIBRAGE DES ÉQUIPEMENTS SCIENTIFIQUES",
        "VÉRIFICATION DES INSTRUMENTS D'ANALYSE",
        "PRÉPARATION DES OUTILS DE PRÉLÈVEMENT",
        "SYNCHRONISATION DU PORTAIL VERS ZARENTHIS",
        "VÉRIFICATION DE L'ATMOSCAN ET DE L'HYDROSCAN",
        "ANALYSE PRÉLIMINAIRE DE L'ATMOSPHÈRE",
        "CALCUL DES COORDONNÉES D'ATTERRISSAGE"
    ];
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
        loadingText.innerText = loadingMessages[messageIndex];
        // Animation de changement de texte
        loadingText.style.opacity = "0";
        setTimeout(() => {
            loadingText.style.opacity = "1";
        }, 200);
        
        messageIndex = (messageIndex + 1) % loadingMessages.length;
    }, 800);
    
    // Terminer le chargement après 6 secondes
    setTimeout(() => {
        clearInterval(messageInterval);
        loadingScreen.style.opacity = "0";
        loadingScreen.style.transition = "opacity 1s ease";
        setTimeout(() => {
            loadingScreen.remove();
            callback();
        }, 1500);
    }, 6000);
};

const showMainMenu = () => {
    // Ajouter les polices nécessaires
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&family=VT323&family=Rajdhani:wght@300;500;700&display=swap";
    document.head.appendChild(fontLink);
    
    // Créer l'élément de conteneur principal
    const menuContainer = document.createElement("div");
    menuContainer.id = "mainMenu";
    menuContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 10;
    `;
    
    // Ajouter les styles globaux avec animations améliorées
    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes backgroundPulse {
            0%, 100% { filter: brightness(0.9) hue-rotate(0deg); }
            50% { filter: brightness(1.1) hue-rotate(15deg); }
        }
        
        @keyframes pulsateShadow {
            0%, 100% { text-shadow: 0 0 15px #00ccff, 0 0 30px #00ccff, 0 0 45px #00ccff; }
            50% { text-shadow: 0 0 25px #66d9ff, 0 0 40px #66d9ff, 0 0 60px #66d9ff; }
        }
        
        @keyframes floatEffect {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes glitchText {
            0% { transform: translate(0); }
            20% { transform: translate(-3px, 3px); clip-path: polygon(0 15%, 100% 15%, 100% 30%, 0 30%); }
            40% { transform: translate(-3px, -3px); clip-path: polygon(0 40%, 100% 40%, 100% 60%, 0 60%); }
            60% { transform: translate(3px, 3px); clip-path: polygon(0 60%, 100% 60%, 100% 75%, 0 75%); }
            80% { transform: translate(3px, -3px); clip-path: polygon(0 75%, 100% 75%, 100% 90%, 0 90%); }
            100% { transform: translate(0); }
        }
        
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        
        @keyframes ripple {
            0% { transform: scale(0.8); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
        }

        /* Éléments du menu avec effet de parallaxe */
        .parallax-bg {
            position: absolute;
            width: 100%;
            height: 100%;
            transform: translateZ(0);
            will-change: transform;
        }
        
        .menu-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url(${imagePortail});
            background-size: cover;
            background-position: center;
            animation: backgroundPulse 10s infinite ease-in-out;
            z-index: -1;
            filter: contrast(1.2) saturate(1.2);
        }
        
        .menu-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%);
            z-index: -1;
        }
        
        .noise-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
            opacity: 0.3;
            z-index: 0;
        }
        
        .glitch-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='smallGrid' width='8' height='8' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 8 0 L 0 0 0 8' fill='none' stroke='rgba(0,204,255,0.07)' stroke-width='0.5'/%3E%3C/pattern%3E%3Cpattern id='grid' width='80' height='80' patternUnits='userSpaceOnUse'%3E%3Crect width='80' height='80' fill='url(%23smallGrid)'/%3E%3Cpath d='M 80 0 L 0 0 0 80' fill='none' stroke='rgba(0,204,255,0.15)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E");
            opacity: 0.4;
            pointer-events: none;
            z-index: 0;
        }
        
        /* Effet de scanline */
        .scanline {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 10px;
            background: linear-gradient(to bottom, transparent, rgba(0, 204, 255, 0.2), transparent);
            opacity: 0.6;
            pointer-events: none;
            z-index: 5;
            animation: scanline 8s linear infinite;
        }
        
        .menu-content {
            position: relative;
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1;
        }
        
        .menu-title-container {
            position: relative;
            margin-bottom: 40px;
            perspective: 1000px;
            transform-style: preserve-3d;
        }
        
        .menu-title {
            font-family: 'Orbitron', sans-serif;
            font-weight: 800;
            font-size: clamp(48px, 10vw, 86px);
            color: #fff;
            text-align: center;
            letter-spacing: 5px;
            animation: pulsateShadow 3s infinite;
            position: relative;
            transform: translateZ(0);
        }
        
        .menu-title::before {
            content: "LIFE SEEKER";
            position: absolute;
            left: 4px;
            top: 0;
            color: #00ccff;
            clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
            animation: glitchText 5s infinite alternate;
            z-index: -1;
        }
        
        .menu-title::after {
            content: "LIFE SEEKER";
            position: absolute;
            left: -4px;
            top: 0;
            color: #ff3377;
            clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
            animation: glitchText 3s infinite alternate-reverse;
            z-index: -1;
        }
        
        .menu-subtitle {
            font-family: 'Rajdhani', sans-serif;
            font-weight: 300;
            font-size: 20px;
            color: rgba(255, 255, 255, 0.8);
            text-align: center;
            letter-spacing: 3px;
            margin-top: -10px;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        
        .menu-buttons {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            margin-top: 20px;
            min-width: 300px;
            position: relative;
        }
        
        .menu-button {
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
            font-size: 22px;
            padding: 18px 0;
            width: 100%;
            text-align: center;
            background: rgba(0, 0, 0, 0.5);
            color: #fff;
            border: 1px solid #00ccff;
            border-radius: 4px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 2px;
            backdrop-filter: blur(5px);
        }
        
        .menu-button::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 204, 255, 0.4), transparent);
            top: 0;
            left: -100%;
            transition: all 0.6s ease;
        }
        
        .menu-button:hover::before {
            left: 100%;
        }
        
        .menu-button:hover {
            background: rgba(0, 204, 255, 0.2);
            box-shadow: 0 0 20px rgba(0, 204, 255, 0.5);
            transform: translateY(-3px) scale(1.02);
        }
        
        .menu-button::after {
            content: "";
            position: absolute;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: rgba(0, 204, 255, 0.5);
            opacity: 0;
            transform: scale(0);
            transition: all 0.5s ease;
        }
        
        .menu-button:active::after {
            animation: ripple 0.6s ease-out;
        }
        
        .menu-button.primary {
            background: rgba(0, 204, 255, 0.2);
            animation: floatEffect 4s infinite ease-in-out;
            border-width: 2px;
        }
        
        .menu-button-icon {
            margin-right: 10px;
            font-size: 18px;
        }
        
        .version-tag {
            position: absolute;
            bottom: 20px;
            right: 20px;
            font-family: 'VT323', monospace;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.5);
        }
        
        .corner-glyphs {
            position: absolute;
            width: 150px;
            height: 150px;
            opacity: 0.8;
            pointer-events: none;
        }
        
        .top-left {
            top: 20px;
            left: 20px;
            border-top: 2px solid #00ccff;
            border-left: 2px solid #00ccff;
        }
        
        .top-right {
            top: 20px;
            right: 20px;
            border-top: 2px solid #00ccff;
            border-right: 2px solid #00ccff;
        }
        
        .bottom-left {
            bottom: 20px;
            left: 20px;
            border-bottom: 2px solid #00ccff;
            border-left: 2px solid #00ccff;
        }
        
        .bottom-right {
            bottom: 20px;
            right: 20px;
            border-bottom: 2px solid #00ccff;
            border-right: 2px solid #00ccff;
        }
        
        /* Animation des particules améliorée */
        .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
            pointer-events: none;
        }
        
        .particle {
            position: absolute;
            background-color: rgba(0, 204, 255, 0.5);
            border-radius: 50%;
            width: 3px;
            height: 3px;
            pointer-events: none;
            box-shadow: 0 0 10px rgba(0, 204, 255, 0.8);
        }
        
        /* Style pour les modals améliorés */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
            opacity: 0;
            visibility: hidden;
            transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
            backdrop-filter: blur(5px);
        }
        
        .modal.active {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-content {
            background: linear-gradient(135deg, rgba(0, 12, 24, 0.95), rgba(0, 24, 48, 0.9));
            border: 1px solid #00ccff;
            box-shadow: 0 0 30px rgba(0, 204, 255, 0.5), inset 0 0 30px rgba(0, 204, 255, 0.1);
            width: 80%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            border-radius: 8px;
            padding: 30px;
            position: relative;
            transform: translateY(-50px) scale(0.95);
            transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
        }
        
        .modal.active .modal-content {
            transform: translateY(0) scale(1);
        }
        
        .modal-title {
            font-family: 'Orbitron', sans-serif;
            color: #00ccff;
            text-align: center;
            margin-bottom: 20px;
            font-size: 28px;
            letter-spacing: 2px;
            text-shadow: 0 0 10px rgba(0, 204, 255, 0.5);
        }
        
        .modal-decoration {
            position: absolute;
            width: 40px;
            height: 40px;
            border: 1px solid rgba(0, 204, 255, 0.5);
            opacity: 0.5;
        }
        
        .modal-decoration.top-left {
            top: 10px;
            left: 10px;
            border-right: none;
            border-bottom: none;
        }
        
        .modal-decoration.top-right {
            top: 10px;
            right: 10px;
            border-left: none;
            border-bottom: none;
        }
        
        .modal-decoration.bottom-left {
            bottom: 10px;
            left: 10px;
            border-right: none;
            border-top: none;
        }
        
        .modal-decoration.bottom-right {
            bottom: 10px;
            right: 10px;
            border-left: none;
            border-top: none;
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 24px;
            color: #00ccff;
            background: none;
            border: none;
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            transform: rotate(90deg);
        }
        
        .setting-group {
            margin-bottom: 20px;
            position: relative;
            padding-left: 10px;
        }
        
        .setting-group::before {
            content: "";
            position: absolute;
            left: 0;
            top: 10px;
            bottom: 10px;
            width: 3px;
            background: rgba(0, 204, 255, 0.3);
        }
        
        .setting-label {
            font-family: 'Rajdhani', sans-serif;
            color: #fff;
            margin-bottom: 10px;
            display: block;
            font-size: 18px;
            letter-spacing: 1px;
        }
        
        .setting-control {
            width: 100%;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid #00ccff;
            padding: 10px;
            color: #fff;
            border-radius: 4px;
            font-family: 'Rajdhani', sans-serif;
            transition: all 0.3s ease;
        }
        
        .setting-control:focus {
            box-shadow: 0 0 15px rgba(0, 204, 255, 0.5);
            outline: none;
        }
        
        .slider-container {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .slider {
            flex-grow: 1;
            -webkit-appearance: none;
            height: 4px;
            background: #004c66;
            outline: none;
            border-radius: 2px;
        }
        
        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #00ccff;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0, 204, 255, 0.5);
            transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
        }
        
        .slider-value {
            width: 40px;
            text-align: center;
            font-family: 'VT323', monospace;
        }
        
        /* Animation pour le bouton de lancement */
        @keyframes launchButtonPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(0, 204, 255, 0.5); }
            50% { transform: scale(1.05); box-shadow: 0 0 25px rgba(0, 204, 255, 0.8); }
        }
        
        .launch-button {
            animation: launchButtonPulse 2s infinite ease-in-out;
        }
    `;
    document.head.appendChild(style);
    
    // Créer les éléments du menu avec plus d'éléments visuels
    const menuHTML = `
        <div class="menu-background parallax-bg" data-depth="0.1"></div>
        <div class="menu-overlay parallax-bg" data-depth="0.2"></div>
        <div class="glitch-overlay parallax-bg" data-depth="0.3"></div>
        <div class="noise-overlay"></div>
        <div class="scanline"></div>
        
        <div class="corner-glyphs top-left"></div>
        <div class="corner-glyphs top-right"></div>
        <div class="corner-glyphs bottom-left"></div>
        <div class="corner-glyphs bottom-right"></div>
        
        <div class="particles" id="particles"></div>
        
        <div class="menu-content">
            <div class="menu-title-container">
                <h1 class="menu-title">LIFE SEEKER</h1>
            </div>
            <div class="menu-subtitle">Mission de sauvetage planétaire</div>
            
            <div class="menu-buttons">
                <button id="startButton" class="menu-button primary launch-button">
                    <span class="menu-button-icon">▶</span> ENTRER DANS LA RÉALITÉ
                </button>
                <button id="optionsButton" class="menu-button">
                    <span class="menu-button-icon">⚙</span> PARAMÈTRES
                </button>
                <button id="loreButton" class="menu-button">
                    <span class="menu-button-icon">📜</span> HISTOIRE
                </button>
                <button id="quitButton" class="menu-button">
                    <span class="menu-button-icon">✕</span> DÉCONNEXION
                </button>
            </div>
        </div>
        
        <div class="version-tag">ALPHA v0.2</div>
    `;
    
    menuContainer.innerHTML = menuHTML;
    document.body.appendChild(menuContainer);
    
    // Créer et configurer le modal des options
    const optionsModal = document.createElement("div");
    optionsModal.className = "modal";
    optionsModal.id = "optionsModal";
    
    const optionsModalContent = `
        <div class="modal-content">
            <div class="modal-decoration top-left"></div>
            <div class="modal-decoration top-right"></div>
            <div class="modal-decoration bottom-left"></div>
            <div class="modal-decoration bottom-right"></div>
            
            <h2 class="modal-title">PARAMÈTRES SYSTÈME</h2>
            <button class="modal-close" id="closeOptions">×</button>
            
            <div class="setting-group">
                <label class="setting-label">Qualité Graphique</label>
                <select class="setting-control" id="graphicsQuality">
                    <option value="low">Basse</option>
                    <option value="medium" selected>Moyenne</option>
                    <option value="high">Haute</option>
                    <option value="ultra">Ultra</option>
                </select>
            </div>
            
            <div class="setting-group">
                <label class="setting-label">Volume Musique</label>
                <div class="slider-container">
                    <input type="range" min="0" max="100" value="70" class="slider" id="musicVolumeSlider">
                    <span class="slider-value" id="musicVolumeValue">70%</span>
                </div>
            </div>
            
            <div class="setting-group">
                <label class="setting-label">Volume Effets</label>
                <div class="slider-container">
                    <input type="range" min="0" max="100" value="80" class="slider" id="sfxVolumeSlider">
                    <span class="slider-value" id="sfxVolumeValue">80%</span>
                </div>
            </div>
            
            <div class="setting-group">
                <label class="setting-label">Sensibilité Souris</label>
                <div class="slider-container">
                    <input type="range" min="1" max="10" value="5" class="slider" id="sensitivitySlider">
                    <span class="slider-value" id="sensitivityValue">5</span>
                </div>
            </div>
            
            <div class="setting-group">
                <label class="setting-label">Plein Écran</label>
                <select class="setting-control" id="displayMode">
                    <option value="windowed">Fenêtré</option>
                    <option value="fullscreen">Plein Écran</option>
                </select>
            </div>
            
            <div class="setting-group">
                <label class="setting-label">Effets Visuels</label>
                <select class="setting-control" id="visualEffects">
                    <option value="minimal">Minimaux</option>
                    <option value="normal" selected>Normaux</option>
                    <option value="maximum">Maximaux</option>
                </select>
            </div>
            
            <button class="menu-button primary" id="saveSettings" style="margin-top: 20px;">SAUVEGARDER</button>
        </div>
    `;
    
    optionsModal.innerHTML = optionsModalContent;
    document.body.appendChild(optionsModal);
    
    // Créer et configurer le modal du lore avec des éléments visuels améliorés
    const loreModal = document.createElement("div");
    loreModal.className = "modal";
    loreModal.id = "loreModal";
    
    const loreModalContent = `
        <div class="modal-content">
            <div class="modal-decoration top-left"></div>
            <div class="modal-decoration top-right"></div>
            <div class="modal-decoration bottom-left"></div>
            <div class="modal-decoration bottom-right"></div>
            
            <h2 class="modal-title">LES ARCHIVES</h2>
            <button class="modal-close" id="closeLore">×</button>
            
            <div style="position: relative; margin-bottom: 20px; padding: 10px; border-left: 3px solid #00ccff;">
                <div style="position: absolute; top: 0; left: 0; width: 10px; height: 10px; border-radius: 50%; background: #00ccff;"></div>
                <p style="color: #ccc; font-family: 'Rajdhani', sans-serif; line-height: 1.6; margin-bottom: 15px;">
                    <span style="color: #00ccff; font-weight: bold;">2079</span> — Après des décennies de catastrophes climatiques, des migrations massives et 
                    l'épuisement total des ressources terrestres, les scientifiques sont unanimes : la Terre n'est plus 
                    viable pour l'humanité.
                </p>
            </div>
            
            <div style="position: relative; margin-bottom: 20px; padding: 10px; border-left: 3px solid #00ccff;">
                <div style="position: absolute; top: 0; left: 0; width: 10px; height: 10px; border-radius: 50%; background: #00ccff;"></div>
                <p style="color: #ccc; font-family: 'Rajdhani', sans-serif; line-height: 1.6; margin-bottom: 15px;">
                    <span style="color: #00ccff; font-weight: bold;">VOTRE RÔLE</span> — Vous êtes un membre clé de l'équipe chargée de rechercher une planète habitable. 
                    Après des années d'analyses et d'exploration, vos recherches ont permis d'identifier une planète d'accueil 
                    potentiel : <span style="color: #00ccff; font-style: italic;">Zarenthis</span>.
                </p>
            </div>
            
            <div style="position: relative; margin-bottom: 20px; padding: 10px; border-left: 3px solid #00ccff;">
                <div style="position: absolute; top: 0; left: 0; width: 10px; height: 10px; border-radius: 50%; background: #00ccff;"></div>
                <p style="color: #ccc; font-family: 'Rajdhani', sans-serif; line-height: 1.6; margin-bottom: 15px;">
                    <span style="color: #00ccff; font-weight: bold;">MISSION</span> — Voyager sur Zarenthis, effectuer des prélèvements et recueillir des données essentielles 
                    sur son atmosphère, son sol, sa faune et sa flore. <span style="color: #ff3377; font-weight: bold;">Vous devez compléter vos analyses en deux semaines !</span>
                </p>
            </div>
            
            <div style="position: relative; margin-bottom: 20px; padding: 10px; border-left: 3px solid #00ccff;">
                <div style="position: absolute; top: 0; left: 0; width: 10px; height: 10px; border-radius: 50%; background: #00ccff;"></div>
                <p style="color: #ccc; font-family: 'Rajdhani', sans-serif; line-height: 1.6; margin-bottom: 15px;">
                    <span style="color: #00ccff; font-weight: bold;">ÉQUIPEMENT</span> — Outils scientifiques avancés (AtmoScan, HydroScan, SolarGuard et une encyclopédie interactive).
                    Vous explorerez cette planète luxuriante aux forêts bioluminescentes, tout en restant vigilant face aux 
                    dangers potentiels.
                </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: rgba(0, 204, 255, 0.1); border-radius: 5px;">
                <p style="color: #fff; font-family: 'Orbitron', sans-serif; line-height: 1.6; font-size: 18px;">
                    Le sort de l'humanité repose entre vos mains. Vos analyses détermineront 
                    si Zarenthis deviendra notre nouveau foyer.
                </p>
            </div>
        </div>
    `;
    
    loreModal.innerHTML = loreModalContent;
    document.body.appendChild(loreModal);
    
    // Ajouter les événements avec effets sonores
    const addSoundEffect = (element, soundType) => {
        element.addEventListener("mouseenter", () => {
            playSound(soundType, 0.2);
        });
        element.addEventListener("click", () => {
            playSound("click", 0.3);
        });
    };
    
    const playSound = (type, volume = 0.5) => {
        const sound = new Audio();
        sound.volume = volume;
        
        switch(type) {
            case "hover":
                sound.src = "https://example.com/path-to-your-hover-sound.mp3";
                break;
            case "click":
                sound.src = "https://example.com/path-to-your-click-sound.mp3";
                break;
            default:
                return;
        }
        
        sound.play().catch(e => console.log("Lecture audio empêchée : Interaction utilisateur nécessaire"));
    };
    
    // Ajouter des effets sonores aux boutons
    document.querySelectorAll(".menu-button").forEach(button => {
        addSoundEffect(button, "hover");
    });
    
    // Ajouter les événements principaux
    document.getElementById("startButton").addEventListener("click", startGameWithTransition);
    document.getElementById("optionsButton").addEventListener("click", () => toggleModal("optionsModal"));
    document.getElementById("loreButton").addEventListener("click", () => toggleModal("loreModal"));
    document.getElementById("quitButton").addEventListener("click", () => confirmExit());
    document.getElementById("closeOptions").addEventListener("click", () => toggleModal("optionsModal"));
    document.getElementById("closeLore").addEventListener("click", () => toggleModal("loreModal"));
    document.getElementById("saveSettings").addEventListener("click", () => {
        // Animation de sauvegarde
        const saveBtn = document.getElementById("saveSettings");
        saveBtn.innerText = "SAUVEGARDÉ !";
        saveBtn.style.background = "rgba(0, 255, 0, 0.2)";
        
        setTimeout(() => {
            saveBtn.innerText = "SAUVEGARDER";
            saveBtn.style.background = "rgba(0, 204, 255, 0.2)";
            toggleModal("optionsModal");
        }, 1000);
        
        // Appliquer les paramètres
        applySettings();
    });
    
    // Ajouter effet de parallaxe
    if (window.matchMedia("(min-width: 768px)").matches) {
        document.addEventListener("mousemove", (e) => {
            const elements = document.querySelectorAll(".parallax-bg");
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            elements.forEach(element => {
                const depth = parseFloat(element.getAttribute("data-depth"));
                const moveX = mouseX * depth * 50;
                const moveY = mouseY * depth * 50;
                element.style.transform = `translate3d(${-moveX}px, ${-moveY}px, 0)`;
            });
        });
    }
    
    // Mettre à jour les valeurs des sliders avec affichage en temps réel
    document.getElementById("musicVolumeSlider").addEventListener("input", (e) => {
        document.getElementById("musicVolumeValue").textContent = e.target.value + "%";
        if (audioBackground) {
            audioBackground.volume = e.target.value / 100;
        }
    });
    
    document.getElementById("sfxVolumeSlider").addEventListener("input", (e) => {
        document.getElementById("sfxVolumeValue").textContent = e.target.value + "%";
    });
    
    document.getElementById("sensitivitySlider").addEventListener("input", (e) => {
        document.getElementById("sensitivityValue").textContent = e.target.value;
    });
    
    // Ajouter animation de particules améliorée
    createParticles();
};

// Fonction pour appliquer les paramètres
const applySettings = () => {
    const graphicsQuality = document.getElementById("graphicsQuality").value;
    const musicVolume = document.getElementById("musicVolumeSlider").value / 100;
    const sfxVolume = document.getElementById("sfxVolumeSlider").value / 100;
    const sensitivity = document.getElementById("sensitivitySlider").value;
    const displayMode = document.getElementById("displayMode").value;
    const visualEffects = document.getElementById("visualEffects").value;
    
    // Appliquer volume musique
    if (audioBackground) {
        audioBackground.volume = musicVolume;
    }
    
    // Appliquer volume effets sonores aux sons ambiants
    ambientSounds.forEach(sound => {
        sound.volume = sfxVolume * 0.5; // Réduire légèrement pour les sons ambiants
    });
    
    // Appliquer plein écran si demandé
    if (displayMode === "fullscreen" && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(e => {
            console.log("Erreur lors du passage en plein écran :", e);
        });
    } else if (displayMode === "windowed" && document.fullscreenElement) {
        document.exitFullscreen().catch(e => {
            console.log("Erreur lors de la sortie du plein écran :", e);
        });
    }
    
    // Sauvegarder les paramètres dans localStorage pour les conserver
    const settings = {
        graphicsQuality,
        musicVolume,
        sfxVolume,
        sensitivity,
        displayMode,
        visualEffects
    };
    
    localStorage.setItem("lifeSeekerSettings", JSON.stringify(settings));
    
    // Appliquer les effets visuels
    applyVisualEffects(visualEffects);
};

// Fonction pour appliquer les effets visuels selon le paramètre
const applyVisualEffects = (level) => {
    const particles = document.getElementById("particles");
    const glitchOverlay = document.querySelector(".glitch-overlay");
    const noiseOverlay = document.querySelector(".noise-overlay");
    const scanline = document.querySelector(".scanline");
    
    switch(level) {
        case "minimal":
            particles.style.opacity = "0.3";
            glitchOverlay.style.opacity = "0.2";
            noiseOverlay.style.opacity = "0.1";
            scanline.style.opacity = "0.3";
            break;
        case "normal":
            particles.style.opacity = "1";
            glitchOverlay.style.opacity = "0.4";
            noiseOverlay.style.opacity = "0.3";
            scanline.style.opacity = "0.6";
            break;
        case "maximum":
            particles.style.opacity = "1";
            glitchOverlay.style.opacity = "0.6";
            noiseOverlay.style.opacity = "0.4";
            scanline.style.opacity = "0.8";
            
            // Ajouter des effets supplémentaires en mode maximum
            if (!document.getElementById("maxEffects")) {
                const maxEffects = document.createElement("style");
                maxEffects.id = "maxEffects";
                maxEffects.innerHTML = `
                    @keyframes rgbEffect {
                        0%, 100% { filter: hue-rotate(0deg); }
                        25% { filter: hue-rotate(15deg); }
                        50% { filter: hue-rotate(30deg); }
                        75% { filter: hue-rotate(15deg); }
                    }
                    
                    .menu-title {
                        animation: pulsateShadow 3s infinite, rgbEffect 10s infinite linear !important;
                    }
                    
                    .menu-background {
                        animation: backgroundPulse 10s infinite ease-in-out, rgbEffect 20s infinite linear !important;
                    }
                `;
                document.head.appendChild(maxEffects);
            }
            break;
    }
};

const toggleModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal.classList.contains("active")) {
        modal.classList.remove("active");
    } else {
        modal.classList.add("active");
    }
};

const confirmExit = () => {
    // Créer un modal de confirmation moderne
    const confirmModal = document.createElement("div");
    confirmModal.className = "modal";
    confirmModal.id = "confirmModal";
    confirmModal.style.zIndex = "150";
    
    const confirmContent = `
        <div class="modal-content" style="max-width: 400px;">
            <h2 class="modal-title">CONFIRMATION</h2>
            <p style="color: #ccc; text-align: center; margin-bottom: 20px; font-family: 'Rajdhani', sans-serif;">
                Êtes-vous sûr de vouloir quitter ?<br>
                <span style="color: #ff3377;">Votre progression ne sera pas sauvegardée.</span>
            </p>
            <div style="display: flex; gap: 10px;">
                <button id="cancelExit" class="menu-button" style="flex: 1;">ANNULER</button>
                <button id="confirmExit" class="menu-button primary" style="flex: 1;">QUITTER</button>
            </div>
        </div>
    `;
    
    confirmModal.innerHTML = confirmContent;
    document.body.appendChild(confirmModal);
    confirmModal.classList.add("active");
    
    document.getElementById("cancelExit").addEventListener("click", () => {
        confirmModal.classList.remove("active");
        setTimeout(() => confirmModal.remove(), 500);
    });
    
    document.getElementById("confirmExit").addEventListener("click", () => {
        window.close();
        // En cas d'échec de la fermeture (navigateurs web)
        confirmModal.classList.remove("active");
        setTimeout(() => {
            confirmModal.remove();
            alert("Votre navigateur a empêché la fermeture de la fenêtre. Vous pouvez fermer l'onglet manuellement.");
        }, 500);
    });
};

const createParticles = () => {
    const particlesContainer = document.getElementById("particles");
    const particleCount = 70; // Augmentation du nombre de particules
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        
        // Position aléatoire
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        // Taille aléatoire et variable
        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Opacité et luminosité aléatoires
        particle.style.opacity = Math.random() * 0.7 + 0.3;
        particle.style.filter = `brightness(${Math.random() * 200 + 100}%)`;
        
        // Animation personnalisée pour chaque particule
        const duration = Math.random() * 15 + 5;
        const delay = Math.random() * 5;
        
        particle.style.animation = `floatEffect ${duration}s ${delay}s infinite ease-in-out`;
        
        // Ajouter effet de scintillement pour certaines particules
        if (Math.random() > 0.7) {
            particle.style.animation += `, pulse 2s ${Math.random() * 2}s infinite ease-in-out`;
        }
        
        particlesContainer.appendChild(particle);
    }
    
    // Ajouter un style pour l'animation de scintillement
    const pulseStyle = document.createElement("style");
    pulseStyle.innerHTML = `
        @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(pulseStyle);
};

const startGameWithTransition = () => {
    // Créer un overlay de transition
    const transitionOverlay = document.createElement("div");
    transitionOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #000510 0%, #001a36 100%);
        z-index: 50;
        opacity: 0;
        transition: opacity 1.5s ease;
    `;
    
    // Ajouter un effet de scanline pour la transition
    const scanlineEffect = document.createElement("div");
    scanlineEffect.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.05) 50%);
        background-size: 100% 4px;
        pointer-events: none;
        z-index: 51;
    `;
    
    // Conteneur pour le message
    const messageContainer = document.createElement("div");
    messageContainer.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 600px;
        text-align: center;
    `;
    
    // Message d'initialisation avec effet de terminal
    const initMessage = document.createElement("div");
    initMessage.style.cssText = `
        color: #00ccff;
        font-family: 'Orbitron', sans-serif;
        font-size: 24px;
        text-align: center;
        margin-bottom: 30px;
        opacity: 0;
        transition: opacity 1s ease;
        text-shadow: 0 0 10px rgba(0, 204, 255, 0.5);
    `;
    initMessage.innerHTML = `PRÉPARATION AU TRANSFERT VERS ZARENTHIS<span class="terminal-cursor">_</span>`;
    
    // Ajouter un effet de curseur clignotant
    const cursorStyle = document.createElement("style");
    cursorStyle.innerHTML = `
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        
        .terminal-cursor {
            animation: blink 1s infinite;
        }
    `;
    document.head.appendChild(cursorStyle);
    
    // Visualiseur de portail
    const portalVisualizer = document.createElement("div");
    portalVisualizer.style.cssText = `
        width: 200px;
        height: 200px;
        margin: 0 auto 40px;
        border-radius: 50%;
        background: radial-gradient(circle, #00ccff 0%, transparent 70%);
        box-shadow: 0 0 50px #00ccff;
        opacity: 0;
        transition: all 2s ease;
        position: relative;
        overflow: hidden;
    `;
    
    // Ajouter une animation de tourbillon
    portalVisualizer.innerHTML = `
        <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; 
                    background-image: conic-gradient(from 0deg, transparent, #00ccff, transparent);
                    animation: rotate 5s linear infinite;"></div>
    `;
    
    // Ajouter un style pour l'animation de rotation
    const rotateStyle = document.createElement("style");
    rotateStyle.innerHTML = `
        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(rotateStyle);
    
    messageContainer.appendChild(portalVisualizer);
    messageContainer.appendChild(initMessage);
    transitionOverlay.appendChild(scanlineEffect);
    transitionOverlay.appendChild(messageContainer);
    document.body.appendChild(transitionOverlay);
    
    // Animation de transition
    setTimeout(() => {
        transitionOverlay.style.opacity = "1";
    }, 100);
    
    setTimeout(() => {
        portalVisualizer.style.opacity = "1";
        portalVisualizer.style.transform = "scale(1.2)";
    }, 800);
    
    setTimeout(() => {
        initMessage.style.opacity = "1";
    }, 1500);
    
    // Messages de transition centrés sur la mission scientifique avec un effet de "typing"
    const transitionMessages = [
        "ÊTES-VOUS PRÊT À SAUVER L'HUMANITÉ ?",
        "ZARENTHIS SERA-T-ELLE NOTRE NOUVEAU FOYER ?",
        "VOUS AVEZ DEUX SEMAINES POUR ANALYSER LA PLANÈTE",
        "L'AVENIR DE L'HUMANITÉ DÉPEND DE VOS RECHERCHES"
    ];
    
    let messageIndex = 0;
    
    const typeMessage = (message, callback) => {
        let i = 0;
        initMessage.innerHTML = '<span class="terminal-cursor">_</span>';
        
        const typing = setInterval(() => {
            if (i < message.length) {
                initMessage.innerHTML = message.substring(0, i + 1) + '<span class="terminal-cursor">_</span>';
                i++;
            } else {
                clearInterval(typing);
                if (callback) setTimeout(callback, 1000);
            }
        }, 50);
    };
    
    const showNextMessage = () => {
        if (messageIndex < transitionMessages.length) {
            typeMessage(transitionMessages[messageIndex], () => {
                messageIndex++;
                showNextMessage();
            });
        } else {
            // Effet de flash pour la transition finale
            const flashOverlay = document.createElement("div");
            flashOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #00ccff;
                z-index: 60;
                opacity: 0;
                transition: opacity 0.1s ease;
            `;
            document.body.appendChild(flashOverlay);
            
            setTimeout(() => {
                flashOverlay.style.opacity = "1";
                
                // Son de téléportation
                const teleportSound = new Audio("https://example.com/path-to-teleport-sound.mp3");
                teleportSound.volume = 0.5;
                teleportSound.play().catch(e => console.log("Lecture audio empêchée"));
                
                setTimeout(() => {
                    flashOverlay.style.opacity = "0";
                    
                    // Lancer le jeu
                    setTimeout(() => {
                        document.getElementById("mainMenu").remove();
                        document.querySelectorAll(".modal").forEach(modal => modal.remove());
                        transitionOverlay.remove();
                        flashOverlay.remove();
                        startGame();
                    }, 400);
                }, 200);
            }, 1000);
        }
    };
    
    // Démarrer la séquence de messages
    setTimeout(showNextMessage, 2000);
};

const startGame = async () => {
    if (audioBackground) {
        // Réduire progressivement le volume de la musique du menu
        const fadeOutInterval = setInterval(() => {
            if (audioBackground.volume > 0.05) {
                audioBackground.volume -= 0.05;
            } else {
                audioBackground.pause();
                clearInterval(fadeOutInterval);
                
                // Charger la musique de jeu
                const gameMusic = new Audio("https://example.com/path-to-your-game-music.mp3");
                gameMusic.loop = true;
                gameMusic.volume = 0;
                
                // Augmenter progressivement le volume de la musique de jeu
                gameMusic.play().catch(e => console.log("Lecture audio automatique empêchée"));
                
                const fadeInInterval = setInterval(() => {
                    if (gameMusic.volume < 0.4) {
                        gameMusic.volume += 0.05;
                    } else {
                        clearInterval(fadeInInterval);
                    }
                }, 100);
                
                // Remplacer l'audio de fond
                audioBackground = gameMusic;
            }
        }, 100);
    }
    
    // Récupérer les paramètres sauvegardés
    const savedSettings = localStorage.getItem("lifeSeekerSettings");
    const settings = savedSettings ? JSON.parse(savedSettings) : null;
    
    // Initialiser le jeu avec les paramètres sauvegardés
    game = new Game(canvas, engine, settings);
    await game.start();
};

// Initialiser Babylon.js
babylonInit();