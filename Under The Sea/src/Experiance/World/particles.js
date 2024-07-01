import WorldValues from "../WorldValues"
import Experience from "../Experiance"
import * as THREE from 'three' 

export default class particles
{
    constructor()
    {
        this.experience= new Experience()
        this.scene=this.experience.scene

        this.WIDTH= WorldValues.coralVariables.size
        this.floor= WorldValues.floorHeight
        this.roof= WorldValues.roofHeight
        this.setPoints()
        this.setMaterial()
        this.setMesh()
    }

    setPoints()
    {
        const pointArr= new Float32Array(((this.WIDTH**2)*10)*3)
        for(let i=0;i<(this.WIDTH**2)*10;i++)
            {
                const i3= i*3
                pointArr[i3]=(Math.random()-0.5)*this.WIDTH
                pointArr[i3+1]=Math.max((Math.random()-0.5)*this.WIDTH, this.floor)
                pointArr[i3+2]=(Math.random()-0.5)*this.WIDTH
            }

        this.geometry= new THREE.BufferGeometry()
        this.geometry.setAttribute('position',new THREE.BufferAttribute(pointArr,3))
    }

    setMaterial()
    {
        this.material= new THREE.PointsMaterial({
            size:0.02,
            sizeAttenuation:true
        
        })
    }

    setMesh()
    {
        this.pointMesh= new THREE.Points(this.geometry,this.material)
        this.scene.add(this.pointMesh)
    }

}