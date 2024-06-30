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
        this.dummy={}
        this.dummy[1] = glb.scene.children[ 0 ].children[ 0 ].children[ 0 ];
        this.dummy[2] = glb.scene.children[ 0 ].children[ 0 ].children[ 1 ];
        this.dummy[3] = glb.scene.children[ 0 ].children[ 0 ].children[ 2 ];
        // this.dummy.frustumCulled=false
        // console.log(this.dummy[1])
        // console.log(this.dummy[2])
        // console.log(this.dummy[3])

        // this.scene.add(this.dummy)
        this.fishMesh={}

        this.fishMesh[1] = new THREE.InstancedMesh( this.dummy[1].geometry, new THREE.MeshBasicMaterial( {
            // flatShading: true,
            color:"orange"
        } ), WorldValues.boids.count );
        this.fishMesh[2]= new THREE.InstancedMesh( this.dummy[2].geometry, new THREE.MeshBasicMaterial( {
            // flatShading: true,
            color:'white'

        } ), WorldValues.boids.count );
        this.fishMesh[3] = new THREE.InstancedMesh( this.dummy[3].geometry, new THREE.MeshBasicMaterial( {
            // flatShading: true,
            color:'black'
        } ), WorldValues.boids.count );
       

        // mesh.castShadow = true;
        // let temp
        for ( let i = 0; i < WorldValues.boids.count; i ++ ) {
            const boid=this.boids.boidLogic.boidArray[i]

            for(let n=1; n<=3; n++)
                {

                    this.dummy[n].position.set(boid.x,boid.y,boid.z)
                    this.dummy[n].scale.set(0.3,0.3,0.3)
                    this.dummy[n].updateMatrix();

                    if(n==1)
                        {
                        this.fishMesh[n].setColorAt( i, new THREE.Color( `hsl(${Math.random() * 360}, 50%, 66%)` ) );
                        }

                    this.fishMesh[n].setMatrixAt( i, this.dummy[n].matrix );

                }




                // this.dummy[1].position.x=this.boids.boidLogic.boidArray[i].x
                // this.dummy[1].position.y=this.boids.boidLogic.boidArray[i].y
                // this.dummy[1].position.z=this.boids.boidLogic.boidArray[i].z

                // this.dummy[2].position.x=this.boids.boidLogic.boidArray[i].x
                // this.dummy[2].position.y=this.boids.boidLogic.boidArray[i].y
                // this.dummy[2].position.z=this.boids.boidLogic.boidArray[i].z

                // this.dummy[3].position.x=this.boids.boidLogic.boidArray[i].x
                // this.dummy[3].position.y=this.boids.boidLogic.boidArray[i].y
                // this.dummy[3].position.z=this.boids.boidLogic.boidArray[i].z
                

                // this.dummy[1].updateMatrix();
                // this.dummy[2].updateMatrix();
                // this.dummy[3].updateMatrix();

                // this.fishMesh[1].setMatrixAt( i, this.dummy[1].matrix );
                // this.fishMesh[1].setColorAt( i, new THREE.Color( `hsl(${Math.random() * 360}, 50%, 66%)` ) );

                // this.fishMesh[2].setMatrixAt( i, this.dummy[2].matrix );
                // this.fishMesh[3].setMatrixAt( i, this.dummy[3].matrix );
                // console.log(this.fishMesh[3])
                // i ++;
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

    

    updateModels()
    {
        // console.log(this.dummy)
        for ( let i = 0; i< WorldValues.boids.count; i++ ) {
            // let dummy= new THREE.Object3D()
            const boid=this.boids.boidLogic.boidArray[i]
            const target=new THREE.Vector3(boid.targetX,boid.targetY,boid.targetZ)

            for(let n=1; n<=3; n++)
                {
                    // this.dummy[n].position.x=boid.x
                    this.dummy[n].position.set(boid.x,boid.y,boid.z)
                    // this.dummy[n].position.y=boid.y
                    // this.dummy[n].position.z=boid.z

                    this.dummy[n].lookAt(target)
                    this.dummy[n].updateMatrix();
                    this.fishMesh[n].setMatrixAt( i, this.dummy[n].matrix );
                    this.fishMesh[n].instanceMatrix.needsUpdate=true

                }
            

            // this.dummy[1].position.x=boid.x
            // this.dummy[1].position.y=boid.y
            // this.dummy[1].position.z=boid.z

            // this.dummy[2].position.x=boid.x
            // this.dummy[2].position.y=boid.y
            // this.dummy[2].position.z=boid.z

            // this.dummy[3].position.x=boid.x
            // this.dummy[3].position.y=boid.y
            // this.dummy[3].position.z=boid.z
            

            // this.dummy[1].lookAt(target)
            // this.dummy[2].lookAt(target)
            // this.dummy[3].lookAt(target)

            // this.dummy[1].updateMatrix();
            // this.dummy[2].updateMatrix();
            // this.dummy[3].updateMatrix();
            
            
            // this.fishMesh[1].setMatrixAt( i, this.dummy[1].matrix );
            // this.fishMesh[2].setMatrixAt( i, this.dummy[2].matrix );
            // this.fishMesh[3].setMatrixAt( i, this.dummy[3].matrix );
            

            // this.fishMesh[1].instanceMatrix.needsUpdate=true
            // this.fishMesh[2].instanceMatrix.needsUpdate=true
            // this.fishMesh[3].instanceMatrix.needsUpdate=true




            // i ++;
    }

    }

    update()
    {
        // console.log("updating")
        this.updateModels()

        this.dummy

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
        this.boids.update({})

        // this.boids.update(this.intersectingEvironmentObjects)
        // // this.perform.timer('boid Update')

    }




}