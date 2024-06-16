/**
 * import dependencies
 */
import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import BoidController from './boidScripts/BoidController'
import * as RAYS from './rayScripts/RayPlotter'
// import { vec3 } from 'three/examples/jsm/nodes/Nodes.js'
import { DragControls } from 'three/addons/controls/DragControls.js';



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


/**add drag objects
 * 
 */

const dragMaterial= new THREE.MeshMatcapMaterial({matcap:matCapTexture})
const dragGeometry1= new THREE.BoxGeometry(0.4,0.4,0.4)
const dragGeometry2=  new THREE.CapsuleGeometry( 0.2, 0.2, 4, 8 ); 

const dragMesh1=new THREE.Mesh(dragGeometry1,dragMaterial)
dragMesh1.position.z=1
const dragMesh2=new THREE.Mesh(dragGeometry2,dragMaterial)
dragMesh2.position.z=-1

scene.add(dragMesh1,dragMesh2)




/**
 * add a camera
 */

const camera= new THREE.PerspectiveCamera(75,sizes.width/sizes.height, 0.1 , 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 0
camera.lookAt(new THREE.Vector3(0,0,0))
scene.add(camera)


/**
 * BOIDS
 */

// const boidController= new BoidController(300,sizes,scene,debug,gui,camera, matCapTexture)
const geometry = new THREE.ConeGeometry( 0.027, 0.132,3 ); 
geometry.rotateX(-Math.PI * 0.5);
const material = new THREE.MeshBasicMaterial({wireframe:true});
const boidMesh= new THREE.Mesh(geometry,material)
scene.add(boidMesh)
/**
 * fib sphere
 */
debug.rayPoints= 500
debug.rayCutoff=0.5

let raySpherePointPositions=RAYS.fibonacci_sphere(debug.rayPoints)

let raySphereColors=RAYS.fibonacci_colours(debug.rayPoints, debug.rayCutoff)
// console.log(raySpherePointPositions)

//set up geometry
const pointsGeometry= new THREE.BufferGeometry()
pointsGeometry.setAttribute('position',new THREE.BufferAttribute(raySpherePointPositions,3))
pointsGeometry.setAttribute('color',new THREE.BufferAttribute(raySphereColors,3))

const pointsMaterial= new THREE.PointsMaterial({
    // color:'white',
    size:0.01,
    sizeAttenuation:true,
    vertexColors:true

})

const particleMesh= new THREE.Points(pointsGeometry,pointsMaterial)
scene.add(particleMesh)


//create lines
//create material





let raysVec3Array=RAYS.fibonacci_sphere_vec3(debug.rayPoints,debug.rayCutoff)

function addDebugLines(targetArr)
{
    const lineMaterial= new THREE.LineBasicMaterial({
        color: 0xff00f0,
    });
    const baseTarget= new THREE.Vector3(0,0,0)
    const lineArr=[]

    targetArr.forEach((target)=>
    {
        let lineGeometry = new THREE.BufferGeometry().setFromPoints( [baseTarget,target] );
    
    
        let line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
        lineArr.push(line)
        
    })
    return lineArr

}
// debug.lineArr = addDebugLines(raysVec3Array)

function updateDebugLines(cutoff)
{
    const arr=debug.lineArr

    for(const lineMesh of arr){
        scene.remove(lineMesh)  
        lineMesh.material.dispose()
        lineMesh.geometry.dispose()
        // console.log(line)
    }
                

                
            
        

    let temp=RAYS.fibonacci_sphere_vec3(debug.rayPoints,cutoff)

    // console.log(temp.length)
    
    debug.lineArr=addDebugLines(temp)
    // console.log(debug.lineArr)
    

}



gui.add(debug,'rayPoints').min(0).max(4000).step(10).onChange((num)=>
    {
        let raySpherePointPositions=RAYS.fibonacci_sphere(num)
        pointsGeometry.setAttribute('position',new THREE.BufferAttribute(raySpherePointPositions,3))
        let raySphereColors=RAYS.fibonacci_colours(debug.rayPoints,debug.rayCutoff)
        
        pointsGeometry.setAttribute('color',new THREE.BufferAttribute(raySphereColors,3))

        // particleBufferAttribute.needsUpdate = true;
    })
gui.add(debug,'rayCutoff').min(-1).max(1).step(0.001).onChange((cutoff)=>
    {
        
        let raySphereColors=RAYS.fibonacci_colours(debug.rayPoints,cutoff)
        
        pointsGeometry.setAttribute('color',new THREE.BufferAttribute(raySphereColors,3))
        
        // console.log(debug.lineArr)
        // updateDebugLines(cutoff)



        // particleBufferAttribute.needsUpdate = true;
    })






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


const dragControls = new DragControls( [dragMesh1,dragMesh2], camera, renderer.domElement );

/**
 * annimaiton loop
 */

const clock= new THREE.Clock()
let past=0

const tick =()=>
    {

        let elapsedTime= clock.getElapsedTime()

        // let current= ((Math.round(Math.sin(elapsedTime/100)*100)))/10
        let current= Math.round(Math.sin(elapsedTime)*100)/100
        if(current!=past){
            // console.log(current)
            // updateDebugLines(current)


        }
        past=current


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