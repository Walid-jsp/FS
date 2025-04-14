import { Engine } from "@babylonjs/core";
import Game from "./game";

let canvas;
let engine;
let game;

const babylonInit = async () => {
    canvas = document.getElementById("renderCanvas");
    engine = new Engine(canvas, false, {
        adaptToDeviceRatio: true,
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });

    // Affichage du menu de démarrage
    showMainMenu();
};

// Fonction pour afficher le menu principal
const showMainMenu = () => {
    const menuDiv = document.createElement("div");
    menuDiv.id = "mainMenu";
    menuDiv.style.position = "absolute";
    menuDiv.style.top = "0";
    menuDiv.style.left = "0";
    menuDiv.style.width = "100%";
    menuDiv.style.height = "100%";
    menuDiv.style.background = "rgba(0, 0, 0, 0.9)";
    menuDiv.style.display = "flex";
    menuDiv.style.flexDirection = "column";
    menuDiv.style.justifyContent = "center";
    menuDiv.style.alignItems = "center";
    menuDiv.style.zIndex = "10";
    menuDiv.style.animation = "pulse 3s infinite alternate";

    // Ajout du style global (animation de fond)
    const style = document.createElement("style");
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Nosifer&display=swap');
        @keyframes pulse {
            0% { background: rgba(50, 0, 0, 0.9); }
            100% { background: rgba(100, 0, 0, 0.9); }
        }
        .horror-button {
            font-size: 24px;
            padding: 12px 24px;
            margin: 10px;
            background: black;
            color: white;
            border: 2px solid red;
            font-family: 'Nosifer', cursive;
            cursor: pointer;
            transition: 0.3s;
        }
        .horror-button:hover {
            background: red;
            color: black;
            transform: scale(1.1);
            box-shadow: 0 0 15px red;
        }
    `;
    document.head.appendChild(style);

    // Titre
    const title = document.createElement("h1");
    title.innerText = "RECHERCHE DE STAGE";
    title.style.color = "red";
    title.style.fontSize = "60px";
    title.style.textShadow = "0px 0px 15px red";
    title.style.fontFamily = "'Nosifer', cursive";
    title.style.marginBottom = "20px";

    // Bouton Start
    const startButton = document.createElement("button");
    startButton.innerText = "Start Game";
    startButton.classList.add("horror-button");
    startButton.onclick = startGame;

    // Bouton Options
    const optionsButton = document.createElement("button");
    optionsButton.innerText = "Options";
    optionsButton.classList.add("horror-button");
    optionsButton.onclick = showOptions;

    menuDiv.appendChild(title);
    menuDiv.appendChild(startButton);
    menuDiv.appendChild(optionsButton);
    document.body.appendChild(menuDiv);
};

// Fonction pour démarrer le jeu
const startGame = async () => {
    document.getElementById("mainMenu").remove(); // Supprime le menu
    game = new Game(canvas, engine);
    await game.start();
};

// Fonction pour afficher les options (à personnaliser)
const showOptions = () => {
    alert("Options pas encore implémentées !");
};

babylonInit();
