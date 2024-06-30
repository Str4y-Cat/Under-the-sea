import FlightController from './Player Controller/Flight Controller.js'
import CameraController from './Player Controller/cameraController.js';


export default class PlayerController
{
    constructor(player,camera)
    {   
        this.experience=null
        this.player=player
        this.camera= camera

        this.scene= this.experience.scene

        this.playerControls= new FlightController(player,this.scene)
        this.cameraControls= new CameraController(camera)

    }

    update()
    {
        // const delta= ...
        this.playerControls.updateQ(delta)
        this.cameraControls.Update(delta,this.playerControls,this.player)
    }

}