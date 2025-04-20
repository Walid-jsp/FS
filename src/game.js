import { ActionManager, Sound, Color3, Color4, FollowCamera, FreeCamera, PhysicsImpostor, SceneLoader, CubeTexture, HavokPlugin, HemisphericLight, InterpolateValueAction, KeyboardEventTypes, Mesh, MeshBuilder, ParticleSystem, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType, Scene, SetValueAction, ShadowGenerator, SpotLight, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { Inspector } from '@babylonjs/inspector';
import HavokPhysics from "@babylonjs/havok";

import floorUrl from "../assets/textures/floor.png";
import floorBumpUrl from "../assets/textures/floor_bump.png";
import Player from "./Player";
import soundFile from "../assets/sounds/Candy shop cut.mp3";
import dungeon from "../assets/textures/the_trees_dungeon.glb";
import darkSky from "../assets/textures/darkSky.png";
import smilyFace from "../assets/models/smily_horror_monster.glb";
import labo from "../assets/models/sci-fi_lab.glb";
import portail from "../assets/models/stargate.glb";
import bioAnalyser from "../assets/models/sci-fi_scanner_prop_fan_art.glb";
import boiteAMunitions from "../assets/models/sci-fi_ammo_box.glb";
import tableau from "../assets/models/sci_fi_monitor.glb";

class Game {

    #canvas;
    #engine;
    #havokInstance;
    #gameScene;
    #gameCamera;
    #shadowGenerator;
    #bInspector = false;
    hasTeleported = false;
    isPlayerReady = true;


    #phase = 0.0;
    #vitesseY = 1.8;

    inputMap = {};
    actions = {};

    #player;
    danceSound;

    constructor(canvas, engine) {
        this.#canvas = canvas;
        this.#engine = engine;
    }

    async start() {
        await this.initGame()
        this.gameLoop();
        this.endGame();
    }

    createScene() {
        const scene = new Scene(this.#engine);
        scene.collisionsEnabled = true;

        const hk = new HavokPlugin(true, this.#havokInstance);
        // enable physics in the scene with a gravity
        scene.enablePhysics(new Vector3(0, -9.81, 0), hk);

        this.#gameCamera = new FollowCamera("camera1", new Vector3(0, 0, 0), scene);
        this.#gameCamera.heightOffset = 4;
        this.#gameCamera.radius = -8;
        this.#gameCamera.maxCameraSpeed = 1;
        this.#gameCamera.cameraAcceleration = 0.025;
        this.#gameCamera.rotationOffset = 180;
        this.#gameCamera.attachControl(this.#canvas, true);

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        const sLight = new SpotLight("spot1", new Vector3(0, 20, 20), new Vector3(0, -1, -1), 2, 24, scene);
        this.#shadowGenerator = new ShadowGenerator(1024, sLight);
        this.#shadowGenerator.useBlurExponentialShadowMap = true;

        const ground = MeshBuilder.CreateGround("ground", { width: 640, height: 640, subdivisions: 128 }, scene);
        ground.checkCollisions = true;

        const matGround = new StandardMaterial("boue", scene);
        matGround.diffuseTexture = new Texture(floorUrl);
        matGround.diffuseTexture.uScale = 64;
        matGround.diffuseTexture.vScale = 64;
        matGround.bumpTexture = new Texture(floorBumpUrl);
        matGround.bumpTexture.uScale = 64;
        matGround.bumpTexture.vScale = 64;

        ground.material = matGround;
        ground.receiveShadows = true;

        const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {
            mass: 0, friction: 0.7, restitution: 0.2
        }, scene);

        groundAggregate.body.setMotionType(PhysicsMotionType.STATIC);

        this.danceSound = new Sound("monSon", soundFile, scene, null, { loop: false, autoplay: true });

        // labo
        SceneLoader.ImportMeshAsync("", "", labo, scene).then((result) => {
            let laboMesh = result.meshes[0];
            laboMesh.name = "labo";
        
            laboMesh.scaling = new Vector3(3, 3, 3);
            laboMesh.position = new Vector3(0, 0, 0);
            laboMesh.checkCollisions = true;
            laboMesh.receiveShadows = true;
        
            for (let childMesh of result.meshes) {
                childMesh.refreshBoundingInfo(true);
                if (childMesh.getTotalVertices() > 0) {
                    const meshAggregate = new PhysicsAggregate(
                        childMesh,
                        PhysicsShapeType.MESH,
                        { mass: 0, friction: 0.4, restitution: 0.1 },
                        scene
                    );
                    meshAggregate.body.setMotionType(PhysicsMotionType.STATIC);
                    childMesh.receiveShadows = true;
                }
            }
        
            // Limitation du labo - 3 murs + toit
            const wallMat = new StandardMaterial("wallMat", scene);
            wallMat.diffuseColor = new Color3(0.75, 0.8, 0.85); // gris clair bleuté
            wallMat.specularColor = new Color3(0.2, 0.2, 0.2); // reflets discrets
            wallMat.emissiveColor = new Color3(0.1, 0.1, 0.1); // pour qu'il ne soit pas trop terne
            wallMat.alpha = 1;
            wallMat.backFaceCulling = false;
            
            const wallLeft = MeshBuilder.CreateBox("wallLeft", {
                width: 1,
                height: 12,
                depth: 32
            }, scene);
            
            wallLeft.position = new Vector3(-44.77, 6, 0);
            wallLeft.rotation = new Vector3(0, 0, 0);
            wallLeft.scaling = new Vector3(1, 1, 1);
            wallLeft.material = wallMat;
            wallLeft.checkCollisions = true;
            
            // MUR DROIT
            const wallRight = MeshBuilder.CreateBox("wallRight", {
                width: 1,
                height: 12,
                depth: 32
            }, scene);
            wallRight.position = new Vector3(11.23, 6, 0);
            wallRight.scaling = new Vector3(1, 1, 1);
            wallRight.material = wallMat;
            wallRight.checkCollisions = true;
        
            // MUR DU FOND
            const wallBack = MeshBuilder.CreateBox("wallBack", {
                width: 32,
                height: 12,
                depth: 1
            }, scene);
            wallBack.scaling = new Vector3(2.2, 1, 1);
            wallBack.position = new Vector3(-2.34, 6, -13.18);
            wallBack.rotation = new Vector3(0, 0, 0);
            wallBack.material = wallMat;
            wallBack.checkCollisions = true;
        });

        // bioAnalyser
        SceneLoader.ImportMeshAsync("", "", bioAnalyser, scene).then((result) => {
            let bioAnalyser = result.meshes[0];
            bioAnalyser.name = "bioAnalyser";

            bioAnalyser.scaling = new Vector3(0.02, 0.02, 0.02);
            bioAnalyser.position = new Vector3(6.05, 0.2, 5.54);
            bioAnalyser.rotation = new Vector3(0, Math.PI, 0);

            bioAnalyser.checkCollisions = true;
            bioAnalyser.receiveShadows = true;

            for (let childMesh of result.meshes) {
                childMesh.refreshBoundingInfo(true);
                if (childMesh.getTotalVertices() > 0) {
                    const meshAggregate = new PhysicsAggregate(childMesh, PhysicsShapeType.MESH, { mass: 0, friction: 0.4, restitution: 0.1 }, scene);
                    meshAggregate.body.setMotionType(PhysicsMotionType.STATIC);
                    childMesh.receiveShadows = true;
                }
            }
        });

        // Boite à munitions
        SceneLoader.ImportMeshAsync("", "", boiteAMunitions, scene).then((result) => {
            let boiteAMunitions = result.meshes[0];
            boiteAMunitions.name = "boite à munitions";

            boiteAMunitions.position = new Vector3(-6.67, 0.76, 7.67);
            boiteAMunitions.rotation = new Vector3(0, Math.PI / 2, 0);

            boiteAMunitions.checkCollisions = true;
            boiteAMunitions.receiveShadows = true;

            for (let childMesh of result.meshes) {
                childMesh.refreshBoundingInfo(true);
                if (childMesh.getTotalVertices() > 0) {
                    const meshAggregate = new PhysicsAggregate(childMesh, PhysicsShapeType.MESH, { mass: 0, friction: 0.4, restitution: 0.1 }, scene);
                    meshAggregate.body.setMotionType(PhysicsMotionType.STATIC);
                    childMesh.receiveShadows = true;
                }
            }
        });

        // Tableau
        SceneLoader.ImportMeshAsync("", "", tableau, scene).then((result) => {
            let tableau = result.meshes[0];
            tableau.name = "tableau de suivi";

            tableau.scaling = new Vector3(2, 2, 2);
            tableau.position = new Vector3(-15, 1, 6);
            tableau.rotation = new Vector3(0, Math.PI / 2, 0);

            tableau.checkCollisions = true;
            tableau.receiveShadows = true;

            for (let childMesh of result.meshes) {
                childMesh.refreshBoundingInfo(true);
                if (childMesh.getTotalVertices() > 0) {
                    const meshAggregate = new PhysicsAggregate(childMesh, PhysicsShapeType.MESH, { mass: 0, friction: 0.4, restitution: 0.1 }, scene);
                    meshAggregate.body.setMotionType(PhysicsMotionType.STATIC);
                    childMesh.receiveShadows = true;
                }
            }
        });

        // Portail avec zone de téléportation - Correction apportée ici
        SceneLoader.ImportMeshAsync("", "", portail, scene).then((result) => {
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
}, scene);

teleportZone.position = new Vector3(0.81, 2, 11.5);

// Matériau transparent
const zoneMat = new StandardMaterial("teleportZoneMat", scene);
zoneMat.diffuseColor = new Color3(1, 1, 1);  // blanc par défaut, mais peu importe
zoneMat.alpha = 0; // totalement transparent
teleportZone.material = zoneMat;

teleportZone.isVisible = false; // le mesh ne s'affiche pas du tout
teleportZone.isPickable = false;
teleportZone.checkCollisions = false;

// On stocke la zone dans la scène pour pouvoir l'utiliser ailleurs
scene.teleportZone = teleportZone;
console.log("Zone de téléportation (invisible) prête à la position:", teleportZone.position);

            for (let childMesh of result.meshes) {
                childMesh.refreshBoundingInfo(true);
                if (childMesh.getTotalVertices() > 0) {
                    const meshAggregate = new PhysicsAggregate(childMesh, PhysicsShapeType.MESH, {
                        mass: 0, friction: 0.4, restitution: 0.1
                    }, scene);
                    meshAggregate.body.setMotionType(PhysicsMotionType.STATIC);
                    childMesh.checkCollisions = true;
                    childMesh.receiveShadows = true;
                }
            }
        });

        // Ennemi smilyFace
        SceneLoader.ImportMeshAsync("", "", smilyFace, scene).then((result) => {
            let smilyMesh = result.meshes[0];
            smilyMesh.scaling = new Vector3(0.05, 0.05, 0.05);
            smilyMesh.position = new Vector3(-4, 0, 50);
            smilyMesh.checkCollisions = true;
            smilyMesh.receiveShadows = true;
        });

        // SkyBox - sphère avec texture
        const sphere1 = MeshBuilder.CreateSphere("skySphere", { diameter: 1000 }, scene);
        const skyMaterial = new StandardMaterial("skyMaterial", scene);
        skyMaterial.backFaceCulling = false;
        skyMaterial.diffuseTexture = new Texture(darkSky, scene);
        skyMaterial.emissiveTexture = new Texture(darkSky, scene);
        sphere1.material = skyMaterial;

        return scene;
    }

    async getInitializedHavok() {
        return await HavokPhysics();
    }

    async initGame() {
        this.#havokInstance = await this.getInitializedHavok();
        this.#gameScene = this.createScene();
        this.#player = new Player(3, 10, 3, this.#gameScene);

        await this.#player.init();
        this.#gameCamera.lockedTarget = this.#player.transform;
        this.#shadowGenerator.addShadowCaster(this.#player.gameObject, true);

        this.initInput();
    }

    initInput() {
        this.#gameScene.onKeyboardObservable.add((kbInfo) => {
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
        this.#engine.runRenderLoop(() => {
            this.updateGame();

            // Debug
            if (this.actions["KeyI"]) {
                this.#bInspector = !this.#bInspector;

                if (this.#bInspector)
                    Inspector.Show();
                else
                    Inspector.Hide();
            }

            this.actions = {};
            divFps.innerHTML = this.#engine.getFps().toFixed() + " fps";
            this.#gameScene.render();
        });
    }
    updateGame() {
        if (!this.isPlayerReady) return; // ⛔ Ne met pas à jour tant que le joueur est en cours de rechargement
    
        let delta = this.#engine.getDeltaTime() / 1000.0;
        this.#player.update(this.inputMap, this.actions, delta);
    
        // Vérification de téléportation
        const teleportZone = this.#gameScene.teleportZone;
    
        if (
            teleportZone &&
            this.#player.transform &&
            this.#player.transform.intersectsMesh(teleportZone, false) &&
            !this.hasTeleported
        ) {
            console.log("⚠️ Intersection détectée avec la zone de téléportation!");
            this.hasTeleported = true;
    
          // 🌌 Effet de portail stylé
const portalDisc = MeshBuilder.CreateDisc("portalDisc", { radius: 6, tessellation: 64 }, this.#gameScene);
portalDisc.position = this.#gameCamera.position.clone().add(new Vector3(0, 0, 6));
portalDisc.billboardMode = Mesh.BILLBOARDMODE_ALL;

const gradientMat = new StandardMaterial("portalMat", this.#gameScene);
gradientMat.emissiveColor = new Color3(0.5, 0.3, 1); // Violet lumineux
gradientMat.alpha = 0.9;
gradientMat.disableLighting = true;
portalDisc.material = gradientMat;

// ✅ Halo secondaire
const energyHalo = MeshBuilder.CreateDisc("haloDisc", { radius: 2, tessellation: 64 }, this.#gameScene);
energyHalo.position = this.#gameCamera.position.clone().add(new Vector3(0, 0, 5.9));
energyHalo.billboardMode = Mesh.BILLBOARDMODE_ALL;

const haloMat = new StandardMaterial("haloMat", this.#gameScene);
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
                    const destination = new Vector3(1000, 10, 0);
                    this.isPlayerReady = false;
            
                    if (this.#player.gameObject) {
                        const oldCamera = this.#gameCamera;
            
                        this.#player = new Player(destination.x, destination.y, destination.z, this.#gameScene);
                        this.#player.init().then(() => {
                            oldCamera.lockedTarget = this.#player.transform;
                            this.#shadowGenerator.addShadowCaster(this.#player.gameObject, true);
            
                            // 🆕 Déplacement manuel de la caméra
                            oldCamera.position = new Vector3(1000, 14, -8); // ↩️ ajustable
                            this.isPlayerReady = true;
            
                            console.log("✅ Joueur et caméra téléportés avec succès !");
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