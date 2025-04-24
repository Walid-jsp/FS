import { ActionManager, Sound, Color3, Color4, FollowCamera, FreeCamera, PhysicsImpostor, SceneLoader, CubeTexture, HavokPlugin, HemisphericLight, InterpolateValueAction, KeyboardEventTypes, Mesh, MeshBuilder, ParticleSystem, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType, Scene, SetValueAction, ShadowGenerator, SpotLight, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { Inspector } from '@babylonjs/inspector';
import Player from "./Player";
import Zaranthis from "./Zaranthis";
import { GlobalManager } from "./GlobalManager";




import HavokPhysics from "@babylonjs/havok";

import floorUrl from "../assets/textures/floor.png";
import floorBumpUrl from "../assets/textures/floor_bump.png";



import darkSky from "../assets/textures/darkSky.png";
import smilyFace from "../assets/models/smily_horror_monster.glb";
import labo from "../assets/models/sci-fi_lab.glb";
import portail from "../assets/models/stargate.glb";
import bioAnalyser from "../assets/models/sci-fi_scanner_prop_fan_art.glb";
import boiteAMunitions from "../assets/models/sci-fi_ammo_box.glb";
import tableau from "../assets/models/sci_fi_monitor.glb";
import { InputController } from "./InputController";


class Game {

    #canvas;
    #engine;
    #havokInstance;
    //#gameScene;
    #gameCamera;
    #shadowGenerator;
    #bInspector = false;
    hasTeleported = false;
    isPlayerReady = true;


    //#phase = 0.0;
    // #vitesseY = 1.8;

    inputMap = {};
    actions = {};

    #player;
    #zaranthis;

    danceSound;

    constructor(canvas, engine) {
        this.#canvas = canvas;
        this.#engine = engine;
        GlobalManager.init(canvas, engine);
    }

    async start() {
        await this.initGame()
        this.gameLoop();
        
        this.endGame();
    }

    createScene() {


        GlobalManager.scene.collisionsEnabled = true;

        const hk = new HavokPlugin(true, this.#havokInstance);
        // enable physics in the scene with a gravity
        GlobalManager.scene.enablePhysics(new Vector3(0, -9.81, 0), hk);
     // Lumière d'ambiance générale
const ambientLight = new HemisphericLight("ambient", new Vector3(0, 1, 0), GlobalManager.scene);
ambientLight.intensity = 0.9;

  // Créer la FollowCamera standard
  this.#gameCamera = new FollowCamera("camera1", new Vector3(0, 0, 0), GlobalManager.scene);
  this.#gameCamera.heightOffset = 3;
  this.#gameCamera.radius = -8;
  this.#gameCamera.maxCameraSpeed = 1;
  this.#gameCamera.cameraAcceleration = 0.025;
  this.#gameCamera.rotationOffset = 180;
  
  // Désactivation du paramètre noPreventDefault pour permettre le contrôle sans clic
  this.#gameCamera.attachControl(this.#canvas, false, false, false);
  
  // Activer les collisions de la caméra
  this.#gameCamera.checkCollisions = true;
  this.#gameCamera.ellipsoid = new Vector3(1, 1, 1);
  this.#gameCamera.ellipsoidOffset = new Vector3(0, 2, 0);
  
  // Le reste de votre code createScene() reste identique...
  
  // Ajout de la gestion personnalisée des mouvements de souris
  this.setupCameraMouseControl();


        

        // Limitation du labo - 3 murs + toit





        // bioAnalyser


        // Boite à munitions

        // Tableau


        // Portail avec zone de téléportation - Correction apportée ici
        SceneLoader.ImportMeshAsync("", "", portail, GlobalManager.scene).then((result) => {
            const portailMesh = result.meshes[0];
            portailMesh.name = "portail";

            portailMesh.scaling = new Vector3(0.02, 0.02, 0.02);
            portailMesh.position = new Vector3(0.81, 2.28, 13.07);
            portailMesh.rotation = new Vector3(0, Math.PI, 0);
            portailMesh.checkCollisions = true;
            portailMesh.receiveShadows = true;

            // Zone de détection devant le portail - Agrandie pour faciliter l'intersection
            // Zone de détection devant le portail - Invisible mais active
            const teleportZone = MeshBuilder.CreateBox("teleportZone", {
                width: 4,
                height: 4,
                depth: 4
            }, GlobalManager.scene);

            teleportZone.position = new Vector3(0.81, 2, 11.5);

            // Matériau transparent
            const zoneMat = new StandardMaterial("teleportZoneMat", GlobalManager.scene);
            zoneMat.diffuseColor = new Color3(1, 1, 1);  // blanc par défaut, mais peu importe
            zoneMat.alpha = 0; // totalement transparent
            teleportZone.material = zoneMat;

            teleportZone.isVisible = false; // le mesh ne s'affiche pas du tout
            teleportZone.isPickable = false;
            teleportZone.checkCollisions = false;

            // On stocke la zone dans la scène pour pouvoir l'utiliser ailleurs
            GlobalManager.scene.teleportZone = teleportZone;
            console.log("Zone de téléportation (invisible) prête à la position:", teleportZone.position);

            for (let childMesh of result.meshes) {
                childMesh.refreshBoundingInfo(true);
                if (childMesh.getTotalVertices() > 0) {
                    const meshAggregate = new PhysicsAggregate(childMesh, PhysicsShapeType.MESH, {
                        mass: 0, friction: 0.4, restitution: 0.1
                    }, GlobalManager.scene);
                    meshAggregate.body.setMotionType(PhysicsMotionType.STATIC);
                    childMesh.checkCollisions = true;
                    childMesh.receiveShadows = true;
                }
            }
        });

    }

    setupCameraMouseControl() {
        let lastX = 0;
        let lastY = 0;
        let isFirstMove = true;
        let verticalOffset = this.#gameCamera.heightOffset;
    
        const minOffset = 1.5;
        const maxOffset = 10;
    
        this.#canvas.addEventListener("pointermove", (evt) => {
            if (isFirstMove) {
                lastX = evt.clientX;
                lastY = evt.clientY;
                isFirstMove = false;
                return;
            }
    
            const deltaX = evt.clientX - lastX;
            const deltaY = evt.clientY - lastY;
    
            // Seulement appliquer le changement si le mouvement est significatif
            if (Math.abs(deltaX) > 0.5) {
                this.#gameCamera.rotationOffset += deltaX * 0.5;
            }
    
            if (Math.abs(deltaY) > 0.5) {
                verticalOffset -= deltaY * 0.1;
                verticalOffset = Math.max(minOffset, Math.min(maxOffset, verticalOffset));
                this.#gameCamera.heightOffset = verticalOffset;
            }
    
            lastX = evt.clientX;
            lastY = evt.clientY;
        });
    
        this.#canvas.addEventListener("pointerout", () => {
            isFirstMove = true;
        });
    
        this.#canvas.addEventListener("pointerenter", () => {
            isFirstMove = true;
        });
    }
    

    async getInitializedHavok() {
        return await HavokPhysics();
    }

    async initGame() {
        this.#havokInstance = await this.getInitializedHavok();
    
        GlobalManager.scene = new Scene(this.#engine);
        GlobalManager.scene.collisionsEnabled = true;
        InputController.init();
        this.createScene();
    
        this.#zaranthis = new Zaranthis(GlobalManager.scene);
        await this.#zaranthis.load();
    
        this.#player = new Player(3, 0, 3);
        await this.#player.init();
    
        this.#gameCamera.lockedTarget = this.#player.transform;
        GlobalManager.addShadowCaster(this.#player.gameObject, true);
    
        this.initInput();
    }
    

    initInput() {
        GlobalManager.scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    this.inputMap[kbInfo.event.code] = true;
                    console.log(`KEY DOWN: ${kbInfo.event.code} / ${kbInfo.event.key}`);
                    break;
                case KeyboardEventTypes.KEYUP:
                    this.inputMap[kbInfo.event.code] = false;
                    this.actions[kbInfo.event.code] = true;
                    console.log(`KEY UP: ${kbInfo.event.code} / ${kbInfo.event.key}`);
                    break;
            }
        });
    }

    endGame() {
        // Méthode vide pour une implémentation future
    }

    gameLoop() {
        const divFps = document.getElementById("fps");
        let hasClicked = false;
    
        window.addEventListener("click", () => {
            if (hasClicked) return;
            hasClicked = true;
    
            const testSound = new Sound(
                "testSound",
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                GlobalManager.scene,
                () => {
                    testSound.play();
                    console.log("✅ testSound is playing");
                },
                {
                    autoplay: false,
                    loop: false,
                    volume: 1.0
                }
            );
        });
    
        this.#engine.runRenderLoop(() => {
            this.updateGame();
    
            if (this.actions["KeyI"]) {
                this.#bInspector = !this.#bInspector;
                if (this.#bInspector) Inspector.Show();
                else Inspector.Hide();
            }
    
            this.actions = {};
            divFps.innerHTML = this.#engine.getFps().toFixed() + " fps";
            GlobalManager.scene.render();
        });
    }
    
    updateGame() {
        if (!this.isPlayerReady) return; // ⛔ Ne met pas à jour tant que le joueur est en cours de rechargement

        let delta = this.#engine.getDeltaTime() / 1000.0;
        this.#player.update(this.inputMap, this.actions, delta);

        // Vérification de téléportation
        const teleportZone = GlobalManager.scene.teleportZone;

        if (
            teleportZone &&
            this.#player.transform &&
            this.#player.transform.intersectsMesh(teleportZone, false) &&
            !this.hasTeleported
        ) {
            console.log("⚠️ Intersection détectée avec la zone de téléportation!");
            this.hasTeleported = true;

            // 🌌 Effet de portail stylé
            const portalDisc = MeshBuilder.CreateDisc("portalDisc", { radius: 6, tessellation: 64 }, GlobalManager.scene);
            portalDisc.position = this.#gameCamera.position.clone().add(new Vector3(0, 0, 6));
            portalDisc.billboardMode = Mesh.BILLBOARDMODE_ALL;

            const gradientMat = new StandardMaterial("portalMat", GlobalManager.scene);
            gradientMat.emissiveColor = new Color3(0.5, 0.3, 1); // Violet lumineux
            gradientMat.alpha = 0.9;
            gradientMat.disableLighting = true;
            portalDisc.material = gradientMat;

            // ✅ Halo secondaire
            const energyHalo = MeshBuilder.CreateDisc("haloDisc", { radius: 2, tessellation: 64 }, GlobalManager.scene);
            energyHalo.position = this.#gameCamera.position.clone().add(new Vector3(0, 0, 5.9));
            energyHalo.billboardMode = Mesh.BILLBOARDMODE_ALL;

            const haloMat = new StandardMaterial("haloMat", GlobalManager.scene);
            haloMat.emissiveColor = new Color3(0.2, 1, 1); // Cyan lumineux
            haloMat.alpha = 0.6;
            haloMat.disableLighting = true;
            energyHalo.material = haloMat;

            // 🌠 Animation visuelle progressive
            const animateFade = () => {
                let step = 0;
                const interval = setInterval(() => {
                    step += 0.05;
                    gradientMat.alpha = Math.max(0, 0.9 - step);
                    haloMat.alpha = Math.max(0, 0.6 - step * 1.5);
                    portalDisc.scaling.scaleInPlace(0.98);
                    energyHalo.scaling.scaleInPlace(0.95);
                    if (gradientMat.alpha <= 0) {
                        clearInterval(interval);
                        portalDisc.dispose();
                        energyHalo.dispose();
                    }
                }, 30);
            };

            // 🚀 Téléportation vers Zaranthis
            console.log("🚀 Tentative de téléportation avec nouvelle méthode...");
            setTimeout(() => {
                try {
                    const destination = Zaranthis.getPosition().add(new Vector3(0, 10, 0));
                    this.isPlayerReady = false;

                    if (this.#player.gameObject) {
                        const oldCamera = this.#gameCamera;

                        // Recrée proprement le joueur à la nouvelle position

                        this.#player = new Player(destination.x, destination.y, destination.z);
                        this.#player.init().then(() => {
                            oldCamera.lockedTarget = this.#player.transform;
                            oldCamera.position = destination.add(new Vector3(0, 14, -8));
                            GlobalManager.addShadowCaster(this.#player.gameObject, true);

                            // Recharge les animations depuis le nouveau modèle
                            //this.#player.reloadAnimations();

                            // Force l’animation idle à s’activer immédiatement
                            //this.#player.stopAllAnimations();
                            if (this.#player.idleAnim) {
                                this.#player.idleAnim.start(true);
                            }

                            // Petit timeout pour s’assurer que tout est prêt
                            setTimeout(() => {
                                this.#player.update(this.inputMap, this.actions, 0.016);
                            }, 100); // ✅ Ce délai permet d’éviter un conflit avec l’instanciation

                            this.#zaranthis.load();
                            this.isPlayerReady = true;
                            console.log("✅ Joueur, caméra et animations relancés !");
                        });




                    }
                } catch (error) {
                    console.error("Erreur téléportation :", error);
                }

                animateFade();
            }, 500);


        }
    }

   


}

export default Game;