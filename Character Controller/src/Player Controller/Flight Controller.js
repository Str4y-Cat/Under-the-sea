import {
	MathUtils,
	Spherical,
	Vector3
} from 'three';

import * as THREE from 'three'
import {math} from './math'

const _lookDirection = new Vector3();
const _spherical = new Spherical();
const _target = new Vector3();

export default class FirstPersonControls {

	constructor( object, domElement ) {

		this.object = object;
		this.domElement = domElement;

        this.decceleration_ = new Vector3(-0.0005, -0.0001, -1);
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
        console.log(this.Attributes)

		// API

		this.enabled = true;

		this.movementSpeed = 1.0;
		this.lookSpeed = 0.005;

		this.lookVertical = true;
		this.autoForward = false;

		this.activeLook = false;

		this.heightSpeed = false;
		this.heightCoef = 1.0;
		this.heightMin = 0.0;
		this.heightMax = 1.0;

		this.constrainVertical = false;
		this.verticalMin = 0;
		this.verticalMax = Math.PI;

		this.mouseDragOn = false;

		// internals

		this.autoSpeedFactor = 0.0;

		this.pointerX = 0;
		this.pointerY = 0;

		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;

		this.viewHalfX = 0;
		this.viewHalfY = 0;

       






		// private variables

		let lat = 0;
		let lon = 0;

		//

		this.handleResize = function () {

			if ( this.domElement === document ) {

				this.viewHalfX = window.innerWidth / 2;
				this.viewHalfY = window.innerHeight / 2;

			} else {

				this.viewHalfX = this.domElement.offsetWidth / 2;
				this.viewHalfY = this.domElement.offsetHeight / 2;

			}

		};

		this.onPointerDown = function ( event ) {

			if ( this.domElement !== document ) {

				this.domElement.focus();

			}

			if ( this.activeLook ) {

				switch ( event.button ) {

					case 0: this.moveForward = true; break;
					case 2: this.moveBackward = true; break;

				}

			}

			this.mouseDragOn = true;

		};

		this.onPointerUp = function ( event ) {

			if ( this.activeLook ) {

				switch ( event.button ) {

					case 0: this.moveForward = false; break;
					case 2: this.moveBackward = false; break;

				}

			}

			this.mouseDragOn = false;

		};

		this.onPointerMove = function ( event ) {

			if ( this.domElement === document ) {

				this.pointerX = event.pageX - this.viewHalfX;
				this.pointerY = event.pageY - this.viewHalfY;

			} else {

				this.pointerX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
				this.pointerY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

			}

		};

		this.onKeyDown = function ( event ) {

			switch ( event.code ) {

				case 'ArrowUp':
				case 'KeyW': this.moveForward = true; break;

				case 'ArrowLeft':
				case 'KeyA': this.moveLeft = true; break;

				case 'ArrowDown':
				case 'KeyS': this.moveBackward = true; break;

				case 'ArrowRight':
				case 'KeyD': this.moveRight = true; break;

				case 'KeyR': this.moveUp = true; break;
				case 'KeyF': this.moveDown = true; break;

			}

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

			switch ( event.code ) {

				case 'ArrowUp':
				case 'KeyW': this.moveForward = false; break;

				case 'ArrowLeft':
				case 'KeyA': this.moveLeft = false; break;

				case 'ArrowDown':
				case 'KeyS': this.moveBackward = false; break;

				case 'ArrowRight':
				case 'KeyD': this.moveRight = false; break;

				case 'KeyR': this.moveUp = false; break;
				case 'KeyF': this.moveDown = false; break;

			}

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

		this.lookAt = function ( x, y, z ) {

			if ( x.isVector3 ) {

				_target.copy( x );

			} else {

				_target.set( x, y, z );

			}

			this.object.lookAt( _target );

			setOrientation( this );

			return this;

		};

		// this.update = function () {

		// 	const targetPosition = new Vector3();

		// 	return function update( delta ) {

		// 		if ( this.enabled === false ) return;

		// 		if ( this.heightSpeed ) {

		// 			const y = MathUtils.clamp( this.object.position.y, this.heightMin, this.heightMax );
		// 			const heightDelta = y - this.heightMin;

		// 			this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

		// 		} else {

		// 			this.autoSpeedFactor = 0.0;

		// 		}

		// 		const actualMoveSpeed = delta * this.movementSpeed;

		// 		if ( this.moveForward || ( this.autoForward && ! this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
		// 		if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

		// 		if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
		// 		if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

		// 		if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
		// 		if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

		// 		let actualLookSpeed = delta * this.lookSpeed;

		// 		if ( ! this.activeLook ) {

		// 			actualLookSpeed = 0;

		// 		}

		// 		let verticalLookRatio = 1;

		// 		if ( this.constrainVertical ) {

		// 			verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

		// 		}

		// 		lon -= this.pointerX * actualLookSpeed;
		// 		if ( this.lookVertical ) lat -= this.pointerY * actualLookSpeed * verticalLookRatio;

		// 		lat = Math.max( - 85, Math.min( 85, lat ) );

		// 		let phi = MathUtils.degToRad( 90 - lat );
		// 		const theta = MathUtils.degToRad( lon );

		// 		if ( this.constrainVertical ) {

		// 			phi = MathUtils.mapLinear( phi, 0, Math.PI, this.verticalMin, this.verticalMax );

		// 		}

		// 		const position = this.object.position;

		// 		targetPosition.setFromSphericalCoords( 1, phi, theta ).add( position );

		// 		this.object.lookAt( targetPosition );

		// 	};

		// }();

        this.updateQ = function (timeInSeconds){
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
              velocity.z = -math.clamp(Math.abs(velocity.z), 2, 2);

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
              if (input.axis2Side) {
                _A.set(0, 0, -1);
                _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * acc.y * input.axis2Side);
                _R.multiply(_Q);
              }
          
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
              this.object.quaternion.copy(_R);
            //   this.object.rotation.z=0
              this.updateAttributes()
              
            //   console.log(this.object.position)
            //   console.log(this.object.quaternion)
              
        };
        // Update(timeInSeconds) {
            
        //   }
        this.updateAttributes=function ()
        {
            this.Attributes.InputPrevious = {...this.Attributes.InputCurrent};
        }

		this.dispose = function () {

			this.domElement.removeEventListener( 'contextmenu', contextmenu );
			this.domElement.removeEventListener( 'pointerdown', _onPointerDown );
			this.domElement.removeEventListener( 'pointermove', _onPointerMove );
			this.domElement.removeEventListener( 'pointerup', _onPointerUp );

			window.removeEventListener( 'keydown', _onKeyDown );
			window.removeEventListener( 'keyup', _onKeyUp );

		};

		const _onPointerMove = this.onPointerMove.bind( this );
		const _onPointerDown = this.onPointerDown.bind( this );
		const _onPointerUp = this.onPointerUp.bind( this );
		const _onKeyDown = this.onKeyDown.bind( this );
		const _onKeyUp = this.onKeyUp.bind( this );

		this.domElement.addEventListener( 'contextmenu', contextmenu );
		this.domElement.addEventListener( 'pointerdown', _onPointerDown );
		this.domElement.addEventListener( 'pointermove', _onPointerMove );
		this.domElement.addEventListener( 'pointerup', _onPointerUp );

		window.addEventListener( 'keydown', _onKeyDown );
		window.addEventListener( 'keyup', _onKeyUp );

		function setOrientation( controls ) {

			const quaternion = controls.object.quaternion;

			_lookDirection.set( 0, 0, - 1 ).applyQuaternion( quaternion );
			_spherical.setFromVector3( _lookDirection );

			lat = 90 - MathUtils.radToDeg( _spherical.phi );
			lon = MathUtils.radToDeg( _spherical.theta );

		}

		this.handleResize();

		setOrientation( this );

	}

}

function contextmenu( event ) {

	event.preventDefault();

}

// export { FirstPersonControls };
