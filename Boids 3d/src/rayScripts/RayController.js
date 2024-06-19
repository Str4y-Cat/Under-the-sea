import * as THREE from 'three'
import { arrayBuffer, attribute } from 'three/examples/jsm/nodes/Nodes.js'
import RaySphere from './RaySphere'


export default class 
{
    constructor(count,rayAngleLimit,environmentObjects,scene,gui)
    {
        this.environmentObjects= environmentObjects
        console.log('environment objects')
        console.log(this.environmentObjects)
        this.scene=scene
        this.gui=gui
        // this.raySphere= new RaySphere(count,rayAngleLimit,scene,gui,{environmentObjects:environmentObjects})
        this.raySphere= new RaySphere(400,1,scene,gui,{environmentObjects:environmentObjects})


        // this.rayTargets= this.rays.rayPositions_vec3Array

        // this.rayOrigin=new THREE.Vector3(0,0,0)
        // this.far=0.3//max distance value
        // this.rayCaster= new THREE.Raycaster()
        // this.rayCaster.layers.set( 1 );
        // this.rayCaster.far=this.far

        this.debug={}
        this.debug.pointMeshes={}

        console.log("set up ray controller")
        console.log(this)
        // this.test()
    }


    //  NOTE: it may be better to use the standard boid position array,instead of the vec3 arr

    /**
     * checks the environment to see if ANY boid sees an object
     * 
     * @param {[THREE.Vector3]} boidPositions 
     * @returns {foundIntersections{boidindex,{distance,position}}} found intersections
     */
    checkEnviroment(boidPositions)
    {

        //initialize return object
        const foundIntersections={}
        
        //NOTE: possible optimization is to change loop here. but might be insignificant
        //loop through boidPositions

        
        boidPositions.forEach((boid,index) => {
            
            //TODO: check how many times this runs
            //rotate raySphere to match boid
            const targets= this.raySphere.rotateTo(boid)
            this.raySphere.timer('checkEnviroment')
            //sets debug for testing rays
            this.raySphere.debug.origin=boid.position

            //cast rays on that sphere
            const environmentIntersections= this.raySphere.castRays(targets,boid.position)
            // this.raySphere.counter('return',true)
            this.raySphere.timer('checkEnviroment')

            //if there are intersections
            if(environmentIntersections)
                {
                    //sets a new object in the found intersections obj
                    // {currentIndex: {distance:k, position: { x,y,z}}}
                    foundIntersections[index]=environmentIntersections
                }

        });

        // console.log('----------------------')
        return foundIntersections
    }

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