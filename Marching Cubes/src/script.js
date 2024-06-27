/**
 * import dependencies
 */
import * as THREE from 'three'
import GUI from 'lil-gui'
import {  OrbitControls } from 'three/examples/jsm/Addons.js'

import Stats from 'three/addons/libs/stats.module.js';
import Performance from './performance/Performance';





//set up debug
const gui = new GUI()
const debug= {}
const perform= new Performance()

//axis helper

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


/**
 * annimaiton loop
 */

const clock= new THREE.Clock()
let past=0
const tick =()=>
    {

        let elapsedTime= clock.getElapsedTime()
        // stats.update()
        controls.update()
        // controls.update(delta)


        //for expensive computations, offset slowtick so that heavy computations are spread
        stats.begin();
        let slowTick= Math.round(elapsedTime*100)
        if(slowTick!=past){
            // perform.timer('check environment')
            

            // perform.timer('check environment')
        }
        stats.end();

        past=slowTick

        // perform.timer('boid Update')
        // perform.timer('boid Update')


        //key controller
        // console.log(debug.key)
       






        //renderer
      
        // ra
        renderer.render(scene,camera)
        //tick
        window.requestAnimationFrame(tick)
    }

    tick()