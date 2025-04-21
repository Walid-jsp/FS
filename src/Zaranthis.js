import {
    MeshBuilder,
    PhysicsAggregate,
    PhysicsMotionType,
    PhysicsShapeType,
    StandardMaterial,
    Color3,
    Texture,
    Vector3,
    SceneLoader, Mesh,VertexData
} from "@babylonjs/core";
import { WaterMaterial } from '@babylonjs/materials';
//import { CreateGroundFromHeightMap } from "@babylonjs/core/Meshes/Builders/groundBuilder";


import zaranthisFloorTexture from "../assets/textures/terrain.jpg";
import greenTree from "../assets/models/Tree.glb";
import redTree from "../assets/models/Twisted Tree.glb";
import crystalPlant from "../assets/models/Crystal.glb";
import plant from "../assets/models/Plant.glb";
import fantasyplant from "../assets/models/fantasy plant.glb";
import treeSpikes from "../assets/models/Tree Spikes.glb";
import shiningTree from "../assets/models/giant_glowbranch.glb";
//import alienRock from "../assets/models/alien_rock.glb";
// import rock from "../assets/models/rock_b.glb";
import rock1 from "../assets/models/ruined_rock_fence.glb";
//import lake from "../assets/models/lake.glb";
import venus from "../assets/models/Venus flytrap.glb";
import carnivorePlant from "../assets/models/Carnivore Plant.glb";
import ciel from "../assets/models/ciel.glb";

class Zaranthis {
    constructor(scene) {
        this.scene = scene;
    }

    static getPosition() {
        return new Vector3(5000, 0, 0);
    }



    async load() {
        const center = Zaranthis.getPosition();

        // Sol
        const ground = MeshBuilder.CreateGround("zaranthisGround", {
            width: 500,
            height: 500,
            subdivisions: 32 // plus de subdivisions = meilleure qualité d’éclairage et collisions
        }, this.scene);
        ;

        const mat = new StandardMaterial("zaranthisMat", this.scene);
        mat.diffuseTexture = new Texture(zaranthisFloorTexture, this.scene);
        mat.diffuseTexture.uScale = 16;
        mat.diffuseTexture.vScale = 16;

        mat.specularColor = Color3.Black();
        ground.material = mat;
        ground.position = center;
        ground.receiveShadows = true;

        const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {
            mass: 0,
            friction: 0.8,
            restitution: 0.1
        }, this.scene);
        groundAggregate.body.setMotionType(PhysicsMotionType.STATIC);

        await SceneLoader.ImportMeshAsync("", "", ciel, this.scene).then((result) => {
            const skybox = result.meshes[0];
            skybox.name = "skyboxMilkyWay";
        
           
            skybox.position = Zaranthis.getPosition().clone();
            skybox.rotation = new Vector3(0, (3 * Math.PI) / 2, 0); // ✅ rotation de 270°

        
          
            skybox.scaling = new Vector3(600, 600, 600); 
        
          
            skybox.isPickable = false;
            skybox.checkCollisions = false;
        
            
            skybox.receiveShadows = false;
        });
        


        await this.spawnModels(greenTree, 50, center, "greenTree", new Vector3(1, 1, 1));

        await this.spawnModels(shiningTree, 40, center, "shiningTree", new Vector3(100, 100, 100));

        await this.spawnModels(redTree, 50, center, "twistedTree", new Vector3(1.5, 1.5, 1.5));

        await this.spawnModels(treeSpikes, 20, center, "spikeTree", new Vector3(1, 1, 1));
        await this.spawnModels(fantasyplant, 20, center, "fantasyPlant", new Vector3(1, 1, 1));
        await this.spawnModels(plant, 20, center, "normalPlant", new Vector3(1, 1, 1));
        await this.spawnModels(crystalPlant, 8, center, "crystalPlant", new Vector3(0.2, 0.2, 0.2)); // 💎

        await this.spawnModels(venus,8,center,"Venus",new Vector3(0.5,0.5,0.5));
        await this.spawnModels(carnivorePlant,8 , center,"Carnivore",new Vector3(1,1,1))

        //await this.spawnModels(alienRock, 6, center, "alienRock", new Vector3(5, 5, 5)); // très rares
        await this.spawnModels(rock1, 20, center, "rock1", new Vector3(0.01, 0.01, 0.01)); // plus nombreux
    
        await this.createWaterLake();
       
       



    }


    async spawnModels(modelPath, count, center, baseName, scale = new Vector3(1, 1, 1)) {
        const result = await SceneLoader.ImportMeshAsync("", "", modelPath, this.scene);
        const base = result.meshes[0];
        base.setEnabled(false);
    
        const lakeCenter = Zaranthis.getPosition().add(new Vector3(-100, 0, 100));
        const lakeRadius = 85;
        const lakeBuffer = 15; // Distance de sécurité autour du lac
    
        let placed = 0;
    
        while (placed < count) {
            const clone = base.clone(`${baseName}_${placed}`, null);
            if (!clone) continue;
    
            // 🎯 Rayonnement variable selon le type
            let radius = 80;
            let randomness = 60;
    
            if (baseName.includes("alien")) {
                radius = 160; randomness = 100;
            } else if (baseName.includes("rock")) {
                radius = 120; randomness = 80;
            } else if (baseName.includes("crystal")) {
                radius = 140; randomness = 40;
            } else if (baseName.includes("plant") || baseName.includes("spike")) {
                radius = 100; randomness = 100;
            } else if (baseName.includes("Venus") || baseName.includes("Carnivore")) {
                radius = 130; randomness = 70;
            }
    
            const angle = Math.random() * Math.PI * 2;
            const distance = radius + Math.random() * randomness;
            const offsetX = Math.cos(angle) * distance;
            const offsetZ = Math.sin(angle) * distance;
            const candidatePosition = center.add(new Vector3(offsetX, 0, offsetZ));
    
            // 🌊 Vérifie que ce n’est pas trop proche du lac
            const distFromLake = Vector3.Distance(candidatePosition, lakeCenter);
            if (distFromLake < lakeRadius + lakeBuffer) continue;
    
            // ✅ Position validée
            clone.position = candidatePosition;
            clone.scaling = scale;
            clone.rotation.y = Math.random() * Math.PI * 2;
            clone.setEnabled(true);
            clone.checkCollisions = true;
            clone.receiveShadows = true;
    
            for (const child of clone.getChildMeshes()) {
                child.refreshBoundingInfo(true);
                if (child.getTotalVertices() > 0) {
                    const aggregate = new PhysicsAggregate(child, PhysicsShapeType.MESH, {
                        mass: 0,
                        friction: 0.4,
                        restitution: 0.1
                    }, this.scene);
                    aggregate.body.setMotionType(PhysicsMotionType.STATIC);
                    child.receiveShadows = true;
                }
            }
    
            placed++;
        }
    }
    

    
    async createWaterLake() {
        const center = Zaranthis.getPosition();
        const lakePosition = center.add(new Vector3(-80, 0.05, 120)); // position du lac dans la map
    
        const waterMesh = MeshBuilder.CreateGround("waterMesh", {
            width: 120,
            height: 120,
            subdivisions: 32
        }, this.scene);
    
        waterMesh.position = lakePosition;
    
        const waterMaterial = new WaterMaterial("waterMaterial", this.scene);
        waterMaterial.bumpTexture = new Texture("https://assets.babylonjs.com/environments/waterbump.png", this.scene);
        waterMaterial.windForce = -5;
        waterMaterial.waveHeight = 0.4;
        waterMaterial.bumpHeight = 0.1;
        waterMaterial.waveLength = 0.1;
        waterMaterial.colorBlendFactor = 0.3;
        waterMaterial.windDirection = new Vector3(1, 1);
        waterMaterial.waterColor = new Color3(0.1, 0.3, 0.6);
    
        waterMaterial.addToRenderList(this.scene.getMeshByName("zaranthisGround"));
    
        waterMesh.material = waterMaterial;
    
        const waterAggregate = new PhysicsAggregate(waterMesh, PhysicsShapeType.BOX, {
            mass: 0,
            friction: 0.9,
            restitution: 0.1
        }, this.scene);
        waterAggregate.body.setMotionType(PhysicsMotionType.STATIC);
    }
    
}

export default Zaranthis;
