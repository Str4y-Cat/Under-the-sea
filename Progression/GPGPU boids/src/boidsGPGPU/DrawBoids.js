import * as THREE from 'three'
import GUI from 'lil-gui'
import Boids from './Boids'

export default class DrawBoids
{
    constructor(three)
    {
      this.setVariables()
      this.three=three
      this.boidArray=[]
      this.boids= new Boids(three,this.boidVariables)
      this.setUpModels()

      console.log()
    }

    setVariables()
    {
      this.boidVariables={}
      this.boidVariables.boundingBox= new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(0,0,0),new THREE.Vector3(5,5,5))
      this.boidVariables.count=100
    }

    //[ ] Set up the model
    //COMMENT: how do we make an array of models without chowing memory? look into instanced mesh
    //COMMENT: add a bit of randomization to each mesh preferably

    //[ ] Update. Update the array of meshes according to the supplied position texture
    setUpModels()
    {
      const geometry= new THREE.ConeGeometry(0.2,0.5,3)
      const material= new THREE.MeshBasicMaterial({color:'red'})

      for(let i=0; i<this.boidVariables.count; i++)
        {
          const i3=i*3
          const mesh= new THREE.Mesh(geometry,material)
          mesh.position.set(
            this.boids.currentPositions.image.data[i3+0],
            this.boids.currentPositions.image.data[i3+1],
            this.boids.currentPositions.image.data[i3+2]
          )
          this.three.scene.add(mesh)
          this.boidArray.push(mesh)
        }
    }

    updateObjects()
    {
      // console.log('draw BOids')
      // console.log(this.boids.gpgpu.computation.getCurrentRenderTarget(this.boids.gpgpu.positionsVariable).texture)
      // for(let i=0; i<this.boidVariables.count; i++)
        // {
          // const i3=i*3
// 
          //   this.boidArray[i].position.set(
          //   this.boids.positionMaterial.uniforms.uPositionTexture.value[i3+0],
          //   this.boids.positionMaterial.uniforms.uPositionTexture.value[i3+1],
          //   this.boids.positionMaterial.uniforms.uPositionTexture.value[i3+2]
          // )
          // if(i==0)
            // {
              // console.log(this.boids.positionMaterial.uniforms.uPositionTexture.value)
              // console.log(this.boidArray[i].position)
            // }
        // }
    }


    update(deltaTime)
    {
      this.boids.update(deltaTime)
      // this.updateObjects()

    }



}