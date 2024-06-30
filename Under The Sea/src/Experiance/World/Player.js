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
        this.resources= this.experience.resources
        this.debug= this.experience.debug
        this.perform= this.experience.Perform
        this.start=0
        this.prevTime= Date.now()

        this.setPlayerMaterial()
        this.setPlayerGeometry()
        this.setMesh()
        this.setController()

        
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
        this.scene.add(this.mesh)
    }

    setController()
    {
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


    }




}