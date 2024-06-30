import * as THREE from 'three'

import BoidController from '../Boids/BoidController'
import Experience from "../Experiance";
import RayController from "../Rays/RayController";

export default class Fish
{
    constructor()
    {
        this.experience= new Experience()
        this.scene= this.experience.scene
        this.resources= this.experience.resources
        this.debug= this.experience.debug
        this.perform= this.experience.Perform
        this.start=0
        this.intersectingEvironmentObjects={}
    
        this.boids= new BoidController(4,40)
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

    setVision(environment,environmentMeshes)
    {
        this.rayController=new RayController(environment.octree,environmentMeshes)
    }

    update()
    {
        const currentTime= Date.now()
        this.current=currentTime
        this.elapsed=this.current-this.start
        let slowTick= Math.round(Math.round(this.elapsed)/100)
        
        if(slowTick!=this.start){
            // perform.timer('check environment')
            // console.log(slowTick)
            this.intersectingEvironmentObjects=this.rayController.update(this.boids.boidMeshes,4)
            // console.log(this.intersectingEvironmentObjects)
            // if(intersectingEvironmentObjects.length>0)
            //     {
            //         console.log(intersectingEvironmentObjects)
            //     }
            // perform.timer('check environment')
        }
        this.start=slowTick



        // this.perform.timer('boid Update')
        // console.log(this.intersectingEvironmentObjects)
        this.boids.update(this.intersectingEvironmentObjects)
        // this.perform.timer('boid Update')

    }




}