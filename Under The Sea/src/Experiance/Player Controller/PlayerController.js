import FlightController from './Flight Controller.js'
import CameraController from './cameraController.js';
import Experience from "../Experiance";



export default class PlayerController
{
    constructor(player)
    {   
        this.experience=new Experience()
        this.scene= this.experience.scene
        this.camera=this.experience.camera.instance
        this.player=player
        

        this.playerControls= new FlightController(player,this.scene)
        this.cameraControls= new CameraController(this.camera)

    }

    update(delta)
    {
        // const delta= ...
        this.playerControls.updateQ(delta)
        // console.log(delta)
        this.cameraControls.Update(delta,this.playerControls,this.player)
    }

}