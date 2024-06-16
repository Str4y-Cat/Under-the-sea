import * as THREE from 'three'
import { lerp } from 'three/src/math/MathUtils.js'



export function fibonacci_sphere(samples){
    const points = new Float32Array(samples*3)
    const phi = Math.PI * (Math.sqrt(5)-1)  //golden angle in radians
    // const n= 8
    
    
    for(let i=0; i<samples; i++)
        {
            // const n=i+0.5
            // const phi= Math.acos(1-2*n/samples)
            // const goldenRatio=(1+5**0.5)/0.2
            // const theta= 2* Math.PI * n/goldenRatio

            // const x= Math.cos(theta)*Math.sin(phi)
            // const y= Math.sin(theta)*Math.sin(phi)
            // const z= Math.cos(phi)

            let y = 1 - (i / (samples - 1)) * 2  // y goes from 1 to -1
            let radius = Math.sqrt(1 - y * y)  // radius at y
    
            let theta = phi * i  // golden angle increment
    
            let x = Math.cos(theta) * radius 
            let z = Math.sin(theta) * radius 
            
            
            // const cutoff=0.7
            // if(z<cutoff)
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

export function fibonacci_sphere_vec3(samples, cutoff){
    const points = []
    const phi = Math.PI * (Math.sqrt(5)-1)  //golden angle in radians
    // const n= 8
    
    
    for(let i=0; i<samples; i++)
        {
           
            let y = 1 - (i / (samples - 1)) * 2  // y goes from 1 to -1
            let radius = Math.sqrt(1 - y * y)  // radius at y
    
            let theta = phi * i  // golden angle increment
    
            let x = Math.cos(theta) * radius 
            let z = Math.sin(theta) * radius 


                const i3=i*3
                let shrinkFactor= 3

                if(z<cutoff){
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

export function fibonacci_colours(samples, cutoff){
    const points = new Float32Array(samples*3)
    const phi = Math.PI * (Math.sqrt(5)-1)  //golden angle in radians
    
    
    for(let i=0; i<samples; i++)
        {

            let y = 1 - (i / (samples - 1)) * 2  // y goes from 1 to -1
            let radius = Math.sqrt(1 - y * y)  // radius at y
    
            let theta = phi * i  // golden angle increment
    
            let x = Math.cos(theta) * radius 
            let z = Math.sin(theta) * radius 


            const i3=i*3
            let shrinkFactor= 3

            const color1=new THREE.Color("black")
            const color2=new THREE.Color("green")
            let mixedColor= color1.clone()
            
            const lerpValue= (z<cutoff)?1:0
            // console.log(lerpValue)
            mixedColor.lerp(color2,(lerpValue)) 

            points[i3]=mixedColor.r
            points[i3+1]=mixedColor.g
            points[i3+2]=mixedColor.b


        }
        return points
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
            
//             const lerpValue= (z<cutoff)?1:0
//             // console.log(lerpValue)
//             mixedColor.lerp(color2,(lerpValue)) 

//             points[i3]=mixedColor.r
//             points[i3+1]=mixedColor.g
//             points[i3+2]=mixedColor.b
//         }
// }