var vShader = `
	uniform mat4 uProjectionMatrix;
	uniform mat4 uViewMatrix;
	uniform mat4 uModelMatrix;
    uniform bool uUseSkybox;

	attribute vec3 aXYZ;
	varying vec3 vXYZ;

    uniform mat4 uNormalMatrix;
	uniform bool uUseNormalMatrix;
	
	attribute vec3 aColor;
	attribute vec3 aNormal;
	
	varying vec3 vST;
	varying vec3 vColor;

	
	void main ()
	{
		mat4 mvMatrix = uViewMatrix * uModelMatrix;
		gl_Position = uProjectionMatrix * mvMatrix * vec4(aXYZ,1);
        vXYZ = aXYZ;
	}`;
	
var fShader = `
	precision mediump float;
	uniform samplerCube uTexUnit;
    uniform bool uUseSkybox;


	varying vec3 vXYZ;
	varying vec3 vColor;

	void main( )
	{
        vec4 weight = vec4(0.1945945946, 0.1216216216,
                                  0.0540540541, 0.0162162162);
        float firstWeight = 0.2270270270;
        if(uUseSkybox) {
            vec3 color = textureCube(uTexUnit,vXYZ).stp * firstWeight;
            float blurFactor = 300.0;

            for (int i=1; i < 5; i++) {
                color += textureCube(uTexUnit,(vXYZ + vec3(float(i)/blurFactor, 0, 0))).stp *  weight[i];
                color += textureCube(uTexUnit,(vXYZ - vec3(float(i)/blurFactor, 0, 0))).stp *  weight[i];
            }

            for (int i=1; i < 5; i++) {
                color += textureCube(uTexUnit,(vXYZ + vec3(0, float(i)/blurFactor, 0))).stp *  weight[i];
                color += textureCube(uTexUnit,(vXYZ - vec3(0, float(i)/blurFactor, 0))).stp *  weight[i];
            }

            vec4 darken = vec4(0.6, 0.6, 0.6, 1);
            gl_FragColor = vec4(color, 1.0) * darken;
        } else {
		    gl_FragColor = textureCube(uTexUnit, vXYZ);
        }
	}`;
