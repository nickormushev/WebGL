﻿var vShader =
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
	'attribute vec2 aST;'+
	'attribute vec3 aColor;'+
	'attribute vec3 aNormal;'+
	''+
	'varying vec3 vColor;'+
	'varying vec3 vNormal;'+
	'varying vec3 vST;'+
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
	'	vST = vec3(aST,1);'+
	'}';
	
var fShader =
	'precision mediump float;'+
	''+
	'uniform highp vec3 uLightDir;'+
	'uniform vec3 uSpecularColor;'+
	'uniform float uShininess;'+
	''+
	'uniform float uTime;'+
	''+
	'uniform sampler2D uRefUnit;'+
	'uniform sampler2D uWavUnit;'+
	'uniform sampler2D uTexUnit;'+
	'uniform mat3 uTexMatrix;'+
	''+
	'varying vec3 vNormal;'+
	'varying vec3 vColor;'+
	'varying vec3 vPos;'+
	'varying vec3 vST;'+
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
	'	vec2 texPos = (uTexMatrix*vST).st;'+
	'	vec4 texCol = texture2D(uTexUnit,texPos);'+
	'	float ref = texture2D(uRefUnit,texPos).r;'+
	'	float wav = 0.0;'+
	'	for (int i=0; i<5; i++)'+
	'	{'+
	'		vec2 ofs = vec2(cos(uTime+float(i)),sin(uTime-float(i)));'+
	'		wav += texture2D(uWavUnit,texPos+0.05*ofs).r;'+
	'	}'+
	'	wav = 0.4+wav/3.0;'+
	'	gl_FragColor = vec4(texCol.stp*vColor+specularColor*ref*wav,1.0);'+
	'}';
