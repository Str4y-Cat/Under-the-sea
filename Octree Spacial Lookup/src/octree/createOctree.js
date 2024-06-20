import Octree from "./Octree"
import * as THREE from 'three'


export default class CreateOctree
{
    constructor(worldObjects,minNodeSize,scene)
    {
        this.worldObjects=worldObjects
        this.minNodeSize= minNodeSize||5
        this.octree= new Octree(this.worldObjects,this.minNodeSize,scene)
        this.drawMeshes=[]
        this.drawDepth=0
        this.scene=scene
        // this.onDraw(scene)
        
    }

    
    update()
    {
        

        this.draw(this.octree.rootNode,this.scene)
        this.drawDepth+=1
    }


    onDraw(scene)
    {
        // console.log(this.octree.rootNode.draw())
        
        // this.drawMeshes.push(this.octree.rootNode.draw(scene)) 
        const helper = new THREE.Box3Helper( this.octree.rootNode.nodeBounds, 'green' )
        this.octree.rootNode.childBounds.forEach((child,i )=> {
            let color
            switch(i)
            {
                case 0:
                    color='#ff0000' 
                    break;

                case 1:
                    color='#ff008f' 
                    break;

                case 2:
                    color='#dc00ff' 
                    break;

                case 3:
                    color='#0013ff' 
                    break;

                case 4:
                    color='#00f7ff' 
                    break;
                case 5:
                    color='#00ff17' 
                    break;
                case 6:
                    color='#fbff00' 
                    break;
                case 7:
                    color='#ff7c00' 
                    break;
                default:
                    color='black'

            }
            if(i==4){
                const helper = new THREE.Box3Helper( child, color )
                scene.add(helper)
            }
            
        });
        scene.add(helper)
    }

    draw(node,scene,colorLerp){
        colorLerp=(colorLerp)?colorLerp:0.0
        if(colorLerp==0){colorLerp=0}

        const color1= new THREE.Color('white')
        const color2= new THREE.Color('red')
        const color3= new THREE.Color().copy(color1)
        color3.lerp(color2,(colorLerp)**2)


        this.drawChildBounds(node,scene,color3)
        

        if(node.children)
            {
                node.children.forEach(child=>
                    {
                        this.draw(child,scene,colorLerp+0.4)
                    }
                )
            }
        // if
    }

    drawChildBounds(node,scene,color)
    {

        if(node.children&&node.depth==this.drawDepth)
            {   
                // console.log(node)
                const center= new THREE.Vector3()
                const scale= new THREE.Vector3()

                node.nodeBounds.getCenter(center)
                node.nodeBounds.getSize(scale)
                scale.multiplyScalar(0.999)

                const box=new THREE.Box3().setFromCenterAndSize(center,scale)
                const helper = new THREE.Box3Helper( box, color)
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
