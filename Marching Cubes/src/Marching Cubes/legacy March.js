import * as THREE from 'three'
import { color } from 'three/examples/jsm/nodes/Nodes.js'
import GUI from 'lil-gui'

import MarchingCubes from './MarchingCubes.js'
import * as NOISE  from 'simplex-noise'
import { tri } from 'three/examples/jsm/nodes/math/TriNoise3D.js'
import Performance from '../performance/Performance.js'
// import testVertexShader from '../shaders/test/vertex.glsl'
// import testFragmentShader from '../shaders/test/fragment.glsl'

export default class testCubes
{

    constructor(size,rez,scene)
    {
        this.noise3D = NOISE.createNoise3D();
        
        const marchingCubes= new MarchingCubes()

        marchingCubes.march(size,rez,10,scene)
        marchingCubes.debugMain(scene)

        // this.main(size,rez,scene)

        // this.drawCell(gridPoints,scene)
    }

    main(size,rez,scene)
    {
        this.perform= new Performance()
        this.perform.timer('createGrid')
        const gridPoints= this.createGrid(size,rez)
        this.perform.timer('createGrid')
        // this.perform.counter('density',true)

        // const gridPoints= this.createGrid(size,rez)
        // this.debugGrid(size,gridPoints.points,scene)
        // this.debugGridCells(gridPoints.gridCells,scene)
        const marchingCubes= new MarchingCubes()
        this.perform.timer('creating triangle array')

        const testarr=[]
        //FIXME: put this in a function and optimize
        this.perform.timer('polygonise')
        gridPoints.gridCells.forEach(cell=>
            {
                

                const triangles=marchingCubes.polygonise(cell,0.5)
                if(triangles)
                    {
                        testarr.push(...triangles)

                    }

            }
        )
        this.perform.timer('polygonise')
        this.perform.timer('Convert to buffer')

        const vertices= new Float32Array(testarr.length*9)
        for (let i = 0; i < testarr.length; i++) {
            const i9=i*9
            const tri1=testarr[i][0]
            const tri2=testarr[i][1]
            const tri3=testarr[i][2]


            vertices[i9+0]=tri1.x
            vertices[i9+1]=tri1.y
            vertices[i9+2]=tri1.z

            vertices[i9+3]=tri2.x
            vertices[i9+4]=tri2.y
            vertices[i9+5]=tri2.z

            vertices[i9+6]=tri3.x
            vertices[i9+7]=tri3.y
            vertices[i9+8]=tri3.z
            // console.log(testarr[i])
        }
        this.perform.timer('Convert to buffer')

        this.perform.timer('creating triangle array')
        this.perform.timer('creating geometry')

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        geometry.computeVertexNormals () 
        const material = new THREE.MeshStandardMaterial( { color: "#ff6be0" } );
        
        // const material = new THREE.RawShaderMaterial({
        //     vertexShader: testVertexShader,
        //     fragmentShader: testFragmentShader,
        //     // wireframe:true,
        //     uniforms:
        //     {
        //         uFrequency:{value: new THREE.Vector2(10,5)},
        //         uTime:{value:0},
        //         uColor:{value: new THREE.Color('orange')},
        //         uTexture:{value:flagTexture}
        //     }
        // })

        const mesh = new THREE.Mesh( geometry, material );
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        scene.add(mesh)
        this.perform.timer('creating geometry')


        // console.log(triangleVertexArr)
        // const test = marchingCubes.polygonise(gridPoints.gridCells[0],0.2)
        // console.log(testarr)
    }

    //FIXME; allow this to tile
     createGrid(SIZE,rez)
    {
        SIZE/=2
        const points=[]
        // this.vertexValues={}

        const gridCells=[]
        // console.log(rez)
        // this.perform.timer('vertex')
        // console.log((SIZE*2)/rez)

        // for(let y=-SIZE;y<=SIZE;y+=rez)
        //     {
        //         y=Math.round(y*100)/100
        //         // console.log(y)
        //      for (let x=-SIZE;x<=SIZE;x+=rez) 
        //         {
        //             x=Math.round(x*100)/100

        //             for (let z=-SIZE;z<=SIZE;z+=rez) 
        //                 {
        //                     z=Math.round(z*100)/100


        //                     // if(!this.vertexValues[y]){
        //                     //     this.vertexValues[y]={}
        //                     //     this.vertexValues[y][x]={}
        //                     // }
        //                     // if(!this.vertexValues[y][x]){
        //                     //     this.vertexValues[y][x]={}
        //                     // }
        //                     // // this.vertexValues[y][x]={}
        //                     // const density= this.density(x,y,z)
        //                     // this.vertexValues[y][x][z]=density

        //                     const point=new THREE.Vector3(x,y,z)
        //                     points.push(point)
        //                     // this.perform.counter('vertex')
        //                     // this.perform.timer()
    
        //                 }  
        //         }  
        //     }
            // console.log(this.vertexValues)
            // this.perform.counter('vertex',true)
        // this.perform.timer('vertex')
        
          


        for(let y=-SIZE;y<SIZE;y+=rez)
            {
                y=Math.round(y*100)/100

                for (let x=-SIZE;x<SIZE;x+=rez) 
                {
                    x=Math.round(x*100)/100

                    for (let z=-SIZE;z<SIZE;z+=rez) 
                        {
                        z=Math.round(z*100)/100

                            // const value = this.noise3D(x,y,z)
                            // console.log(rez)
                            const cell= this.createCell(x,y,z,rez)
                            gridCells.push(cell)
                        }  
                }  
            }
        return {gridCells,points}
    }
    
     debugGrid(size,points, scene)
     {
        const box=new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(0,0,0),new THREE.Vector3(size,size,size))
        const boxHelper= new THREE.Box3Helper(box,'blue')
        scene.add(boxHelper)
    
        const pointsArr= new Float32Array(points.length*3)
        const colorArr= new Float32Array(points.length*3)
        points.forEach((point,i)=>
            {   
                const i3=i*3
                pointsArr[i3]=point.x
                pointsArr[i3+1]=point.y
                pointsArr[i3+2]=point.z
                



                    // const lerp= point.distanceTo ( new THREE.Vector3(0,0,0))/(size/2) 
                    // console.log(lerp)
                    colorArr[i3]=1-Math.abs(point.x)/(size/2)
                    colorArr[i3+1]=1-Math.abs(point.y)/(size/2)
                    colorArr[i3+2]=1-Math.abs(point.z)/(size/2)
                
            })
        // console.log(pointsArr)
        const geometry= new THREE.BufferGeometry()
        geometry.setAttribute('position',new THREE.BufferAttribute(pointsArr,3))
        geometry.setAttribute('color',new THREE.BufferAttribute(colorArr,3))
    
        const material= new THREE.PointsMaterial(
            {
                size:0.05,
                sizeAttenuation:true,
                // color:"red",
                vertexColors:true
            })
    
        const mesh= new THREE.Points(geometry,material)
        scene.add(mesh)
    }

    debugGridCells(gridCells, scene,i)
     {
        gridCells.forEach((cell,i)=>
            {   

                const box= new THREE.Box3(cell.p[0],cell.p[6])
                let helper
                // if(i%3==0){
                    helper= new THREE.Box3Helper(box,new THREE.Color('red'))
                    scene.add(helper)
// 
                // }
                // else{
                    //  helper= new THREE.Box3Helper(box,new THREE.Color('blue'))

                // }
                    
                
                
            }
        )
    
        
    }

    drawCell(gridCells, scene)
     {
       const debug={draw:0}
        const gui=new GUI()
        gui.add(debug,"draw").min(0).max(gridCells.length).onChange((num)=>
        {
            const cell= gridCells[num]
                
            const box= new THREE.Box3(cell[0],cell[6])
            const helper= new THREE.Box3Helper(box,new THREE.Color(Math.random(),Math.random(),Math.random()))
            scene.add(helper)
        })
        
                
    }

    

    createCell(x,y,z,rez)
    {
        // console.log(rez)
        // perform.timer('vec3')
        // console.log('done')

        const X= Math.round((x+rez)*100)/100
        const Y= Math.round((y+rez)*100)/100
        const Z= Math.round((z+rez)*100)/100


        const p= []
        const val=[]
        p[0]=new THREE.Vector3(x,y,z)
        // val[0]=this.vertexValues[x][y][z]
        
        p[1]=new THREE.Vector3(X,y,z)

        // console.log(this.vertexValues[X][y])
        // console.log(rez)
        // console.log(X)
        // console.log(x)
        // val[1]=this.vertexValues[X][y][z]

        p[2]=new THREE.Vector3(X,y,Z)
        // val[2]=this.vertexValues[X][y][Z]

        p[3]=new THREE.Vector3(x,y,Z)
        // val[3]=this.vertexValues[x][y][Z]

        p[4]=new THREE.Vector3(x,Y,z)
        // val[4]=this.vertexValues[x][Y][z]

        p[5]=new THREE.Vector3(X,Y,z)
        // val[5]=this.vertexValues[X][Y][z]

        p[6]=new THREE.Vector3(X,Y,Z)
        // val[6]=this.vertexValues[X][Y][Z]

        p[7]=new THREE.Vector3(x,Y,Z)
        // val[7]=this.vertexValues[x][Y][Z]

        // perform.timer('vec3')

        // perform.timer('noise')

                // this.perform.counter('density')
        
        for(let i=0; i<8; i++)
            {   
                val[i]=this.density(p[i].x,p[i].y,p[i].z)
            }
            // perform.timer('noise')
        
        return {p,val}
    }

    density(x,y,z)
    {
        let density=y
        //FIXME; create a dedicated function for this
        density+= this.noise3D(x*4.03,y*4.03,z*4.03)*0.25
        // density+= this.noise3D(x*1.96,y*1.96,z*1.96)*0.5
        // density+= this.noise3D(x*1.01,y*1.01,z*1.01)*1
        density+= this.noise3D(x*0.2,y*0.2,z*0.2)*4
        density+= this.noise3D(x*0.1,y*0.1,z*0.1)*5



        if(y<=-2)
            {
                density=1
            }
        // density+= this.noise.perlin3(x,y,z)
        // this.perform.counter('density')

        return density
    }

    // changeValues()

}


