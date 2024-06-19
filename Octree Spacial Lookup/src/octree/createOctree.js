import Octree from "./Octree"

export default class CreateOctree
{
    constructor(worldObjects,minNodeSize)
    {
        this.worldObjects=worldObjects
        this.minNodeSize= minNodeSize||5
        this.octree= new Octree(this.worldObjects,this.minNodeSize)
        this.drawMeshes=[]
        this.onDraw()
    }

    onDraw()
    {
        console.log(this.octree.rootNode.draw())
        
        this.drawMeshes.push(this.octree.rootNode.draw()) 
        console.log(this.drawMeshes)
    }
}