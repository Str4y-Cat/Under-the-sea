import * as THREE from "three"

import Experience from "../Experiance";
import Environment from "./Environment";
import Floor from "./Floor";
import Fox from "./Fox";
import Coral from "./Coral";
import Fish from "./Fish";

export default class World
{
    constructor()
    {
    this.experience= new Experience()
    this.scene=this.experience.scene
    this.resources= this.experience.resources

        this.resources.on("ready",()=>
            {
                // console.log('resourcse are ready')
                this.coral= new Coral()
                this.floor=new Floor()
                this.fish=new Fish()
                // this.fox=new Fox()
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