function start( )
{
    gl = getContext("picasso");
    glprog = getProgram("vshader","fshader");

    aXY = gl.getAttribLocation(glprog,"aXY");
    aRGB = gl.getAttribLocation(glprog,"aRGB");
    gl.vertexAttrib3f(aRGB,0,1,1);
    
    gl.clearColor(1,1,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var n = 150;
    let data = [];
    let r = 0.6; 
    let pointOffset = 360/n;
    let pointOffsetRad = pointOffset * Math.PI/180;

    for (var i = 0; i < n; i++) {
        // this makes the radius longer so we can have a second point which will be used to draw the hair.
        let secondPointOffset = random(0.05, 0.4) + r;
        let aspectRatio = 4/6
        data.push(aspectRatio * r * Math.cos(pointOffsetRad * i), r * Math.sin(pointOffsetRad * i),
            aspectRatio * secondPointOffset * Math.cos(pointOffsetRad * i), secondPointOffset * Math.sin(pointOffsetRad * i));
    }
    
    let buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aXY);
    gl.vertexAttribPointer(aXY, 2, gl.FLOAT, false, 4 * FLOATS, 0 * FLOATS);

    gl.drawArrays(gl.LINE_LOOP, 0, n);

    gl.vertexAttribPointer(aXY, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0, 2 * n);
    


}
