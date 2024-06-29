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
        this.debug= this.experience.debug
        this.perform= this.experience.Perform

        
    
        this.boids= new BoidController(200,40,this.scene,{},this.debug.ui,this.experience.camera,)
        this.setFishGeometry()
        this.setFishMaterial()
        this.createBoids()
        //setUp
        //create the fish

        //Debug
        if(this.debug.active)
            {
                this.debugFolder=this.debug.ui.addFolder("Fish")
                this.boids.debug(this.debugFolder)
            }
        
    }

    setFishMaterial()
    {
        this.boids.setBasicMaterial('white')
    }

    setFishGeometry()
    {
        this.boids.setGeometry()
    }

    createBoids()
    {
        this.boids.init()
    }


    update()
    {
        // this.perform.timer('boid Update')
        this.boids.update([])
        // this.perform.timer('boid Update')

    }




}