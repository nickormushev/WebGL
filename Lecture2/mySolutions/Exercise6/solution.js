function start() {
    gl = getContext("picasso");
    glprog = getProgram("vshader","fshader");

    aXY = gl.getAttribLocation(glprog,"aXY");
    aRGB = gl.getAttribLocation(glprog,"aRGB");
    
    gl.clearColor(1,1,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Общо n зъба
    var n = 39;
    var data = [];
    let increment = 6/n;
    let start = -3;

    data.push(-0.95, 0, 0.95, 0, 0, -0.95, 0, 0.95);
    
    // добавете код за създаване на буфера с върхове
    for (let i = 0; i < n; i++) {
        let x = start + i * increment;
        // I multiplied by yLimit because I wanted
        // y to vary between -yLimit to yLimit instead of -1 to 1
        let yLimit = 0.5;
        let y1 = Math.sin(x) * yLimit;
        let y2 = Math.cos(x) * yLimit;
        let nX = 0.95 * x / 3;
        if(i % 2 == 0) {
            data.push(nX, y2, nX, y1);
        } else {
            data.push(nX, y1, nX, y2);
        }
    }

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(aXY);
    gl.vertexAttribPointer(aXY,2,gl.FLOAT,false,0,0);

    gl.vertexAttrib3f(aRGB, 0, 0, 0);
    gl.drawArrays(gl.LINES, 0, 4);

    gl.vertexAttrib3f(aRGB, 1, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 4, n * 2);
    
    // първо рисуваме черни координатни оси,
    // а после и червена графика между синус и косинус
}

