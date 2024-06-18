import * as THREE from 'three'
import { arrayBuffer, attribute } from 'three/examples/jsm/nodes/Nodes.js'
import RaySphere from './RaySphere'


export default class 
{
    constructor(count,rayAngleLimit,environmentObjects,scene,gui)
    {
        this.environmentObjects= environmentObjects
        this.scene=scene
        this.gui=gui
        this.raySphere= new RaySphere(count,rayAngleLimit,scene,gui,{environmentObjects:environmentObjects})


        // this.rayTargets= this.rays.rayPositions_vec3Array

        // this.rayOrigin=new THREE.Vector3(0,0,0)
        // this.far=0.3//max distance value
        // this.rayCaster= new THREE.Raycaster()
        // this.rayCaster.layers.set( 1 );
        // this.rayCaster.far=this.far

        this.debug={}
        this.debug.pointMeshes={}
        // this.test()
    }


    /**
     * checks the environment to see if ANY boid sees an object
     */
    checkEnviroment(boidPositions)
    {
        //initialize return object
        const foundIntersections={}

        //loop through boidPositions
        boidPositions.forEach((boid,index) => {
            
            // console.log(boid)
            //rotate raySphere to match boid
            const targets= this.raySphere.rotateTo(boid)
            // console.log(targets)
            this.raySphere.debug.origin=boid.position
            // console.log(boid.position)

            //cast rays on that sphere
            const environmentIntersections= this.raySphere.castRays(targets,boid.position)
            // this.debugPoints(boid,index)

            //if there are intersections
            if(environmentIntersections)
                {
                        // console.log(environmentIntersections)
                        this.raySphere.debug.ray=this.raySphere.debugRay(environmentIntersections,boid.position)
                        
                    // add returnObjec[currentIndex]= return value from raySphere.castRays 
                    foundIntersections[index]=environmentIntersections
                }

        });

        return foundIntersections
    }

    test()
    {

        // const vec3Arrary=this.raySphere.float3ToVec3(this.raySphere.rayPositions_floatArray)
        // console.log(vec3Arrary)

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