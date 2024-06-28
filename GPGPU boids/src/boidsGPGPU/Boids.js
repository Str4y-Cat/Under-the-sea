import * as THREE from 'three'
import GUI from 'lil-gui'
import BoidPositionShader from '../shaders/gpgpu/position.glsl'
import BoidVelocityShader from '../shaders/gpgpu/velocity.glsl'
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js'

export default class Boids
{
    constructor({renderer,scene},boidVariables)
    {
        // console.log(BoidPositionShader)
        // console.log(BoidVelocityShader)

        this.three={
            renderer:renderer,
            scene:scene
        }
        
        this.count=boidVariables.count||100
        
        this.boundingBox={}
        this.boundingBox.box=boidVariables.boundingBox
        this.boundingBox.size=new THREE.Vector3()
        this.boundingBox.box.getSize(this.boundingBox.size)
        // console.log(this.boundingBox.size)
        //renderer
        this.weights={
            visualRange: boidVariables.visualRange||1,
            protectedRange:boidVariables.protectedRange||0.3,
            seperation: boidVariables.seperation||1,
            cohesion:  boidVariables.cohesion||1,
            alignment: boidVariables.alignment||1,
            turnFactor: boidVariables.turnFactor||0.2,
        }
        this.weights.speed={}
        this.weights.speed.min=0
        this.weights.speed.max=4

        this.test=true

        this.setUpGPGPU()

    }
    //[ ] set up gpgpu
    
    
    
    
    //
    setUpGPGPU()
    {
        //setUp the gpgpu object
        this.createGPGPU()

        //set up position texture
        this.createPositionTexture()

        //set up velocity texture
        this.createVelocityTexture()

        // create variables
        this.createVariables()

        // add uniforms
        this.updateUniforms()

        // init
        this.gpgpu.computation.init()

        //debug
        this.debugPlane()

        //create a material to get the positions from
        this.createPositionMaterial()

    }


    //[x] set up gpgpu object
    //size-> ciel of sqrt(count)
    //gpgpu.computation= new GPUComputationRenderer(gpgpu.size,gpgpu.size,renderer)
    createGPGPU()
    {
        this.gpgpu={}
        this.gpgpu.size=Math.ceil(Math.sqrt(this.count))
        this.gpgpu.computation= new GPUComputationRenderer(this.gpgpu.size,this.gpgpu.size,this.three.renderer)
        console.log(this.gpgpu)
    }


    //[x] set up the positions texture
    /**
        const texture = gpgpu.computation.createTexture()
        console.log(texture)

        for (let i = 0; i < baseGeometry.count; i++) {
            const i3= i*3
            const i4= i*4

            //position based on random point within bounding box
            texture.image.data[i4+0]= random x
            texture.image.data[i4+1]= random y
            texture.image.data[i4+2]= random z
            texture.image.data[i4+3]= 0 //no need for alpha channel at this poit
            
        }
        this.positionsTexture= texture
     */
    createPositionTexture()
    {
        const texture = this.gpgpu.computation.createTexture()
        
        for (let i = 0; i < this.count; i++) {
            const i4= i*4

            //position based on random point within bounding box
            texture.image.data[i4+0]= (Math.random()-0.5)*(this.boundingBox.size.x)
            texture.image.data[i4+1]= (Math.random()-0.5)*(this.boundingBox.size.x)
            texture.image.data[i4+2]= (Math.random()-0.5)*(this.boundingBox.size.x)
            texture.image.data[i4+3]= 0 //no need for alpha channel at this poit
            
        }
        this.positionsTexture= texture
        this.currentPositions=texture
        console.log('position texture')
        console.log(texture)
    }

    //[x] set up the velocity texture
    /**
                const texture = gpgpu.computation.createTexture()
                console.log(texture)

                for (let i = 0; i < baseGeometry.count; i++) {
                    const i3= i*3
                    const i4= i*4

                    //velocity within the weight.maxVel and weight.maxVel values
                    texture.image.data[i4+0]= random x
                    texture.image.data[i4+1]= random y
                    texture.image.data[i4+2]= random z
                    texture.image.data[i4+3]= 0 //no need for alpha channel at this poit
                    
                }
                
                this.velocityTexture= texture
            */
    createVelocityTexture()
    {
        const texture = this.gpgpu.computation.createTexture()
        
        for (let i = 0; i < this.count; i++) {
            const i4= i*4

            //position based on random point within bounding box
            texture.image.data[i4+0]= (Math.random()-0.5)*2*this.weights.speed.max
            texture.image.data[i4+1]= (Math.random()-0.5)*2*this.weights.speed.max
            texture.image.data[i4+2]= (Math.random()-0.5)*2*this.weights.speed.max
            texture.image.data[i4+3]= 0 //no need for alpha channel at this poit
            
        }
        console.log('velocity texture')
        this.velocityTexture= texture
        console.log(texture)
    }

    //[ ] create ObjectAvoid Texture
    /**
     * convert from object to vec4 array 
     */

    //[x] create Variables
    /**
     * 
     * gpgpu.positionsVariable = gpgpu.computation.addVariable('uPosition',BoidPositionShader,positionTexture)
     * gpgpu.velocityVariable = gpgpu.computation.addVariable('uVelocity',BoidVelocityShader,velocityTexture)
     * gpgpu.computation.setVariableDependencies(gpgpu.positionsVariable,[gpgpu.positionsVariable,gpgpu.velocityVariable])
     * gpgpu.computation.setVariableDependencies(gpgpu.velocityVariable,[gpgpu.positionsVariable,gpgpu.velocityVariable])
     * 
     * 
     * const velVar = gpuCompute.addVariable( "textureVelocity", fragmentShaderVel, pos0 );
     * const posVar = gpuCompute.addVariable( "texturePosition", fragmentShaderPos, vel0 );
     */
    createVariables()
    {
        this.gpgpu.positionsVariable = this.gpgpu.computation.addVariable('uPosition',BoidPositionShader,this.positionsTexture)
        this.gpgpu.velocityVariable = this.gpgpu.computation.addVariable('uVelocity',BoidVelocityShader,this.velocityTexture)
        this.gpgpu.computation.setVariableDependencies(this.gpgpu.positionsVariable,[this.gpgpu.positionsVariable,this.gpgpu.velocityVariable])
        this.gpgpu.computation.setVariableDependencies(this.gpgpu.velocityVariable,[this.gpgpu.velocityVariable,this.gpgpu.positionsVariable])

    }


    //[ ] set up uniforms
    /**Velocity Uniforms
     * 
     * gpgpu.velocityVariable.material.uniforms.x= new THREE.Uniform()
     * 
     * objects |texture
     * 
     * visual range |int
     * protected range |int
     * 
     * seperation  |int
     * cohesion |int
     * alignment |int
     * turn factor |int
     * boundsMin |vec3 taken from box3.min
     * boundsMax |vec3 taken from box3.max
     */
    updateUniforms()
    {
        this.gpgpu.velocityVariable.material.uniforms.uVisualRange= new THREE.Uniform(this.weights.visualRange)
        this.gpgpu.velocityVariable.material.uniforms.uProtectedRange= new THREE.Uniform(this.weights.protectedRange)
        this.gpgpu.velocityVariable.material.uniforms.uSeperation= new THREE.Uniform(this.weights.seperation)
        this.gpgpu.velocityVariable.material.uniforms.uCohesion= new THREE.Uniform(this.weights.cohesion)
        this.gpgpu.velocityVariable.material.uniforms.uAlignment= new THREE.Uniform(this.weights.alignment)
        this.gpgpu.velocityVariable.material.uniforms.uTurnFactor= new THREE.Uniform(this.weights.turnFactor)
        this.gpgpu.velocityVariable.material.uniforms.uBoundsMin= new THREE.Uniform(this.boundingBox.box.min)
        this.gpgpu.velocityVariable.material.uniforms.uBoundsMax= new THREE.Uniform(this.boundingBox.box.max)
        this.gpgpu.velocityVariable.material.uniforms.uDeltaTime= new THREE.Uniform(0)
        this.gpgpu.velocityVariable.material.uniforms.uTime= new THREE.Uniform(0)
    
        this.gpgpu.positionsVariable.material.uniforms.uDeltaTime= new THREE.Uniform(0)
    
    
    }


    
    //[x] debug plane
    //debug
    debugPlane()
    {
        // console.log(this.gpgpu.computation.getCurrentRenderTarget(this.gpgpu.positionsVariable).texture)
   
        this.gpgpu.debugPosition=new THREE.Mesh(
            new THREE.PlaneGeometry(3,3),
            new THREE.MeshBasicMaterial({map: this.gpgpu.computation.getCurrentRenderTarget(this.gpgpu.positionsVariable).texture
            })
        )

        

        this.gpgpu.debugVelocity=new THREE.Mesh(
            new THREE.PlaneGeometry(3,3),
            new THREE.MeshBasicMaterial({map: this.gpgpu.computation.getCurrentRenderTarget(this.gpgpu.velocityVariable).texture
            })
        )

        // console.log(this.gpgpu.computation.getCurrentRenderTarget(this.gpgpu.particlesVariable).texture)
        
        this.gpgpu.debugPosition.position.x= 3
        // this.gpgpu.debugPosition.visible=false

        this.gpgpu.debugVelocity.position.x= 3
        this.gpgpu.debugVelocity.position.y= -3.2
        // this.gpgpu.debugVelocity.visible=false
        
        this.three.scene.add(this.gpgpu.debugPosition,this.gpgpu.debugVelocity)
        // this.three.scene.add(this.gpgpu.debugPosition)
    }

    createPositionMaterial()
    {
        // Material
        this.position={}
        this.position.positionMaterial = this.gpgpu.computation.createShaderMaterial( BoidPositionShader, {theTexture: { value: null } } );
        this.position.positionMaterial.uniforms.theTexture.value = this.positionsTexture;
        this.position.positionBuffer = new Uint8Array( this.gpgpu.size* this.gpgpu.size * 4 );

        this.position.positionRenderTarget = new THREE.WebGLRenderTarget( this.gpgpu.size, this.gpgpu.size, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type: THREE.UnsignedByteType,
            depthBuffer: false
        } );
    
    }

    //[ ] Update function. handles everything in the tick function
    /**
     * annimate function 
     * 
     * //GPGPU update
        //update uniforms that need to be updated
        gpgpu.computation.compute()
        //handle ping pong
        particles.material.uniforms.uParticlesTexture.value= gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture
     * 
     */
    update(deltaTime)
    {
        
        // gpgpu.particlesVariable.material.uniforms.uTime.value= elapsedTime
        // console.log(deltaTime)
        this.gpgpu.velocityVariable.material.uniforms.uDeltaTime.value= deltaTime
        this.gpgpu.velocityVariable.material.uniforms.uTime.value+= deltaTime
        // console.log(this.gpgpu.velocityVariable.material.uniforms.uTime.value)
        this.gpgpu.positionsVariable.material.uniforms.uDeltaTime.value= deltaTime

        this.gpgpu.computation.compute();
        this.gpgpu.computation.doRenderTarget( BoidPositionShader, this.position.positionRenderTarget );

        // console.log(this.gpgpu.computation)
        // this.three.renderer.readRenderTargetPixels(
        //     this.position.positionRenderTarget,
        //     0,
        //     0,
        //     this.gpgpu.size,
        //     this.gpgpu.size,
        //     this.position.positionBuffer
        // );
        // console.log(this.position.positionBuffer)

        // renderer.readRenderTargetPixels( readWaterLevelRenderTarget, 3, 3, 4, 1, readWaterLevelImage );
		// const pixels = new Float32Array( readWaterLevelImage.buffer );
        // w/h: width/height of the region to read
        // x/y: bottom-left corner of that region
       
        // const buffer = new Uint8Array(this.gpgpu.size * this.gpgpu.size * 4);
        // // console.log(this.gpgpu.computation.getCurrentRenderTarget(this.gpgpu.positionsVariable))
        // this.three.renderer.readRenderTargetPixels(this.gpgpu.computation.getCurrentRenderTarget(this.gpgpu.positionsVariable), -this.gpgpu.size/2, -this.gpgpu.size/2, this.gpgpu.size, this.gpgpu.size, buffer);
        // // const pixels = new Float32Array( buffer.buffer );
        if(this.test)
            {
                console.log(this.gpgpu.computation.getCurrentRenderTarget(this.gpgpu.positionsVariable))

                const pixels = new Uint8Array(this.gpgpu.size * this.gpgpu.size * 4);
                // console.log(this.gpgpu.computation)
                this.three.renderer.readRenderTargetPixels(
                    this.gpgpu.computation.getCurrentRenderTarget(this.gpgpu.positionsVariable),
                    0,
                    0,
                    this.gpgpu.size,
                    this.gpgpu.size,
                    pixels
                );

                this.test=false
            }

        
        // console.log(pixels)
        // this.positionMaterial.uniforms.uPositionTexture.value= this.gpgpu.computation.getCurrentRenderTarget(this.gpgpu.positionsVariable).texture
        // myMaterial.uniforms.myTexture.value = gpuCompute.getCurrentRenderTarget( posVar ).texture;
        // console.log(this.positionMaterial.uniforms.uPositionTexture.value)
        // this.currentPositions = this.gpgpu.computation.getCurrentRenderTarget( this.gpgpu.positionsVariable).texture;
    }














}