import Octree from "./Octree"
import * as THREE from 'three'


export default class CreateOctree
{
    constructor(worldObjects,minNodeSize,scene)
    {
        this.worldObjects=worldObjects
        this.minNodeSize= minNodeSize||5
        this.octree= new Octree(this.worldObjects,this.minNodeSize)
        this.drawMeshes=[]
        
        this.scene=scene

        this.draw(this.octree.rootNode,scene)
        
    }


    draw(node,scene,colorLerp){
        colorLerp=(colorLerp)?colorLerp:0.0
        

        let color1= new THREE.Color('white')
        let color2= new THREE.Color('red')
        let temp=colorLerp

        // if(colorLerp>1&&colorLerp<=2){
        //      color2= new THREE.Color('red')
        //      color1= new THREE.Color('blue')
        //     temp=colorLerp/2
        //     }

        
        let color3= new THREE.Color().copy(color1)
        color3.lerp(color2,(temp))


        this.drawChildBounds(node,scene,color3)
        

        if(node.children)
            {
                node.children.forEach(child=>
                    {
                        this.draw(child,scene,colorLerp+0.2)
                    }
                )
            }
        // if
    }

    drawChildBounds(node,scene,color)
    {

        if(node.children)
            {   
                // console.log(node)
                const center= new THREE.Vector3()
                const scale= new THREE.Vector3()

                node.nodeBounds.getCenter(center)
                node.nodeBounds.getSize(scale)
                scale.multiplyScalar(0.999)

                const box=new THREE.Box3().setFromCenterAndSize(center,scale)
                let helper = new THREE.Box3Helper( box, color)
                
                if(node.bordersObject)
                    {
                        console.log('fond one')
                         helper = new THREE.Box3Helper( box, "blue")
                    }
                
                scene.add(helper)
            }
        // else{
        //     node.childBounds.forEach(child => {
        //         const helper = new THREE.Box3Helper( child, color)
        //         scene.add(helper)
        //     });
        // }

        // .lerpColors ( color1 : Color, color2 : Color, alpha : Float ) : 
        
    }
}
