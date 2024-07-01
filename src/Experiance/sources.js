//set the import locations

export default[
    {
        name:"environmentMapTexture",
        type:'cubeTexture',
        path:[
            'textures/environmentMap/px.jpg',
            'textures/environmentMap/nx.jpg',
            'textures/environmentMap/py.jpg',
            'textures/environmentMap/ny.jpg',
            'textures/environmentMap/pz.jpg',
            'textures/environmentMap/nz.jpg',
        ]
        
        
    },

    {
        name:"oceanTexture",
        type:'equirectangular',
        path:'textures/environmentMap/oceanEnvMap.hdr'
    },
    // {
    //     name:'grassNormalTexture',
    //     type:'texture',
    //     path:'textures/dirt/normal.jpg'
    // },
    {
        name:'foxModel',
        type:'gltfModel',
        path:   'models/Fox/glTF/Fox.gltf'

    },
    {
        name:'fishModel',
        type:'gltfModel',
        path:   'models/Fish/glTF/Fish.gltf'

    },
    {
        name:'playerModel',
        type:'gltfModel',
        path:   'models/Fish/glTF/Fish.gltf'

    },
    {
        name:'fishModelBinary',
        type:'gltfModel',
        path:   'models/Fish/Binary/Fish.glb'

    },



    {
        name:'sandColorTexture',
        type:'texture',
        path:'textures/flour/color.jpg'
    },
    {
        name:'sandNormalTexture',
        type:'texture',
        path:'textures/flour/normal.jpg'
    },
    {
        name:'sandARMTexture',
        type:'texture',
        path:'textures/flour/arm.jpg'
    },
    {
        name:'sandDisplacementTexture',
        type:'texture',
        path:'textures/flour/displacement.png'
    },
    {
        name:'sandAOTexture',
        type:'texture',
        path:'textures/flour/ao.jpg'
    },
]