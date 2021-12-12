function start( )
{
    gl = getContext("picasso");
    glprog = getProgram("vshader","fshader");

    aXY = gl.getAttribLocation(glprog,"aXY");
    aRGB = gl.getAttribLocation(glprog,"aRGB");
    
    gl.clearColor(1,1,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // брой сегменти n
    var n = 60;
    let step = 360 / n;
    let radStep = step/180 * Math.PI ;
    let radius = 0.9

    let colourSections = n / 3;
    let data = []; 
    // създаване на цветното колело
    for (let i = 0, colourCounter = 0; i < n + 1; i++, colourCounter++) {
        if(colourCounter > colourSections) {
            colourCounter = 0;
        }
        data.push(4/6 * radius * Math.cos(i * radStep), radius * Math.sin(i * radStep),
            1, colourCounter/colourSections, 0);
        data.push(0,0, 1, 1, 1);
    }

    let buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(aXY);
    gl.enableVertexAttribArray(aRGB);
    gl.vertexAttribPointer(aRGB, 3, gl.FLOAT, false, 5 * FLOATS, 2 * FLOATS);
    gl.vertexAttribPointer(aXY, 2, gl.FLOAT, false, 5 * FLOATS, 0);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n * 2 + 1);
}

        //if (i < colourSections) { 
            //data.push(4/6 * radius * Math.cos(i * radStep), radius * Math.sin(i * radStep),
                //i/colourSections, (colourSections - i)/colourSections, 0);
        //} else if (i < 2 * colourSections) {
            //data.push(4/6 * radius * Math.cos(i * radStep), radius * Math.sin(i * radStep),
                //(2 * colourSections - i)/colourSections, 0, (i - colourSections)/colourSections );
        //} else {
            data.push(4/6 * radius * Math.cos(i * radStep), radius * Math.sin(i * radStep),
                0, i - 2 * colourSections, (3 * colourSections - i)/colourSections );
        //}
