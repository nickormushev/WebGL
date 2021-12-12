function generateSection(data, aXY, aRGB, dotCount) {
    let buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    
    gl.enableVertexAttribArray(aXY);
    gl.vertexAttribPointer(aXY, 2, gl.FLOAT, false, 4 * FLOATS, 2 * FLOATS);


    gl.vertexAttrib3f(aRGB, random(0, 1), random(0, 1), random(0, 1));
    gl.drawArrays(gl.LINE_STRIP, 0, dotCount);

    gl.vertexAttribPointer(aXY, 2, gl.FLOAT, false, 4 * FLOATS, 0 * FLOATS);
    gl.drawArrays(gl.LINE_STRIP, 0, dotCount);
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
    let n = 10;
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
    m = 5;

    // Разделям на m + 1, защото искам да имам за m стълба
    // m + 1 равни интервала между тях и преди и след тях
    incrementM = incrementM / (m + 1);
    startX = -1 + incrementM

    let smoothness = 2.5;
    let aspectRatio = 4/6;

    data.push(-1, -1);
    for (let j = 0; j < m; j++) {
        data = [];
        let n = Math.round(random(10, 50));
        let localIncrementN = incrementN/(n - 1);
        let offset = startX + j * incrementM;
        let dotCount = n;
        for (let i = 0; i < n; i++) {
            let newY = startY + i * localIncrementN;
            let newX = aspectRatio * Math.sin(i/smoothness) * scale;
            data.push(newX + offset, newY);
            data.push(newX + offset + whiteSpace, newY);
        }

        generateSection(data, aXY, aRGB, dotCount);
    }
}
