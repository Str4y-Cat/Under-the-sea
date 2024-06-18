/**
 * import dependencies
 */
import * as THREE from 'three'
import GUI from 'lil-gui'
import {  OrbitControls } from 'three/examples/jsm/Addons.js'
import BoidController from './boidScripts/BoidController'

import { DragControls } from 'three/addons/controls/DragControls.js';
import RAYS from './rayScripts/RaySphere'
import Stats from 'three/addons/libs/stats.module.js';

import RayController from './rayScripts/RayController';
// import RayController from './rayScripts/RayController';



//set up debug
const gui = new GUI()
const debug= {}

const textureLoader= new THREE.TextureLoader()
const matCapTexture= textureLoader.load('/textures/matCap1.png')

//axis helper

//create canvas
const canvas = document.querySelector('.webgl')

//create scene
const scene = new THREE.Scene()

const axisHelper= new THREE.AxesHelper(0.3)
scene.add(axisHelper)
/**
 * Handle sizes and resize
 */
const sizes= 
{
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize',()=>
    {
        sizes.width=window.innerWidth
        sizes.height=window.innerHeight

        //update camera
        camera.aspect= sizes.width/sizes.height
        camera.updateProjectionMatrix()
        
        //update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(2,window.devicePixelRatio))


    })


/**
 * and a object
 */
debug.floorSize=5
const floorGeometry= new THREE.PlaneGeometry(debug.floorSize,debug.floorSize,8,8)
const floorMaterial= new THREE.MeshBasicMaterial(
    {
        color:"red",
        wireframe:true
    })
const floor= new THREE.Mesh(
    floorGeometry,
    floorMaterial
)
floor.rotation.x=-Math.PI/2
floor.position.y-=debug.floorSize/2
// floor.position.x=1
scene.add(floor)


/**add drag objects
 * 
 */

const dragMaterial= new THREE.MeshMatcapMaterial({matcap:matCapTexture})
const dragGeometry1= new THREE.BoxGeometry(0.1,0.1,0.1)
// const dragGeometry2=  new THREE.CapsuleGeometry( 0.2, 0.2, 4, 8 ); 
// const dragGeometry2=  new THREE.SphereGeometry( 0.1 ); 

// const dragMesh1=new THREE.Mesh(dragGeometry1,dragMaterial)
// dragMesh1.position.z=1
const dragMesh2=new THREE.Mesh(dragGeometry1,dragMaterial)
dragMesh2.position.z=-0.4

// dragMesh1.layers.enable( 1 );
dragMesh2.layers.enable( 1 );
const testFolder=gui.addFolder('testObject')
testFolder.add(dragMesh2.position,'x').min(-1).max(1).step(0.00001).name('test Object x')
testFolder.add(dragMesh2.position,'y').min(-1).max(1).step(0.00001).name('test Object y')
testFolder.add(dragMesh2.position,'z').min(-1).max(1).step(0.00001).name('test Object z')
// scene.add(dragMesh1,dragMesh2)
scene.add(dragMesh2)




/**
 * add a camera
 */

const camera= new THREE.PerspectiveCamera(75,sizes.width/sizes.height, 0.1 , 100)
camera.position.x = 1
camera.position.y = 0.5
camera.position.z = 0
camera.lookAt(new THREE.Vector3(0,0,0))
scene.add(camera)

/**
 * stats
 */
let stats = new Stats();
document.body.appendChild( stats.dom );

/**
 * BOIDS
 */

// const boidController= new BoidController(300,sizes,scene,debug,gui,camera, matCapTexture)
const geometry = new THREE.ConeGeometry( 0.027, 0.132,3 ); 
geometry.rotateX(-Math.PI * 0.5);
const material = new THREE.MeshBasicMaterial({wireframe:true});
const boidMesh= new THREE.Mesh(geometry,material)

// const geometry = new THREE.ConeGeometry( 0.027, 0.132,3 ); 

// const material = new THREE.MeshBasicMaterial({wireframe:true});
const boidMesh2= new THREE.Mesh(geometry,material)
// const boidMesh3= new THREE.Mesh(geometry,material)

boidMesh2.position.z=-0.5
// boidMesh3.position.z=0.3
// boidMesh.position.z=0
boidMesh.rotation.y=Math.PI

gui.add(boidMesh.position,'z').min(-2).max(2).step(0.001)
gui.add(boidMesh.rotation,'y').min(-Math.PI).max(Math.PI).step(0.001).name('y Rotation')

const testBoids=[boidMesh,boidMesh2]
scene.add(boidMesh,boidMesh2)

/**
 * mouse events
 */
debug.keyDown

window.addEventListener('keydown',(e)=>
{

    // console.log(e)
    const currentKey=e.key

    debug.keyDown=currentKey

})




/**
 * RAYCASTING
 */

const rayController=new RayController(200,-0.347,[dragMesh2],scene,gui)





/**
 * add controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping=true


/**
 * add renderer
 */
const renderer= new THREE.WebGLRenderer({
    canvas:canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(2,window.devicePixelRatio))


// const dragControls = new DragControls( [dragMesh2], camera, renderer.domElement );


/**
 * annimaiton loop
 */

const clock= new THREE.Clock()
let past=0

const tick =()=>
    {

        let elapsedTime= clock.getElapsedTime()
        stats.update()
        controls.update()
        // controls.update(delta)


        //for expensive computations, offset slowtick so that heavy computations are spread
        let slowTick= Math.round(elapsedTime)/10
        if(slowTick!=past){
            // rayController.update()
            // console.log(slowTick)
            // rayController.test()
            console.log(rayController.checkEnviroment(testBoids))

        }

        past=slowTick

        // boidController.update()


        //key controller
        // console.log(debug.key)
        switch(debug.keyDown)
        {
            case "a":
                //left
                // console.log('going left')
                dragMesh2.position.z+=0.03
                debug.keyDown=null

                break

            case "d":
                //right
                dragMesh2.position.z-=0.03
                debug.keyDown=null

                break

            case "w":
                //forward
                dragMesh2.position.x-=0.03
                debug.keyDown=null
                break

            case "s":
                //back
                dragMesh2.position.x+=0.03
                debug.keyDown=null
            break

            case "Shift":
                //down
                dragMesh2.position.y-=0.03
                debug.keyDown=null
                break

            case " ":
                //up
                dragMesh2.position.y+=0.03
                debug.keyDown=null
                break
        }






        //renderer
      
        // ra
        renderer.render(scene,camera)
        //tick
        window.requestAnimationFrame(tick)
    }

    tick()