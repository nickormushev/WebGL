function start( )
{
    var	canvas = document.getElementById("picasso");
    canvas.addEventListener('webglcontextlost',function(event){event.preventDefault();},false);
    canvas.addEventListener('webglcontextrestored',function(){init();},false);

    init();
    drawFrame();
}

function drawCube()
{
    useMatrix();
    gl.drawArrays(gl.TRIANGLES,0,36);
}

function init()
{
    gl = getContext("picasso");
    glprog = getProgram("vshader","fshader");

    
    aXYZ = gl.getAttribLocation(glprog,"aXYZ");
    uProjectionMatrix = gl.getUniformLocation(glprog,"uProjectionMatrix");
    uViewMatrix = gl.getUniformLocation(glprog,"uViewMatrix");
    uModelMatrix = gl.getUniformLocation(glprog,"uModelMatrix");

    aColor = gl.getAttribLocation(glprog,"aColor");
    uAmbientColor = gl.getUniformLocation(glprog,"uAmbientColor");
    aNormal = gl.getAttribLocation(glprog,"aNormal");
    uDiffuseColor = gl.getUniformLocation(glprog,"uDiffuseColor");
    uLightDir = gl.getUniformLocation(glprog,"uLightDir");

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(1,1,1,1);

    identity();
    perspective(30,gl.canvas.width/gl.canvas.height,1,40000);

    // куб 1x1x1
    var v = [ [+0.5,-0.5,-0.5], [+0.5,+0.5,-0.5],
              [-0.5,+0.5,-0.5], [-0.5,-0.5,-0.5],
              [+0.5,-0.5,+0.5], [+0.5,+0.5,+0.5],
              [-0.5,+0.5,+0.5], [-0.5,-0.5,+0.5] ];
    var n = [ [1,0,0], [-1,0,0],
              [0,1,0], [0,-1,0],
              [0,0,1], [0,0,-1] ];
    var data = [].concat(
              v[0],n[0],v[1],n[0],v[4],n[0],
              v[4],n[0],v[1],n[0],v[5],n[0],
              v[6],n[1],v[2],n[1],v[7],n[1],
              v[7],n[1],v[2],n[1],v[3],n[1],
              v[5],n[2],v[1],n[2],v[6],n[2],
              v[6],n[2],v[1],n[2],v[2],n[2],
              v[4],n[3],v[7],n[3],v[0],n[3],
              v[0],n[3],v[7],n[3],v[3],n[3],
              v[4],n[4],v[5],n[4],v[7],n[4],
              v[7],n[4],v[5],n[4],v[6],n[4],
              v[0],n[5],v[3],n[5],v[1],n[5],
              v[1],n[5],v[3],n[5],v[2],n[5] );

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aXYZ);
    gl.vertexAttribPointer(aXYZ,3,gl.FLOAT,false,6*FLOATS,0*FLOATS);

    gl.enableVertexAttribArray(aNormal);
    gl.vertexAttribPointer(aNormal,3,gl.FLOAT,false,6*FLOATS,3*FLOATS);

    gl.vertexAttrib3f(aColor,0.8,1,0.5);
    gl.uniform3f(uAmbientColor,0.2,0,0);
    gl.uniform3f(uDiffuseColor,1,1,1);
    gl.uniform3f(uLightDir,0,0,-1);
}

var frame = 0;

function drawFrame()
{
    frame++;
    gl.clear(gl.COLOR_BUFFER_BIT+gl.DEPTH_BUFFER_BIT);

    lookAt([50*Math.cos(frame/200),0,50*Math.sin(frame/200)], [0,0,0], [0,1,0]);
    
    let N = 30;
    // рисуване на шредера (за момента 
    // се рисува само един от резците)
    for (var i = 0; i < N; i++) {
        identity();
        zRotate(360*i/N);
        translate([0, 10 , 0]);
        xRotate(-2 * frame * (i % 2 != 0));
        xRotate(2 * frame * (i % 2 == 0));
        scale([0.5, 2, 10]);
        drawCube();
    }

    requestAnimationFrame(drawFrame);
}
