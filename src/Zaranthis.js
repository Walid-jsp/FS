import {
    MeshBuilder,
    PhysicsAggregate,
    PhysicsMotionType,
    PhysicsShapeType,
    StandardMaterial,
    Color3,
    Texture,
    Vector3,
} from "@babylonjs/core";

import zaranthisFloorTexture from "../assets/textures/Zarenthis floor.png";

class Zaranthis {
    constructor(scene) {
        this.scene = scene;
    }

    static getPosition() {
        return new Vector3(5000, 0, 0); 
    }

    async load() {
        const ground = MeshBuilder.CreateGround("zaranthisGround", {
            width: 300,
            height: 300,
            subdivisions: 16
        }, this.scene);

        const mat = new StandardMaterial("zaranthisMat", this.scene);

       
        mat.diffuseTexture = new Texture(zaranthisFloorTexture, this.scene);
        mat.diffuseTexture.uScale = 16;
        mat.diffuseTexture.vScale = 16;

        
        mat.diffuseColor = new Color3(1, 0.93, 0.6); 


        mat.specularColor = Color3.Black(); 

        ground.material = mat;
        ground.position = Zaranthis.getPosition();
        ground.receiveShadows = true;

        const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {
            mass: 0,
            friction: 0.8,
            restitution: 0.1
        }, this.scene);

        groundAggregate.body.setMotionType(PhysicsMotionType.STATIC);
    }
}

export default Zaranthis;
