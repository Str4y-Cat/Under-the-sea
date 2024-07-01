import * as THREE from 'three'

import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'
import Resources from './Utils/Resources'
import sources from './sources'
import Debug from './Utils/Debug'
import Perform from './Utils/Performance'
import Stats from 'three/addons/libs/stats.module.js';

// import World from '.World/World.js'

//convert to singleton
let instance = null

export default class Experience{
    constructor(canvas){
        if(instance)
            {return instance}
        instance=this

        // console.log('experiance online')

        //global access 
        window.experience=this

        // stats
        this.stats = new Stats();
        

        //options
        this.canvas=canvas

        //setUp
        this.debug=new Debug()
        this.sizes=new Sizes()
        this.time= new Time()
        this.scene= new THREE.Scene()
        this.resources=new Resources(sources)
        this.camera= new Camera()
        this.renderer=new Renderer()
        this.world= new World()
        this.Perform= new Perform()
        const listener= new THREE.AudioListener()
        this.camera.instance.add(listener)
        this.sound=new THREE.Audio(listener)
        //sizes resize event
        this.sizes.on('resize',()=>{
            this.resize()
        })

        //Time tick event
        this.time.on('tick',()=>
            {
                this.update()
            })

        // console.log(this.scene)
        if(this.debug.active){
            document.body.appendChild( this.stats.dom );

        }
    }

    resize(){
        // console.log("resizing")
        this.camera.resize()
        this.renderer.resize()
    }

    update(){
        // console.log('update the experiance')
        this.stats.begin();

        this.camera.update()
        this.world.update()
        this.renderer.update()
        this.stats.end();

    }

    destroy()
    {
        this.sizes.off('resize')
        this.time.off('tick')

        this.scene.traverse((child)=>
        {
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()
                
                for(const key in child.material)
                    {
                        const value=child.material[key]
                        if(value && typeof value.dispose === 'function')
                            {
                                value.dispose()
                            }
                    }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()
        if(this.debug.active)
            {
                this.debug.ui.destroy()
            }
        
    }
}