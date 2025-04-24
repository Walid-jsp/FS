// import {
//     MeshBuilder, Sound, PhysicsAggregate, PhysicsMotionType,
//     PhysicsShapeType, Quaternion, SceneLoader, Vector3, Ray
// } from "@babylonjs/core";

// import { GlobalManager } from "./GlobalManager";

// import astronaut from "../assets/models/toon_astronaut.glb";
// import soundFile from "../assets/sounds/Candy shop cut.mp3";

// const USE_FORCES = false;
// let RUNNING_SPEED = 8;
// let JUMP_IMPULSE = 10;
// const PLAYER_HEIGHT = 1.7;
// const PLAYER_RADIUS = 0.4;

// class Player {
//     transform;
//     gameObject;
//     capsuleAggregate;
//     animationsGroup;

//     bWalking = false;
//     bOnGround = false;
//     bJumping = false;

//     idleAnim;
//     runAnim;
//     walkAnim;
//     danceAnim;
//     JumpAnim;

//     danceSound;

//     speedX = 0.0;
//     speedZ = 0.0;

//     constructor(x, y, z) {
//         const scene = GlobalManager.scene;

//         this.transform = MeshBuilder.CreateCapsule("player", {
//             height: PLAYER_HEIGHT,
//             radius: PLAYER_RADIUS
//         }, scene);
//         this.transform.visibility = 0.0;
//         this.transform.position = new Vector3(x, y, z);
//         if (USE_FORCES) RUNNING_SPEED *= 2;
//     }

//     async init() {
//         const scene = GlobalManager.scene;

//         this.danceSound = new Sound("monSon", soundFile, scene, null, { loop: false, autoplay: false });

//         const result = await SceneLoader.ImportMeshAsync("", "", astronaut, scene);
//         this.result = result;

//         this.gameObject = result.meshes[0];
//         this.gameObject.name = "astronaut";
//         this.gameObject.scaling = new Vector3(1.2, 1.2, 1.2);
//         this.gameObject.position = new Vector3(0, -PLAYER_HEIGHT / 2, 0);
//         this.gameObject.checkCollisions = true;

//         this.transform.rotation = new Vector3(0, Math.PI, 0);
//         this.gameObject.bakeCurrentTransformIntoVertices();
//         this.gameObject.parent = this.transform;

//         this.capsuleAggregate = new PhysicsAggregate(this.transform, PhysicsShapeType.CAPSULE, {
//             mass: 1,
//             friction: 1,
//             restitution: 0.1
//         }, scene);

//         this.capsuleAggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);
//         this.capsuleAggregate.body.setMassProperties({
//             inertia: new Vector3(0, 0, 0),
//             centerOfMass: new Vector3(0, PLAYER_HEIGHT / 2, 0),
//             mass: 1,
//             inertiaOrientation: new Quaternion(0, 0, 0, 1)
//         });

//         this.capsuleAggregate.body.setLinearDamping(USE_FORCES ? 0.8 : 0.5);
//         this.capsuleAggregate.body.setAngularDamping(USE_FORCES ? 10.0 : 0.5);

//         this.animationsGroup = result.animationGroups;
//         this.animationsGroup.forEach(group => group.stop());

//         this.reloadAnimations();

//         // ✅ Ajoute aux ombres via GlobalManager
//         GlobalManager.addShadowCaster(this.gameObject, true);
//     }

//     reloadAnimations() {
//         if (!this.animationsGroup || this.animationsGroup.length === 0) return;

//         this.idleAnim = this.animationsGroup.find(a => a.name.toLowerCase().includes("idle"));
//         this.runAnim = this.animationsGroup.find(a => a.name.toLowerCase().includes("run"));
//         this.walkAnim = this.animationsGroup.find(a => a.name.toLowerCase().includes("walk"));
//         this.danceAnim = this.animationsGroup.find(a => a.name.toLowerCase().includes("dance"));
//         this.JumpAnim = this.animationsGroup.find(a => a.name.toLowerCase().includes("jump"));

//         this.stopAllAnimations();
//         if (this.idleAnim) {
//             this.idleAnim.start(true);
//             this.bWalking = false;
//         }
//     }

//     checkGround() {
//         const origin = this.transform.position.add(new Vector3(0, -PLAYER_HEIGHT / 2, 0));
//         const ray = new Ray(origin, Vector3.Down(), 0.15);
//         const hit = GlobalManager.scene.pickWithRay(ray, mesh => mesh !== this.transform && mesh.isPickable);

//         const wasOnGround = this.bOnGround;
//         this.bOnGround = hit && hit.hit;

//         if (!wasOnGround && this.bOnGround) this.bJumping = false;
//     }

//     stopAllAnimations() {
//         this.animationsGroup?.forEach(anim => anim.stop());
//     }

//     update(inputMap, actions, delta) {
//         this.checkGround();

//         let currentVelocity = this.capsuleAggregate.body.getLinearVelocity();

//         this.speedX = inputMap["KeyA"] ? -RUNNING_SPEED : inputMap["KeyD"] ? RUNNING_SPEED : this.speedX * 0.88;
//         this.speedZ = inputMap["KeyW"] ? RUNNING_SPEED : inputMap["KeyS"] ? -RUNNING_SPEED : this.speedZ * 0.88;

//         if (inputMap["KeyG"] && !this.danceSound.isPlaying && this.danceAnim) {
//             this.stopAllAnimations();
//             this.danceSound.play();
//             this.danceAnim.start(true);
//         }

//         if (inputMap["Space"] && this.bOnGround && !this.bJumping) {
//             currentVelocity.y = JUMP_IMPULSE;
//             this.bJumping = true;
//         }

//         currentVelocity.x = this.speedX;
//         currentVelocity.z = this.speedZ;
//         this.capsuleAggregate.body.setLinearVelocity(currentVelocity);

//         const directionXZ = new Vector3(this.speedX, 0, this.speedZ);
//         if (directionXZ.length() > 2.5) {
//             this.gameObject.lookAt(directionXZ.normalize());
//             if (!this.bWalking && this.runAnim) {
//                 this.stopAllAnimations();
//                 this.runAnim.start(true);
//                 this.bWalking = true;
//             }
//         } else if (this.bWalking && this.idleAnim) {
//             this.stopAllAnimations();
//             this.idleAnim.start(true);
//             this.bWalking = false;
//         }
//     }
// }

// export default Player;
import { Axis, Mesh, MeshBuilder, PhysicsAggregate, PhysicsMotionType, PhysicsShape, PhysicsShapeType, SceneLoader, TransformNode, Vector3 } from "@babylonjs/core";
import astronaut from "../assets/models/toon_astronaut.glb";
import { GlobalManager } from "./GlobalManager";
import { Ray } from "@babylonjs/core"; // déjà présent si tu as copié le code complet plus haut


const PLAYER_HEIGHT = 1.7;
const PLAYER_RADIUS = 0.4;
let IN_LABO = false;

class Player {

    //Position dans le monde
    transform;

    //Mesh
    gameObject;


    //Animations
    animationsGroup;
    bWalking = false;
    idleAnim;
    runAnim;
    walkAnim;
    runningSpeed = 2;

    //Position et vitesse
    x = 0.0;
    y = 0.0;
    z = 0.0;
    speedX = 0.0;
    speedY = 0.0;
    speedZ = 0.0;

    //Physics
    capsuleAggregate;

    constructor(x, y, z) {

        this.x = x || 0.0;
        this.y = y || 0.0;
        this.z = z || 0.0;
        this.transform = new MeshBuilder.CreateCapsule("player", { height: PLAYER_HEIGHT, radius: PLAYER_RADIUS }, GlobalManager.scene);
        this.transform.visibility = 0.0;
        this.transform.position = new Vector3(this.x, this.y, this.z);
    }

    async init() {
        //Creation du mesh
        const result = await SceneLoader.ImportMeshAsync("", "", astronaut, GlobalManager.scene);
        this.gameObject = result.meshes[0];
        this.gameObject.scaling = new Vector3(1, 1, 1);
        this.gameObject.position = new Vector3(0, -PLAYER_HEIGHT / 2, 0);
        this.gameObject.rotate(Vector3.UpReadOnly, Math.PI);
        this.gameObject.bakeCurrentTransformIntoVertices();
        this.gameObject.checkCollisions = true;
        this.gameObject.ellipsoid = new Vector3(1, 1, 1);
        this.gameObject.ellipsoidOffset = new Vector3(0, 2, 0);
        

        for (let playerMesh of result.meshes) {
            playerMesh.receiveShadows = true;
            playerMesh.castShadows = true;
            GlobalManager.addShadowCaster(playerMesh);
        }

        //Physic havok
        this.capsuleAggregate = new PhysicsAggregate(this.transform, PhysicsShapeType.CAPSULE, { mass: 1, friction: 1, restitution: 0.1 }, GlobalManager.scene);
        this.capsuleAggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);

        //Bloque la rotation du player
        this.capsuleAggregate.body.setMassProperties({ inertia: new Vector3(0, 0, 0), centerOfMass: new Vector3(0, PLAYER_HEIGHT / 2, 0), mass: 1 });

        //Accrochage du mesh au parent
        this.gameObject.parent = this.transform;

        //Animation du mesh
        this.animationsGroup = result.animationGroups;
        this.animationsGroup[0].stop();
        this.idleAnim = GlobalManager.scene.getAnimationGroupByName("idle");
        this.runAnim = GlobalManager.scene.getAnimationGroupByName("run");
        this.walkAnim = GlobalManager.scene.getAnimationGroupByName("walk");
        this.idleAnim.start(true, 1.0, this.idleAnim.from, this.idleAnim.to, false);

    }

    //Pour le moment on passe les events clavier ici, on utilisera un InputManager plus tard


    update(inputMap, actions, delta) {
        //Gravité
        let currentVelocity = this.capsuleAggregate.body.getLinearVelocity();
        currentVelocity = new Vector3(this.speedX, currentVelocity.y, this.speedZ);

        //Inputs
        const camera = GlobalManager.scene.activeCamera;
        let move = Vector3.Zero();

        if (inputMap["KeyW"])
            move.addInPlace(camera.getDirection(Axis.Z));
        if (inputMap["KeyS"])
            move.addInPlace(camera.getDirection(Axis.Z).negate());
        if (inputMap["KeyA"])
            move.addInPlace(camera.getDirection(Axis.X).negate());
        if (inputMap["KeyD"])
            move.addInPlace(camera.getDirection(Axis.X));

        //Mouvement
        if (move.length() > 0.1) {
            move.normalize();

            this.speedX = move.x * this.runningSpeed;
            this.speedZ = move.z * this.runningSpeed;

            const directionXZ = new Vector3(this.speedX, 0, this.speedZ);
            this.gameObject.lookAt(directionXZ.normalize());

        //     const directionXZ = new Vector3(this.speedX, 0, this.speedZ);
        // this.gameObject.lookAt(this.gameObject.position.add(directionXZ));

            if (!this.bWalking) {
                if (!IN_LABO) {
                    this.runningSpeed = 6;
                    this.runAnim.start(true, 1.0, this.runAnim.from, this.runAnim.to, false);
                } else {
                    this.runningSpeed = 2;
                    this.walkAnim.start(true, 1.0, this.walkAnim.from, this.walkAnim.to, false);
                }
                this.bWalking = true;
            }
        } else {
            //Arrêt du mouvement
            this.speedX += (-12.0 * this.speedX * delta);
            this.speedZ += (-12.0 * this.speedZ * delta);

            //Arrêt
            if (this.bWalking) {
                this.runAnim.stop();
                this.walkAnim.stop();
                this.idleAnim.start(true, 1.0, this.idleAnim.from, this.idleAnim.to, false);
                this.bWalking = false;
            }
        }

        //Gravité
        currentVelocity = this.capsuleAggregate.body.getLinearVelocity();
        currentVelocity = new Vector3(this.speedX, 0 + currentVelocity.y, this.speedZ);

        // Appliquer la vitesse au corps
        this.capsuleAggregate.body.setLinearVelocity(currentVelocity);


      // ✅ Raycast sol uniquement si on ne saute pas
// ✅ Raycast sol uniquement si on ne saute pas
if (!this.bJumping) {
    const ray = new Ray(this.transform.position.add(new Vector3(0, 10, 0)), Vector3.Down(), 20);
    const pick = GlobalManager.scene.pickWithRay(ray, (mesh) => mesh.name === "zaranthisGround");

    if (pick?.hit && pick.pickedPoint) {
        const targetY = pick.pickedPoint.y + PLAYER_HEIGHT / 2;

        // Seulement si on est très proche du sol
        const distanceToGround = Math.abs(this.transform.position.y - targetY);

        if (distanceToGround < 1.5) {
            // Doucement, pour éviter les "sauts" ou les blocages
            this.transform.position.y += (targetY - this.transform.position.y) * 0.2;
        }
    }
}




    }

    stopAllAnimations() {
        this.animationsGroup?.forEach(anim => anim.stop());
    }

    reloadAnimations() {
        if (!this.animationsGroup || this.animationsGroup.length === 0) return;

        this.idleAnim = this.animationsGroup.find(a => a.name.toLowerCase().includes("idle"));
        this.runAnim = this.animationsGroup.find(a => a.name.toLowerCase().includes("run"));
        this.walkAnim = this.animationsGroup.find(a => a.name.toLowerCase().includes("walk"));
        this.danceAnim = this.animationsGroup.find(a => a.name.toLowerCase().includes("dance"));
        this.JumpAnim = this.animationsGroup.find(a => a.name.toLowerCase().includes("jump"));

        this.stopAllAnimations();
        if (this.idleAnim) {
            this.idleAnim.start(true);
            this.bWalking = false;
        }
    }





}

export default Player;