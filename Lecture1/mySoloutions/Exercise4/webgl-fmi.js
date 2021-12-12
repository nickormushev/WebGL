export function getContext(canvasID) {
	let canvas = document.getElementById(canvasID);
    let gl = canvas.getContext("webgl");
    if (!gl) {gl = canvas.getContext("experimental-webgl");}
    if (!gl)
    {
        alert("Искаме WebGL контекст, а няма!");
    }

    return gl;
}

export function getShader(gl, shaderTag, shaderType) {
    let vSource = document.getElementById(shaderTag).text;
    let vShader = gl.createShader(shaderType);
    gl.shaderSource(vShader,vSource);
    gl.compileShader(vShader);
    if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS))
    {
        alert(gl.getShaderInfoLog(vShader));
    }

    return vShader;
}

export function getProgram(gl, vShader, fShader) {
    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vShader);
    gl.attachShader(shaderProgram, fShader);
    
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS))
    {
        alert(gl.getProgramInfoLog(shaderProgram));
    }

    return shaderProgram;
};
