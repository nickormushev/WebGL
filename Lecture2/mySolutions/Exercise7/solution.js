class Triangle {
  constructor(x1, y1, x2, y2, x3, y3) {
    this.x1 = x1;
    this.y1 = y1;

    this.x2 = x2;
    this.y2 = y2;

    this.x3 = x3;
    this.y3 = y3;
  }
}

function start( )
{
    gl = getContext("picasso");
    glprog = getProgram("vshader","fshader");

    aXY = gl.getAttribLocation(glprog,"aXY");
    aRGB = gl.getAttribLocation(glprog,"aRGB");
    
    gl.clearColor(1,1,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var data = [];
    let lineLength = 0.2;
    let leftTriangle = new Triangle(-1, lineLength - 1, -1, 1 - lineLength, -lineLength, 0);
    let rightTriangle = new Triangle(1, lineLength - 1, 1, 1 - lineLength, lineLength, 0);
    let bottomTriangle = new Triangle(lineLength - 1, -1, 1 - lineLength, -1, 0, -lineLength);
    let topTriangle = new Triangle(-1 + lineLength, 1, 1 - lineLength, 1, 0, lineLength);

    gl.clearColor(1,204/255,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    data.push(leftTriangle.x1, leftTriangle.y1, leftTriangle.x2, leftTriangle.y2, leftTriangle.x3, leftTriangle.y3);
    data.push(rightTriangle.x1, rightTriangle.y1, rightTriangle.x2, rightTriangle.y2, rightTriangle.x3, rightTriangle.y3);
    data.push(topTriangle.x1, topTriangle.y1, topTriangle.x2, topTriangle.y2, topTriangle.x3, topTriangle.y3);
    data.push(bottomTriangle.x1, bottomTriangle.y1, bottomTriangle.x2, bottomTriangle.y2, bottomTriangle.x3, bottomTriangle.y3);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(aXY);
    gl.vertexAttribPointer(aXY,2,gl.FLOAT,false,0,0);
    

    gl.vertexAttrib3f(aRGB, 0, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    gl.vertexAttrib3f(aRGB, 25/255, 153/255, 51/255);
    gl.drawArrays(gl.TRIANGLES, 6, 6);

}

