import * as THREE from 'three'
import GUI from 'lil-gui'
import Boids from './Boids'

export default class DrawBoids
{
    constructor(three)
    {
      this.setVariables()
      
      this.boids= new Boids(three,this.boidVariables)
    }

    setVariables()
    {
      this.boidVariables={}
      this.boidVariables.boundingBox= new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(0,0,0),new THREE.Vector3(5,5,5))
    
    }

    //[ ] Set up the model
    //COMMENT: how do we make an array of models without chowing memory? look into instanced mesh
    //COMMENT: add a bit of randomization to each mesh preferably

    //[ ] Update. Update the array of meshes according to the supplied position texture

    update()
    {
      this.boids.update()
    }



}