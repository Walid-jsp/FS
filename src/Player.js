import { MeshBuilder, Sound, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType, Quaternion, SceneLoader, Vector3, Ray } from "@babylonjs/core";

import astronaut from "../assets/models/toon_astronaut.glb";
import soundFile from "../assets/sounds/Candy shop cut.mp3";

const USE_FORCES = false;
let RUNNING_SPEED = 8;
let JUMP_IMPULSE = 10;
const PLAYER_HEIGHT = 1.7;
const PLAYER_RADIUS = 0.4;

class Player {

    scene;
    transform;
    gameObject;
    capsuleAggregate;
    animationsGroup;

    bWalking = false;
    bOnGround = false;
    bJumping = false;

    idleAnim;
    runAnim;
    walkAnim;
    danceAnim;
    JumpAnim;

    danceSound;

    speedX = 0.0;
    speedZ = 0.0;

    constructor(x, y, z, scene) {
        this.scene = scene;
        this.transform = MeshBuilder.CreateCapsule("player", { height: PLAYER_HEIGHT, radius: PLAYER_RADIUS }, this.scene);
        this.transform.visibility = 0.0;
        this.transform.position = new Vector3(x, y, z);
        if (USE_FORCES) RUNNING_SPEED *= 2;
    }

    async init() {
        this.danceSound = new Sound("monSon", soundFile, this.scene, null, { loop: false, autoplay: false });
    
        const result = await SceneLoader.ImportMeshAsync("", "", astronaut, this.scene);
        this.result = result; // 🔥 C’est ça qui manquait
    
        this.gameObject = result.meshes[0];
        this.gameObject.name = "astronaut";
        this.gameObject.scaling = new Vector3(1.2, 1.2, 1.2);
        this.gameObject.position = new Vector3(0, -PLAYER_HEIGHT / 2, 0);
        this.gameObject.checkCollisions = true;
    
        this.transform.rotation = new Vector3(0, Math.PI, 0);
        this.gameObject.bakeCurrentTransformIntoVertices();
    
        this.capsuleAggregate = new PhysicsAggregate(this.transform, PhysicsShapeType.CAPSULE, {
            mass: 1,
            friction: 1,
            restitution: 0.1
        }, this.scene);
    
        this.capsuleAggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);
        this.capsuleAggregate.body.setMassProperties({
            inertia: new Vector3(0, 0, 0),
            centerOfMass: new Vector3(0, PLAYER_HEIGHT / 2, 0),
            mass: 1,
            inertiaOrientation: new Quaternion(0, 0, 0, 1)
        });
    
        this.capsuleAggregate.body.setLinearDamping(USE_FORCES ? 0.8 : 0.5);
        this.capsuleAggregate.body.setAngularDamping(USE_FORCES ? 10.0 : 0.5);
    
        this.gameObject.parent = this.transform;
    
        this.animationsGroup = result.animationGroups;
        this.animationsGroup.forEach(group => group.stop());
    
        this.reloadAnimations();
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
    
    

    checkGround() {
        const origin = this.transform.position.add(new Vector3(0, -PLAYER_HEIGHT / 2, 0));
        const ray = new Ray(origin, Vector3.Down(), 0.15);
        const hit = this.scene.pickWithRay(ray, mesh => mesh != this.transform && mesh.isPickable);

        const wasOnGround = this.bOnGround;
        this.bOnGround = hit && hit.hit;

        if (!wasOnGround && this.bOnGround) this.bJumping = false;
    }

    stopAllAnimations() {
        this.animationsGroup?.forEach(anim => anim.stop());
    }

    update(inputMap, actions, delta) {
        this.checkGround();

        let currentVelocity = this.capsuleAggregate.body.getLinearVelocity();

        this.speedX = inputMap["KeyA"] ? -RUNNING_SPEED : inputMap["KeyD"] ? RUNNING_SPEED : this.speedX * 0.88;
        this.speedZ = inputMap["KeyW"] ? RUNNING_SPEED : inputMap["KeyS"] ? -RUNNING_SPEED : this.speedZ * 0.88;

        if (inputMap["KeyG"] && !this.danceSound.isPlaying && this.danceAnim) {
            this.stopAllAnimations();
            this.danceSound.play();
            this.danceAnim.start(true);
        }

        if (inputMap["Space"] && this.bOnGround && !this.bJumping) {
            currentVelocity.y = JUMP_IMPULSE;
            this.bJumping = true;
        }

        currentVelocity.x = this.speedX;
        currentVelocity.z = this.speedZ;
        this.capsuleAggregate.body.setLinearVelocity(currentVelocity);

        const directionXZ = new Vector3(this.speedX, 0, this.speedZ);
        if (directionXZ.length() > 2.5) {
            this.gameObject.lookAt(directionXZ.normalize());
            if (!this.bWalking && this.runAnim) {
                this.stopAllAnimations();
                this.runAnim.start(true);
                this.bWalking = true;
            }
        } else if (this.bWalking && this.idleAnim) {
            this.stopAllAnimations();
            this.idleAnim.start(true);
            this.bWalking = false;
        }
    }
}

export default Player;
