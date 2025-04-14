import { Matrix, Mesh, MeshBuilder, Physics6DoFConstraint,Sound, PhysicsAggregate, PhysicsConstraintAxis, PhysicsMotionType, PhysicsShapeType, Quaternion, SceneLoader, TransformNode, Vector3, Ray } from "@babylonjs/core";

import astronaut from "../assets/models/dark_astronaut.glb";
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
    bFalling = false;
    bJumping = false;

    idleAnim;
    runAnim;
    walkAnim;
    danceAnim;
    JumpAnim;

    danceSound;

    x = 0.0;
    y = 0.0;
    z = 0.0;

    speedX = 0.0;
    speedY = 0.0;
    speedZ = 0.0;

    constructor(x, y, z, scene) {
        this.scene = scene;
        this.x = x || 0.0;
        this.y = y || 0.0;
        this.z = z || 0.0;
        this.transform = new MeshBuilder.CreateCapsule("player", { height: PLAYER_HEIGHT, radius: PLAYER_RADIUS }, this.scene);
        this.transform.visibility = 0.0;
        this.transform.position = new Vector3(this.x, this.y, this.z);
        if (USE_FORCES) {
            RUNNING_SPEED *= 2;
        }
    }

    async init() {
        this.danceSound = new Sound("monSon", soundFile, this.scene, null, { loop: false, autoplay: false });
        const result = await SceneLoader.ImportMeshAsync("", "", astronaut, this.scene);
        this.gameObject = result.meshes[0];
        this.gameObject.scaling = new Vector3(0.1, 0.1, 0.1);
        this.gameObject.position = new Vector3(0, -PLAYER_HEIGHT / 2, 0);
        this.gameObject.rotate(Vector3.UpReadOnly, Math.PI);
        this.gameObject.bakeCurrentTransformIntoVertices();
        this.gameObject.checkCollisions = true;

        this.capsuleAggregate = new PhysicsAggregate(this.transform, PhysicsShapeType.CAPSULE, { mass: 1, friction: 1, restitution: 0.1 }, this.scene);
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
        // this.animationsGroup = result.animationGroups;
        // this.animationsGroup[0].stop();
        // this.idleAnim = this.scene.getAnimationGroupByName('Idle');
        // this.runAnim = this.scene.getAnimationGroupByName('Running');
        // this.walkAnim = this.scene.getAnimationGroupByName('Walking');
        // this.danceAnim = this.scene.getAnimationGroupByName('Dancing');
        // this.JumpAnim = this.scene.getAnimationGroupByName('JumpAttack');
        // this.idleAnim.start(true, 1.0, this.idleAnim.from, this.idleAnim.to, false);
    }

    checkGround() {
        const origin = this.transform.position.add(new Vector3(0, -PLAYER_HEIGHT / 2, 0)); // bas du corps
        const direction = new Vector3(0, -1, 0);
        const ray = new Ray(origin, direction, 0.15); // plus petit rayon, juste sous les pieds
        const hit = this.scene.pickWithRay(ray, (mesh) => mesh != this.transform && mesh.isPickable);
    
        const wasOnGround = this.bOnGround;
        this.bOnGround = hit && hit.hit;
    
        if (!wasOnGround && this.bOnGround) {
            this.bJumping = false;
        }
    }
    

    stopAllAnimations() {
        if (this.animationsGroup) {
            this.animationsGroup.forEach(anim => anim.stop());
        }
    }

    update(inputMap, actions, delta) {
        this.checkGround();
        


        let currentVelocity = this.capsuleAggregate.body.getLinearVelocity();

        if (inputMap["KeyA"]) this.speedX = -RUNNING_SPEED;
        else if (inputMap["KeyD"]) this.speedX = RUNNING_SPEED;
        else this.speedX += USE_FORCES ? 0 : (-12.0 * this.speedX * delta);

        if (inputMap["KeyW"]) this.speedZ = RUNNING_SPEED;
        else if (inputMap["KeyS"]) this.speedZ = -RUNNING_SPEED;
        else this.speedZ += USE_FORCES ? 0 : (-12.0 * this.speedZ * delta);

        if (inputMap["KeyG"] && !this.danceSound.isPlaying) {
            this.stopAllAnimations();
            this.danceSound.play();
            this.danceAnim.start(true, 1.0, this.danceAnim.from, this.danceAnim.to, false);
        }

        if (inputMap["KeyH"]) {
            this.stopAllAnimations();
            this.JumpAnim.start(false, 1.0, this.JumpAnim.from, this.JumpAnim.to, false);
        }

        if (inputMap["KeyX"]) {
            this.stopAllAnimations();
            this.walkAnim.start(true, 1.0, this.walkAnim.from, this.danceAnim.to, false);
        }

        if (USE_FORCES) {
            if (actions["Space"] && this.bOnGround && !this.bJumping) {
                this.capsuleAggregate.body.applyImpulse(new Vector3(0, JUMP_IMPULSE, 0), Vector3.Zero());
                this.bJumping = true;
            }
            this.capsuleAggregate.body.applyForce(new Vector3(this.speedX, 0, this.speedZ), Vector3.Zero());
        } else {
            if (inputMap["Space"] && this.bOnGround && !this.bJumping) {
                currentVelocity = new Vector3(this.speedX, JUMP_IMPULSE, this.speedZ);
                this.capsuleAggregate.body.setLinearVelocity(currentVelocity);
                this.bJumping = true;
            } else {
                currentVelocity = new Vector3(this.speedX, currentVelocity.y, this.speedZ);
                this.capsuleAggregate.body.setLinearVelocity(currentVelocity);
            }
            
        }
        

        let directionXZ = new Vector3(this.speedX, 0, this.speedZ);

        if (directionXZ.length() > 2.5) {
            this.gameObject.lookAt(directionXZ.normalize());
            if (!this.bWalking) {
                this.stopAllAnimations();
                this.runAnim.start(true, 1.0, this.runAnim.from, this.runAnim.to, false);
                this.bWalking = true;
            }
        } else {
            if (this.bWalking) {
                this.stopAllAnimations();
                this.idleAnim.start(true, 1.0, this.idleAnim.from, this.idleAnim.to, false);
                this.bWalking = false;
            }
        }
    }
}

export default Player;