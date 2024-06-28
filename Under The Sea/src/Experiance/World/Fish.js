import * as THREE from 'three'

import BoidController from '../Boids/BoidController'
import Experience from "../Experiance";

export default class Fish
{
    constructor()
    {
        this.experience= new Experience()
        this.scene= this.experience.scene
        this.resources= this.experience.resources

        //Debug
        if(this.debug.active)
        {
            this.debugFolder=this.debug.ui.addFolder("Fish")
        }
    
        this.boids= new BoidController(200,40,this.scene,{},this.debug.ui,this.experience.camera,)
        //setUp
        //create the fish
        
    }







}