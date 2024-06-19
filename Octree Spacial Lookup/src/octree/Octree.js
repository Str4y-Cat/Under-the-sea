import * as THREE from 'three'
import OctreeNode from "./OctreeNode";

export default class Octree
{
    constructor(worldObjects,minNodeSize)
    {
        //create a new box
        const bounds = new THREE.Box3() 
        //loop through all meshes and grow the box to encapsulate all
        worldObjects.forEach(mesh => {

            bounds.expandByObject(mesh)

        });

        // console.log(bounds)
        // console.log(bounds.containsPoint(new THREE.Vector3(1,1,1)))
        // console.log(bounds.min)

        // const target= new THREE.Vector3()
        // bounds.getSize(target)
        // console.log( target)

        const size= new THREE.Vector3()
        bounds.getSize(size)

        const maxSize= Math.max(...[size.x,size.y,size.z])
        console.log(`maxSize: ${maxSize}`) //works!

        const sizeVector= new THREE.Vector3(maxSize,maxSize,maxSize)
        sizeVector.multiplyScalar(0.5)
        console.log(sizeVector)
        
        const boundsCenter=new THREE.Vector3()
        bounds.getCenter(boundsCenter)

        const minBoundsCenter=new THREE.Vector3()
        minBoundsCenter.copy(boundsCenter)

        // console.log(sizeVector)
        // console.log(boundsCenter)
        // console.log(bounds)


        bounds.set(minBoundsCenter.sub(sizeVector),boundsCenter.add(sizeVector))
        console.log(bounds.min)
        console.log(bounds.max)



        this.rootNode= new OctreeNode(bounds,minNodeSize)
    }
}