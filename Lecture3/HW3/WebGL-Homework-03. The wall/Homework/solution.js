function vectorLength(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

function pointDistance(x, y) {
    let a = x[0] - y[0];
    let b = x[1] - y[1];
    return Math.sqrt( a * a + b * b);
}

function generateRow(hearthCoordinates, oddRow) {
    // Not actual brick count
    // If actualy I would need to resize the brick
    // and caluclate the circumfrence
    let brickCount = 300;

    hearthCoordinates.push(hearthFunction(0))

    let t = 0;
    if (oddRow) {
        // Offset t by half a brick. I did this by seing which value
        // looked good. I do not understand the heart function that well
        // to say if there is a better way.
        t = 0.18
    } 

    for(let i = 1; i < brickCount && t <= 6.1; i++) {
        let lastCoordinates = hearthCoordinates[i - 1];
        let currentCoordinates = hearthCoordinates[i - 1];
        let distanceCounter = 0;

        
        while (t <= 360 && distanceCounter <= 0.45) {
            // Increment the degree by the smallest possible amount so the
            // distance is calculated correctly.
            t+=0.001;
            currentCoordinates = hearthFunction(t);
            distanceCounter += pointDistance(lastCoordinates, currentCoordinates);
            lastCoordinates = currentCoordinates;
        }

        hearthCoordinates.push(currentCoordinates);
    }
}

function normalVector(v) {
    if (v[0] > 0) {
        return [v[1], -v[0]];
    }

    return [-v[1], v[0]];
}

function dotProduct(x, y) {
    return x[0] * y[0] + x[1] * y[1];
}

function hearthFunction(t) { 
    let x = 16 * Math.pow(Math.sin(t), 3);	
    let y =	13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

    return [x, y];
}

// Calculates the normal vector between two points
// and then evaluates the angle from the normalized base vector [1, 0]
// to use to rotate my objects. Uses cos(angle) = dot(x, y)/(|x| * |y|)
function rotationAngle(x, y) {
    let tangentVector = [y[0] - x[0], y[1] - x[1]];
    let normalV = normalVector(tangentVector);
    let normalVLength = vectorLength(normalV);

    let dot = dotProduct(normalV, [1, 0]);

    let cosAngleFromStart = dot/normalVLength;

    let angleInRadians = Math.acos(cosAngleFromStart);
    
    return angleInRadians * 180/Math.PI;
}

function rotateCoordinates(coordinates, angle) {
    let angleInRadians = radians(angle);
    let x = coordinates[0];
    let y = coordinates[1];

    return [ x * Math.cos(angleInRadians) - y * Math.sin(angleInRadians),
             x * Math.sin(angleInRadians) + y * Math.cos(angleInRadians) ];
}

function brick(angle, coordinates, z) {
    identity();
    zRotate(angle);
    // take into account the rotation of the object
    coordinates = rotateCoordinates(coordinates, angle);

    let xScale = 1/5;
    let yScale = 2/5;
    scale([xScale, yScale, 1/8]);

    // translate while taking into account the new scale
    translate([coordinates[0]/xScale, coordinates[1] / yScale, z + 0.2 * z]);
    useMatrix();

    gl.drawArrays(gl.LINE_LOOP,0,4);
    gl.drawArrays(gl.LINE_LOOP,4,4);
    gl.drawArrays(gl.LINES,8,8);
}

function start() {
    gl = getContext("picasso");
    glprog = getProgram("vshader","fshader");
    
    aXYZ = gl.getAttribLocation(glprog,"aXYZ");
    uColor = gl.getUniformLocation(glprog,"uColor");
    uProjectionMatrix = gl.getUniformLocation(glprog,"uProjectionMatrix");
    uViewMatrix = gl.getUniformLocation(glprog,"uViewMatrix");
    uModelMatrix = gl.getUniformLocation(glprog,"uModelMatrix");

    gl.clearColor(1,1,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var proj = perspMatrix(30,gl.canvas.width/gl.canvas.height,1,40000);
    gl.uniformMatrix4fv(uProjectionMatrix,false,proj);

    // close to bricks
    // let view = viewMatrix([8, -16,1], [0,-8,2], [0,0,1]);
    // from above
    // let view = viewMatrix([0,-24,60], [0,-3,0], [0,0,1]);
    // from the side
    let view = viewMatrix([20,-34,20], [0,0,0], [0,0,1]);
    gl.uniformMatrix4fv(uViewMatrix,false,view);

    // куб 1x1x1
    var data = [ 0.5,-0.5,0.5,	// предна стена
                 0.5,0.5,0.5,
                -0.5,0.5,0.5,
                -0.5,-0.5,0.5,
                 0.5,-0.5,-0.5, // задна стена
                 0.5,0.5,-0.5,
                -0.5,0.5,-0.5,
                -0.5,-0.5,-0.5,
                
                 0.5,-0.5,0.5, // десни хоризонтални ръбове
                 0.5,-0.5,-0.5,
                 0.5,0.5,0.5,
                 0.5,0.5,-0.5,
                -0.5,0.5,0.5,	// леви хоризонтални ръбове
                -0.5,0.5,-0.5,
                -0.5,-0.5,0.5,
                -0.5,-0.5,-0.5
                ];


    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(aXYZ);
    gl.vertexAttribPointer(aXYZ, 3, gl.FLOAT, false, 0, 0);

    let levels = 20;
    let hearthCoordinatesEven = [];
    let hearthCoordinatesOdd = [];
    generateRow(hearthCoordinatesEven, false);
    generateRow(hearthCoordinatesOdd, true);

    gl.uniform3f(uColor,139/255,0 ,0);

    for (let z = 0; z < levels; z++) {
        let hearthCoordinates = (z % 2 == 0 ? hearthCoordinatesEven : hearthCoordinatesOdd);

        for (let i = 0; i < hearthCoordinates.length - 1; i++) {
            let angle = rotationAngle(hearthCoordinates[i], hearthCoordinates[i + 1]);
            brick(angle, hearthCoordinates[i], z);
        }
    }
    // Вместо единичен куб, да се нарисува стена под формата на сърце
    // от 20 реда застъпващи се тухли, използвайки трансформиран куб
}

