import * as THREE from 'three'
import { arrayBuffer, attribute } from 'three/examples/jsm/nodes/Nodes.js'
import RaySphere from './RaySphere'
import WorldValues from '../WorldValues'
import Experience from '../Experiance'


export default class 
{
    constructor(environment,environmentMeshes)
    {
        this.experience=new Experience()
        this.environment= environment
        this.environmentMeshes= environmentMeshes
        console.log(environmentMeshes)
        console.log(this.environment)
        this.scene=this.experience.scene
        this.debug= this.experience.debug.ui
        // this.raySphere= new RaySphere(count,rayAngleLimit,scene,gui,{environment:environment})

        this.rayCount=WorldValues.rays.count
        this.rayAngle=WorldValues.rays.angle
        this.raySphere= new RaySphere(this.rayCount,this.rayAngle,this.scene,this.gui,{environment:environment})

        this.stagger= 
        {
            count:0
        }

        // this.rayTargets= this.rays.rayPositions_vec3Array

        // this.rayOrigin=new THREE.Vector3(0,0,0)
        // this.far=0.3//max distance value
        // this.rayCaster= new THREE.Raycaster()
        // this.rayCaster.layers.set( 1 );
        // this.rayCaster.far=this.far

        this.debug={}
        this.debug.pointMeshes={}

        console.log("set up ray controller")
        // console.log(this)
        // this.test()
    }


    //  NOTE: it may be better to use the standard boid position array,instead of the vec3 arr

    /**
     * checks the environment to see if ANY boid sees an object
     * 
     * @param {[THREE.Vector3]} boidPositions 
     * @returns {foundIntersections{boidindex,{distance,position}}} found intersections
     */
    checkEnviroment(boidPositions, iStart, iEnd)
    {
        if(iStart==null||iEnd==null)
            {
                iStart=0;
                iEnd=boidPositions.length
            }
        // this.raySphere.timer('checkEnviroment')
        //initialize return object
        const foundIntersections={}
        //loop through boidPositions
        for(let i = iStart; i<iEnd; i++){

            //finds environments objects that the boid intersects with
            const enviromentObjectIds=this.environment.getObjectId(boidPositions[i])
            const enviromentObjects=[]

            if(enviromentObjectIds.length>0)
                {
                    
                    // console.log(enviromentObjectIds)
                    // console.log(boidPositions[i])
                    // console.log(i)

                    enviromentObjectIds.forEach((id)=>
                        {
                            enviromentObjects.push(this.environmentMeshes[id])
                        })
                }
            
            let environmentIntersections
            
            //if there are intersections, cast the rays
            if(enviromentObjects.length>0)
            {

                //rotate raySphere to match boid
                const targets= this.raySphere.rotateTo(boidPositions[i])
                
                //sets debug for testing rays
                this.raySphere.debug.origin=boidPositions[i].position

                //cast rays on that sphere
                environmentIntersections = this.raySphere.castRays(targets,boidPositions[i].position, enviromentObjects)
                // this.raySphere.counter('return',true)
                // console.log("environmentIntersections")
                // console.log(environmentIntersections)
                
            }
            
            //if there are intersections
            if(environmentIntersections)
                {
                    // console.log('setting found intersection')
                    //sets a new object in the found intersections obj
                    // {currentIndex: {distance:k, position: { x,y,z}}}
                    foundIntersections[i]=environmentIntersections
                    // console.log(foundIntersections)


                }
            // this.raySphere.timer('checkEnviroment')
        }
        // if(foundIntersections[0]!=null){
        //     console.log("foundIntersections is not null")
        //     console.log(foundIntersections)

        // }
        // console.log(foundIntersections)
        return foundIntersections
    }

   


    update(boidPoistions, stagger)
    {
        this.stagger.count++
        if(this.stagger.count==10000){this.stagger.count=0}   
        const increase= boidPoistions.length/stagger
        const shift= this.stagger.count%stagger
        // console.log(`shift:${shift} start:${increase*shift} end:${increase*(shift+1)}`)
        // if(increase*(shift+1)==boidPoistions.length)
        //     {
        //         console.log("complete cycle")
        //     }
        const iStart=increase*shift
        const iEnd=increase*(shift+1)
        return this.checkEnviroment(boidPoistions,iStart,iEnd)
        
        
        // const startIndex=
        // const endIndex=
        //
    }

    // setStagger()

    test()
    {

        const rays= this.raySphere.castRays(new THREE.Vector3(0,0,0))
        if(rays){console.log('found')}
    }
   
    //#region DEBUG
    /**
     * debugRay
     * 
     * shoot a line to the target if there is something found
     */
    debugPoints(boid,i)
    {   

        if(this.debug.pointMeshes[i]){
            this.removePointsMesh(this.debug.pointMeshes[i])
        }
        //remoce the debug object from the scene

        // //create the float array
        //     const positionsArray=arr
        // //create geometry
        //     const geometry= new THREE.BufferGeometry()
        // //create postions attribute
        //     geometry.setAttribute('position', new THREE.BufferAttribute(positionsArray,3))
        // //create material
        //     const material= new THREE.PointsMaterial(
        //         {
        //             color:'white',
        //             size:0.007,
        //             sizeAttenuation:true,
        //         }
        //     )
        //create mesh
            const mesh= this.raySphere.pointSphere.clone()

            
            mesh.position.copy(boid.position)
        //add to scene
            this.scene.add(mesh)
            this.debug.pointMeshes[i]=mesh


    }
    removePointsMesh(mesh)
    {
        this.scene.remove(mesh)
        mesh.geometry.dispose()
        mesh.material.dispose()
    }

    //#endregion


}