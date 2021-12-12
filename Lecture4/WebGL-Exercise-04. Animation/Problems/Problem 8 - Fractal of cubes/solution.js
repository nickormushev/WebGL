var k=40;

function start( )
{
    var	canvas = document.getElementById("picasso");
    canvas.addEventListener('webglcontextlost',function(event){event.preventDefault();},false);
    canvas.addEventListener('webglcontextrestored',function(){init();},false);

    init();
    drawFrame();
}

// рисуване на единичен куб
function drawCube()
{
    useMatrix();
    gl.drawArrays(gl.TRIANGLES,0,36);
}

// This can probably be done in a smarter way but it still works
// Rotates the object so the x axis faces the right direction.
// Either towards one of the sides of the cube or it's floor or ceiling
function rotate(k) {
    if (k < 4) {
        zRotate(90 * k);
    } else if(k == 4) {
        yRotate(90);
    } else {
        yRotate(-90);
    }
}

// Using dfs I create the subcubes
function createCubes(depth, frame) {
    if(depth == 0) {
        return;
    }
    let offset = 1/2;
    
    for (var k = 0; k < 6; k++) {
        pushMatrix();

        rotate(k);
        translate([offset, 0, 0]);
        scale([1/2,1/2,1/2]);
        translate([offset * Math.cos(frame/30) + 0.1, 0, 0]);
        drawCube();
        createCubes(depth - 1, frame);
        popMatrix();
    }
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
    uDiffuseColor = gl.getUniformLocation(glprog,"uDiffuseColor");
    uSpecularColor = gl.getUniformLocation(glprog,"uSpecularColor");

    aNormal = gl.getAttribLocation(glprog,"aNormal");


    uLightDir = gl.getUniformLocation(glprog,"uLightDir");
    uShininess = gl.getUniformLocation(glprog,"uShininess");

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0,0,0,1);

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

    // настройка на цветове и светлини
    gl.vertexAttrib3f(aColor,1/2,1/2,1);
    gl.uniform3f(uAmbientColor,0.2,0.2,0.2);
    gl.uniform3f(uDiffuseColor,1,1,1);
    gl.uniform3f(uSpecularColor,0.7,0.7,0.7);
    gl.uniform1f(uShininess,15);

    gl.uniform3f(uLightDir,0.5,-0.5,-1);
}

var frame = 0;
let depth = 4;
function drawFrame()
{
    frame++;
    gl.clear(gl.COLOR_BUFFER_BIT+gl.DEPTH_BUFFER_BIT);

    lookAt([4*Math.cos(frame/100),4*Math.sin(frame/100),0], [0,0,0], [0,0,1]);
    // засега се рисува само най-големият куб
    // добавете и останалите кубове
    identity();
    
    //yRotate(0.5);
    drawCube();

    createCubes(depth, frame);
    
    requestAnimationFrame(drawFrame);
}

