function start()
{
    gl = getContext("picasso");
    glprog = getProgram("vshader","fshader");


    //Aspect ratio
    uAspect = gl.getUniformLocation(glprog, "uAspect");
    uDotCount = gl.getUniformLocation(glprog, "uDotCount");
    aIndex = gl.getAttribLocation(glprog, "aIndex");
    aRGB = gl.getAttribLocation(glprog,"aRGB");

    gl.clearColor(1,1,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var n = 250;
    var data = [ ];
    for(let i = 0; i < n; i++) {
        data.push(i);
    }

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    gl.vertexAttrib3f(aRGB,1,0.2,0);
    gl.uniform1f(uAspect, 4/6);
    gl.uniform1i(uDotCount, n);

    gl.enableVertexAttribArray(aIndex);
    gl.vertexAttribPointer(aIndex, 1, gl.FLOAT, false, 0, 0);

    // създаден е буфера с n поредни числа, остава да подадете
    // числата и броя им, за да се нарисува пеперудата
    gl.drawArrays(gl.LINE_LOOP,0,n);
}

