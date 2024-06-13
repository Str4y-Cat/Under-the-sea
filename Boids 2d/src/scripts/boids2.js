
export default class Boids2
{
    /**
     * 
     * @param {int} boidCount 
     * @param {object} displaySizes 
     * @param {object} param2
     * 
     */
    constructor(boidCount,displaySizes,{visualRange,protectedRange,cohesionFactor,matchingFactor,minSpeed,maxSpeed, wallTransparent})
    {
        //boid objects
        this.boidCount=count
        this.boidArray=this.setUpBoidPositions(this.boidCount)


        //world variables
        this.sizes=sizes
        this.transPadding = 10;
        this.solidPadding = 20;
        this.boundingBoxTransparent={
            width : this.sizes.width + this.transPadding * 2,
            height : this.sizes.height + this.transPadding * 2
        }
        this.boundingBoxSolid={
            top : this.solidPadding,
            bottom : this.sizes.height - this.solidPadding,

            left : this.solidPadding,
            right : this.sizes.width + this.solidPadding,
        }

        //debuggable objects
        this.visualRange=visualRange;
        this.protectedRange=protectedRange;
        this.cohesionFactor=cohesionFactor
        this.matchingFactor=matchingFactor
        this.minSpeed=minSpeed
        this.maxSpeed=maxSpeed   
        this.wallTransparent=(wallTransparent)
        
    }

    // updateBoids


    setUpBoidPositions(count){
        const boidArray=[]
        for(let i = 0; i< count; i++)
            {   
                const x= Math.random()*this.sizes.width
                const y= Math.random()*this.sizes.height
                boidArray.push(new Boid(x,y))
            }
        return boidArray
    }

    updateBoids()
    {
        this.boidArray.forEach((boid,i)=>
            {
                //zero accum variables
                let accum= this.accumulatorObject()

                //loop through every other boid
                this.boidArray.forEach((otherBoid,n)=>
                    {
                        //compute differences in xy coords
                        const dx= boid.x - otherBoid.x
                        const dy= boid.y - otherBoid.y

                        //check if they are within visual range
                        if(Math.abs(dx)<this.visualRange && Math.abs(dy)<this.visualRange)
                            {
                                //get the distance between the two boids
                                const distance= Math.sqrt(dx**2+dy**2)

                                //is the distance less than the protected range
                                if(distance< this.protectedRange)
                                    {
                                        //calculate the difference in x/y-coordinates to the nearfield boid
                                        accum.close_dx+=boid.x-otherBoid.x //!!!!!!!!! can just use dx
                                        accum.close_dy+=boid.y-otherBoid.y //!!!!!!!!! can just use dy

                                    }
                                
                                //if its not in the protected range, is it in the visual range?
                                else if(distance<this.visualRange)
                                    {
                                        //add other boids x/y coords and velocity variables to the accum
                                        accum.xpos_avg+=otherBoid.x
                                        accum.ypos_avg+=otherBoid.y
                                        accum.xvel_avg+=otherBoid.vx
                                        accum.yvel_avg+=otherBoid.yx

                                        //increment number of boids in visual range
                                        accum.neighboring_boids++
                                    }
                            }
                    })

                //check if there were any boids in the visual range
                if(accum.neighboring_boids>0)
                    {
                        //average the positions and velocity by number of neighboring boids
                        accum.xpos_avg/=accum.neighboring_boids
                        accum.ypos_avg/=accum.neighboring_boids
                        accum.xvel_avg/=accum.neighboring_boids
                        accum.yvel_avg/=accum.neighboring_boids

                        //add cohesion and alignment factors
                        boid.vx+= (accum.xpos_avg-boid.x)*this.cohesionFactor
                        boid.vx+= (accum.xvel_avg-boid.vx)*this.matchingFactor

                        boid.vy+= (accum.ypos_avg-boid.y)*this.cohesionFactor
                        boid.vy+= (accum.yvel_avg-boid.vy)*this.matchingFactor
                    }
                
                //Add sepperation factor
                boid.vx+= (accum.close_dx*this.seperationFactor) 
                boid.vy+= (accum.close_dy*this.seperationFactor)

                // if(this.wallType=='solid')
                    // {
                        //put into dedicated function
                        if(this.boundingBoxSolid.top)
                            {
                                boid.vy+=this.turnFactor
                            }
                        
                        if(this.boundingBoxSolid)
                            {
                                boid.vx+=this.turnFactor
                            }
                            
                        if(this.boundingBoxSolid)
                            {
                                boid.vx+=this.turnFactor
                            }
                        
                        if(this.boundingBoxSolid)
                            {
                                boid.vy+=this.turnFactor
                            }
                    // }
                // if(this.wallType=='transparent')
                //     {
                //     }
                
                // calculate boids speed
                const speed = Math.sqrt(boid.vx**2+boid.vy**2)

                //enforce speedlimits

                if (speed< this.minSpeed)
                    {
                        boid.vx= (boid.vx/speed)*this.minSpeed
                        boid.vy= (boid.vy/speed)*this.minSpeed
                    }
                if (speed> this.this.maxSpeed)
                    {
                        boid.vx= (boid.vx/speed)*this.maxSpeed
                        boid.vy= (boid.vy/speed)*this.maxSpeed
                    }
                
                //update positions
                boid.x+=boid.vx
                boid.y+=boid.vy
        })
    }

    accumulatorObject(){
        const accum=
        {
            xpos_avg:0,
             ypos_avg:0,
             xvel_avg:0,
             yvel_avg:0,
             neighboring_boids:0,
             close_dx:0,
             close_dy:0
        }
        return accum
    }

}

class Boid
{
    constructor(x,y)
    {
        this.x=x
        this.y=y
        this.vx=1
        this.vy=1
    }



}

