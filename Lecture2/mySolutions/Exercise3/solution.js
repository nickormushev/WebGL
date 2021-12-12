function start() {

    gl = getContext("picasso");
    glprog = getProgram("vshader","fshader");

    aXY = gl.getAttribLocation(glprog,"aXY");
    aGreen = gl.getAttribLocation(glprog,"aGreen");
    
    gl.clearColor(1,1,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var n = 1000000;
    let data = [];

    for (let i = 0; i < n; i++) {
        let xCoord = random(-1, 1);
        let yCoord = random(-1, 1);
        let green = random(0, 1);
        data.push(xCoord, yCoord, green);
    }

    let buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(aXY);
    gl.enableVertexAttribArray(aGreen);
    gl.vertexAttribPointer(aXY, 2, gl.FLOAT, false, 3 * FLOATS, 0 * FLOATS);
    gl.vertexAttribPointer(aGreen, 1, gl.FLOAT, false, 3 * FLOATS, 2 * FLOATS);

    gl.drawArrays(gl.POINTS, 0, n);
}

