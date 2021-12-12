﻿var vShaderPhong =
	'uniform mat4 uProjectionMatrix;'+
	'uniform mat4 uViewMatrix;'+
	'uniform mat4 uModelMatrix;'+
	'uniform mat4 uNormalMatrix;'+
	'uniform bool uUseNormalMatrix;'+
	''+
	'uniform vec3 uAmbientColor;'+
	'uniform vec3 uDiffuseColor;'+
	''+
	'uniform vec3 uLightDir;'+
	''+
	'attribute vec3 aXYZ;'+
	'attribute vec3 aColor;'+
	'attribute vec3 aNormal;'+
	''+
	'varying vec3 vColor;'+
	'varying vec3 vNormal;'+
	'varying vec3 vPos;'+
	''+
	'void main ()'+
	'{'+
	'	mat4 mvMatrix = uViewMatrix * uModelMatrix;'+
	'	vec4 pos = mvMatrix * vec4(aXYZ,1);'+
	'	gl_Position = uProjectionMatrix * pos;'+
	'	mat4 nMatrix = uUseNormalMatrix?uNormalMatrix:mvMatrix;'+
	''+
	'	vColor = uAmbientColor*aColor;'+
	''+
	'	vec3 light = normalize(-uLightDir);'+
	'	vec3 normal = vec3(normalize(nMatrix*vec4(aNormal,0)));'+
	'	vColor += aColor*uDiffuseColor*max(dot(normal,light),0.0);'+
	''+
	'	vPos = pos.xyz/pos.w;'+
	'	vNormal = normal;'+
	'}';
	
var fShaderPhong =
	'precision mediump float;'+
	''+
	'uniform highp vec3 uLightDir;'+
	'uniform vec3 uSpecularColor;'+
	'uniform float uShininess;'+
	''+
	'varying vec3 vNormal;'+
	'varying vec3 vColor;'+
	'varying vec3 vPos;'+
	''+
	'void main( )'+
	'{'+
	'	vec3 specularColor = vec3(0);'+
	''+
	'	vec3 light = normalize(-uLightDir);'+
	'	vec3 reflectedLight = normalize(reflect(light,normalize(vNormal)));'+
	'	vec3 viewDir = normalize(vPos);'+
	''+
	'	float cosa = max(dot(reflectedLight,viewDir),0.0);'+
	'	specularColor = uSpecularColor*pow(cosa,uShininess);'+
	''+
	'	gl_FragColor = vec4(vColor+specularColor,1);'+
	'}';
