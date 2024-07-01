import * as THREE from 'three'

import EventEmitter from "./EventEmitter";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'


export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()

        //Options
        this.sources=sources

        //Setup
        this.items={}
        this.toLoad=this.sources.length
        this.loaded=0

        // console.log('starting resources methods')
        this.setLoaders()
        this.startLoading()
    }

    setLoaders()
    {
        this.loaders={}
        this.loaders.gltfLoader=new GLTFLoader()
        this.loaders.textureLoader=new THREE.TextureLoader()
        this.loaders.cubeTextureLoader=new THREE.CubeTextureLoader()
        this.loaders.rgbeLoader=new RGBELoader()
    }

    startLoading()
    {
        //Load each source
        for( const source of this.sources)
        {
            if(source.type=== 'gltfModel'){
                this.loaders.gltfLoader.load(
                    source.path,
                    (file)=>
                    {
                        this.sourceLoaded(source,file)
                        
                    }
                )
            }
            else if(source.type=== 'texture'){
                this.loaders.textureLoader.load(
                    source.path,
                    (file)=>
                    {
                        this.sourceLoaded(source,file)
                        
                    }
                )
            }
            else if(source.type=== 'cubeTexture'){
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file)=>
                    {
                        this.sourceLoaded(source,file)
                    }
                )
            }
            else if(source.type=== 'equirectangular'){
                console.log(source.path)
                this.loaders.rgbeLoader.load(
                    source.path,
                    (file)=>
                    {
                        console.log('loaded')
                        file.mapping=THREE.EquirectangularReflectionMapping
                        this.sourceLoaded(source,file)
                    }
                )
            }
            else
            {
                console.log('error')
            }
        }
    }

    sourceLoaded(source,file)
    {
        this.items[source.name]=file
        this.loaded++

        if(this.loaded=== this.toLoad)
            {
                // console.log('finished')
                this.trigger('ready')
            }
    }

}