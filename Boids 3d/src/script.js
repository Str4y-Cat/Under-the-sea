/**
 * import dependencies
 */
import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import BoidController from './boidScripts/BoidController'
import * as RAYS from './rayScripts/RayPlotter'



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

// scene.add(floor)




/**
 * add a camera
 */

const camera= new THREE.PerspectiveCamera(75,sizes.width/sizes.height, 0.1 , 100)
camera.position.x = 2
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

/**
 * BOIDS
 */

// const boidController= new BoidController(300,sizes,scene,debug,gui,camera, matCapTexture)
const geometry = new THREE.ConeGeometry( 0.027, 0.132,3 ); 
geometry.rotateX(-Math.PI * 0.5);
const material = new THREE.MeshToonMaterial();
const boidMesh= new THREE.Mesh(geometry,material)
scene.add(boidMesh)
/**
 * fib sphere
 */
debug.rayPoints= 500
debug.rayCutoff=0.5

let raySpherePointPositions=RAYS.fibonacci_sphere(debug.rayPoints)
let raySphereColors=RAYS.fibonacci_colours(debug.rayPoints, debug.rayCutoff)
console.log(raySpherePointPositions)

const pointsGeometry= new THREE.BufferGeometry()
pointsGeometry.setAttribute('position',new THREE.BufferAttribute(raySpherePointPositions,3))
pointsGeometry.setAttribute('color',new THREE.BufferAttribute(raySphereColors,3))

const pointsMaterial= new THREE.PointsMaterial({
    // color:'white',
    size:0.01,
    sizeAttenuation:true,
    vertexColors:true

})

const particleMesh= new THREE.Points(
    pointsGeometry,
    pointsMaterial
)

scene.add(particleMesh)

gui.add(debug,'rayPoints').min(0).max(4000).step(10).onChange((num)=>
    {
        let raySpherePointPositions=RAYS.fibonacci_sphere(num)
        pointsGeometry.setAttribute('position',new THREE.BufferAttribute(raySpherePointPositions,3))
        let raySphereColors=RAYS.fibonacci_colours(debug.rayPoints,debug.rayCutoff)
        
        pointsGeometry.setAttribute('color',new THREE.BufferAttribute(raySphereColors,3))

        // particleBufferAttribute.needsUpdate = true;
    })
gui.add(debug,'rayCutoff').min(-1).max(1).step(0.001).onChange((num)=>
    {
        
        let raySphereColors=RAYS.fibonacci_colours(debug.rayPoints,num)
        
        pointsGeometry.setAttribute('color',new THREE.BufferAttribute(raySphereColors,3))

        // particleBufferAttribute.needsUpdate = true;
    })





/**
 * lights
 */
debug.lightColor= "#ffffff"


const pointLight = new THREE.PointLight( debug.lightColor, 5, 100 );
pointLight.position.set( 0, 0, 0 );
scene.add( pointLight );
gui.addColor(debug,'lightColor').onChange((color)=>
{
    pointLight.color= new THREE.Color(color)
})

// const sphereSize = 0.3;
// const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
// scene.add( pointLightHelper );
debug.ambientLightColor= "#ffffff"

const ambientLight = new THREE.AmbientLight( debug.ambientLightColor,0.005, 100 );
// scene.add( ambientLight );
gui.addColor(debug,'ambientLightColor').onChange((color)=>
{
    pointLight.color= new THREE.Color(color)
})

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

const clock= new THREE.Clock()
const tick =()=>
    {

        let elapsedTime= clock.getElapsedTime()
        // console.log(elapsedTime)
        // boidController.update()

        //controls
        // controls.update()

        //renderer
      
        // ra
        renderer.render(scene,camera)
        //tick
        window.requestAnimationFrame(tick)
    }

    tick()