var vShader =`
	uniform mat4 uProjectionMatrix;
	uniform mat4 uViewMatrix;
	uniform mat4 uModelMatrix;
	uniform mat4 uNormalMatrix;
	uniform bool uUseNormalMatrix;
	uniform bool uUseAColor;
	
	uniform vec3 uAmbientColor;
	uniform vec3 uDiffuseColor;
	
	uniform vec3 uLightDir;
	
	attribute vec3 aXYZ;
	attribute vec3 aColor;
	attribute vec3 aNormal;
	attribute float aIsBlack;
	
	varying vec3 vColor;
	
	void main ()
	{
		mat4 mvMatrix = uViewMatrix * uModelMatrix;
        gl_PointSize = 3.0;
		gl_Position = uProjectionMatrix * mvMatrix * vec4(aXYZ,1);
		mat4 nMatrix = uUseNormalMatrix?uNormalMatrix:mvMatrix;

        vec3 whiteRGB = vec3(1.0, 1.0, 1.0);
        vec3 greenRGB = vec3(0.0, 100.0/255.0, 0.0);
        vec3 yellowRGB = vec3(1.0, 1.0, 0.0);
        vec3 blueRGB = vec3(0.0, 0.0, 1.0);
        vec3 blackRGB = vec3(0.0, 0.0, 0.0);

        if(uUseAColor) {
            vColor = aColor;
        } else if(aIsBlack > 0.5) {
            vColor = blackRGB;
        } else if(aXYZ.z > 50.0) {
		    vColor = whiteRGB;
        } else if(aXYZ.z > 5.0) {
            vColor = mix(whiteRGB, greenRGB,  1.0 - (aXYZ.z - 5.0)/(50.0 - 5.0));
        } else if(aXYZ.z > 0.0) {
            vColor = mix(greenRGB, yellowRGB, 1.0 - aXYZ.z/15.0);
        } else {
            vColor = mix(blueRGB, yellowRGB, aXYZ.z/60.0);
        }

		vColor = uAmbientColor*vColor;
	
		vec3 light = normalize(-uLightDir);
		vec3 normal = vec3(normalize(nMatrix*vec4(aNormal,0)));
		vColor += vColor*uDiffuseColor*max(dot(normal,light),0.0);
	}`;
	
var fShader =
	'precision mediump float;'+
	'varying vec3 vColor;'+
	'uniform float uAlpha;'+
	'void main( )'+
	'{'+
	'	gl_FragColor = vec4(vColor,uAlpha);'+
	'}';
