function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [ r, g, b];
}

function generateLines(data, aXY, aHSL, dotCount) {
    let buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    
    gl.enableVertexAttribArray(aXY);
    gl.vertexAttribPointer(aXY, 2, gl.FLOAT, false, 4 * FLOATS, 0 * FLOATS);


    gl.vertexAttrib3f(aHSL, 0, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, dotCount);
    gl.vertexAttribPointer(aXY, 2, gl.FLOAT, false, 4 * FLOATS, 2 * FLOATS);
    gl.drawArrays(gl.LINE_STRIP, 0, dotCount);
}


function generateTriangles(data, aXY, aHSL, dotCount) {
    let buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    
    gl.enableVertexAttribArray(aXY);
    gl.vertexAttribPointer(aXY, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, dotCount);
}

function start(){
    gl = getContext("picasso");
    glprog = getProgram("vshader","fshader");
    
    gl.clearColor(1,1,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // от тук до края на функцията да се сложи код,
    // който създава и рисува m цветни вълнообразни ленти

    // брой ленти m
    let m = 11;
    baboPleti(m);
}

function baboPleti(m) {
    let data = [];
    aXY = gl.getAttribLocation(glprog,"aXY");
    aHSL = gl.getAttribLocation(glprog,"aHSL");

    let rgb = hslToRgb(random(0, 1), random(0.2, 0.4),  random(0.5, 0.9))
    gl.clearColor(rgb[0],rgb[1], rgb[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let incrementN = 2;
    let incrementM = 2;
    let whiteSpace = 0.03;

    let scale = 0.1;
    let startY = -1;
    let startX = -1 + scale;

    // Разделям на m + 1, защото искам да имам за m стълба
    // m + 1 равни интервала между тях и преди и след тях
    incrementM = incrementM / (m + 1);
    startX = -1 + incrementM

    let smoothness = 2.5;
    let aspectRatio = 4/6;
    let usedN = [];

    for (let j = 0; j < m; j++) {
        data = [];
        let n = Math.round(random(10, 50));
        usedN[j] = n;
        let localIncrementN = incrementN/(n - 1);
        let offset = startX + j * incrementM;
        let dotCount = 2 * n;

        for (let i = 0; i < n; i++) {
            let newY = startY + i * localIncrementN;
            let newX = aspectRatio * Math.sin(i/smoothness) * scale;
            data.push(newX + offset, newY);
            data.push(1, newY);
        }

        gl.vertexAttrib3f(aHSL, random(0, 1), random(0.2, 0.4), random(0.7, 0.95));
        generateTriangles(data, aXY, aHSL, dotCount);
    }

    for (let j = 0; j < m; j++) {
        data = [];
        let n = usedN[j];
        let localIncrementN = incrementN/(n - 1);
        let offset = startX + j * incrementM;
        let dotCount = 2 * n;

        for (let i = 0; i < n; i++) {
            let newY = startY + i * localIncrementN;
            let newX = aspectRatio * Math.sin(i/smoothness) * scale;
            data.push(newX + offset, newY);
            data.push(newX + offset + whiteSpace, newY);
        }


        gl.vertexAttrib3f(aHSL, 0, 0, 1);
        generateTriangles(data, aXY, aHSL, dotCount);

        dotCount = n;
        generateLines(data, aXY, aHSL, dotCount);
    }
}

function setColumnCount() {
    let columnCount = document.getElementById('columnCount').value;
    if(columnCount === "") {
        return;
    }
    columnCount = parseInt(columnCount, 10);

    baboPleti(columnCount);
}
