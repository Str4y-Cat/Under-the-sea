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
        // this.model= this.experience.resources.items.foxModel
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
        // console.log(glb)
        const dummy={}
        dummy[1] = glb.scene.children[ 0 ].children[ 0 ].children[ 0 ];
        dummy[2] = glb.scene.children[ 0 ].children[ 0 ].children[ 1 ];
        dummy[3] = glb.scene.children[ 0 ].children[ 0 ].children[ 2 ];
        // dummy.frustumCulled=false
        // console.log(dummy[1])
        // console.log(dummy[2])
        // console.log(dummy[3])

        // this.scene.add(dummy)
        this.fishMesh={}

        this.fishMesh[1] = new THREE.InstancedMesh( dummy[1].geometry, new THREE.MeshBasicMaterial( {
            // flatShading: true,
            color:"orange"
        } ), WorldValues.boids.count );
        this.fishMesh[2]= new THREE.InstancedMesh( dummy[2].geometry, new THREE.MeshBasicMaterial( {
            // flatShading: true,
            color:'white'

        } ), WorldValues.boids.count );
        this.fishMesh[3] = new THREE.InstancedMesh( dummy[3].geometry, new THREE.MeshBasicMaterial( {
            // flatShading: true,
            color:'black'
        } ), WorldValues.boids.count );

        // mesh.castShadow = true;
        // let temp
        for ( let x = 0, i = 0; x < WorldValues.boids.count; x ++ ) {

                dummy[1].position.x=this.boids.boidLogic.boidArray[i].x
                dummy[1].position.y=this.boids.boidLogic.boidArray[i].y
                dummy[1].position.z=this.boids.boidLogic.boidArray[i].z

                dummy[2].position.x=this.boids.boidLogic.boidArray[i].x
                dummy[2].position.y=this.boids.boidLogic.boidArray[i].y
                dummy[2].position.z=this.boids.boidLogic.boidArray[i].z

                dummy[3].position.x=this.boids.boidLogic.boidArray[i].x
                dummy[3].position.y=this.boids.boidLogic.boidArray[i].y
                dummy[3].position.z=this.boids.boidLogic.boidArray[i].z
                

                dummy[1].updateMatrix();
                dummy[2].updateMatrix();
                dummy[3].updateMatrix();

                this.fishMesh[1].setMatrixAt( i, dummy[1].matrix );
                this.fishMesh[1].setColorAt( i, new THREE.Color( `hsl(${Math.random() * 360}, 50%, 66%)` ) );

                this.fishMesh[2].setMatrixAt( i, dummy[2].matrix );
                this.fishMesh[3].setMatrixAt( i, dummy[3].matrix );
                // mesh.setColorAt( i, new THREE.Color( `hsl(${Math.random() * 360}, 50%, 66%)` ) );
                // console.log(mesh)
                i ++;
        }
        // this.camera.position.x=temp.x+2
        // this.camera.position.z=temp.z+2
        // this.camera.position.y=temp.y+2
        // this.camera.lookAt(temp)
        // console.log(mesh)
        this.scene.add( this.fishMesh[1] );
        this.scene.add( this.fishMesh[2] );
        this.scene.add( this.fishMesh[3] );

        this.mixer = new THREE.AnimationMixer( glb.scene );

        const action = this.mixer.clipAction( glb.animations[ 0 ] );

        action.play();
        // console.log('model has been added')
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
        // if ( this.mesh1||this.mesh2||this.mesh3 ) {
            
        //     for ( let i = 0; i < WorldValues.boids.count; i ++ ) {

        //         this.mixer.setTime(1);

        //         this.mesh1.setMorphAt( i, this.dummy1 );
        //         this.mesh2.setMorphAt( i, this.dummy2 );
        //         this.mesh3.setMorphAt( i, this.dummy3 );

        //     }

        //     this.mesh1.morphTexture.needsUpdate = true;
        //     this.mesh2.morphTexture.needsUpdate = true;
        //     this.mesh3.morphTexture.needsUpdate = true;

        // }
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