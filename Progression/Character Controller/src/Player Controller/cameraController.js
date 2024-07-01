import * as THREE from 'three'

export default class CameraController
{
    //target= player
    constructor(camera) {
        
  
        // this.params_ = params;
        // this.Attributes=params.Attributes;
        this.camera_ = camera;
  
        this.currentPosition_ = new THREE.Vector3();
        // this.SetPass(1);
      }
  
      /**
       * input = userinput this.Attributes.InputCurrent;
       * @param {*} input 
       * @returns 
       */
      _CalculateIdealOffset(input,target) {
        const idealOffset = new THREE.Vector3(0, 5, 10);
        // const input = target.Attributes.InputCurrent;
  
        if (input.axis1Side) {
          idealOffset.lerp(
              new THREE.Vector3(10 * input.axis1Side, 5, 20), Math.abs(input.axis1Side));
        }
        
        if (input.axis1Forward < 0) {
          idealOffset.lerp(
            new THREE.Vector3(0, 0, 18 * -input.axis1Forward), Math.abs(input.axis1Forward));
        }
  
        if (input.axis1Forward > 0) {
          idealOffset.lerp(
            new THREE.Vector3(0, 5, 15 * input.axis1Forward), Math.abs(input.axis1Forward));
        }
  
        idealOffset.applyQuaternion(target.quaternion);
        idealOffset.add(target.position);
  
        return idealOffset;
      }
  
      //target = player
      Update(timeElapsed,input, target) {
        const idealOffset = this._CalculateIdealOffset(input,target);
  
        const t1 = 1.0 - Math.pow(0.05, timeElapsed);
        const t2 = 1.0 - Math.pow(0.01, timeElapsed);
  
        this.currentPosition_.lerp(idealOffset, t1);
  
        this.camera_.position.copy(this.currentPosition_);
        this.camera_.quaternion.slerp(target.quaternion, t2);
      }
}