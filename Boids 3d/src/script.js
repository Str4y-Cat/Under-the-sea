/**
 * import dependencies
 */
import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import BoidController from './boidScripts/BoidController'



//set up debug
const gui = new GUI()
const debug= {}

const textureLoader= new THREE.TextureLoader()
const matCapTexture= textureLoader.load('/textures/matCap3.png')

//axis helper

//create canvas
const canvas = document.querySelector('.webgl')

//create scene
const scene = new THREE.Scene()

// const axisHelper= new THREE.AxesHelper(4)
// scene.add(axisHelper)
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




/**
 * add a camera
 */

const camera= new THREE.PerspectiveCamera(75,sizes.width/sizes.height, 0.1 , 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

/**
 * BOIDS
 */

const boidController= new BoidController(50,sizes,scene,debug,gui,camera, matCapTexture)


/**
 * lights
 */
// debug.lightColor= "#ffffff"
// console.log(debug.lightColor)
// const pointLight= new THREE.PointLight("#ffffff",10)
// gui.addColor(debug,'lightColor').onChange((color)=>
// {
//     pointLight.color= new THREE.Color(color)
// })

// const pointLight = new THREE.PointLight( debug.lightColor, 10, 100 );
// pointLight.position.set( 0, 0, 0 );
// scene.add( pointLight );
// gui.addColor(debug,'lightColor').onChange((color)=>
// {
//     pointLight.color= new THREE.Color(color)
// })

// const sphereSize = 0.3;
// const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
// scene.add( pointLightHelper );
// debug.ambientLightColor= "#ffffff"

// const ambientLight = new THREE.AmbientLight( debug.ambientLightColor,0.01, 100 );
// // pointLight.position.set( 0, 0, 0 );
// scene.add( ambientLight );
// gui.addColor(debug,'ambientLightColor').onChange((color)=>
// {
//     pointLight.color= new THREE.Color(color)
// })

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

        boidController.update()

        //controls
        controls.update()
        //renderer
        renderer.render(scene,camera)
        //tick
        window.requestAnimationFrame(tick)
    }

    tick()