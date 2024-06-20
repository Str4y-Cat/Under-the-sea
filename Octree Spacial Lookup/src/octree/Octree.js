import * as THREE from 'three'
import OctreeNode from "./OctreeNode";

export default class Octree
{
    constructor(worldObjects,minNodeSize,scene)
    {
        this.scene=scene
        console.log(this.scene)
        //create a new box
        const bounds = new THREE.Box3() 

        //loop through all meshes and grow the box to encapsulate all
        worldObjects.forEach(mesh => {

            //grow the bounds
            bounds.expandByObject(mesh)

        });

        //copy the size of the bounds
        const size= new THREE.Vector3()
        bounds.getSize(size)

        //find the max axis value of the size vector
        const maxSize= Math.max(...[size.x,size.y,size.z])
        // console.log(`maxSize: ${maxSize}`) //works!

        //new box size
        const sizeVector= new THREE.Vector3(maxSize,maxSize,maxSize)
        //box starts from center, multiply by 0.5 to account for extra length
        sizeVector.multiplyScalar(0.5)
        // console.log(sizeVector)
        
        //get the center of the box
        const boundsCenter=new THREE.Vector3()
        bounds.getCenter(boundsCenter)


        // const minBoundsCenter=new THREE.Vector3()
        // minBoundsCenter.copy(boundsCenter)

        // console.log(sizeVector)
        // console.log(boundsCenter)
        // console.log(bounds)


        bounds.set(boundsCenter.clone().sub(sizeVector),boundsCenter.add(sizeVector))
        // console.log(bounds.min)
        // console.log(bounds.max)



        this.rootNode= new OctreeNode(bounds,minNodeSize,this.scene)
        this.addObjects(worldObjects)
    }

    addObjects(worldObjects)
    {
        worldObjects.forEach(obj => {
            this.rootNode.addObject(obj)
        });
    }

    debugDraw(box)
    {
        const helper = new THREE.Box3Helper( box, 'red' )
        this.scene.add(helper)
    }

}