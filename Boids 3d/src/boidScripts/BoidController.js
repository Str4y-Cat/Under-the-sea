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
    constructor(count, sizes, scene,debug,gui,camera,texture)
    {
        this.camera=camera
        this.texture= texture

        this.scene=scene
        this.sceneSize=debug.floorSize
        startValues.sceneSize=this.sceneSize


        this.boidLogic=new BoidLogic(count, sizes,startValues)
        this.boidMeshes= this.setUp(this.boidLogic.boidArray)


        this.gui=gui
        this.addControls()
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
        const material = new THREE.MeshMatcapMaterial( {matcap:this.texture} );
        geometry.rotateX(-Math.PI * 0.5);
        // const material = new THREE.MeshToonMaterial();
        // const material = new THREE.MeshLambertMaterial();
        
        // material.shininess=0.5
        // material.specular=0.7
        // console.log(`texture`)
        // console.log(this.texture)

        boidArray.forEach((boid,i) => {

            const boidMesh= new THREE.Mesh(geometry,material)
            // if(i==0){
            //     boidMesh.geometry.rotateX

            // }

            boidMesh.position.y= boid.y
            boidMesh.position.x= boid.x
            boidMesh.position.z= boid.z


            // console.log()
            this.scene.add(boidMesh)
            boidMeshes.push(boidMesh)
            

        });
        // console.log(boidMeshes)
        return boidMeshes
    }

    /** Update()
     * 
     * Updates the movement of the boid objects
     * 
     */
    update(environmenObjects)
    {
        this.boidLogic.update(environmenObjects)

        this.boidMeshes.forEach((boidMesh,i)=>
        {
            const boid= this.boidLogic.boidArray[i]

            boidMesh.position.x=boid.x
            boidMesh.position.y=boid.y
            boidMesh.position.z=boid.z
            // console.log(boid.z)
            boidMesh.lookAt(new THREE.Vector3(boid.targetX,boid.targetY,boid.targetZ))
            

            if(i==0&&this.debugHalos.protectedCircle)
                {
                    this.debugHalos.protectedCircle.position.copy( boidMesh.position)
                    this.debugHalos.protectedCircle.lookAt(this.camera.position);
                    // console.log(this.scene.children) 
                    this.debugHalos.viewCircle.position.copy( boidMesh.position)
                    this.debugHalos.viewCircle.lookAt(this.camera.position);

                }

        })
    }

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
    addControls()
    {
       
        this.gui.add(startValues,"cohesionFactor").min(0).max(0.05).step(0.00001).onChange((num)=>{
            this.boidLogic.cohesionFactor=num
        })
        this.gui.add(startValues,"matchingFactor").min(0).max(0.1).step(0.00001).onChange((num)=>{
            this.boidLogic.matchingFactor=num
        })
        this.gui.add(startValues,"seperationFactor").min(0).max(0.5).step(0.00001).onChange((num)=>{
            this.boidLogic.seperationFactor=num
        })
        this.gui.add(startValues,"turnFactor").min(0).max(1).step(0.0001).onChange((num)=>{
            this.boidLogic.turnFactor=num/100
        })
        this.gui.add(startValues,"minSpeed").min(0).max(10).step(0.001).onChange((num)=>{
            this.boidLogic.minSpeed=num/100
        })
        this.gui.add(startValues,"maxSpeed").min(0).max(10).step(0.001).onChange((num)=>{
            this.boidLogic.maxSpeed=num/100
        })
        this.gui.add(startValues,"wallTransparent").onChange((bool)=>{
            this.boidLogic.wallTransparent=bool
}) 
    }

    /**DEBUG
     */
    debug()
    {
        this.debugSolidBorderBox()
        this.debugHalos()
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

    debugHalos()
    {
        
        const viewMaterial = new THREE.LineBasicMaterial( { color: "green" } );
        const protectedMaterial = new THREE.LineBasicMaterial( { color: "red" } );

        const viewCurve = new THREE.EllipseCurve(
            0,  0,            // ax, aY
            this.boidLogic.visualRange, this.boidLogic.visualRange,           // xRadius, yRadius
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
        
       
        let points = viewCurve.getPoints( 50 );
        let viewGeometry = new THREE.BufferGeometry().setFromPoints( points );
        
        // Create the final object to add to the scene
        const viewCircle = new THREE.Line( viewGeometry, viewMaterial );


        const protectedCurve = new THREE.EllipseCurve(
            0,  0,            // ax, aY
            this.boidLogic.protectedRange, this.boidLogic.protectedRange,           // xRadius, yRadius
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
        
       
        points = protectedCurve.getPoints( 50 );
        let protectedGeometry = new THREE.BufferGeometry().setFromPoints( points );
        
        // Create the final object to add to the scene
        const protectedCircle = new THREE.Line( protectedGeometry, protectedMaterial );
        // protectedCircle.material.color= new THREE.Color("red")

        this.scene.add(protectedCircle,viewCircle)

        
        this.debugHalos={
            protectedCircle:protectedCircle,
            viewCircle:viewCircle
        }
        // console.log(this.debugValues)
    }


}

/**
 * start options
 */

const startValues=
{
    // transPadding : null,
    // solidPadding : null,
    visualRange:0.6,
    protectedRange:0.2,
    cohesionFactor:0.00206,
    matchingFactor:0.09385,
    seperationFactor:0.30332,
    minSpeed:2.379,
    maxSpeed:5.575   ,
    wallTransparent:false,
    turnFactor:0.201,
    boidCount:null,
    sceneSize:null,
}

