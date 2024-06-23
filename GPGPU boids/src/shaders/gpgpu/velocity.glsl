uniform float uDelta;
uniform float uTime;




uniform float uVisualRange;
uniform float uProtectedRange;
uniform float uSeperation;
uniform float uCohesion;
uniform float uAlignment;
uniform float uTurnFactor;
uniform vec3 uBoundsMin;
uniform vec3 uBoundsMax;


void main()
{
        float visualRange=  uVisualRange;
        float protectedRange=  uProtectedRange;
        float seperation=  uSeperation;
        float cohesion=  uCohesion;
        float alignment=  uAlignment;
        float turnFactor=  uTurnFactor;
        vec3 boundsMin=   uBoundsMin;
        vec3 boundsMax=   uBoundsMax;

    float delta = uDelta;
    float time = uTime;

    // float velocity= uVelocity;
    vec2 uv= gl_FragCoord.xy/resolution.xy;
    uv.xy+=delta;
    vec4 velocity= texture(uVelocity,uv);
    vec4 position= texture(uPosition,uv);
    gl_FragColor= vec4(1.0,0.0,1.0,1.0);
}