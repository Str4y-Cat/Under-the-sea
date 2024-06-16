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

        this.debug={}
    }

    update()
    {   
        //check if the rays object has been updated
        if(this.rays.needsUpdate)
            {
                this.rayTargets= this.rays.rayPositions_vec3Array
                this.rays.needsUpdate=false
            }
        
        //get the average of rays sent
        let obsticle= this.castRays()
        if(obsticle){
            
            //
            this.debug.ray=this.debugRay(obsticle)
        }
        else
        {
            this.removeRay()
        }
        
    
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
        // console.log(returnValue)
        return returnValue
        
    }
    
    debugRay(obsticle)
{   
    //clear the last ray path
    this.removeRay()
   

    const lineMaterial= new THREE.LineBasicMaterial();
    lineMaterial.color=new THREE.Color(Math.random(),Math.random, Math.random())
    const baseTarget= new THREE.Vector3(0,0,0)
    const target= new THREE.Vector3(obsticle.x,obsticle.y,obsticle.z)
    const lineArr=[]

    let lineGeometry = new THREE.BufferGeometry().setFromPoints( [baseTarget,target] );


    let line = new THREE.Line(lineGeometry, lineMaterial);
    this.scene.add(line);
    lineArr.push(line)
        
 
    return lineArr

    }
    removeRay(){
        if(this.debug.ray){
            this.scene.remove(this.debug.ray[0])
            this.debug.ray[0].material.dispose()
            this.debug.ray[0].geometry.dispose()
        }
    }

    averageObjectDistance(arr)
    {

    }







}