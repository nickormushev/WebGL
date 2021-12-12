var k=40; 
let nyanColor = false;
function getColour(radius) {
    if (nyanColor == false) {
        return [92/255, 51/255, 23/255];
    }

    if(radius < 10) {
        //return vec3(1.0, 0.0, 0.0);
        return [ 255/255, 125/255, 125/255 ];
    }

    if(color < 20) {
        //return vec3(1.0, 165.0/255.0, 0.0);
        return [ 255/255, 249/255, 121/255 ];
    }

    if(color < 30) {
        //return vec3(1.0, 1.0, 0.0);
        return [ 111/255, 255/255, 106/255 ];
    }

    if(color < 40) {
        //return vec3(0.0, 1.0, 0.0);
        return [ 153/255, 252/255, 255/255 ];
    }

    //if(color == 4.0) {
        //return vec3(0.0, 0.0, 1.0);
        return [ 255/255, 145/255, 250/255 ];
    //}

    //return vec3(1.0, 0.0, 1.0);
}

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

    aXY = gl.getAttribLocation(glprog,"aXY");
    aFrame = gl.getAttribLocation(glprog,"aFrame");
    uProjectionMatrix = gl.getUniformLocation(glprog,"uProjectionMatrix");
    uViewMatrix = gl.getUniformLocation(glprog,"uViewMatrix");
    uModelMatrix = gl.getUniformLocation(glprog,"uModelMatrix");
    
    aColor = gl.getAttribLocation(glprog,"aColor");
    uAmbientColor = gl.getUniformLocation(glprog,"uAmbientColor");
    uUseAmbient   = gl.getUniformLocation(glprog,"uUseAmbient");

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
    for (var r = 1; r <= Math.sqrt(2) * k; r += 1)
    {
        for (var i = 0; i < 2 * k; i++)
        {
            let angle = radians(step * i);
            data.push(r * Math.cos(angle), r * Math.sin(angle));
            //data = data.concat(colourR);
            data.push((r - 1) * Math.cos(angle), (r - 1) * Math.sin(angle));
            //data = data.concat(colourR1);
            angle = radians(step * (i + 1));
            data.push(r * Math.cos(angle), r *  Math.sin(angle));
            //data = data.concat(colourR);

            angle = radians(step * i);
            data.push((r - 1) * Math.cos(angle), (r - 1) * Math.sin(angle));
            //data = data.concat(colourR1);
            angle = radians(step * (i + 1));
            data.push(r * Math.cos(angle), r *  Math.sin(angle));
            //data = data.concat(colourR);
            data.push((r - 1) * Math.cos(angle), (r - 1) * Math.sin(angle));
            //data = data.concat(colourR1);
        }
    }

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    // включване на върховете
    gl.enableVertexAttribArray(aXY);
    //gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aXY,2,gl.FLOAT,false,0*FLOATS,0*FLOATS);
    
    // настройка на цветове и светлини
    //gl.vertexAttribPointer(aColor,3,gl.FLOAT,false,5*FLOATS,2*FLOATS);
    gl.vertexAttrib3f(aColor,92/255, 51/255, 23/255);
    gl.uniform3f(uAmbientColor,0.5,0.5,0.5);
    gl.uniform3f(uDiffuseColor,1,1,1);
    gl.uniform3f(uSpecularColor,1,1,1);
    gl.uniform1f(uShininess,20);

    gl.uniform3f(uLightDir,0,0,-1);
    
    gl.uniform1i(uUseAmbient,true);
    gl.uniform1i(uUseDiffuse,true);
    gl.uniform1i(uUseSpecular,true);
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
    for (var i = 0; i < Math.sqrt(2) * k; i++) {
        gl.drawArrays(gl.TRIANGLES, i * (2 * k) * (2 * 3),(2*k)*(2*3));
    }

    requestAnimationFrame(drawFrame);
}

