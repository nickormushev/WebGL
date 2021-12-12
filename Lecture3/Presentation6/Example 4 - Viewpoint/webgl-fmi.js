﻿// Библиотека WebGL-FMI v0.06.04
//
// Работа с контексти и шейдъри
//		getContext(id)
//		getShader(id,type)
//		getProgram(idv,idf)
//
// Математически функции
//		random(a,b)
//
// Работа с матрици
//		orthoMatrix(width, height, near, far)
//		perspMatrix(angle, aspect, near, far)
//


var gl;		// глобален WebGL контекст
var glprog;	// глобална GLSL програма

// брой байтове в един WebGL FLOAT (трябва да са 4 байта)
var FLOATS = Float32Array.BYTES_PER_ELEMENT;

// връща WebGL контекст, свързан с HTML елемент с даден id
function getContext(id)
{
	var canvas = document.getElementById(id);
	if (!canvas)
	{
		alert("Искаме canvas с id=\""+id+"\", а няма!");
		return null;
	}
	
	var context = canvas.getContext("webgl");
	if (!context)
	{
		context = canvas.getContext("experimental-webgl");
	}
	
	if (!context)
	{
		alert("Искаме WebGL контекст, а няма!");
	}
	
	return context;
}

// връща компилиран шейдър
function getShader(id,type)
{
	var source = document.getElementById(id).text;
	var shader = gl.createShader(type);

	gl.shaderSource(shader,source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
	{
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	
	return shader;
}


// връща готова програма
function getProgram(idv,idf)
{
	var vShader = getShader(idv,gl.VERTEX_SHADER);
	var fShader = getShader(idf,gl.FRAGMENT_SHADER);
			
	if (!vShader || !fShader) {return null;}
	
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram,vShader);
	gl.attachShader(shaderProgram,fShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS))
	{
		alert(gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	gl.useProgram(shaderProgram);
	return shaderProgram;
}


// случайно дробно число в интервал
function random(a,b)
{
	return a+(b-a)*Math.random();
}


// създава матрица за ортографска проекция
function orthoMatrix(width, height, near, far)
{
	var matrix = [
		2.0/width, 0, 0, 0,
		0, 2.0/height, 0, 0,
		0, 0, 2.0/(near-far), 0,
		0, 0, (far+near)/(near-far), 1];
	return new Float32Array(matrix);
}

// създава матрица за перспективна проекция
// ъгълът на зрителното поле е в градуси
function perspMatrix(angle, aspect, near, far)
{
	var fov = 1/Math.tan(angle/2*Math.PI/180);
	var matrix = [
		fov/aspect, 0, 0, 0,
		0, fov, 0, 0,
		0, 0, (far+near)/(near-far), -1,
		0, 0, 2.0*near*far/(near-far), 0];
	return new Float32Array(matrix);
}

