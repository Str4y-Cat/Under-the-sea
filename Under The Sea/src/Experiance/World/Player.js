import * as THREE from 'three'

import Experience from "../Experiance";
import PlayerController from '../Player Controller/PlayerController';

export default class Player
{
    constructor()
    {
        this.experience= new Experience()
        this.scene= this.experience.scene
        this.camera=this.experience.camera
        this.resource= this.experience.resources.items.playerModel
        this.debug= this.experience.debug
        this.perform= this.experience.Perform
        this.start=0
        this.prevTime= Date.now()

        this.setPlayerMaterial()
        this.setPlayerGeometry()
        this.setMesh()

        this.setModel()
        // this.setPlayerModel()
        this.setController()
        this.setAnimations()

        // this.prevPosition=0;

        
        //setUp
        //create the fish

        //Debug
        if(this.debug.active)
            {
                this.debugFolder=this.debug.ui.addFolder("Player")

            }
        
    }

    setPlayerMaterial()
    {
        this.material= new THREE.MeshLambertMaterial({color:'red'})
    }

    setPlayerGeometry()
    {
        // this.geometry = new THREE.ConeGeometry( 0.2, 0.132,3 ); 
        this.geometry = new THREE.BoxGeometry( 0.2,0.2,0.2 ); 
        this.geometry.rotateX(-Math.PI * 0.5);
    }

    setMesh()
    {
        this.mesh= new THREE.Mesh(this.geometry,this.material)
        // this.scene.add(this.mesh)
    }

    setModel()
    {
        // console.log(this.resource.scene.children[0])
        this.fishModel=this.resource.scene.children[0]
        this.fishModel.scale.set(0.1,0.1,0.1)
        this.scene.add(this.fishModel)
    }

    setAnimations()
    {
        // console.log(this.resource.scene.children[0])
        this.mixer= new THREE.AnimationMixer(this.fishModel)
        const action = this.mixer.clipAction(this.resource.animations[0])
        action.play()
    }

    setController()
    {
        // console.log(this.mesh)
        this.playerController=new PlayerController(this.mesh,this.camera)

    }


    update()
    {
        const currentTime= Date.now()
        this.current=currentTime
        // this.elapsed=this.current-this.start
        this.delta=this.current-this.prevTime
        this.prevTime=this.current

        this.playerController.update(this.delta/1000)
        this.fishModel.position.copy(this.mesh.position)
        this.fishModel.rotation.copy(this.mesh.rotation)

        if(this.mixer)
            {
                // if(this.playerController.playerControls.velocityMain)
                //     {
                //         console.log(this.playerController.playerControls.velocityMain)
                //     }
                // console.log(deltaPos)
                this.mixer.update((this.delta/200)*Math.max(0.1,Math.abs(this.playerController.playerControls.velocityMain*10)))


            }
        // console.log(this.fishModel.position)


    }




}