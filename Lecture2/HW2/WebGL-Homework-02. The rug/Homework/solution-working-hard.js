function generateLines(data, aXY, aRGB, dotCount) {
    let buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    
    gl.enableVertexAttribArray(aXY);
    gl.vertexAttribPointer(aXY, 2, gl.FLOAT, false, 4 * FLOATS, 0 * FLOATS);


    gl.vertexAttrib3f(aRGB, 0, 0, 0);
    gl.drawArrays(gl.POINTS, 0, dotCount);
    gl.drawArrays(gl.LINE_STRIP, 0, dotCount);
    gl.vertexAttribPointer(aXY, 2, gl.FLOAT, false, 4 * FLOATS, 2 * FLOATS);
    gl.drawArrays(gl.POINTS, 0, dotCount);
    gl.drawArrays(gl.LINE_STRIP, 0, dotCount);
}


function generateTriangles(data, aXY, aRGB, dotCount) {
    let buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    
    gl.enableVertexAttribArray(aXY);
    gl.vertexAttribPointer(aXY, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttrib3f(aRGB, random(0.2, 1), random(0.2, 1), random(0.2, 1));

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, dotCount);
}


function generateTrianglesFan(data, aXY, aRGB, dotCount) {
    let buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    
    gl.enableVertexAttribArray(aXY);
    gl.vertexAttribPointer(aXY, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttrib3f(aRGB, random(0.2, 1), random(0.2, 1), random(0.2, 1));

    gl.drawArrays(gl.TRIANGLE_FAN, 0, dotCount);
}

function start(){
    gl = getContext("picasso");
    glprog = getProgram("vshader","fshader");

    aXY = gl.getAttribLocation(glprog,"aXY");
    aRGB = gl.getAttribLocation(glprog,"aRGB");
    
    gl.clearColor(1,1,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // от тук до края на функцията да се сложи код,
    // който създава и рисува m цветни вълнообразни ленти

    // Идея. Раздели екрана на n реда. Сложи начални точки -1.
    // Генерирай m на брой точки на всеки ред. Като генерираш една точка
    // следващата ще се генерира на база предишната, за да е вдясно от нея
    // сложи на база на m колко е максималното разстояние надясно, което може да е
    // следващата точка. Така стана много назъбено. Очевидно без sin или cos няма как
    // да стане като му подам параметри за колко гъсто и с каква скорост да се движи.

    // брой ленти m
    let m = 11;
    let data = [];

    gl = getContext("picasso");
    glprog = getProgram("vshader","fshader");

    aXY = gl.getAttribLocation(glprog,"aXY");

    gl.clearColor(1,1,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let incrementN = 2;
    let incrementM = 2;
    let whiteSpace = 0.03;

    let scale = 0.1;
    let startY = -1;
    let startX = -1 + scale;
    //incrementM = 1 - scale - startX;
    m = 4;

    // Разделям на m + 1, защото искам да имам за m стълба
    // m + 1 равни интервала между тях и преди и след тях
    incrementM = incrementM / (m + 1);
    startX = -1 + incrementM

    let smoothness = 2.5;
    let aspectRatio = 4/6;
    let lastX = [];
    let lastY = [];
    let lastN = 0;

    for (let j = 0; j < m; j++) {
        data = [];
        let n = Math.round(random(10, 50));
        let localIncrementN = incrementN/(n - 1);
        let offset = startX + j * incrementM;
        let dotCount = 2 * n;

        if(j == 0) {
            // Оцветява най-лявата част
            for (let i = 0; i < n; i++) {
                let newY = startY + i * localIncrementN;
                let newX = aspectRatio * Math.sin(i/smoothness) * scale;
                data.push(-1, newY);
                data.push(newX + offset, newY);
                lastX[i] = newX + offset + whiteSpace;
                lastY[i] = newY;
                lastN = n;
            }
            generateTriangles(data, aXY, aRGB, dotCount);
        } else {
            let lastLastX = -3;
            let lastLastY = 0;
            for (let i = 0; i < n; i++) {
                let newY = startY + i * localIncrementN;
                let newX = aspectRatio * Math.sin(i/smoothness) * scale;
                if (lastLastX == -3) {
                    data.push(lastX[i], lastY[i]);
                } else {
                    data.push(lastLastX, lastLastY);
                }

                data.push(newX + offset, newY);
                if(lastN == i + 1) {
                    lastLastX = lastX[i];
                    lastLastY = lastY[i];
                } 

                lastX[i] = newX + offset + whiteSpace;
                lastY[i] = newY;
            }
            
            if(lastN > n) {
                for (let i = 0; i < lastN - n; i++) {
                    dotCount += 2;
                    data.push(lastX[i + n], lastY[i + n]);
                    data.push(lastX[n - 1], lastY[n - 1]);
                }
            } 

            generateTriangles(data, aXY, aRGB, dotCount);
            dotCount = dotCount/2;
            generateLines(data, aXY, aRGB, dotCount);
        }

        lastN = n;

        // Оцветява най-дясната част
        if (j + 1 == m) {
            data = [];
            for (let i = 0; i < lastX.length + 2 ; i++) {
                let newY = startY + i * localIncrementN;
                data.push(1, newY);
                data.push(lastX[i], newY);
            }
            
            generateTriangles(data, aXY, aRGB, lastX.length * 2);
            generateLines(data, aXY, aRGB, lastX.length);
        }

    }
}
