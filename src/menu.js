// import { Scene, Vector3, Color3, ArcRotateCamera, HemisphericLight, MeshBuilder, StandardMaterial, Texture, ActionManager, ExecuteCodeAction, Sound } from "@babylonjs/core";
// import horrorFont from "../assets/textures/image-cache.jpg"; // Remplace avec une texture pour le texte
// import menuMusic from "../assets/sounds/horror-background-atmosphere-156462.mp3"; // Remplace par un son d'ambiance

// class Menu {
//     constructor(canvas, engine) {
//         this.canvas = canvas;
//         this.engine = engine;
//         this.scene = this.createScene();
//         this.onStartGame = null;

//         this.engine.runRenderLoop(() => {
//             this.scene.render();
//         });
//     }

//     createScene() {
//         const scene = new Scene(this.engine);
//         scene.clearColor = new Color3(0, 0, 0); // Fond noir total

//         // Caméra fixe
//         //const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 10, Vector3.Zero(), scene);
//         const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 15, Vector3.Zero(), scene);

//         camera.attachControl(this.canvas, true);

//         // Lumière faible pour ambiance creepy
//        // new HemisphericLight("light", new Vector3(0, 1, 0), scene).intensity = 0.2;
//        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
// light.intensity = 0.8;


//         // Musique d’ambiance
//         const music = new Sound("menuMusic", menuMusic, scene, null, { loop: true, autoplay: true, volume: 0.3 });

//         // Titre du jeu en 3D
//         const title = MeshBuilder.CreatePlane("title", { width: 5, height: 2 }, scene);
//         title.position = new Vector3(0, 3, 0);

//         const titleMat = new StandardMaterial("titleMat", scene);
//         //titleMat.diffuseTexture = new Texture(horrorFont, scene);
//         titleMat.diffuseTexture = new Texture("https://www.babylonjs-playground.com/textures/grass.jpg", scene);
//         title.material = titleMat;

//         // Effet d’oscillation pour le titre (léger mouvement sinusoïdal)
//         scene.onBeforeRenderObservable.add(() => {
//             title.position.y = 3 + Math.sin(Date.now() * 0.002) * 0.1;
//         });

//         // Boutons start & options
//         const buttonStart = this.createButton("START GAME", new Vector3(0, 1, 0), scene);
//         const buttonOptions = this.createButton("OPTIONS", new Vector3(0, -0.5, 0), scene);

//         // Action du bouton start
//         buttonStart.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
//             if (this.onStartGame) this.onStartGame();
//         }));
//         console.log(scene);
//         return scene;
//     }
  

//     createButton(text, position, scene) {
//         const button = MeshBuilder.CreatePlane("button", { width: 3, height: 1 }, scene);
//         button.position = position;

//         const buttonMat = new StandardMaterial("buttonMat", scene);
//         buttonMat.diffuseTexture = new Texture(horrorFont, scene);
//         button.material = buttonMat;

//         button.actionManager = new ActionManager(scene);
//         return button;
//     }
// }

// export default Menu;
