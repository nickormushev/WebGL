export function getContext(canvasID) {
	var canvas = document.getElementById(canvasID);
    var gl = canvas.getContext("webgl");
    if (!gl) {gl = canvas.getContext("experimental-webgl");}
    if (!gl)
    {
        alert("Искаме WebGL контекст, а няма!");
    }

    return gl;
}
