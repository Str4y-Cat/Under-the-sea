
import * as THREE from 'three'
import GUI from 'lil-gui'
import {  OrbitControls } from 'three/examples/jsm/Addons.js'

import Stats from 'three/addons/libs/stats.module.js';
import BoidsController from './boidsGPGPU/DrawBoids';




//set up debug
const gui = new GUI()
const debug= {}


//#region textures
const textureLoader= new THREE.TextureLoader()
const matCapTexture= textureLoader.load('/textures/matCap1.png')
const matCapTexture2= textureLoader.load('/textures/matCap2.png')

//#endregion

//#region scene
//create canvas
const canvas = document.querySelector('.webgl')

//create scene
const scene = new THREE.Scene()
scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
scene.fog = new THREE.Fog( scene.background, 1, 5000 );

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



//#endregion

//#region three.js essentials
/**
 * Lights
 */

const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 2 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 50, 0 );
scene.add( hemiLight );



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
//#endregion

//#region boids
/**
 * BOIDS
 */
const three={
    scene:scene,
    renderer:renderer
}
const boids= new BoidsController(three)

//#endregion





/**
 * annimaiton loop
 */

const clock= new THREE.Clock()
// clock.start()
let last=0
const tick =()=>
    {

        let elapsedTime= clock.getElapsedTime()
        let current=elapsedTime
        let deltaTime= current-last;
        last=current;

        // let deltaTime= clock.getDelta()
        // console.log(delta)
        // stats.update()
        controls.update()
    
        boids.update(deltaTime)
        //renderer
      
        // ra
        renderer.render(scene,camera)
        //tick
        window.requestAnimationFrame(tick)
    }

tick()