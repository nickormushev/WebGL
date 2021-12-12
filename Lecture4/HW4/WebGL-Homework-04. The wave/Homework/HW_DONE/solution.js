var k=40; 
let nyanColor = true;

function start( )
{
    var	canvas = document.getElementById("picasso");
    canvas.addEventListener('webglcontextlost',function(event){event.preventDefault();},false);
    canvas.addEventListener('webglcontextrestored',function(){init();},false);

    init();
    drawFrame();
}


function init()
{
    gl = getContext("picasso");
    glprog = getProgram("vshader","fshader");

    aRA = gl.getAttribLocation(glprog,"aRA");
    aFrame = gl.getAttribLocation(glprog,"aFrame");
    uProjectionMatrix = gl.getUniformLocation(glprog,"uProjectionMatrix");
    uViewMatrix = gl.getUniformLocation(glprog,"uViewMatrix");
    uModelMatrix = gl.getUniformLocation(glprog,"uModelMatrix");
    
    uAmbientColor = gl.getUniformLocation(glprog,"uAmbientColor");
    uUseAmbient   = gl.getUniformLocation(glprog,"uUseAmbient");
    uUseNyanColour   = gl.getUniformLocation(glprog,"uUseNyanColour");

    uDiffuseColor = gl.getUniformLocation(glprog,"uDiffuseColor");
    uUseDiffuse = gl.getUniformLocation(glprog,"uUseDiffuse");

    uSpecularColor = gl.getUniformLocation(glprog,"uSpecularColor");
    uUseSpecular = gl.getUniformLocation(glprog,"uUseSpecular");

    uLightDir = gl.getUniformLocation(glprog,"uLightDir");
    uShininess = gl.getUniformLocation(glprog,"uShininess");

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(1,1,1,1);

    identity();
    perspective(30,gl.canvas.width/gl.canvas.height,1,40000);

    // генерираме триъгълниците: координати на върхове и нормали
    // на върховете на всеки триъгълник слагаме нормалата от първия му връх
    let data = [];

    let step = 360/(2 * k);
    for (var r = 1; r <= Math.sqrt(2) * k; r++)
    {
        for (var i = 0; i < 2 * k; i++)
        {
            let angle = radians(step * i);
            data.push(r, angle);
            data.push(r - 1, angle);
            angle = radians(step * (i + 1));
            data.push(r, angle);

            angle = radians(step * i);
            data.push(r - 1, angle);
            angle = radians(step * (i + 1));
            data.push(r, angle);
            data.push(r - 1, angle);
        }
    }

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    // включване на върховете
    gl.enableVertexAttribArray(aRA);
    gl.vertexAttribPointer(aRA,2,gl.FLOAT,false,0*FLOATS,0*FLOATS);
    
    // настройка на цветове и светлини
    gl.uniform3f(uAmbientColor,0.5,0.5,0.5);
    gl.uniform3f(uDiffuseColor,1,1,1);
    gl.uniform3f(uSpecularColor,1,1,1);
    gl.uniform1f(uShininess,100);

    gl.uniform3f(uLightDir,0,0,-1);
    
    gl.uniform1i(uUseAmbient,true);
    gl.uniform1i(uUseNyanColour, false);
    gl.uniform1i(uUseDiffuse,true);
    gl.uniform1i(uUseSpecular,true);
}

function enable_nyan() {
    gl.uniform1i(uUseNyanColour,true);
}

function enable_chocolate() {
    gl.uniform1i(uUseNyanColour, false);
}

var frame = 0;

function drawFrame()
{
    frame++;
    gl.clear(gl.COLOR_BUFFER_BIT+gl.DEPTH_BUFFER_BIT); // изчистваме цвета и дълбочината

    // движение на камерата около повърхнината с периодично
    // приближаване към и отдалечаване от нея
    var dist = 80+37*Math.sin(frame/100);
    var d = 0.6+0.3*Math.sin(frame/200);
    lookAt([dist*Math.cos(frame/300)*d,dist*Math.sin(frame/300)*d,(140-dist)*d], [0.1,-0.1,0], [0,0,1]);

    let animationSpeed = 3;
    gl.vertexAttrib1f(aFrame, frame / animationSpeed);

    useMatrix();
    for (var i = 0; i < Math.sqrt(2) * k - 1; i++) {
        gl.drawArrays(gl.TRIANGLES, i * (2 * k) * (2 * 3),(2*k)*(2*3));
    }

    requestAnimationFrame(drawFrame);
}

