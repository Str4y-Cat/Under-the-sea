import * as THREE from 'three'

import Experience from "../Experiance";
import WorldValues from '../WorldValues';
import MarchingCubes from '../Marching Cubes/MarchingCubes';

export default class Coral
{
    constructor()
    {
        this.experience= new Experience()
        this.scene= this.experience.scene
        this.resources= this.experience.resources
        this.debug=this.experience.debug
        this.worldValues= WorldValues
        
        // console.log(this.debug)
        
        this.coralVariables=this.worldValues.coralVariables
        // this.coralVariables.size=40
        // this.coralVariables.rez=1
        // this.coralVariables.tileSize=10



        this.MarchingCubes= new MarchingCubes(this.coralVariables.size,this.coralVariables.rez,this.coralVariables.tileSize,this.scene,this.worldValues.floorHeight-1)
        this.environmentObjects= this.MarchingCubes.environmentObjects
        // console.log(this.environmentObjects)
        console.log(this.MarchingCubes.envBoundingBox)
        this.boundingBoxes=this.MarchingCubes.envBoundingBox
        if(this.debug.active)
            {
                this.debugFolder=this.debug.ui.addFolder("Coral")
                this.MarchingCubes.debugMain(this.scene,this.debugFolder)
            }

        // console.log('wah')
    }







    // setGeometry()
    // {
    //     this.geometry= new THREE.CircleGeometry(5,64)
    // }

    // setTextures()
    // {
    //     this.textures={}

    //     this.textures.color=this.resources.items.grassColorTexture
    //     this.textures.color.colorSpace = THREE.SRGBColorSpace
    //     this.textures.color.repeat.set(1.5, 1.5)
    //     this.textures.color.wrapS = THREE.RepeatWrapping
    //     this.textures.color.wrapT = THREE.RepeatWrapping
        
    //     this.textures.normal=this.resources.items.grassNormalTexture
    //     this.textures.normal.repeat.set(1.5, 1.5)
    //     this.textures.normal.wrapS = THREE.RepeatWrapping
    //     this.textures.normal.wrapT = THREE.RepeatWrapping




    // }

    // setMaterial()
    // {
    //     this.material= new THREE.MeshStandardMaterial({
    //         map:this.textures.color,
    //         normalMap: this.textures.normal
    //     })
    // }

    // setMesh()
    // {
    //     this.mesh=new THREE.Mesh(this.geometry,this.material)
    //     this.mesh.rotation.x=-Math.PI *0.5
    //     this.mesh.recieveShadow=true
    //     // console.log(this.mesh)
    //     // console.log(this.mesh.recieveShadow)

    //     this.scene.add(this.mesh)
    // }

}