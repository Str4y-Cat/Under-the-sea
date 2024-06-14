/**
 * import dependencies
 */
import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/Addons.js'



//set up debug
const gui = new GUI()
const debug= {}

//axis helper

//create canvas
const canvas = document.querySelector('.webgl')

//create scene
const scene = new THREE.Scene()

const axisHelper= new THREE.AxesHelper(4)
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
const floorGeometry= new THREE.PlaneGeometry(10,10,64,64)
const floorMaterial= new THREE.MeshBasicMaterial(
    {
        color:"white",
        wireframe:true
    })
const floor= new THREE.Mesh(
    floorGeometry,
    floorMaterial
)
floor.rotation.x=-Math.PI/2
// floor.position.x=1

scene.add(floor)

/**
 * BOIDS
 */






/**
 * add a camera
 */

const camera= new THREE.PerspectiveCamera(75,sizes.width/sizes.height, 0.1 , 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

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

/**
 * annimaiton loop
 */

const tick =()=>
    {


        //controls
        controls.update()
        //renderer
        renderer.render(scene,camera)
        //tick
        window.requestAnimationFrame(tick)
    }

    tick()