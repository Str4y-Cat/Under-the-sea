import * as THREE from "three"

import Experience from "../Experiance";
import Environment from "./Environment";
import Floor from "./Floor";
import Fox from "./Fox";

export default class World
{
    constructor()
    {
    this.experience= new Experience()
    this.scene=this.experience.scene
    this.resources= this.experience.resources
        
        //test mesh
        // const testMesh= new THREE.Mesh(
        //     new THREE.BoxGeometry(0.2,0.2,0.2),
        //     new THREE.MeshStandardMaterial()
        // )
        // console.log(testMesh)
        // this.scene.add(testMesh)

        this.resources.on("ready",()=>
            {
                // console.log('resourcse are ready')
                this.floor=new Floor()
                this.fox=new Fox()
                this.environment=new Environment()

            })

        //Setup
    }

    update()
    {
        if(this.fox)
            this.fox.update()
    }
}