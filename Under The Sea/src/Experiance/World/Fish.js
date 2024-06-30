import * as THREE from 'three'
import { MeshStandardNodeMaterial } from 'three/nodes';

import BoidController from '../Boids/BoidController'
import Experience from "../Experiance";
import RayController from "../Rays/RayController";
import WorldValues from '../WorldValues';

export default class Fish
{
    constructor()
    {
        this.experience= new Experience()
        this.scene= this.experience.scene
        this.camera= this.experience.camera.instance
        this.model= this.experience.resources.items.fishModel
        this.debug= this.experience.debug
        this.perform= this.experience.Perform
        this.start=0
        this.intersectingEvironmentObjects={}
    
        this.boids= new BoidController(WorldValues.boids.count,40)
        // this.setFishGeometry()
        // this.setFishMaterial()
        // this.createBoids()
        console.log('setting model')
        this.setFishInstancedModels()
        
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

    setFishInstancedModels()
    {
        //TODO: 
        const glb=this.model
        console.log(glb)
        const dummy = glb.scene.children[ 0 ];

        const mesh = new THREE.InstancedMesh( dummy.geometry, new MeshStandardNodeMaterial( {
            // flatShading: true,
        } ), WorldValues.boids.count );

        // mesh.castShadow = true;
        let temp
        for ( let x = 0, i = 0; x < WorldValues.boids.count; x ++ ) {

            

                dummy.position.x=this.boids.boidLogic.boidArray[i].x
                dummy.position.y=this.boids.boidLogic.boidArray[i].y
                dummy.position.z=this.boids.boidLogic.boidArray[i].z
                temp=(dummy.position)
                

                dummy.updateMatrix();

                mesh.setMatrixAt( i, dummy.matrix );

                // mesh.setColorAt( i, new THREE.Color( `hsl(${Math.random() * 360}, 50%, 66%)` ) );
                // console.log(mesh)
                i ++;
        }
        this.camera.position.x=temp.x+2
        this.camera.position.z=temp.z+2
        this.camera.position.y=temp.y+2
        this.camera.lookAt(temp)
        console.log(mesh)
        this.scene.add( mesh );
        console.log('model has been added')
        // this.boids.boidInstancedMesh=//ADD
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
        // const currentTime= Date.now()
        // this.current=currentTime
        // this.elapsed=this.current-this.start
        // let slowTick= Math.round(Math.round(this.elapsed)/100)
        
        // if(slowTick!=this.start){
        //     // perform.timer('check environment')
        //     // console.log(slowTick)
        //     this.intersectingEvironmentObjects=this.rayController.update(this.boids.boidMeshes,4)
        //     // console.log(this.intersectingEvironmentObjects)
        //     // if(intersectingEvironmentObjects.length>0)
        //     //     {
        //     //         console.log(intersectingEvironmentObjects)
        //     //     }
        //     // perform.timer('check environment')
        // }
        // this.start=slowTick



        // // this.perform.timer('boid Update')
        // // console.log(this.intersectingEvironmentObjects)
        // this.boids.update(this.intersectingEvironmentObjects)
        // // this.perform.timer('boid Update')

    }




}