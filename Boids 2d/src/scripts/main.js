import GUI from "lil-gui"
// import { Application, Assets } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { addBoidsToScene, animateBoids } from './fish';
import BOID from "./boids";

const gui= new GUI()

const debug={
    boidCount:5
}

const sizes={
    width:window.innerWidth,
    height:window.innerHeight,

}


// Create a PixiJS application.
const app = new PIXI.Application();

// Store an array of fish sprites for animation.
const boidSprites = [];


const boid= new BOID(debug.boidCount,sizes)

// gui.add(debug,'boidCount').min(1).max(100).step(1)

async function setup()
{
    await app.init({ background: '#1099bb', resizeTo: window });
    document.body.appendChild(app.canvas);
    // Enable interactivity!
    app.stage.eventMode = 'static';

    // Make sure the whole canvas area is interactive, not just the circle.
    app.stage.hitArea = app.screen;
}

async function preload()
{
    const assets = [
        { alias: 'boid1', src: '/img/circle-red.png' },

    ];
    await PIXI.Assets.load(assets);
}


// Async "MAIN"
(async () =>
    {
 
    
    const values={
        mousePos: {x:0, y:0}
    }
    
        await setup();
        await preload();

        

        addBoidsToScene(app, boidSprites,boid.boidArray);

        boidSprites[0].eventMode = 'static';
        boidSprites[0].cursor = 'pointer';
        boidSprites[0].on('pointerdown', ()=>{
            console.log(boid.getCloseBoids(boidSprites[0],0))
        });
        

        
        app.ticker.add((time) =>
            {   
                boid.update()
                animateBoids(app, boidSprites, time, boid.boidArray)
                // console.log(boid.boidArray)
            } );
    
    })();




    //UTILS
    function enableUserInput(app){
        const mousePos={}
        app.stage.addEventListener('pointermove', (e) =>
            {
                mousePos=e.global
            });
        return mousePos
    }