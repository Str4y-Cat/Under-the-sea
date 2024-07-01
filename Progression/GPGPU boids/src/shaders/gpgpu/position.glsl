void main()
{
    vec2 uv = gl_FragCoord.xy/resolution.xy;
    vec4 position= texture(uPosition,uv);
    vec4 velocity= texture(uVelocity,uv);
    // position.xyz+=0.01;
    gl_FragColor= vec4(position.xyz,1.0);
}