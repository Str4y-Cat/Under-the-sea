import * as THREE from 'three'

import Experience from "../Experiance";
import Particles from './particles';

export default class Environment
{
    constructor()
     {
        this.experience=new Experience()
        this.scene= this.experience.scene
        this.resources= this.experience.resources
        this.debug=this.experience.debug
        this.debugValues={color:"#ffffff"}
        //Debug
        if(this.debug.active)
            {
                this.debugFolder= this.debug.ui.addFolder("Environment")
            }

        // this.setSunLight()
            this.setHemisphereLight()

        this.setEnvironmentMap()
        this.particles= new Particles()
        // this.addHelper()
    }

    setSunLight(){
        this.sunLight = new THREE.DirectionalLight(this.debugValues.color, 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 2, - 1.25)
        this.scene.add(this.sunLight)



        //debug
        if(this.debug.active)
            {
                this.debugFolder
                .add(this.sunLight,'intensity')
                .name('Sunlight Intensity')
                .min(0)
                .max(10)
                .step(0.001)

                this.debugFolder
                .addColor(this.debugValues,'color')
                .name('Sunlight Color')
                .onChange(color=>
                    {
                        this.sunLight.color.set(new THREE.Color(color))
                    }
                )

                this.debugFolder
                .add(this.sunLight.position,'x')
                .name('Sunlight Xposition')
                .min(-5)
                .max(5)
                .step(0.001)

                this.debugFolder
                .add(this.sunLight.position,'y')
                .name('Sunlight Yposition')
                .min(-5)
                .max(5)
                .step(0.001)

                this.debugFolder
                .add(this.sunLight.position,'z')
                .name('Sunlight Zposition')
                .min(-5)
                .max(5)
                .step(0.001)
            }
    }

    setEnvironmentMap()
    {
        this.environmentMap={}
        this.environmentMap.intensity=0.4
        this.environmentMap.texture= this.resources.items.oceanTexture
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace

        this.scene.fog = new THREE.Fog( new THREE.Color('#153a9e'), 1, 30 );


        // this.scene.environment=this.environmentMap.texture
        this.scene.background=this.environmentMap.texture

        // this.environmentMap.updateMaterial=()=>
        //     {
        //         this.scene.traverse((child)=>
        //             {
        //                 if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshLambertMaterial)
        //                     {
        //                         child.material.envMap=this.environmentMap.texture
        //                         child.material.envMapIntensity=this.environmentMap.intensity
        //                         child.material.needsUpdate=true
        //                     }
        //             })
        //     }

        // this.environmentMap.updateMaterial()

        if(this.debug.active){
            this.debugFolder
            .add(this.environmentMap,'intensity')
            .name('envMap Intensity')
            .min(0)
            .max(4)
            .step(0.001)
            .onChange(this.environmentMap.updateMaterial())
        }
    }

    setHemisphereLight()
    {
        const hemiLight = new THREE.HemisphereLight( "8cd2f8", "#140449", 2 );
        
        // hemiLight.position.set( 0, 0, 0 );
        this.scene.add( hemiLight );
    }

    addHelper()
    {
        const helper = new THREE.DirectionalLightHelper( this.sunLight, 5 );
        this.scene.add( helper );
    }







}