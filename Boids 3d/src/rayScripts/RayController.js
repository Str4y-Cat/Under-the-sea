import * as THREE from 'three'
import { arrayBuffer } from 'three/examples/jsm/nodes/Nodes.js'
import RAYS from './RayPlotter'


export default class 
{
    constructor(count,rayAngleLimit,environmentObjects,scene,gui)
    {
        this.environmentObjects= environmentObjects
        this.scene=scene
        this.gui=gui
        this.rays= new RAYS(count,rayAngleLimit,scene,gui)

        this.rayTargets= this.rays.rayPositions_vec3Array

        this.rayOrigin=new THREE.Vector3(0,0,0)
        this.far=1//max distance value
        this.rayCaster= new THREE.Raycaster()
        this.rayCaster.layers.set( 1 );
    }

    update()
    {
        this.castRays()
    }

    /**
     * debugRay
     * 
     * shoot a line to the target if there is something found
     */

    /**
     * testRays()
     * 
     * shoot rays, remove all boids, return values
     * 
     */
    castRays()
    {   
        
        const objectArr=[]
        this.rayTargets.forEach((target)=>{
            this.rayCaster.set(this.rayOrigin,target)
            const foundArr=this.rayCaster.intersectObjects ( this.environmentObjects)
            if(foundArr.length)
                {
                    objectArr.push(foundArr)
                }
        })
        if(objectArr.length)
            {
                console.log('found!')
            }
        return objectArr
        
    }








}