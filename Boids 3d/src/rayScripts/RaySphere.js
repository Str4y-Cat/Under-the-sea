import * as THREE from 'three'
import { temp } from 'three/examples/jsm/nodes/Nodes.js'


export default class RaySphere
{
    constructor(count,rayAngleLimit,scene,gui,rayCastValues)
    {
        this.rayCount=count
        this.rayAngleLimit=rayAngleLimit
        this.scene=scene
        this.gui=gui

        this.rayPositions_vec3Array=this.fibonacci_sphere_vec3()
        this.rayPositions_floatArray=this.toFloatArr(this.rayPositions_vec3Array)

        this.rayColours= this.fibonacci_colours()

        this.debug={
            
        }
        this.debug.origin=new THREE.Vector3(0,0,0)
        this.setUpDebug()

        this.needsUpdate=false

        this.pointSphere=this.setUpPointSphere()
        this.rayTargets

        //raycaster
        this.rayCaster=this.setUpRayCaster(rayCastValues)
        this.rayDistance=1
        this.environmentObjects=rayCastValues.environmentObjects
       

        // console.log( this.environmentObjects)
        // console.log( this.rayCaster)
        // console.log('raySphere set up')
        
        // console.log(' this.pointSphere')
        // this.test()

    }

    fibonacci_sphere(){
        // console.log('this.rayCount')
        // console.log(`this.rayCount: ${this.rayCount}`)
        const phi = Math.PI * (Math.sqrt(5)-1)  //golden angle in radians
        // const n= 8
        // let count= 0
        // for(let n=0; n<this.rayCount; n++)
        //     {
        //         let i= n+0.5
        //         let y = 1 - (i / (this.rayCount - 1)) * 2  // y goes from 1 to -1
        //         let radius = Math.sqrt(1 - y * y)  // radius at y
        //         let theta = phi * i  // golden angle increment
        //         let z = Math.sin(theta) * radius 
        //             if(z<this.rayAngleLimit){
        //                 count++
        //             }
                    
        //         // }
        //     }
        // console.log(`count: ${count}\n this.rayCount:${this.rayCount}`)
        let points = []
        
        for(let i=0; i<this.rayCount; i++)
            {
                // let i= i+0.5
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
    
                    if(z<this.rayAngleLimit){
                        points[i3]=x /3
                        points[i3+1]=y /3
                        points[i3+2]=z /3
                    }
                    
                // }
            }

        // console.log("points start")   
        // console.log(points)

        points = points.filter((x)=>{return x!=null})
        // console.log(points)

        const floatPoints = new Float32Array(points.length)
        points.forEach((point,i)=>{
            floatPoints[i]=point
        })
        // console.log(floatPoints)
        // console.log("points end")   

        
    
        return floatPoints
    }
    

    
    


    //#region sphereMethods

    /**
     * creates the point geometry
     * 
     * returns point geometry
     */
    setUpPointSphere()
    {
        const pointsGeometry= new THREE.BufferGeometry()
        pointsGeometry.setAttribute('position',new THREE.BufferAttribute(this.rayPositions_floatArray,3))
        // pointsGeometry.setAttribute('color',new THREE.BufferAttribute(this.rayColours,3))

        const pointsMaterial= new THREE.PointsMaterial({
            color:'green',
            size:0.04,
            sizeAttenuation:true,
            // vertexColors:true

        })

        const particleMesh= new THREE.Points(pointsGeometry,pointsMaterial)

        // particleMesh.rotateY=Math.PI

        // this.scene.add(particleMesh)

        // for(let i=0; i<10; i++)
        //     {
        //         console.log(particleMesh.geometry.attributes.position.array[i])
        //         console.log(this.rayPositions_floatArray[i])
        //     }

        
        

        return particleMesh
    }

    /**this method positions the targeting sphere so that it matches the rotation of the boid
     * note! it may be quicker to use the boidPoistion array instead of the boidMesh
     * 
     * @param {*} mesh 
     */
    rotateTo(mesh)
    {
        // console.log(this.pointSphere.rotation)
        // console.log("rotating")
        // const rotation= new THREE.Quaternion();
        this.pointSphere.rotation.copy(mesh.rotation)

       return this.toWorldVertices()

        


        // vector.applyQuaternion( quaternion );


        // mesh.rotation
    }

    getTarget()
    {
        //covert sphere points to three vectors
        // return the average of xyz and normalized distance
        return 'temp'
    }

    //#endregion

    //#region RayCasting

    setUpRayCaster(rayCastValues)
    {
        if(rayCastValues==undefined){rayCastValues={}}
        const rayCaster= new THREE.Raycaster()
        rayCaster.layers.set( 1 );
        rayCaster.far=rayCastValues.far||0.3

        return rayCaster
    }

    castRays(rayTargets, origin)
    {
        //get points from sphere
            //call util function
            
            // let rayTargets=this.rayPositions_vec3Array
            // let rayTargets=this.rothis.rayPositions_vec3Array
            // console.log('casting rays')

            const minz=(rayTargets.reduce((sum,cur)=>{return sum=(sum.z<cur.z)?sum:cur},new THREE.Vector3(0,0,0)))
            const maxz=(rayTargets.reduce((sum,cur)=>{return sum=(sum.z>cur.z)?sum:cur},new THREE.Vector3(0,0,0)))

            const minx=(rayTargets.reduce((sum,cur)=>{return sum=(sum.x<cur.x)?sum:cur},new THREE.Vector3(0,0,0)))
            const maxx=(rayTargets.reduce((sum,cur)=>{return sum=(sum.x>cur.x)?sum:cur},new THREE.Vector3(0,0,0)))

            const miny=(rayTargets.reduce((sum,cur)=>{return sum=(sum.y<cur.y)?sum:cur},new THREE.Vector3(0,0,0)))
            const maxy=(rayTargets.reduce((sum,cur)=>{return sum=(sum.y>cur.y)?sum:cur},new THREE.Vector3(0,0,0)))
            // console.log(`Length ${rayTargets.length}\nmax z ${maxz.z} min z ${minz.z}\nmax x ${maxx.x} min x ${minx.x}\nmax y ${maxy.y} min y ${miny.y}`)
            this.debug.rayTargetCount=rayTargets.length
            
            //DELETE -------------------------------------------
            // if(this.debug.temp){
            //     this.debug.temp.geometry.dispose()
            //     this.debug.temp.material.dispose()
            //     this.scene.remove(this.debug.temp)
            // }
            // const geometry= new THREE.BufferGeometry()
            // geometry.setAttribute('position',new THREE.BufferAttribute(this.pointSphere.geometry.attributes.position.array,3))
            // const material= new THREE.PointsMaterial({size:0.01, color:'red'})
            // const mesh= new THREE.Points(geometry,material)
            // this.scene.add(mesh)
            // this.debug.temp=mesh

            // console.log(mesh)
            //--------------------------------------------------------
            // this.debug.test=rayTargets

        // console.log(`length of points: ${this.pointSphere.geometry.attributes.position.array.length}`)
        //cast rays(copy the one below)
        const objectArr=[]

        const sum= {distance:0,position:{x:0,y:0,z:0}}
        for(const target of rayTargets)
        {
            // this.debug.test=target
            //aim the ray caster
            // console.log(target)
            // target.normalize()
            // this.debug.test=target

            this.rayCaster.set(origin,target)
            // console.log(this.rayCaster)

            //find intersections of environment objects
            const foundArr=this.rayCaster.intersectObjects ( this.environmentObjects)
            if(foundArr.length)
            {
                console.log("found")
                objectArr.push(foundArr[0])
            }
        }

        //if there is something intersecting the ray
        if(objectArr.length)
        {
        
            //sum the values in the array
            for(const obj of objectArr){
                sum.distance+=obj.distance
                sum.position.x+=obj.point.x
                sum.position.z+=obj.point.z
                sum.position.y+=obj.point.y
            }
            
            //if theres more than one value average the values
            if(objectArr.length>1)
                {
                    sum.distance/=objectArr.length
                    sum.position.x/=objectArr.length
                    sum.position.y/=objectArr.length
                    sum.position.z/=objectArr.length
                }

            //normalize the distance
            sum.distance/=this.rayCaster.far
        }


        // const returnValue= (sum.distance)?sum:null
        // if(obsticle){
        //         this.debug.ray=this.debugRay(obsticle)
        //         }
        //         else
        //         {
        //             //removes ray once you leave the circle. for debug view
        //             this.removeRay()
        //         }

        


        //return the distance, else return null
        
        

        return (sum.distance)?sum:null

        // return {normailizedDist,postition}
        // return targets
    }

    /** addEnvironmentObjects(){}
     * 
     * adds a new object to look for the raycaster
     */
    //#endregion

    test()
    {
        // const modifiedvec3=this.float3ToVec3(this.rayPositions_floatArray)
        // const floatArr=this.rayPositions_floatArray
        // const vec3Arr=this.rayPositions_vec3Array

        // // const vec3Arr=this.rayPositions_vec3Array

        // for (let i = 0; i < 20; i++) {

        //     let x1= this.pointSphere.geometry.attributes.position.array[i]
        //     let y1= this.pointSphere.geometry.attributes.position.array[i+1]
        //     let z1= this.pointSphere.geometry.attributes.position.array[i+2]
        //     console.log()

        //     let x2= floatArr[i+0]
        //     let y2= floatArr[i+1]
        //     let z2= floatArr[i+2]

        //     let x3= vec3Arr[i+0].x
        //     let y3= vec3Arr[i+1].y
        //     let z3= vec3Arr[i+2].z

        //     console.log(`x1:${x1}\nx2:${x2}\nx3:${x3}`)
        //     console.log(`y1:${y1}\n2:${y2}\ny3:${y3}`)
        //     console.log(`z1:${z1}\nz2:${z2}\nz3:${z3}`)

        // }

        // const vec1= new THREE.Vector3(0.2863161078062363,  -0.7002653686702316, 0.6539506861008958 )
        // const vec2= new THREE.Vector3(3,3,3)
        

        // console.log("BEGINING TEST")
        // console.log(vec1.normalize())
        // console.log("END TEST")

        // console.log(this.pointSphere.geometry.index)



    }

    
    /** float3ToVecThree(arr)
     * 
     * converts a float arr to a three.vec3 arr
     * 
     * TESTED
     */
    float3ToVec3(arr)
    {
       
        const vec3Arr=[]
        for (let i = 0; i < arr.length/3; i++) {
                const i3=i*3
                const vec= new THREE.Vector3(
                    arr[i3],//x
                    arr[i3+1],//y
                    arr[i3+2]//z
                )
                // vec.normalize()
                vec3Arr.push(vec)
            
        }
        return vec3Arr
    }

    toVertices(geometry) {
        const positions = geometry.attributes.position;
        const vertices = [];
        for (let index = 0; index < positions.count; index++) {
          vertices.push(
            new THREE.Vector3(
              positions.getX(index),
              positions.getY(index),
              positions.getZ(index)
            )
          );
        }
        return vertices;
      }
    
    updateAngle(rayAngleLimit)
    {
        // this.rayAngleLimit=rayAngleLimit

        this.rayColours= this.fibonacci_colours()
        this.rayPositions_vec3Array=this.fibonacci_sphere_vec3()
        this.needsUpdate=true
    }

    updateArrayCount(count)
    {
        // this.rayCount=count
        // this.debugColours= this.fibonacci_colours()
        // this.rayPositions_vec3Array=this.fibonacci_sphere_vec3()
        this.rayPositions_floatArray=this.fibonacci_sphere()
        this.needsUpdate=true

    }


    //#region DEBUG
    
    setUpDebug()
    {
        const folder= this.gui.addFolder('Rays')
        //set up Points
        
        this.debug.rotation=0
        this.debug.getPointCount=()=>{console.log(`Sphere points: ${this.debug.rayTargetCount}`)}
        this.debug.getTest=()=>{console.log(`Test:`);console.log(this.debug.test)}
        console.log(this.debug)


        folder.add(this,'rayCount').min(0).max(400).step(1).onFinishChange((num)=>
            {
                this.updateArrayCount(num)
                this.updateAngle(this.rayCutoff)
                

                this.pointSphere.geometry.setAttribute('position',new THREE.BufferAttribute(this.rayPositions_floatArray,3))
                this.pointSphere.geometry.setAttribute('color',new THREE.BufferAttribute(this.rayColours,3))
        
        
            })
        folder.add(this,'rayAngleLimit').min(-1).max(1).step(0.001).onChange((angleLimit)=>
            {
                this.updateArrayCount(this.rayCount)

                this.updateAngle(angleLimit)
                this.pointSphere.geometry.setAttribute('position',new THREE.BufferAttribute(this.rayPositions_floatArray,3))
                this.pointSphere.geometry.setAttribute('color',new THREE.BufferAttribute(this.rayColours,3))
        

            })
        
        folder.add(this.debug,'getPointCount')
        folder.add(this.debug,'getTest')
        folder.add(this,'test')
        folder.add(this,'debugTestTargets').name("Fire all Rays")



    }

    debugRay(obsticle,origin)
    {   
        //clear the last ray path
        this.removeRay()
        
        
        if(!obsticle.isVector3){obsticle= obsticle.position;}

        const lineMaterial= new THREE.LineBasicMaterial();
        lineMaterial.color=new THREE.Color("green")
        const baseTarget= origin
        const target= new THREE.Vector3(obsticle.x,obsticle.y,obsticle.z)
        const lineArr=[]

        let lineGeometry = new THREE.BufferGeometry().setFromPoints( [baseTarget,target] );


        let line = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(line);
        lineArr.push(line)
            
    
        return lineArr

    }

    debugTestTargets()
    {
        // const arr= this.float3ToVec3(this.rayPositions_floatArray)
        const vertices= this.toWorldVertices(this.pointSphere.geometry)

        const origin= this.debug.origin
        console.log(origin)
        // this.rayPositions_vec3Array.forEach((target)=>
        //     {
        //         this.debugRay(target, origin)
        //     })
        console.log(vertices.length)

        vertices.forEach((target)=>
            {   
                target.add(origin).normalize
                this.debugRay(target, origin)
            })


        
    }



    removeRay(){
        if(this.debug.ray){
            // console.log(this.debug.ray[0].material)
            this.debug.ray[0].material.color.set(new THREE.Color("red"))
            // this.scene.remove(this.debug.ray[0])
            // this.debug.ray[0].material.dispose()
            // this.debug.ray[0].geometry.dispose()
        }
    }
    //#endregion

    //#region utils

    toWorldVertices()
    {
        
        const positionAttribute = this.pointSphere.geometry.getAttribute( 'position' );
        // console.log(positionAttribute)
        const rotatedVerticies=[]
        for(let i=0; i<positionAttribute.count;i++)
            {
                const vertex = new THREE.Vector3();
                vertex.fromBufferAttribute( positionAttribute, i );
                this.pointSphere.localToWorld( vertex );
                rotatedVerticies.push(vertex)
                
            }

        

        return rotatedVerticies
    }
    toFloatArr(arr)
    {
        const floatArr= new Float32Array(arr.length*3)
        arr.forEach((vec,i)=>
        {
            const i3=i*3
            floatArr[i3]=vec.x
            floatArr[i3+1]=vec.y
            floatArr[i3+2]=vec.z
        })
        return floatArr
    }
    //#endregion

    //#region unused
    
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
    
                    // const normalizedTarget=new THREE.Vector3(x,y,z)

                    if(z<this.rayAngleLimit){
                        const normalizedTarget=new THREE.Vector3(x,y,z)
                        normalizedTarget.normalize()
                        points.push(normalizedTarget)
                    }
                    // else
                    // {
                    //     // console.log("cutting")
                    // }
                
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
    
    //#endregion


}



// update()
// {   
//     //check if the rays object has been updated
//     if(this.rays.needsUpdate)
//         {
//             this.rayTargets= this.rays.rayPositions_vec3Array
//             this.rays.needsUpdate=false
//         }
    
//     //get the average of rays sent
//     let obsticle= this.castRays()
//     if(obsticle){
//         //set up debug. shows the path to the obstical vector
//         this.debug.ray=this.debugRay(obsticle)
//         // console.log(obsticle)
//     }
//     else
//     {
//         //removes ray once you leave the circle. for debug view
//         this.removeRay()
//     }
    
//     return obsticle

// }

// /**
//  * testRays()
//  * 
//  * shoot rays, remove all boids, return values
//  * 
//  */
// castRays()
// {   
//     const objectArr=[]

//     const sum= {distance:0,x:0,y:0,z:0}
//     for(const target of this.rayTargets)
//     {
//         //aim the ray caster
//         this.rayCaster.set(this.rayOrigin,target)

//         //find intersections of environment objects
//         const foundArr=this.rayCaster.intersectObjects ( this.environmentObjects)
//         if(foundArr.length)
//         {
//             objectArr.push(foundArr[0])
//         }
//     }

//     //if there is something intersecting the ray
//     if(objectArr.length)
//     {
       
//         //sum the values in the array
//         for(const obj of objectArr){
//             sum.distance+=obj.distance
//             sum.x+=obj.point.x
//             sum.z+=obj.point.z
//             sum.y+=obj.point.y
//         }
        
//         //if theres more than one value average the values
//         if(objectArr.length>1)
//             {
//                 sum.distance/=objectArr.length
//                 sum.x/=objectArr.length
//                 sum.y/=objectArr.length
//                 sum.z/=objectArr.length
//             }

//         //normalize the distance
//         sum.distance/=this.far
//     }


//     // const returnValue= (sum.distance)?sum:null

//     //return the distance, else return null
//     return (sum.distance)?sum:null
    
// }