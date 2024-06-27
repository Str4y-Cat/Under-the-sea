import * as THREE from 'three'
import { color } from 'three/examples/jsm/nodes/Nodes.js'
import GUI from 'lil-gui'

import MarchingCubes from './reference.js'
import * as NOISE  from 'simplex-noise'
import { tri } from 'three/examples/jsm/nodes/math/TriNoise3D.js'

export default class testCubes
{

    constructor(size,rez,scene)
    {
        this.noise3D = NOISE.createNoise3D();
        this.main(size,rez,scene)

        // this.drawCell(gridPoints,scene)
    }

    main(size,rez,scene)
    {
        const gridPoints= this.createGrid(size,rez)
        // const gridPoints= this.createGrid(size,rez)
        this.debugGrid(size,gridPoints.points,scene)
        // this.debugGridCells(gridPoints.gridCells,scene)

        const marchingCubes= new MarchingCubes()
        const testarr=[]

        gridPoints.gridCells.forEach(cell=>
            {
                const triangles=marchingCubes.polygonise(cell,0.2)
                if(triangles)
                    {
                        testarr.push(...triangles)

                    }

            }
        )
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

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        const mesh = new THREE.Mesh( geometry, material );
        scene.add(mesh)


        // console.log(triangleVertexArr)
        // const test = marchingCubes.polygonise(gridPoints.gridCells[0],0.2)
        // console.log(testarr)
    }

     createGrid(SIZE,rez)
    {
        SIZE/=2
        const points=[]
        const gridCells=[]
        for(let y=-SIZE;y<=SIZE;y+=rez)
            {
             for (let x=-SIZE;x<=SIZE;x+=rez) 
                {
                    for (let z=-SIZE;z<=SIZE;z+=rez) 
                        {
                            const point=new THREE.Vector3(x,y,z)
                            points.push(point)
    
                        }  
                }  
            }
        
        for(let y=-SIZE;y<SIZE;y+=rez)
            {
                for (let x=-SIZE;x<SIZE;x+=rez) 
                {
                    for (let z=-SIZE;z<SIZE;z+=rez) 
                        {
                            // const value = this.noise3D(x,y,z)
                            // console.log(value)
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
        const p= []
        const val=[]
        p[0]=new THREE.Vector3(x,y,z)
        p[1]=new THREE.Vector3(x+rez,y,z)
        p[2]=new THREE.Vector3(x+rez,y,z+rez)
        p[3]=new THREE.Vector3(x,y,z+rez)
        p[4]=new THREE.Vector3(x,y+rez,z)
        p[5]=new THREE.Vector3(x+rez,y+rez,z)
        p[6]=new THREE.Vector3(x+rez,y+rez,z+rez)
        p[7]=new THREE.Vector3(x,y+rez,z+rez)

        
        for(let i=0; i<8; i++)
            {   
                let density=p[i].y
                density+= this.noise3D(p[i].x,p[i].y,p[i].z)




                val[i]=density
            }
        
        return {p,val}
    }

    // changeValues()

}


