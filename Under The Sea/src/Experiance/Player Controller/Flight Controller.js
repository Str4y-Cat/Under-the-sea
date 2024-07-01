
import * as THREE from 'three'
import {math} from './math'



export default class FirstPersonControls {

	constructor( object, domElement ) {

		this.object = object;
		this.domElement = domElement;

        this.decceleration_ = new THREE.Vector3(-0.0005, -0.0001, -1);
        this.acceleration_ = new THREE.Vector3(100, 0.5, 25000);
        this.velocity_ = new THREE.Vector3(0, 0, 0);

        this.Attributes={}
        this.Attributes.InputCurrent = {
            axis1Forward: 0.0,
            axis1Side: 0.0,
            axis2Forward: 0.0,
            axis2Side: 0.0,
            pageUp: false,
            pageDown: false,
            space: false,
            shift: false,
            backspace: false,
          };
        this.Attributes.InputPrevious = {...this.Attributes.InputCurrent};
        // console.log(this.Attributes)

        this.normalizeZ=false
        // this.inverse=new THREE.Quaternion()



		this.onKeyDown = function ( event ) {

			// switch ( event.code ) {

			// 	case 'ArrowUp':
			// 	case 'KeyW': this.moveForward = true; break;

			// 	case 'ArrowLeft':
			// 	case 'KeyA': this.moveLeft = true; break;

			// 	case 'ArrowDown':
			// 	case 'KeyS': this.moveBackward = true; break;

			// 	case 'ArrowRight':
			// 	case 'KeyD': this.moveRight = true; break;

			// 	case 'KeyR': this.moveUp = true; break;
			// 	case 'KeyF': this.moveDown = true; break;

			// }

            switch (event.keyCode) {
                case 87: // w
                  this.Attributes.InputCurrent.axis1Forward = -1.0;
                  break;
                case 65: // a
                  this.Attributes.InputCurrent.axis1Side = -1.0;
                  break;
                case 83: // s
                  this.Attributes.InputCurrent.axis1Forward = 1.0;
                  break;
                case 68: // d
                  this.Attributes.InputCurrent.axis1Side = 1.0;
                  break;
                case 33: // PG_UP
                  this.Attributes.InputCurrent.pageUp = true;
                  break;
                case 34: // PG_DOWN
                  this.Attributes.InputCurrent.pageDown = true;
                  break;
                case 32: // SPACE
                  this.Attributes.InputCurrent.space = true;
                  break;
                case 16: // SHIFT
                  this.Attributes.InputCurrent.shift = true;
                  break;
                case 8: // BACKSPACE
                  this.Attributes.InputCurrent.backspace = true;
                  break;
              }

		};

		this.onKeyUp = function ( event ) {

			// switch ( event.code ) {

			// 	case 'ArrowUp':
			// 	case 'KeyW': this.moveForward = false; break;

			// 	case 'ArrowLeft':
			// 	case 'KeyA': this.moveLeft = false; break;

			// 	case 'ArrowDown':
			// 	case 'KeyS': this.moveBackward = false; break;

			// 	case 'ArrowRight':
			// 	case 'KeyD': this.moveRight = false; break;

			// 	case 'KeyR': this.moveUp = false; break;
			// 	case 'KeyF': this.moveDown = false; break;

			// }

            switch(event.keyCode) {
                case 87: // w
                  this.Attributes.InputCurrent.axis1Forward = 0.0;
                  break;
                case 65: // a
                  this.Attributes.InputCurrent.axis1Side = 0.0;
                  break;
                case 83: // s
                  this.Attributes.InputCurrent.axis1Forward = 0.0;
                  break;
                case 68: // d
                  this.Attributes.InputCurrent.axis1Side = 0.0;
                  break;
                case 33: // PG_UP
                  this.Attributes.InputCurrent.pageUp = false;
                  break;
                case 34: // PG_DOWN
                  this.Attributes.InputCurrent.pageDown = false;
                  break;
                case 32: // SPACE
                  this.Attributes.InputCurrent.space = false;
                  break;
                case 16: // SHIFT
                  this.Attributes.InputCurrent.shift = false;
                  break;
                case 8: // BACKSPACE
                  this.Attributes.InputCurrent.backspace = false;
                  break;
              }

		};


        this.updateQ = function (timeInSeconds){
          this.normalizeZ=false
            // if (this.dead_) {
            //     return;
            //   }
                // console.log(this)
        
              const input = this.Attributes.InputCurrent;
            //   console.log(this.Attributes.InputCurrent)
              

              if (!input) {
                return;
              }
        
              const velocity = this.velocity_;
              const frameDecceleration = new THREE.Vector3(
                  velocity.x * this.decceleration_.x,
                  velocity.y * this.decceleration_.y,
                  velocity.z * this.decceleration_.z
              );
              
              frameDecceleration.multiplyScalar(timeInSeconds);
        
              velocity.add(frameDecceleration);
            //   velocity.z = -math.clamp(Math.abs(velocity.z), 2, 2);
            if(input.space){
              velocity.z = -math.clamp(Math.abs(velocity.z), 3, 3);

            }
            else{
                velocity.z = -math.clamp(0,0,0);     
            }
          
            //   console.log(object)
              const _PARENT_Q = this.object.quaternion.clone();
              const _PARENT_P = this.object.position.clone();
        
              const _Q = new THREE.Quaternion();
              const _A = new THREE.Vector3();
              const _R = _PARENT_Q.clone();
          
              const acc = this.acceleration_.clone();
              if (input.shift) {
                acc.multiplyScalar(2.0);
                velocity.multiplyScalar(2.0);
              }
          
              if (input.axis1Forward) {
                _A.set(1, 0, 0);
                _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * acc.y * input.axis1Forward);
                _R.multiply(_Q);
              }
              if (input.axis1Side) {
                _A.set(0, 1, 0);
                _Q.setFromAxisAngle(_A, -Math.PI * timeInSeconds * acc.y * input.axis1Side);
                _R.multiply(_Q);
              }
              let inverse
              if(!input.axis1Forward&&!input.axis1Side)
                {
                  // console.log('true')
                  // console.log(object.quaternion.w)
                  // inverse= new THREE.Quaternion(0,0,object.quaternion.z,object.quaternion.w).invert()
                  this.normalizeZ=true
                }
              // if (input.axis2Side) {
              //   _A.set(0, 0, -1);
              //   _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * acc.y * input.axis2Side);
              //   _R.multiply(_Q);
              // }
          
              const forward = new THREE.Vector3(0, 0, 1);
              forward.applyQuaternion(_PARENT_Q);
              forward.normalize();
            //   console.log(forward)
          
              const updown = new THREE.Vector3(0, 1, 0);
              updown.applyQuaternion(_PARENT_Q);
              updown.normalize();
            //   console.log(updown)

        
              const sideways = new THREE.Vector3(1, 0, 0);
              sideways.applyQuaternion(_PARENT_Q);
              sideways.normalize();
            //   console.log(sideways)

          
              sideways.multiplyScalar(velocity.x * timeInSeconds);
              updown.multiplyScalar(velocity.y * timeInSeconds);
              forward.multiplyScalar(velocity.z * timeInSeconds);



            //   console.log(sideways)
            //   console.log(updown)
            //   console.log(forward)

          
              const pos = _PARENT_P;
            //   console.log(pos)

              pos.add(forward);
            //   console.log(forward)

            //   console.log(pos)

              pos.add(sideways);
            //   console.log(sideways)

            //   console.log(pos)

              pos.add(updown);
            //   console.log(updown)

            //   console.log(pos)
              
              this.object.position.copy(pos);
              // const euler=new THREE.Euler().setFromQuaternion(_R)
              // const test= new THREE.Quaternion()
              // _R.z=0
              // this.object.quaternion.copy(finalQ);
              this.velocityMain=velocity.z * timeInSeconds

              if(this.normalizeZ&&this.object.quaternion.z!=0)
                {
                this.velocityMain=0
                  
                  const newQ=new THREE.Quaternion(this.object.quaternion.x,this.object.quaternion.y,0,this.object.quaternion.w)
                  _R.rotateTowards ( newQ, 0.01 )
                }
              this.object.quaternion.copy(_R);
              // const test= new THREE.Vector3().copy(this.object.position)
              // test.y+=2
              // console.log(_R)
              // console.log(test)
              // this.object.lookAt(test)
            //   this.object.rotation.z=0
              this.updateAttributes()
              // this.object.position.copy(pos);
              return 
            //   console.log(this.object.position)
              // console.log(this.object.quaternion)
              
        };

        // this.updateE = function (timeInSeconds){
        //     // if (this.dead_) {
        //     //     return;
        //     //   }
        //         // console.log(this)
        
        //       const input = this.Attributes.InputCurrent;
        //     //   console.log(this.Attributes.InputCurrent)
              

        //       if (!input) {
        //         return;
        //       }
        
        //       const velocity = this.velocity_;
        //       const frameDecceleration = new THREE.Vector3(
        //           velocity.x * this.decceleration_.x,
        //           velocity.y * this.decceleration_.y,
        //           velocity.z * this.decceleration_.z
        //       );
              
        //       frameDecceleration.multiplyScalar(timeInSeconds);
        
        //       velocity.add(frameDecceleration);
        //     //   velocity.z = -math.clamp(Math.abs(velocity.z), 2, 2);
        //     if(input.space){
        //       velocity.z = -math.clamp(Math.abs(velocity.z), 2, 2);

        //     }
        //     else{
        //         velocity.z = -math.clamp(0,0,0);     
        //     }
          
        //     //   console.log(object)
        //       const _PARENT_Q = this.object.rotation.clone();
        //       const _PARENT_P = this.object.rotation.clone();
        
        //       const _Q = new THREE.Euler();
        //       const _A = new THREE.Vector3();
        //       const _R = _PARENT_Q.clone();
          
        //       const acc = this.acceleration_.clone();
        //       if (input.shift) {
        //         acc.multiplyScalar(2.0);
        //         velocity.multiplyScalar(2.0);
        //       }
          
        //       if (input.axis1Forward) {
                
        //         _Q.set(timeInSeconds * acc.y * input.axis1Forward,1,1,"XYZ");
        //         _R.applyEuler(_Q);
        //       }
        //       if (input.axis1Side) {
        //         // _A.set(0, 1, 0);
        //         _Q.set(1,timeInSeconds * acc.y * input.axis1Forward,1,"XYZ");
        //         _R.applyEuler(_Q);
        //       }
        //     //   if (input.axis2Side) {
        //     //     _A.set(0, 0, -1);
        //     //     _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * acc.y * input.axis2Side);
        //     //     _R.multiply(_Q);
        //     //   }
          
        //       const forward = new THREE.Vector3(0, 0, 1);
        //       forward.applyEuler(_PARENT_Q);
        //       forward.normalize();
        //     //   console.log(forward)
          
        //       const updown = new THREE.Vector3(0, 1, 0);
        //       updown.applyEuler(_PARENT_Q);
        //       updown.normalize();
        //     //   console.log(updown)

        
        //       const sideways = new THREE.Vector3(1, 0, 0);
        //       sideways.applyEuler(_PARENT_Q);
        //       sideways.normalize();
        //     //   console.log(sideways)

          
        //       sideways.multiplyScalar(velocity.x * timeInSeconds);
        //       updown.multiplyScalar(velocity.y * timeInSeconds);
        //       forward.multiplyScalar(velocity.z * timeInSeconds);
        //     //   console.log(sideways)
        //     //   console.log(updown)
        //     //   console.log(forward)

          
        //       const pos = _PARENT_P;
        //     //   console.log(pos)

        //       pos.add(forward);
        //     //   console.log(forward)

        //     //   console.log(pos)

        //       pos.add(sideways);
        //     //   console.log(sideways)

        //     //   console.log(pos)

        //       pos.add(updown);
        //     //   console.log(updown)

        //     //   console.log(pos)
              
        //       // this.object.position.copy(pos);
        //       if(this.normalizeZ)
        //         {
                  
        //           _R.multiply(this.inverse)
        //         }
        //       this.object.quaternion.copy(_R);
        //     //   this.object.rotation.z=0
        //       this.updateAttributes()
              
        //     //   console.log(this.object.position)
        //       console.log(this.object.quaternion)
              
        // };

        this.updateAttributes=function ()
        {
            this.Attributes.InputPrevious = {...this.Attributes.InputCurrent};
        }

		const _onKeyDown = this.onKeyDown.bind( this );
		const _onKeyUp = this.onKeyUp.bind( this );

		window.addEventListener( 'keydown', _onKeyDown );
		window.addEventListener( 'keyup', _onKeyUp );

	}

}

