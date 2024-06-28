import * as THREE from 'three'

import Experience from "../Experiance";
import { normalMap } from 'three/examples/jsm/nodes/Nodes.js';

export default class Floor
{
    constructor()
    {
        this.experience= new Experience()
        this.scene= this.experience.scene
        this.resources= this.experience.resources

        //setUp
        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()

        console.log('wah')
    }

    setGeometry()
    {
        this.geometry= new THREE.CircleGeometry(5,64)
    }

    setTextures()
    {
        this.textures={}

        this.textures.color=this.resources.items.grassColorTexture
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.color.repeat.set(1.5, 1.5)
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping
        
        this.textures.normal=this.resources.items.grassNormalTexture
        this.textures.normal.repeat.set(1.5, 1.5)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping




    }

    setMaterial()
    {
        this.material= new THREE.MeshStandardMaterial({
            map:this.textures.color,
            normalMap: this.textures.normal
        })
    }

    setMesh()
    {
        this.mesh=new THREE.Mesh(this.geometry,this.material)
        this.mesh.rotation.x=-Math.PI *0.5
        this.mesh.recieveShadow=true
        console.log(this.mesh)
        console.log(this.mesh.recieveShadow)

        this.scene.add(this.mesh)
    }

}