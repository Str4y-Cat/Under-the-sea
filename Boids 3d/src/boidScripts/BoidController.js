import BoidLogic from "./BoidLogic";
import * as THREE from 'three'

export default class BoidController
{

    /** constructor()
     * 
     *  
     *  boidObject arr = setUp (boidArray)
     *  
     * 
     */
    constructor(count, sizes, scene,debug)
    {
        this.scene=scene
        this.sceneSize=debug.floorSize
        startValues.sceneSize=this.sceneSize
        this.boidLogic=new BoidLogic(count, sizes,startValues)
        this.boidMeshes= this.setUp(this.boidLogic.boidArray)

        this.debug()
    }

    /** setUp(boidArray)
     * 
     * sets up the boids on the map
     * 
     */
    setUp(boidArray)
    {
        const boidMeshes=[]

        //create geometry
        const geometry = new THREE.ConeGeometry( 0.027, 0.132,3 ); 

        //create material
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );

        boidArray.forEach(boid => {

            const boidMesh= new THREE.Mesh(geometry,material)
            boidMesh.position.y= boid.y
            boidMesh.position.x= boid.x
            // boidMesh.position.z= boid.z
            // console.log()
            this.scene.add(boidMesh)
            boidMeshes.push(boidMesh)
            

        });
        console.log(boidMeshes)
    }

    /** Update()
     * 
     * Updates the movement of the boid objects
     * 
     */

    /** Destroy()
     * 
     * removes a specific boid
     * removes from logic
     * removes geometry
     * clears scene
     * 
     */

    /** addBoid()
     * 
     *  creates a new boid
     *  adds to logic arr
     *  adds to scene
     * 
     */

    /** addControls
     * 
     * adds gui controls
     * 
     */

    /**DEBUG
     */
    debug()
    {
        this.debugSolidBorderBox()
    }

    //debug border box
    debugSolidBorderBox()
    {
        // const box= new THREE.Mesh(
        //     new THREE.BoxGeometry(this.sceneSize,this.sceneSize,this.sceneSize),
        //     new THREE.MeshBasicMaterial({wireframe:true})
        // )
        const boxGeometry= new THREE.BoxGeometry(this.sceneSize,this.sceneSize,this.sceneSize)
        

        const box= new THREE.LineSegments(
            new THREE.EdgesGeometry(boxGeometry),
            new THREE.LineBasicMaterial({color:"red"})

        )
        this.scene.add(box)


    }


}

/**
 * start options
 */

const startValues=
{
    transPadding : null,
    solidPadding : null,
    visualRange:null,
    protectedRange:null,
    cohesionFactor:null,
    matchingFactor:null,
    seperationFactor:null,
    minSpeed:null,
    maxSpeed:null   ,
    wallTransparent:(null),
    turnFactor:null,
    boidCount:null,
    sceneSize:null,
}