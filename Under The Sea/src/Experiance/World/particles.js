import WorldValues from "../WorldValues"
import Experience from "../Experiance"
import * as THREE from 'three' 

import particlesVertexShader from '../shaders/particles/vertex.glsl'
import particlesFragmentShader from '../shaders/particles/fragment.glsl'
// import gpgpuParticlesShader from '../shaders/particles/gpgpuParticle.glsl'
import GPGPUParticleShader from '../shaders/particles/gpgpuParticle.glsl'
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js'

// console.log(gpgpuParticlesShader)


export default class particles
{
    constructor()
    {
        this.experience= new Experience()
        this.scene=this.experience.scene
        this.sizes= this.experience.sizes
        this.renderer= this.experience.renderer

        this.WIDTH= WorldValues.coralVariables.size
        this.floor= WorldValues.floorHeight
        this.roof= WorldValues.roofHeight
        this.setPoints()
        this.setMaterial()
        this.setMesh()

        // this.setGpgpu()
    }

    setPoints()
    {
        this.count=(this.WIDTH**2)*10
        const pointArr= new Float32Array(this.count*3)
        for(let i=0;i<this.count*10;i++)
            {
                const i3= i*3
                pointArr[i3]=(Math.random()-0.5)*this.WIDTH
                pointArr[i3+1]=Math.max((Math.random()-0.5)*this.WIDTH, this.floor)
                pointArr[i3+2]=(Math.random()-0.5)*this.WIDTH
            }

        this.geometry= new THREE.BufferGeometry()
        this.geometry.setAttribute('position',new THREE.BufferAttribute(pointArr,3))
    }

    setMaterial()
    {
        this.material= new THREE.PointsMaterial({
            size:0.02,
            sizeAttenuation:true
        
        })
        // console.log(particlesVertexShader)
        // console.log(particlesFragmentShader)
        // this.material = new THREE.ShaderMaterial({
        //     vertexShader: particlesVertexShader,
        //     fragmentShader: particlesFragmentShader,
        //     uniforms:
        //     {
        //         uSize: new THREE.Uniform(0.07),
        //         uResolution: new THREE.Uniform(new THREE.Vector2(this.sizes.width * this.sizes.pixelRatio, this.sizes.height * this.sizes.pixelRatio)),
        //         uParticlesTexture: new THREE.Uniform()
        //     }
        // })
    }

    setGpgpu()
    {
        this.gpgpu={}
        this.gpgpu.size=Math.ceil(Math.sqrt(this.count))
        console.log(this.count)
        this.gpgpu.computation= new GPUComputationRenderer(this.gpgpu.size,this.gpgpu.size,this.renderer.instance)
        // console.log(this.renderer)ssssssssssssd

        //Base Particles
        const baseParticlesTexture = this.gpgpu.computation.createTexture()
        console.log(baseParticlesTexture)

        for (let i = 0; i < this.count; i++) {
            const i3= i*3
            const i4= i*4

            //position based on geometry
            baseParticlesTexture.image.data[i4+0]= this.geometry.attributes.position.array[i3+0]
            // console.log(this.geometry.attributes.position.array[i3+0])
            baseParticlesTexture.image.data[i4+1]= this.geometry.attributes.position.array[i3+1]
            baseParticlesTexture.image.data[i4+2]= this.geometry.attributes.position.array[i3+2]
            baseParticlesTexture.image.data[i4+3]= Math.random()
    
        }
        console.log(baseParticlesTexture)
        this.gpgpu.particlesVariable = this.gpgpu.computation.addVariable('uParticles',GPGPUParticleShader,baseParticlesTexture)
        this.gpgpu.computation.setVariableDependencies(this.gpgpu.particlesVariable,[this.gpgpu.particlesVariable])
       
        //uniforms
        this.gpgpu.particlesVariable.material.uniforms.uTime = new THREE.Uniform(0)
        this.gpgpu.particlesVariable.material.uniforms.uBase = new THREE.Uniform(baseParticlesTexture)
        this.gpgpu.particlesVariable.material.uniforms.uDeltaTime = new THREE.Uniform(0)
        this.gpgpu.particlesVariable.material.uniforms.uFlowFieldInfluence= new THREE.Uniform(0.5)
        this.gpgpu.particlesVariable.material.uniforms.uFlowFieldStrength= new THREE.Uniform(2)
        this.gpgpu.particlesVariable.material.uniforms.uFlowFieldFrequency= new THREE.Uniform(0.5)

        this.gpgpu.computation.init()

        const debug=new THREE.Mesh(
            new THREE.PlaneGeometry(3,3),
            new THREE.MeshBasicMaterial({map: this.gpgpu.computation.getCurrentRenderTarget(this.gpgpu.particlesVariable).texture
        
            })
        )
        this.scene.add(debug)

    }

    setMesh()
    {
        
        this.pointMesh= new THREE.Points(this.geometry,this.material)
        console.log(this.pointMesh)
        this.scene.add(this.pointMesh)
    }

    update()
    {
        // const delaTime= this.experience.time.delta
        // const elapsedTime= this.experience.time.elapsed
        // // console.log(delaTime,elapsedTime)
        // this.gpgpu.particlesVariable.material.uniforms.uTime.value= elapsedTime
        // this.gpgpu.particlesVariable.material.uniforms.uDeltaTime.value= delaTime
        // this.gpgpu.computation.compute()
        // this.pointMesh.material.uniforms.uParticlesTexture.value= this.gpgpu.computation.getCurrentRenderTarget(this.gpgpu.particlesVariable).texture
    
    }

}