import * as THREE from 'three'


export default  class OctreeNode
{
    //three.box node bounds
    //int min start
    constructor(box, minNodeSize,scene,depth)
    {
        this.scene=scene
        this.depth=depth||1
        // console.log(this.scene)

        this.nodeBounds= box
        this.minSize = minNodeSize

        this.nodeSize =  new THREE.Vector3()
        this.nodeBounds.getSize(this.nodeSize)


        this.childBounds=[]
        this.setUpChildNodes()

        this.children=null//node array
        
        // new THREE.Vector3()

    }

    setUpChildNodes()
    {
        

        const quarter = this.nodeSize.y/4
        // console.log(this.nodeSize.y)
        const childLength= this.nodeSize.y/ 2
        const childSize=new THREE.Vector3(childLength,childLength,childLength)

        const center= new THREE.Vector3()
        this.nodeBounds.getCenter(center)

        this.childBounds[0]=new THREE.Box3().setFromCenterAndSize(
            center
            .clone()
            .add( new THREE.Vector3(-quarter,quarter,-quarter))
            ,childSize
        )
        // console.log('--------------------------------------------')

        // console.log("new bounds")
        // console.log(this.childBounds[0].min)
        // console.log(this.childBounds[0].max)
        // console.log("new bounds setup")
        // console.log(center.clone().add( new THREE.Vector3(-quarter,quarter,-quarter)))
        // console.log(childSize)
        // console.log('...')

        this.childBounds[1]=new THREE.Box3().setFromCenterAndSize(
            center
            .clone()
            .add( new THREE.Vector3(quarter,quarter,-quarter))
            ,childSize
        )
        

        // console.log("new bounds")
        // console.log(this.childBounds[0].min)
        // console.log(this.childBounds[0].max)
        // console.log("new bounds setup")
        // console.log(center.clone().add( new THREE.Vector3(-quarter,quarter,-quarter)))
        // console.log(childSize)
        // console.log('...')
       

        // console.log(quarter)

        this.childBounds[2]=new THREE.Box3().setFromCenterAndSize(
            center
            .clone()
            .add( new THREE.Vector3(-quarter,quarter,quarter))
            ,childSize
        )
       

        // console.log("new bounds")
        // console.log(this.childBounds[0].min)
        // console.log(this.childBounds[0].max)
        // console.log("new bounds setup")
        // console.log(center.clone().add( new THREE.Vector3(-quarter,quarter,-quarter)))
        // console.log(childSize)
        // console.log('--------------------------------------------')
        // console.log(quarter)

        this.childBounds[3]=new THREE.Box3().setFromCenterAndSize(
            center
            .clone()
            .add( new THREE.Vector3(quarter,quarter,quarter))
            ,childSize
        )
        // console.log(quarter)

        this.childBounds[4]=new THREE.Box3().setFromCenterAndSize(
            center
            .clone()
            .add( new THREE.Vector3(-quarter,-quarter,-quarter))
            ,childSize
        )
        // console.log(quarter)

        this.childBounds[5]=new THREE.Box3().setFromCenterAndSize(
            center
            .clone()
            .add( new THREE.Vector3(quarter,-quarter,-quarter))
            ,childSize
        )
        // console.log(quarter)

        this.childBounds[6]=new THREE.Box3().setFromCenterAndSize(
            center
            .clone()
            .add( new THREE.Vector3(-quarter,-quarter,quarter))
            ,childSize
        )
        // console.log(quarter)

        this.childBounds[7]=new THREE.Box3().setFromCenterAndSize(
            center
            .clone()
            .add( new THREE.Vector3(quarter,-quarter,quarter))
            ,childSize
        )
        // console.log(quarter)
        // console.log("-------------------------------")

            
    }

    // createChild(quaterVector3,childSize)
    // {
    //     const quarter = this.nodeSize.y/4
    //     console.log(this.nodeSize.y)
    //     const childLength= this.nodeSize.y/ 2
    //     const childSize=new THREE.Vector3(childLength,childLength,childLength)

    //     const center= new THREE.Vector3()
    //     this.nodeBounds.getCenter(center)


    //     this.childBounds[4]=new THREE.Box3(
    //         center
    //         .clone()
    //         .add( new THREE.Vector3(-quarter,-quarter,-quarter))
    //         ,childSize
    //     )
    // }

    addObject(worldObj)
    {
        this.divideAndAdd(worldObj)
    }

    divideAndAdd(worldObj)
    {
        if(this.nodeSize.y<=this.minSize)
            {
                // console.log('returning')
                return;
            }
        //     console.log('sizes-----------------------------')
        // console.log(this.nodeSize.y)
        // console.log(this.minSize)
        // console.log('sizes-----------------------------')

        if(this.children==null)
            {
                this.children=[]
                // this.children=new OctreeNode[8]
            }
        let dividing=false
        for(let i=0;i<8;i++)
            {
                if(this.children[i] == null)
                    {
                        
                        this.children[i]= new OctreeNode(this.childBounds[i],this.minSize,this.scene,this.depth+1)
                        // console.log('creating new child')
                        // console.log(this.children[i])
                    }
                // console.log(this.children[i])
                // console.log(new THREE.Box3().setFromObject(worldObj))
                //NOTE: changed this section form the tutorial
                if(this.children[i].nodeBounds.intersectsBox(new THREE.Box3().setFromObject(worldObj)))
                    {
                        // console.log(this.children[i].nodeBounds.min)
                        // console.log(this.children[i].nodeBounds.max)
                        // console.log((new THREE.Box3().setFromObject(worldObj)).min)
                        // console.log((new THREE.Box3().setFromObject(worldObj)).max)
                        dividing=true
                        // console.log('dividing')/

                        this.children[i].divideAndAdd(worldObj)

                    }
            }
        if(dividing==false)
        {
            console.log('children were false')
            this.children=null
            console.log(this)
            
        }
    }

    draw(scene)
    {
        // const vec3= new THREE.Vector3()
        // this.nodeBounds.getSize(vec3)
        // const geometry = new THREE.BoxGeometry()
        // const material = new THREE.MeshBasicMaterial({wireframe:true,color:"red"})
        // const mesh= new THREE.Mesh(geometry,material)
        // this.nodeBounds.getCenter(vec3)
        // mesh.position.copy(vec3)
        // return mesh
        // console.log('drawing')
        const temp=[]
        if(this.children!=null)
            {
                for(let i=0;i<8;i++)
                    {
                        if(this.children[i] !=null)
                            {
                                // console.log('draw the node')
                                // console.log(this.children[i])

                                const helper = new THREE.Box3Helper( this.nodeBounds, 'red' )
                                scene.add(helper)
                                // temp.push(helper)
                            }
                    }
            }
        
        
        
        return temp

        
    }
    debugDraw(box)
    {
        const helper = new THREE.Box3Helper( box, 'red' )
        this.scene.add(helper)
    }
}