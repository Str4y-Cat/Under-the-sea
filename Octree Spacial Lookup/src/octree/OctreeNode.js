import * as THREE from 'three'


export default  class OctreeNode
{
    //three.box node bounds
    //int min start
    constructor(box, minNodeSize)
    {
        this.nodeBounds= box
        this.minSize = minNodeSize

    }

    draw()
    {
        // const vec3= new THREE.Vector3()
        // this.nodeBounds.getSize(vec3)
        // const geometry = new THREE.BoxGeometry()
        // const material = new THREE.MeshBasicMaterial({wireframe:true,color:"red"})
        // const mesh= new THREE.Mesh(geometry,material)
        // this.nodeBounds.getCenter(vec3)
        // mesh.position.copy(vec3)
        // return mesh

        const helper = new THREE.Box3Helper( this.nodeBounds, 'red' )
        return helper

        
    }
}