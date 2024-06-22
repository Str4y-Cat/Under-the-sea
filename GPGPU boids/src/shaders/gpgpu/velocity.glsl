void main()
{

    // float velocity= uVelocity;
    vec2 uv= gl_FragCoord.xy/resolution.xy;
    vec4 velocity= texture(uVelocity,uv);
    vec4 position= texture(uPosition,uv);
    gl_FragColor= vec4(uv.xy,1.0,1.0);
}