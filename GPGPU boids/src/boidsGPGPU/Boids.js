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
        this.weights={}
        this.weights.speed={}
        this.weights.speed.min=0
        this.weights.speed.max=4



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

        //debug
        // add uniforms
        // this.addUniforms()

        // init
        console.log(this.gpgpu)
        this.gpgpu.computation.init()
        this.debugPlane()

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
     * boundsMin |int taken from box3.min
     * boundsMax |int taken from box3.max
     */

    
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
    update()
    {
        this.gpgpu.computation.compute();
        // particles.material.uniforms.uParticlesTexture.value= gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture
        // myMaterial.uniforms.myTexture.value = gpuCompute.getCurrentRenderTarget( posVar ).texture;
    }














}