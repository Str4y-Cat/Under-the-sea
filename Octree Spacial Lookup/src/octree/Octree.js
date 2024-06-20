import * as THREE from 'three'
import OctreeNode from "./OctreeNode";

export default class Octree
{
    constructor(worldObjects,minNodeSize)
    {

        //create a new box
        const bounds = this.setUpBounds(worldObjects)

        this.rootNode= new OctreeNode(bounds,minNodeSize)
        this.addObjects(worldObjects)
    }

    setUpBounds(worldObjects)
    {
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

        bounds.set(boundsCenter.clone().sub(sizeVector),boundsCenter.add(sizeVector))

        return bounds
    }

    addObjects(worldObjects)
    {
        worldObjects.forEach(obj => {
            this.rootNode.addObject(obj)
        });
    }

    findObj(mesh,scene)
    {
        const box= new THREE.Box3().setFromObject(mesh)
        return this.intersectsObject(this.rootNode,box,scene)

        
    }

    intersectsObject(node,box,scene)
    {
        // console.log(node)

        // if(node.isBox3)
        //check if bounding box intersects
        if(node.nodeBounds.intersectsBox(box))
            {
                if(node.children==null)
                    {
                        console.log(box)
                        console.log(node)
                        this.debugDraw(node.nodeBounds,"green",scene)
                        this.debugDraw(box,"green",scene)
                        return true
                    }
                
                for(let i =0; i<8; i++)
                    {
                        if(node.childBounds[i].intersectsBox(box))
                            {
                                return this.intersectsObject(node.children[i],box,scene)
                                // break
                            }
                    }
            }
        return false
            
    }





    debugDraw(box,color,scene)
    {
        const helper = new THREE.Box3Helper( box, color )
        scene.add(helper)
    }

}