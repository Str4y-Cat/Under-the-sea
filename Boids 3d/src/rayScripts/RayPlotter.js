// export default
// class RayPlotter{

//     constructor()
//     {

//     }


    

    


// }

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

            // const index= i+0.5
            // let r= Math.sqrt(index/samples)
            // const theta= Math.PI * (1+5**0.5)*index
            // const x= Math.cos(theta)*r
            // const z= Math.sin(theta)*r
            // const y=1
            // points.push((x, y, z))
            const i3=i*3
            points[i3]=x
            points[i3+1]=y
            points[i3+2]=z
        }

    return points
}