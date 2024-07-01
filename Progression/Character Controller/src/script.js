/**
 * import dependencies
 */
import * as THREE from 'three'
import GUI from 'lil-gui'
import {  OrbitControls } from 'three/examples/jsm/Addons.js'
import {  FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'

import Stats from 'three/addons/libs/stats.module.js';
import Performance from './performance/Performance';

import FlightController from './Player Controller/Flight Controller.js'
import CameraController from './Player Controller/cameraController.js';







//set up debug
const gui = new GUI()
const debug= {}
const perform= new Performance()
gui.add(perform,'reset').name('reset average')
// gui.add(perform,'avg').name('avg')



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

//#region world objects
/**
 * floor
 */
debug.floorSize=5
const floorGeometry= new THREE.PlaneGeometry(debug.floorSize,debug.floorSize,8,8)
floorGeometry.computeBoundingBox();

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




/**
 * objects to avoid
 */

const dragMaterial= new THREE.MeshPhongMaterial({color:"#ff5733"})
const dragGeometry1= new THREE.BoxGeometry(1,1,1,1,64,64)
dragGeometry1.computeBoundingBox();


// const dragGeometry1= new THREE.TorusGeometry(1)
const environmentObjects=[]

const createRandom=()=>
    {
        for(let i=0; i<5; i++)
            {
                const mesh= new THREE.Mesh(dragGeometry1,dragMaterial )
                mesh.scale.x=Math.max(Math.random(),0.4)
                mesh.scale.y=Math.max(Math.random(),0.4)
                mesh.scale.z=Math.max(Math.random(),0.4)
                // mesh.rotation.set(new THREE.Vector3((Math.random()-0.5)*2*Math.PI,(Math.random()-0.5)*2*Math.PI,(Math.random()-0.5)*2*Math.PI)) 
                mesh.rotation.x=(Math.random()-0.5)*2*Math.PI
                mesh.rotation.y=(Math.random()-0.5)*2*Math.PI
                mesh.rotation.z=(Math.random()-0.5)*2*Math.PI
        
                // console.log(mesh.rotation.x)
                
                // mesh.position.set(new THREE.Vector3((Math.random()-0.5)*2*10,(Math.random()-0.5)*2*10,(Math.random()-0.5)*2*10)) 
                mesh.position.x=(Math.random()-0.5)*5
                mesh.position.y=(Math.random()-0.5)*5
                mesh.position.z=(Math.random()-0.5)*5
                
                mesh.layers.enable( 1 );
               
                scene.add(mesh)
                environmentObjects.push(mesh)
            }
        
    }


const createGrid=()=>{
    for(let y=-2; y<=2; y++)
        {
            for(let x = -2 ; x<=2;x++)
                {
                    for (let z = -2 ; z<=2;z++ )
                        {
                            const mesh= new THREE.Mesh(dragGeometry1,dragMaterial )
                            mesh.scale.x=0.3
                            mesh.scale.y=0.3
                            mesh.scale.z=0.3
                            // // mesh.rotation.set(new THREE.Vector3((Math.random()-0.5)*2*Math.PI,(Math.random()-0.5)*2*Math.PI,(Math.random()-0.5)*2*Math.PI)) 
                            // mesh.rotation.x=(Math.random()-0.5)*2*Math.PI
                            // mesh.rotation.y=(Math.random()-0.5)*2*Math.PI
                            // mesh.rotation.z=(Math.random()-0.5)*2*Math.PI
                    
                            // console.log(mesh.rotation.x)
                            
                            // mesh.position.set(new THREE.Vector3((Math.random()-0.5)*2*10,(Math.random()-0.5)*2*10,(Math.random()-0.5)*2*10)) 
                            mesh.position.x=x
                            mesh.position.y=y
                            mesh.position.z=z
                            
                            mesh.layers.enable( 1 );
                           
                            scene.add(mesh)
                            environmentObjects.push(mesh)
                        }
                }
        }
}

const createWall=()=>{
    const mesh= new THREE.Mesh(dragGeometry1,dragMaterial )
        mesh.scale.x=Math.abs(Math.random()-0.5)
    mesh.scale.y=2.5
    mesh.position.y=-1.25
        mesh.scale.z=5
    mesh.layers.enable( 1 );
    scene.add(mesh)

    environmentObjects.push(mesh,floor)
    }


//#endregion




//#region Camera
/**
 * add a camera
 */

const camera= new THREE.PerspectiveCamera(75,sizes.width/sizes.height, 0.1 , 100)
camera.position.x = 2
camera.position.y = 2.5
camera.position.z = 5
camera.lookAt(new THREE.Vector3(0,0,0))
scene.add(camera)
//#endregion

//#region misc
/**
 * stats
 */
let stats = new Stats();
document.body.appendChild( stats.dom );
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


//#endregion











/**
 * Lights
 */


//#region three.js essentials
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 2 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 50, 0 );
scene.add( hemiLight );



/**
 * add controls
 */
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping=true


/**
 * add renderer
 */
const renderer= new THREE.WebGLRenderer({
    canvas:canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(2,window.devicePixelRatio))
//#endregion


/**
 * player
 */

const playerGeometry= new THREE.BoxGeometry(1,1,1)
const playerMaterial= new THREE.MeshToonMaterial()
const playerMesh= new THREE.Mesh(playerGeometry,playerMaterial)
scene.add(playerMesh)

const controls= new FlightController(playerMesh, renderer.domElement)
controls.movementSpeed = 0.1;
controls.lookSpeed = 0.01;

const cameraControls= new CameraController(camera)



/**
 * annimaiton loop
 */

const clock= new THREE.Clock()

let intersectingEvironmentObjects={}
// controls.updateQ(0.16)
controls.updateQ(0.016)
console.log(controls)
cameraControls.Update(0.016,controls.Attributes,playerMesh)
const tick =()=>
    {
        controls.updateQ(0.016)
        cameraControls.Update(0.016,controls.Attributes,playerMesh)

        let elapsedTime= clock.getElapsedTime()
        // stats.update()
        // camera.position.set(playerMesh.position.x,playerMesh.position.y+2,playerMesh.position.z+3)
        // camera.lookAt(playerMesh.position)
        
        // controls.update(delta)
        // console.log(camera.position)

        //for expensive computations, offset slowtick so that heavy computations are spread
        stats.begin();
        
        stats.end();

      

        

        






        //renderer
      
        // ra
        renderer.render(scene,camera)
        //tick
        window.requestAnimationFrame(tick)
    }

    tick()