﻿// Библиотека WebGL-FMI v0.06.07
//
// Работа с контексти и шейдъри
//		getContext(id)
//		getShader(id,type)
//		getProgram(idv,idf)
//
// Математически функции
//		random(a,b)
//
// Работа с вектори 
//		unitVector(x)
//		vectorProduct(x,y)
//		scalarProduct(x,y)
//		vectorPoints(x,y)
//
// Работа с матрици
//		unitMatrix();
//		translateMatrix(v)
//		scaleMatrix(v)
//		viewMatrix (eye, focus, up)
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


// единичен вектор
function unitVector(x)
{
	var len = 1/Math.sqrt( x[0]*x[0]+x[1]*x[1]+x[2]*x[2] );
	return [ len*x[0], len*x[1], len*x[2] ];
}


// векторно произведение на два вектора
function vectorProduct(x,y)
{
	return [
		x[1]*y[2]-x[2]*y[1],
		x[2]*y[0]-x[0]*y[2],
		x[0]*y[1]-x[1]*y[0] ];
}


// скаларно произведение на два вектора
function scalarProduct(x,y)
{
	return x[0]*y[0] + x[1]*y[1] + x[2]*y[2];
}


// вектор между две точки
function vectorPoints(x,y)
{
	return [ x[0]-y[0], x[1]-y[1], x[2]-y[2] ];
}


// генерира матрица за гледна точка, параметрите са масиви с по 3 елемента
function viewMatrix (eye, focus, up)
{
	// единичен вектор Z' по посоката на гледане
	var z = unitVector(vectorPoints(eye,focus));
	
	// единичен вектор X', перпендикулярен на Z' и на посоката нагоре
	var x = unitVector(vectorProduct(up,z));
	
	// единичен вектор Y', перпендикулярен на X' и Z'
	var y = unitVector(vectorProduct(z,x));
	
	// резултатът е тези три вектора + транслация
	var matrix = [
		x[0], y[0], z[0], 0,
		x[1], y[1], z[1], 0,
		x[2], y[2], z[2], 0,
		-scalarProduct(x,eye),
		-scalarProduct(y,eye),
		-scalarProduct(z,eye), 1 ];
	return new Float32Array(matrix);
};


// единична матрица
function unitMatrix()
{
	var matrix = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1];
	return new Float32Array(matrix);
}

// матрица за транслация по вектор V
function translateMatrix(v)
{
	var matrix = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		v[0], v[1], v[2], 1];
	return new Float32Array(matrix);
}


// матрица за мащабиране с вектор V
function scaleMatrix(v)
{
	var matrix = [
		v[0], 0, 0, 0,
		0, v[1], 0, 0,
		0, 0, v[2], 0,
		0, 0, 0, 1];
	return new Float32Array(matrix);
}
