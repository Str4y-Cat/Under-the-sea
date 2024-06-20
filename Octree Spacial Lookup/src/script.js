import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import CreateOctree from './octree/createOctree'
import { FlyControls } from 'three/addons/controls/FlyControls.js';


/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })

// #region three.js basic setup
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
scene.fog = new THREE.Fog( scene.background, 1, 5000 );


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(7, 5, 7)
camera.lookAt(new THREE.Vector3(0,0,0))
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// const controls= new FlyControls(camera,canvas)

const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 2 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 50, 0 );
scene.add( hemiLight );


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // logarithmicDepthBuffer: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// #endregion


//add objects around scene

const geom= new THREE.BoxGeometry(1,1,1)
geom.computeBoundingBox()
const material= new THREE.MeshPhongMaterial()
const worldObjects=[]
for(let i = 0; i<2; i++)
    {
        
        const mesh= new THREE.Mesh(geom,material)
        mesh.scale.set(Math.random()+0.3,Math.random()+0.3,Math.random()+0.3)
        mesh.position.set((Math.random()-0.5)*2*10,(Math.random()-0.5)*2*10,(Math.random()-0.5)*2*10)
        mesh.rotation.set((Math.random()-0.5)*2*Math.PI,(Math.random()-0.5)*2*Math.PI,(Math.random()-0.5)*2*Math.PI)
        worldObjects.push(mesh)
        
        
        scene.add(mesh)
    }


//#region octree 

const octreeClass=new CreateOctree(worldObjects,1,scene)
console.log(octreeClass.octree)



const geometry= new THREE.SphereGeometry(1)
geometry.computeBoundingBox()
const travelerMesh= new THREE.Mesh(geometry,material)
travelerMesh.position.set((Math.random()-0.5)*2*10,(Math.random()-0.5)*2*10,(Math.random()-0.5)*2*10)

scene.add(travelerMesh)
console.log(octreeClass.octree.findObj(travelerMesh,scene))
// const debug=
// {
//     depth:0,
//     draw:false
// }
// gui.add(debug,'depth').min(0).max(10).step(1).onChange(()=>{octree.update()})
// gui.add(debug,'draw')
// if(octree.drawMeshes.length)
// {
//     console.log(octree.drawMeshes)
    
// }

//#endregion




/**
 * Animate
 */
const clock = new THREE.Clock()
let past=0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const delta = clock.getDelta()

    //animate water
    
    let slowTick= Math.round(elapsedTime)
        if(slowTick!=past){
            
            // if(debug.draw==true)
            //     {
            //         // octree.update()
            //     }
        }
        past=slowTick


    // Update controls
    controls.update()
    // controls.update ( delta) 

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()