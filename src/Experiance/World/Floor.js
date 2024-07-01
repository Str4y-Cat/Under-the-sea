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

        // console.log('wah')
    }

    setGeometry()
    {
        this.geometry= new THREE.PlaneGeometry(60,60,64,64)
    }

    setTextures()
    {
        this.textures={}

        this.textures.color=this.resources.items.sandColorTexture
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.color.repeat.set(1.5, 1.5)
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping
        
        this.textures.normal=this.resources.items.sandNormalTexture
        this.textures.normal.repeat.set(1.5, 1.5)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping

        this.textures.ao=this.resources.items.sandAOTexture
        this.textures.ao.repeat.set(1.5, 1.5)
        this.textures.ao.wrapS = THREE.RepeatWrapping
        this.textures.ao.wrapT = THREE.RepeatWrapping

        this.textures.displacement=this.resources.items.sandDisplacementTexture
        this.textures.displacement.repeat.set(1.5, 1.5)
        this.textures.displacement.wrapS = THREE.RepeatWrapping
        this.textures.displacement.wrapT = THREE.RepeatWrapping




    }

    setMaterial()
    {
        this.material= new THREE.MeshStandardMaterial({
            map:this.textures.color,
            normalMap: this.textures.normal,
            aoMap:this.textures.ao,
            displacementMap:this.textures.displacement,
            
        })
        
    }

    setMesh()
    {
        this.mesh=new THREE.Mesh(this.geometry,this.material)
        this.mesh.rotation.x=-Math.PI *0.5
        this.mesh.position.y=-4
        // this.mesh.recieveShadow=true
        // console.log(this.mesh)
        // console.log(this.mesh.recieveShadow)

        this.scene.add(this.mesh)
    }

}