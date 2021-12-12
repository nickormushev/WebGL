function drawCircle(data, rad, n) {
    for(var i=0; i < n; i++) {
        data.push(rad * Math.cos(2.0*Math.PI*i/n), rad * Math.sin(2.0 *Math.PI*i/n));
    }
}

function radians(degrees) {
    return degrees*Math.PI/180;
}


function zRotateMatrix(a) {
    a = radians(a);
    var c = Math.cos(a);
    var s = Math.sin(a);
    let aspectRatio = 4/6;
    var matrix = [
        aspectRatio * c, s, 0, 0,
        aspectRatio * -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1];
    return new Float32Array(matrix);
}

// identity with apsect ratio
function identity() {
    let aspectRatio = 4/6;
    var matrix = [
        aspectRatio, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
    return new Float32Array(matrix);
}


function draw(data, circlePoints, holeRainbowPoints, holeCount) {
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    uModelMatrix = gl.getUniformLocation(glprog, "uModelMatrix");
    gl.uniformMatrix4fv(uModelMatrix, false, identity());

    gl.uniform3f(uColor,0.3,0.7,0.2);
    gl.enableVertexAttribArray(aXY);
    gl.vertexAttribPointer(aXY,2,gl.FLOAT,false,0,0);

    // рисуване на външната окръжност,
    // за да има някаква начална мостра,
    // която да се доработва
    gl.drawArrays(gl.LINE_LOOP,0, circlePoints);
    gl.drawArrays(gl.LINE_LOOP, circlePoints, circlePoints);

    let dataOffset = 2 * circlePoints;

    for (var i = 0; i < holeCount; i++) {
        let matrix = zRotateMatrix(i * 60);
        gl.uniformMatrix4fv(uModelMatrix, false, matrix);

        gl.drawArrays(gl.LINE_LOOP, dataOffset, 2 * holeRainbowPoints);
    }
}


function start( ) {
    gl = getContext("picasso");
    glprog = getProgram("vshader","fshader");

    aXY = gl.getAttribLocation(glprog,"aXY");
    uColor = gl.getUniformLocation(glprog,"uColor");

    gl.clearColor(1,1,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // точки по ролката
    var circlePoints = 360;

    // създаване на окръжности
    let data = []
    drawCircle(data, 0.8, circlePoints);
    drawCircle(data, 0.1, circlePoints);

    let degs = 40;
    let rad = 0.15;
    for(let i = 0; i < degs; i++) {
        data.push(rad * Math.cos(2.0*Math.PI*i/circlePoints), rad * Math.sin(2.0 *Math.PI*i/circlePoints));
    }

    // the second arc is in reverse so the points align right and I can use LINE_LOOP
    rad = 0.7;
    for(let i = degs - 1; i >= 0; i--) {
        data.push(rad * Math.cos(2.0*Math.PI*i/circlePoints), rad * Math.sin(2.0 *Math.PI*i/circlePoints));
    }


    draw(data, circlePoints, degs, 6)
}

