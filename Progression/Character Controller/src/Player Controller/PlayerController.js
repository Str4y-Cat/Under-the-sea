import FlightController from './Player Controller/Flight Controller.js'
import CameraController from './Player Controller/cameraController.js';
import Experience from "../Experiance";



export default class PlayerController
{
    constructor(player)
    {   
        this.experience= new Experience()

        this.scene= this.experience.scene
        this.camera=this.experience.camera
        this.player=player
        // this.camera= camera

        // this.scene= this.experience.scene

        this.playerControls= new FlightController(player,this.scene)
        this.cameraControls= new CameraController(camera)

    }

    update(delta)
    {
        // const delta= ...
        this.playerControls.updateQ(delta)
        this.cameraControls.Update(delta,this.playerControls,this.player)
    }

}