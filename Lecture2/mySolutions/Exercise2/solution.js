// checks if row is odd and returns one dot less if it is.
function getDotCount(n, i) {
    if(i % 2 == 0) {
        return n;
    }

    return n - 1;
}

function getOffsetX(x, i, incrementN) {
    if(i % 2 == 0) {
        return x;
    }

    return x + incrementN/2;
}

function calculateDotCount(n, m) {
    // we assume m is even
    let oddRows = m/2;
    let evenRows = m/2;

    if(m % 2 != 0) {
        oddRows = (m - 1)/2;
        evenRows = (m - 1)/2 + 1
    }

    return oddRows * (n - 1) + evenRows * n;
}

function start() {
    gl = getContext("picasso");
    glprog = getProgram("vshader","fshader");

    aXY = gl.getAttribLocation(glprog,"aXY");

    gl.clearColor(1,1,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var n = 18;
    var m = 15;

    let incrementN = 1.9;
    let incrementM = 1.9;

    // here we have division by (n - 1)
    // the increment is detirmined by the number
    // of intervals between the dots and not the number
    // of dots which is why it is divided by n - 1.
    if(n > 1) {
        incrementN = incrementN / (n - 1);
    }
 

    // same as above
    if(m > 1) {
        incrementM = incrementM / (m - 1);
    }

    let startX = -0.95;
    let startY = 0.95;
    let data = [];
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < getDotCount(n, i) ; j++) {
            data.push(incrementN * j + getOffsetX(startX, i, incrementN), -incrementM * i + startY);
        }
    }

    let buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    
    gl.enableVertexAttribArray(aXY);
    gl.vertexAttribPointer(aXY, 2, gl.FLOAT, false, 0, 0);

    let dotCount = calculateDotCount(n, m);

    gl.drawArrays(gl.Point, 0, dotCount);
}
