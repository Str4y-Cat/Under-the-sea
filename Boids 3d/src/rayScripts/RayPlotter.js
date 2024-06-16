import * as THREE from 'three'
import { lerp } from 'three/src/math/MathUtils.js'

export default class RayPlotter
{
    constructor(count,rayAngleLimit)
    {
        this.rayCount=count
        this.rayAngleLimit=rayAngleLimit

        this.rayPositions_floatArray=this.fibonacci_sphere()
        this.rayPositions_vec3Array=this.fibonacci_sphere_vec3()
        this.rayColours= this.fibonacci_colours()

    }

      fibonacci_sphere(){
        // console.log('this.rayCount')
        // console.log(`this.rayCount: ${this.rayCount}`)
        const points = new Float32Array(this.rayCount*3)
        const phi = Math.PI * (Math.sqrt(5)-1)  //golden angle in radians
        // const n= 8
        
        
        for(let i=0; i<this.rayCount; i++)
            {
    
                let y = 1 - (i / (this.rayCount - 1)) * 2  // y goes from 1 to -1
                let radius = Math.sqrt(1 - y * y)  // radius at y
        
                let theta = phi * i  // golden angle increment
        
                let x = Math.cos(theta) * radius 
                let z = Math.sin(theta) * radius 
                
                
                // const this.rayAngleLimit=0.7
                // if(z<this.rayAngleLimit)
                //     {
                        const i3=i*3
                    let shrinkFactor= 3
    
                    points[i3]=x /shrinkFactor
                    points[i3+1]=y/shrinkFactor
                    points[i3+2]=z/shrinkFactor
                // }
            }
    
        return points
    }
    
      fibonacci_sphere_vec3(){
        // console.log(`this.rayCount: ${this.rayCount}`)

        const points = []
        const phi = Math.PI * (Math.sqrt(5)-1)  //golden angle in radians
        // const n= 8
        
        
        for(let i=0; i<this.rayCount; i++)
            {
               
                let y = 1 - (i / (this.rayCount - 1)) * 2  // y goes from 1 to -1
                let radius = Math.sqrt(1 - y * y)  // radius at y
        
                let theta = phi * i  // golden angle increment
        
                let x = Math.cos(theta) * radius 
                let z = Math.sin(theta) * radius 
    
    
                    const i3=i*3
                    let shrinkFactor= 3
    
                    if(z<this.rayAngleLimit){
                        // console.log("pushing")
                        points.push(new THREE.Vector3(x/3,y/3,z/3))
                    }
                    else
                    {
                        // console.log("cutting")
                    }
                
            }
            // console.log("done")
        // console.log(points)
        return points
    }
    
      fibonacci_colours(){
        // console.log(`this.rayCount: ${this.rayCount}`)
        const points = new Float32Array(this.rayCount*3)
        const phi = Math.PI * (Math.sqrt(5)-1)  //golden angle in radians
        
        
        for(let i=0; i<this.rayCount; i++)
            {
    
                let y = 1 - (i / (this.rayCount - 1)) * 2  // y goes from 1 to -1
                let radius = Math.sqrt(1 - y * y)  // radius at y
        
                let theta = phi * i  // golden angle increment
        
                let x = Math.cos(theta) * radius 
                let z = Math.sin(theta) * radius 
    
    
                const i3=i*3
                let shrinkFactor= 3
    
                const color1=new THREE.Color("black")
                const color2=new THREE.Color("green")
                let mixedColor= color1.clone()
                
                const lerpValue= (z<this.rayAngleLimit)?1:0
                // console.log(lerpValue)
                mixedColor.lerp(color2,(lerpValue)) 
    
                points[i3]=mixedColor.r
                points[i3+1]=mixedColor.g
                points[i3+2]=mixedColor.b
    
    
            }
            return points
    }

    updateAngle(rayAngleLimit)
    {
        this.rayAngleLimit=rayAngleLimit

        this.rayColours= this.fibonacci_colours()
        this.rayPositions_vec3Array=this.fibonacci_sphere_vec3()
    }

    updateArrayCount(count)
    {
        this.rayCount=count
        // this.debugColours= this.fibonacci_colours()
        // this.rayPositions_vec3Array=this.fibonacci_sphere_vec3()
        this.rayPositions_floatArray=this.fibonacci_sphere()
    }


}





// export function lineGradient(base,target)
// {   

//     const colors= new Float32Array(vec3Array.length*3)

//     for(let i=0; i<vec3Array.length;i++)
//         {
//             const i3=i*3

//             const color1=new THREE.Color("red")
//             const color2=new THREE.Color("green")
//             let mixedColor= color1.clone()
            
//             const lerpValue= (z<this.rayAngleLimit)?1:0
//             // console.log(lerpValue)
//             mixedColor.lerp(color2,(lerpValue)) 

//             points[i3]=mixedColor.r
//             points[i3+1]=mixedColor.g
//             points[i3+2]=mixedColor.b
//         }
// }