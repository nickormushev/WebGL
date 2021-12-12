class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
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

    // параметър n за точност на дъгите в триъгълника
    var n = 50;
    // The side acts as the radius
    let side = 1.2;
    let aspectRatio = 4/6;
    let leftPoint =  new Point(aspectRatio * -0.6, -0.5);
    let rightPoint = new Point(leftPoint.x + aspectRatio * side, leftPoint.y);
    let topPoint = new Point(leftPoint.x + aspectRatio * side/2, leftPoint.y + Math.sqrt(Math.pow(side, 2) - Math.pow(side/2, 2)));
    
    gl.vertexAttrib2f(aXY, topPoint.x, topPoint.y);
    gl.vertexAttrib3f(aRGB, 0, 0, 0);
    gl.drawArrays(gl.POINTS, 0, 2);
    gl.vertexAttrib2f(aXY, rightPoint.x, rightPoint.y);
    gl.drawArrays(gl.POINTS, 0, 2);
    gl.vertexAttrib2f(aXY, leftPoint.x, leftPoint.y);
    gl.drawArrays(gl.POINTS, 0, 2);


    let radiusStep = 60/n;
    let radiusStepRad = radiusStep * Math.PI/180;
    let data = [];

    data.push(leftPoint.x, leftPoint.y);
    for (var i = 0; i < n + 1; i++) {
        // we are addding leftPoint.x and leftPoint.y so we move coordinates to have a center leftPoint
        data.push(leftPoint.x + aspectRatio * side * Math.cos(i * radiusStepRad), leftPoint.y + side * Math.sin(i * radiusStepRad));
    }
    
    data.push(rightPoint.x, rightPoint.y);
    for (var i = 0; i < n + 1; i++) {
        // we are addding topPoint.x and topPoint.y so we move coordinates to have a center topPoint
        data.push(rightPoint.x + side * aspectRatio * Math.cos(120/180 * Math.PI + i * radiusStepRad),
            rightPoint.y + side * Math.sin(120/180 * Math.PI + i * radiusStepRad));
    }

    data.push(topPoint.x, topPoint.y);
    for (var i = 0; i < n + 1; i++) {
        // we are addding topPoint.x and topPoint.y so we move coordinates to have a center topPoint
        data.push(topPoint.x + aspectRatio * side * Math.cos(240/180 * Math.PI + i * radiusStepRad),
            topPoint.y + side * Math.sin(240/180 * Math.PI + i * radiusStepRad));
    }
    
    // изчислете тука координатите на триъгълника
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    gl.vertexAttrib3f(aRGB,1,0.5,0);
    
    gl.enableVertexAttribArray(aXY);
    gl.vertexAttribPointer(aXY,2,gl.FLOAT,false,0,0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, n + 2);
    gl.drawArrays(gl.TRIANGLE_FAN, n + 2, n + 2);
    gl.drawArrays(gl.TRIANGLE_FAN, 2 * (n + 2), n + 2);

    data = [];
    var buf1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf1);
    data.push(leftPoint.x, leftPoint.y, rightPoint.x, rightPoint.y, topPoint.x, topPoint.y);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.vertexAttribPointer(aXY,2,gl.FLOAT,false,0,0);

    gl.vertexAttrib3f(aRGB, 0, 0, 0);
    gl.drawArrays(gl.LINE_LOOP, 0, 3);
}

