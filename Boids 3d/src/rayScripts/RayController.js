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
        this.far=0.3//max distance value
        this.rayCaster= new THREE.Raycaster()
        this.rayCaster.layers.set( 1 );
        this.rayCaster.far=this.far
    }

    update()
    {
        let arr= this.castRays()
        // if(arr.length){
        //     console.log(arr)
        // }
    
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
        const distanceAccum=0
        const xAccum=0
        const yAccum=0
        const zAccum=0

        // console.log('casting rays')
        const sum= {distance:0,x:0,y:0,z:0}
        for(const target of this.rayTargets)
        {
            this.rayCaster.set(this.rayOrigin,target)
            
            // console.log(this.rayCaster)
            const foundArr=this.rayCaster.intersectObjects ( this.environmentObjects)
            if(foundArr.length)
            {
                
                
                // console.log("ray Intersected")
                objectArr.push(foundArr[0])

                
            }
        }
        if(objectArr.length)
        {
            // console.log('found!')
            
            for(const obj of objectArr){
                sum.distance+=obj.distance
                sum.x+=obj.point.x
                sum.z+=obj.point.z
                sum.y+=obj.point.y
            }
            
            if(objectArr.length>1)
                {
                    sum.distance/=objectArr.length
                    sum.x/=objectArr.length
                    sum.y/=objectArr.length
                    sum.z/=objectArr.length
                }
        }

        const returnValue= (sum.distance)?sum:null
        console.log(returnValue)
        return returnValue
        
    }

    averageObjectDistance(arr)
    {

    }







}