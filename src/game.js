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

    // #elevator;
    // #elevatorAggregate;
    // #zoneA;
    // #zoneB;

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
        this.#gameCamera.rotationOffset = 0;
        this.#gameCamera.attachControl(this.#canvas, true);
        //this.#gameCamera.setTarget(Vector3.Zero());
        //this.#gameCamera.attachControl(this.#canvas, true);

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        const sLight = new SpotLight("spot1", new Vector3(0, 20, 20), new Vector3(0, -1, -1), 2, 24, scene);
        this.#shadowGenerator = new ShadowGenerator(1024, sLight);
        this.#shadowGenerator.useBlurExponentialShadowMap = true;

        // const elevator = MeshBuilder.CreateDisc("sphere", { diameter: 2, segments: 32 }, scene);
        // elevator.rotate(Vector3.Right(), Math.PI / 2)
        // elevator.position.y = 0.1;
        // this.#elevator = elevator;

        const ground = MeshBuilder.CreateGround("ground", { width: 640, height: 640, subdivisions: 128 }, scene);
        ground.checkCollisions = true;

        const matGround = new StandardMaterial("boue", scene);
        //matGround.diffuseColor = new Color3(1, 0.4, 0);
        matGround.diffuseTexture = new Texture(floorUrl);
        matGround.diffuseTexture.uScale = 64;
        matGround.diffuseTexture.vScale = 64;
        matGround.bumpTexture = new Texture(floorBumpUrl);
        matGround.bumpTexture.uScale = 64;
        matGround.bumpTexture.vScale = 64;

        ground.material = matGround;
        ground.receiveShadows = true;
        // Create a static box shape.

        const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {
            mass: 0, friction: 0.7, restitution: 0.2
        }, scene);

        groundAggregate.body.setMotionType(PhysicsMotionType.STATIC);

        const matSphere = new StandardMaterial("silver", scene);
        matSphere.diffuseColor = new Color3(0.8, 0.8, 1);
        matSphere.specularColor = new Color3(0.4, 0.4, 1);
       // elevator.material = matSphere;

       // this.#shadowGenerator.addShadowCaster(elevator);




        // this.#zoneA = MeshBuilder.CreateBox("zoneA", { width: 8, height: 0.2, depth: 8 }, scene);
        // let zoneMat = new StandardMaterial("zoneA", scene);
        // zoneMat.diffuseColor = Color3.Red();
        // zoneMat.alpha = 0.5;
        // this.#zoneA.material = zoneMat;
        // this.#zoneA.position = new Vector3(12, 0.1, 12);


        // this.#zoneB = MeshBuilder.CreateBox("zoneB", { width: 8, height: 0.2, depth: 8 }, scene);
        // let zoneMatB = new StandardMaterial("zoneB", scene);
        // zoneMatB.diffuseColor = Color3.Green();
        // zoneMatB.alpha = 0.5;
        // this.#zoneB.material = zoneMatB;
        // this.#zoneB.position = new Vector3(-12, 0.1, -12);

        // // Create a sphere shape and the associated body. Size will be determined automatically.
        // this.#elevatorAggregate = new PhysicsAggregate(elevator, PhysicsShapeType.CONVEX_HULL, { mass: 1, restitution: 0.0 }, scene);
        // this.#elevatorAggregate.body.setMotionType(PhysicsMotionType.ANIMATED);


        // let boxDebug = MeshBuilder.CreateBox("boxDebug", { width: 0.5, depth: 0.5, height: 0.25 });
        // boxDebug.position = new Vector3(10, 15, 5);
        // this.#shadowGenerator.addShadowCaster(boxDebug);

        // // Create a sphere shape and the associated body. Size will be determined automatically.
        // const boxAggregate = new PhysicsAggregate(boxDebug, PhysicsShapeType.BOX, {
        //     mass: .25, friction: 0.05, restitution: 0.3
        // }, scene);

        this.danceSound = new Sound("monSon", soundFile, this.scene, null, { loop: false, autoplay: true });

        // SceneLoader.ImportMeshAsync("", "", dungeon, scene).then((result) => {
        //     let dungeonMesh = result.meshes[0];
        //     dungeonMesh.scaling = new Vector3(10, 10, 10);
        //     dungeonMesh.position = new Vector3(0, 0, 0);
        //     dungeonMesh.checkCollisions = true;
        //     dungeonMesh.receiveShadows = true;
        // });

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
        
            // 🔰 LIMITATION DU LABO - 3 murs + toit
        
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
            wallRight.scaling=new Vector3(1,1,1);
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
            wallBack.rotation = new Vector3(0, 0, 0); // Facultatif si pas déjà tourné
            wallBack.material = wallMat;
            wallBack.checkCollisions = true;
            
        
            // TOIT
            const roof = MeshBuilder.CreateBox("roof", {
                width: 32,
                height: 1,
                depth: 32
            }, scene);
            roof.position = new Vector3(0, 12, 0);
            roof.material = wallMat;
            roof.checkCollisions = true;
        });
        

        // bioAnalyser

        SceneLoader.ImportMeshAsync("", "", bioAnalyser, scene).then((result) => {

            let bioAnalyser = result.meshes[0];
            bioAnalyser.name = "bioAnalyser"


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
        })

        //boite à munitions

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
        })

        //tableau 

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
        })

        SceneLoader.ImportMeshAsync("", "", portail, scene).then((result) => {
            const portailMesh = result.meshes[0];
            portailMesh.name = "portail";

            portailMesh.scaling = new Vector3(0.02, 0.02, 0.02);

            // const playerPos = this.#player.transform.position;
            portailMesh.position = new Vector3(0.81, 2.28, 13.07);
            portailMesh.rotation = new Vector3(0, Math.PI, 0);
            portailMesh.checkCollisions = true;
            portailMesh.receiveShadows = true;

            for (let childMesh of result.meshes) {
                childMesh.refreshBoundingInfo(true);

                if (childMesh.getTotalVertices() > 0) {
                    const meshAggregate = new PhysicsAggregate(childMesh, PhysicsShapeType.MESH, {
                        mass: 0,
                        friction: 0.4,
                        restitution: 0.1
                    }, scene);

                    meshAggregate.body.setMotionType(PhysicsMotionType.STATIC);
                    childMesh.checkCollisions = true;
                    childMesh.receiveShadows = true;
                }
            }
        });





        SceneLoader.ImportMeshAsync("", "", smilyFace, scene).then((result) => {
            let smilyMesh = result.meshes[0];
            smilyMesh.scaling = new Vector3(0.05, 0.05, 0.05);
            smilyMesh.position = new Vector3(-4, 0, 50);
            smilyMesh.checkCollisions = true;
            smilyMesh.receiveShadows = true;
        });

        // SceneLoader.ImportMeshAsync("", "", labo, scene).then((result) => {
        //     let dungeonMesh = result.meshes[0];
        //     dungeonMesh.scaling = new Vector3(3,3,3);
        //     dungeonMesh.position = new Vector3(0, 0, 0); 
        //     dungeonMesh.checkCollisions = true;
        //     dungeonMesh.receiveShadows = true;
        // });




        //    const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
        // const skyboxMaterial = new StandardMaterial("skyBoxMaterial", scene);

        // // Désactive le backFaceCulling pour afficher l'intérieur de la box
        // skyboxMaterial.backFaceCulling = false;

        // // Charge ton image PNG comme une texture simple
        // skyboxMaterial.emissiveTexture = new Texture(darkSky, scene);
        // skyboxMaterial.emissiveTexture.coordinatesMode = Texture.SKYBOX_MODE;

        // // Désactive l'effet de la lumière sur la skybox
        // skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        // skyboxMaterial.specularColor = new Color3(0, 0, 0);

        // // Applique le matériau à la skybox
        // skybox.material = skyboxMaterial;

        // // Désactive le tone mapping pour éviter les problèmes de couleur
        // scene.imageProcessingConfiguration.toneMappingEnabled = false;

        const sphere1 = MeshBuilder.CreateSphere("skySphere", { diameter: 1000 }, scene);

        // Ajouter un matériau
        const skyMaterial = new StandardMaterial("skyMaterial", scene);
        skyMaterial.backFaceCulling = false;
        skyMaterial.diffuseTexture = new Texture(darkSky, scene);
        skyMaterial.emissiveTexture = new Texture(darkSky, scene);

        // Appliquer le matériau à la sphère
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

    }

    gameLoop() {

        const divFps = document.getElementById("fps");
        this.#engine.runRenderLoop(() => {

            this.updateGame();


            //Debug
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
        let delta = this.#engine.getDeltaTime() / 1000.0;

        this.#player.update(this.inputMap, this.actions, delta);

        this.#phase += this.#vitesseY * delta;
       // this.#elevatorAggregate.body.setLinearVelocity(new Vector3(0, Math.sin(this.#phase)), 0);

    //     const hudText = document.getElementById("hudText");
    //     if (this.#elevator.intersectsMesh(this.#zoneA, false)) {
    //         this.#elevator.material.emissiveColor = Color3.Red();
    //         hudText.innerText = "Zone A atteinte !";
    //     } else if (this.#elevator.intersectsMesh(this.#zoneB, false)) {
    //         this.#elevator.material.emissiveColor = Color3.Green();
    //         hudText.innerText = "Zone B atteinte !";
    //     } else {
    //         this.#elevator.material.emissiveColor = Color3.Black();
    //         hudText.innerText = "";
    //     }
    }
}

export default Game;