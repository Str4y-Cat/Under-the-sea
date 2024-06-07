import { Container, Sprite } from 'pixi.js';


export function addBoidsToScene(app, boidSprites, boidPositions)
{
    // Create a container to hold all the sprites.
    const boidContainer = new Container();

    // Add the boid container to the stage.
    app.stage.addChild(boidContainer);

    const boidAsset = 'boid1';

    // Create a boid sprite for each boid.
    for (const boid_Obj of boidPositions)
    {
        

        // Create a boid sprite.
        const boidSprite = Sprite.from(boidAsset);

        // Center the sprite anchor.
        boidSprite.anchor.set(0.5);
        boidSprite.scale.set(0.2);
        boidSprite.speed = 1;

        // Assign additional properties for the animation.
        boidSprite.direction = boid_Obj.direction;
        boidSprite.position.copyFrom(boid_Obj.position) ;


        boidContainer.addChild(boidSprite);
        boidSprites.push(boidSprite);
        
    }

    

}

export function animateBoids(app, boidSprites, time , boidPositions )
{
    // Extract the delta time from the Ticker object.
    const delta = time.deltaTime;

    //Parameters
    const stagePadding = 10;
    const boundWidth = app.screen.width + stagePadding * 2;
    const boundHeight = app.screen.height + stagePadding * 2;

    // Iterate through each fish sprite.
    boidSprites.forEach((boidSprite,i) =>
    {
        

        // boidSprite.direction = boidPositions[i].direction;

        
        // boidSprite.position.copyFrom(boidPositions[i].position)

        
        // boidSprite.rotation = -boidSprite.direction - Math.PI / 2;

        
      
    });
}


