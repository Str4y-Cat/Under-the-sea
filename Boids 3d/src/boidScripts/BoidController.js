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
        startValues.sceneSize= debug.floorSize
        this.boidLogic=new BoidLogic(count, sizes,startValues)
        this.boidMeshes= this.setUp(this.boidLogic.boidArray)

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
    sceneSize:10,
}