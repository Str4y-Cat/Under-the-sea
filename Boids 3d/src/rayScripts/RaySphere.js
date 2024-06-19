import * as THREE from 'three'

export default class RaySphere
{
    /**
     * raySphere controlls the positioning and firing of rays for one object
     * - uses a point geometry to position targets for rays. 
     * 
     * @param {*} count amount of rays to be tested
     * @param {*} rayAngleLimit angle limit for the rays (-1 -> 1)
     * @param {*} scene the three.js scene
     * @param {*} gui debug gui
     * @param {*} rayCastValues object holding values specific to the raycaster. {far:"length of fired rays"}
     */
    constructor(count,rayAngleLimit,scene,gui,rayCastValues)
    {
        //setup base parameters
        this.rayCount=count
        this.rayAngleLimit=rayAngleLimit
        this.scene=scene
        this.gui=gui
        this.environmentObjects=rayCastValues.environmentObjects


        //setup sphere
        this.rayPositions_vec3Array=this.fibonacci_sphere_vec3()
        this.rayPositions_floatArray=this.toFloatArr(this.rayPositions_vec3Array)
        this.pointSphere=this.setUpPointSphere()
        // this.rayColours= this.fibonacci_colours()

        //debug
        this.debug={
            
        }
        this.debug.origin=new THREE.Vector3(0,0,0)
        this.setUpDebug()
        this.needsUpdate=false
        //TODO: add a counter, to check how many loops are run each raycaster call

        

        //raycaster
        this.rayFar=rayCastValues.far||0.3
        this.rayTargets
        this.rayCaster=this.setUpRayCaster()
       
        console.log("raysphere set up")
        //TODO: ADD counter('return',true)
    }

    //#region sphere methods

    /**
     * Creates the point sphere points mesh using a bufferattribute derived from the global float array
     * 
     * @returns mesh
     */
    setUpPointSphere()
    {
        //set up the geometry
        const pointsGeometry= new THREE.BufferGeometry()
        //get points from global float array
        pointsGeometry.setAttribute('position',new THREE.BufferAttribute(this.rayPositions_floatArray,3))

        //set up material
        const pointsMaterial= new THREE.PointsMaterial({
            color:'green',
            size:0.04,
            // sizeAttenuation:true,
        })

        //create mesh
        const particleMesh= new THREE.Points(pointsGeometry,pointsMaterial)

        //no need to add it to scene. its just for positioning

        return particleMesh
    }

    // fibonacci_sphere(){
    //     // console.log('this.rayCount')
    //     // console.log(`this.rayCount: ${this.rayCount}`)
    //     const phi = Math.PI * (Math.sqrt(5)-1)  //golden angle in radians
    //     // const n= 8
    //     // let count= 0
    //     // for(let n=0; n<this.rayCount; n++)
    //     //     {
    //     //         let i= n+0.5
    //     //         let y = 1 - (i / (this.rayCount - 1)) * 2  // y goes from 1 to -1
    //     //         let radius = Math.sqrt(1 - y * y)  // radius at y
    //     //         let theta = phi * i  // golden angle increment
    //     //         let z = Math.sin(theta) * radius 
    //     //             if(z<this.rayAngleLimit){
    //     //                 count++
    //     //             }
                    
    //     //         // }
    //     //     }
    //     // console.log(`count: ${count}\n this.rayCount:${this.rayCount}`)
    //     let points = []
        
    //     for(let i=0; i<this.rayCount; i++)
    //         {
    //             // let i= i+0.5
    //             let y = 1 - (i / (this.rayCount - 1)) * 2  // y goes from 1 to -1
    //             let radius = Math.sqrt(1 - y * y)  // radius at y
        
    //             let theta = phi * i  // golden angle increment
        
    //             let x = Math.cos(theta) * radius 
    //             let z = Math.sin(theta) * radius 
                
                
    //             // const this.rayAngleLimit=0.7
    //             // if(z<this.rayAngleLimit)
    //             //     {
    //                     const i3=i*3
    //                 let shrinkFactor= 3
    
    //                 if(z<this.rayAngleLimit){
    //                     points[i3]=x /3
    //                     points[i3+1]=y /3
    //                     points[i3+2]=z /3
    //                 }
                    
    //             // }
    //         }

    //     // console.log("points start")   
    //     // console.log(points)

    //     points = points.filter((x)=>{return x!=null})
    //     // console.log(points)

    //     const floatPoints = new Float32Array(points.length)
    //     points.forEach((point,i)=>{
    //         floatPoints[i]=point
    //     })
    //     // console.log(floatPoints)
    //     // console.log("points end")   

        
    
    //     return floatPoints
    // }

    //
    
    /**
     * returns points placed quasi equidistantly around a sphere using the Fibonacci sphere algorithm
     * - radius is normalized
     * - cuttoff value determines the z limit for the points on the sphere
     * - adapted from https://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere/44164075#44164075
     * @returns a THREE.Vector3 array
     */
    fibonacci_sphere_vec3(){

        const points = []
        const phi = Math.PI * (Math.sqrt(5)-1)  //golden angle in radians

        for(let i=0; i<this.rayCount; i++)
            {
               
                let y = 1 - (i / (this.rayCount - 1)) * 2  // y goes from 1 to -1
                let radius = Math.sqrt(1 - y * y)  // radius at y
        
                let theta = phi * i  // golden angle increment
        
                let x = Math.cos(theta) * radius 
                let z = Math.sin(theta) * radius 


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

    /**
     * Rotates the point sphere to match the given mesh rotation.
     * Returns an array of the sphere vertices shifted to the world position
     * 
     * note! it may be quicker to use the boidPoistion array instead of the boidMesh
     * possibly dont need the mesh. may be better with just the vec3 rotation (euler)
     * 
     * @param {*} mesh object mesh
     * @returns THREE.Vector3 Array
     */
    rotateTo(mesh)
    {
        //TODO: ADD counter(rotateto)
        this.pointSphere.rotation.copy(mesh.rotation)
       return this.toWorldVertices()
    }

    //#endregion

    //#region ray casting

    /**
     * sets up the raycaster.
     * - current layer set to 1
  
     * @returns THREE.Raycaster
     */
    setUpRayCaster()
    {
        // if(rayCastValues==undefined){rayCastValues={}}
        const rayCaster= new THREE.Raycaster()
        rayCaster.layers.set( 1 );
        rayCaster.far=this.rayFar


        return rayCaster
    }

    /**
     * Aims the raycaster and checks for intersections
     * - averages the found intersections distances and position
     * - normalized the final distance with the raycaster Far distance
     * 
     * @param {[THREE.Vector3]} rayTargets 
     * @param {THREE.Vector3} origin 
     * @returns {Object} {distance: int ,position: obj}
     */
    castRays(rayTargets, origin)
    {
        //FIXME: no need for a object arr, just use sum and sum.keys.length
        //instanciate the found objects arr
        const objectArr=[]
        //instanciate accumulator
        const sum= {distance:0,position:{x:0,y:0,z:0}}

        //loop through targets, aim raycaster and check for intersection
        //FIXME convert for(const of) -> for(i...)
        for(const target of rayTargets)
        {
            //TODO: ADD counter(CastRays)
            
            
            
            //aims the raycaster
            this.rayCaster.set(origin,target)


            //find intersections of environment objects
            const foundArr=this.rayCaster.intersectObjects(this.environmentObjects)

            //if something was found add it to the array
            if(foundArr.length)
            {
                objectArr.push(foundArr[0])
            }
        }

        //if there is something intersecting the ray
        if(objectArr.length)
        {


            //FIXME: unessecary loop, move this into the above if(foundArr)
            //sum the values in the array
            for(const obj of objectArr){
                //TODO: ADD counter(CastRays)

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

        //return the distance, else return null
        return (sum.distance)?sum:null

    }

    /** addEnvironmentObjects(){}
     * 
     * adds a new object to look for the raycaster
     */
    //#endregion

    //#region DEBUG
    
    /**
     * sets up the debug gui 
     */
    setUpDebug()
    {
        const folder= this.gui.addFolder('Rays')
        //set up Points
        
        this.debug.rotation=0
        this.debug.getPointCount=()=>{console.log(`Sphere points: ${this.debug.rayTargetCount}`)}
        this.debug.getTest=()=>{console.log(`Test:`);console.log(this.debug.test)}
        // console.log(this.debug)


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

    /**
     * draws a path from the origin parameter to the obsticle parameter
     * 
     * @param {*} obsticle 
     * @param {*} origin 
     * @returns 
     */
    debugRay(obsticle,origin)
    {   
        //clear the last ray path
        // console.log(obsticle)
        // console.log('debugging ray')
        this.removeRay()
        
        
        if(!obsticle.isVector3){obsticle= obsticle.position;}

        const lineMaterial= new THREE.LineBasicMaterial();
        lineMaterial.color=new THREE.Color("green")
        const baseTarget= origin
        const target= new THREE.Vector3(obsticle.x,obsticle.y,obsticle.z)
        // target.clampLength(0,this.rayFar)
        const lineArr=[]

        let lineGeometry = new THREE.BufferGeometry().setFromPoints( [baseTarget,target] );


        let line = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(line);
        lineArr.push(line)
            
    
        return lineArr

    }

    /**
     * draws a line for every target for a specific origin
     */
    debugTestTargets()
    {
        // const arr= this.toVec3Arr(this.rayPositions_floatArray)
        const vertices= this.toWorldVertices(this.pointSphere.geometry)

        const origin= this.debug.origin
        // console.log(origin)
        // this.rayPositions_vec3Array.forEach((target)=>
        //     {
        //         this.debugRay(target, origin)
        //     })
        // console.log(vertices.length)

        vertices.forEach((target)=>
            {   
                // target.clamp(new THREE.Vector3(0,0,0),this.rayFar)
                // target.add(origin).normalize()
                target.clampLength(0,this.rayFar).add(origin)
                // console.log(clamp)
                this.debugRay(target, origin)
            })


        
    }

    /**
     * removes the drawn path
     */
    removeRay(){
        if(this.debug.ray){
            // console.log(this.debug.ray[0].material)
            this.debug.ray[0].material.color.set(new THREE.Color("red"))
            // this.scene.remove(this.debug.ray[0])
            // this.debug.ray[0].material.dispose()
            // this.debug.ray[0].geometry.dispose()
        }
    }

    updateAngle(rayAngleLimit)
    {
        // this.rayAngleLimit=rayAngleLimit

        // this.rayColours= this.fibonacci_colours()
        this.rayPositions_vec3Array=this.fibonacci_sphere_vec3()
        this.rayPositions_floatArray=this.toFloatArr(this.rayPositions_vec3Array)
        this.pointSphere.geometry.setAttribute('position',
            new THREE.BufferAttribute(this.rayPositions_floatArray,3)
        )
        this.needsUpdate=true
    }

    updateArrayCount(count)
    {
        // this.rayCount=count
        // this.debugColours= this.fibonacci_colours()
        this.rayPositions_vec3Array=this.fibonacci_sphere_vec3()
        this.rayPositions_floatArray=this.fibonacci_sphere()
        this.pointSphere.geometry.setAttribute('position',
            new THREE.BufferAttribute(this.rayPositions_floatArray,3)
        )
        this.needsUpdate=true

    }

    test()
    {
        // const modifiedvec3=this.toVec3Arr(this.rayPositions_floatArray)
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
    //#endregion

    //#region utils

    /**
     * converts the vertices of the pointsphere mesh to world space
     * @returns [THREE.Vector3] array
     */
    toWorldVertices()
    {
        const positionAttribute = this.pointSphere.geometry.getAttribute( 'position' );
        // console.log(positionAttribute)
        const rotatedVerticies=[]
        for(let i=0; i<positionAttribute.count;i++)
            {
                //TODO: ADD counter(toWorldVertices)

                const vertex = new THREE.Vector3();
                vertex.fromBufferAttribute( positionAttribute, i );
                this.pointSphere.localToWorld( vertex );
                rotatedVerticies.push(vertex)
                
            }

        

        return rotatedVerticies
    }

    /**
     * Converts a THREE.Vector3 array to a Float32Array
     * @param {*} arr 
     * @returns 
     */
    toFloatArr(arr)
    {
        const floatArr= new Float32Array(arr.length*3)
        arr.forEach((vec,i)=>
        {
            //TODO: ADD counter(toFloatArr)

            const i3=i*3
            floatArr[i3]=vec.x
            floatArr[i3+1]=vec.y
            floatArr[i3+2]=vec.z
        })
        return floatArr
    }

    /**
     * Converts a Float32Array to a THREE.Vector3 array
     * @param {*} arr 
     * @returns 
     */
    toVec3Arr(arr)
    {
        
        const vec3Arr=[]
        for (let i = 0; i < arr.length/3; i++) {
                //TODO: ADD counter(toVec3Arr)
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

    //TODO: ADD counter() method
    /**
     *  counter(name,return flag||false, incrementValue||1)
     *  if(returnFlag){console.log(this.count)}
     *  checks if this.count[name] exists, create if it does with count=0
     *  this.count[name]+=incrementVaule
     * 
     */

    //#endregion

    //#region unused
    
    
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

