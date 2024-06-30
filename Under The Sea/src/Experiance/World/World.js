import * as THREE from "three"

import Experience from "../Experiance";
import Environment from "./Environment";
import Floor from "./Floor";
import Fox from "./Fox";
import Coral from "./Coral";
import Fish from "./Fish";
import CreateOctree from "../Octree/createOctree";
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';

export default class World
{
    constructor()
    {
    
    // Add the extension functions
    THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
    THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
    THREE.Mesh.prototype.raycast = acceleratedRaycast;

    this.experience= new Experience()
    this.scene=this.experience.scene
    this.resources= this.experience.resources

    

        this.resources.on("ready",()=>
            {
                // console.log('resourcse are ready')
                this.start=0
                this.coral= new Coral()
                this.floor=new Floor()
                this.fish=new Fish()
                // this.fox=new Fox()
                this.environment=new Environment()

                console.log(this.coral.environmentObjects)
                console.log(this.coral.boundingBoxes)
                this.Octree=new CreateOctree(this.coral.boundingBoxes,1,true)
                console.log(this.Octree)
                this.fish.setVision(this.Octree,this.coral.environmentObjects)
                //FIXME move this into debug
                // this.Octree.debug(this.scene)
            })

        //Setup
    }

    update()
    {
        if(this.fish)
            {


                
                this.fish.update()
                
                

            }
        if(this.fox)
            this.fox.update()
    }
}