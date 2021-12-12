const m = 11;
const N = 9;
var data = [0,1,0,0,0,0,1,1,0,1,0,0];

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
    uProjectionMatrix = gl.getUniformLocation(glprog,"uProjectionMatrix");
    uViewMatrix = gl.getUniformLocation(glprog,"uViewMatrix");
    uModelMatrix = gl.getUniformLocation(glprog,"uModelMatrix");

    aColor = gl.getAttribLocation(glprog,"aColor");
    gl.vertexAttrib3f(aColor,1,0.5,0);

    gl.clearColor(1,1,1,1);

    identity();
    perspective(30,gl.canvas.width/gl.canvas.height,1,40000);

    // тук да се създаде една лента от шахматно разположени квадрати
    data = [];

    for (var y = 0; y < m; y++) {
        let beginOffset = (y % 2 === 0) ? 0 : 1;
        let dotCounter = 0;
        for (var x = beginOffset; x < N + 1; x++) {
            if((dotCounter + 1) % 3 !== 0) {
                data.push(x, y);
                data.push(x, y + 1);
            } else {
                x--;
                data.push(x, y + 1);
                data.push(x + 1, y);
            }
            dotCounter++;
        }

        data.push(N, y + 1);
        if(beginOffset == 0) {
            data.push(2, y + 1);
        } else {
            data.push(0, y + 1);
        }
    }
    
    var e = document.getElementById('title');

    e.innerHTML = e.innerHTML+' ('+data.length*FLOATS/(N*m)+' байта, '+1+' drawArrays)';


    translate([-5, 0, 0]);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(aXY);
    gl.vertexAttribPointer(aXY,2,gl.FLOAT,false,0,0);
}

var frame = 0;

function drawFrame()
{
    frame++;
    gl.clear(gl.COLOR_BUFFER_BIT+gl.DEPTH_BUFFER_BIT);

    lookAt([1/2,1/2,30], [1/2,1/2,0], [Math.sin(frame/200),Math.cos(frame/200),0]);
    useMatrix();

    // рисуване на мрежата от квадрати с едно
    // извикване на drawArrays
    gl.drawArrays(gl.TRIANGLE_STRIP,0,  data.length/2);
    
    requestAnimationFrame(drawFrame);
}
