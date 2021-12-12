// става и кост - конструктор
Bone = function(size, color)
{	
	this.bone = new Cuboid([0,0,0],size);
    this.size = size;
	this.bone.color = color;
	this.bone.offset = [0,0,0.5];
	this.rot = [0,0,0,0];
}

// става и кост - метод за рисуване
Bone.prototype.draw = function()
{	
	if (this.rot)
	{
		if (this.rot[0]) zRotate(this.rot[0]);	// хоризонтален ъгъл
		if (this.rot[1]) yRotate(this.rot[1]);	// вертикален ъгъл
		if (this.rot[2]) xRotate(this.rot[2]);	// вертикален ъгъл
		if (this.rot[3]) zRotate(this.rot[3]);	// осев ъгъл
	}
	if (this.offset) translate(this.offset); 
	this.bone.draw();
	translate([0,0,this.bone.size[2]]); // преместване в края на костта
}

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255)/255, Math.round(g * 255)/255, Math.round(b * 255)/255];
}

// птица - конструктор
Bird = function()
{	
	// торс
	this.tor = new Bone([1.2,0.7,0.5], [0.5, 0.5, 0.5]);
    

    let startOffset =  Math.PI/15 + 4 * Math.PI / 15;
    let offset =  Math.PI/15;
    

    this.wingsL = [];
    for (var i = 0; i < 10; i++) {
	    this.wingsL[i] = new Bone([1 * Math.sin(startOffset + i * offset), 0.1, 0.25], hslToRgb((93 - 10 * i)/360, 1, 0.75 - i/12));
    }
    
    this.wingsR = [];
    for (var i = 0; i < 10; i++) {
	    this.wingsR[i] = new Bone([1 * Math.sin(startOffset + i * offset), 0.1, 0.25], hslToRgb((93 - 10 * i)/360, 1, 0.75 - i/12));
    }
  
	// глава
	this.head = new Bone([0.5,0.7,0.3], [0.3, 0.3, 0.3]);
	this.head.offset = [1.05,0,-0.4];

    // клюн
	this.beak = new Bone([0.5,0.5,0.05], [1, 0, 0]);
	this.beak.offset = [0.13,0.13,-0.19];

    // очи
	this.eyeL = new Bone([0.2,0.2,0.1], [0.7, 0.7, 0.7]);
	this.innerEyeL = new Bone([0.1,0.1,0.01], [0.3, 0.3, 0.7]);
	this.eyeR = new Bone([0.2,0.2,0.1], [0.7, 0.7, 0.7]);
	this.innerEyeR = new Bone([0.1,0.1,0.01], [0.3, 0.3, 0.7]);
}

// скелет - метод за рисуване
Bird.prototype.draw = function()
{
	pushMatrix();
        xRotate(90);
		this.tor.draw();

		// ляв крак
        pushMatrix();
        for (let i = 0; i < 10; i++) {
            translate([0.45, 0, 0]);
            this.wingsL[i].offset = [-0.5, 0, 0];
            this.wingsL[i].draw();
        }
        popMatrix();

        pushMatrix();
        //-2 * <size of wing part>
        translate([0,0,-0.5]);
        xRotate(180);
        for (let i = 0; i < 10; i++) {
            translate([0.45, 0, 0]);
            this.wingsR[i].offset = [-0.5, 0, 0];
            this.wingsR[i].draw();
        }
        popMatrix();
        
        this.head.draw();
        pushMatrix()
        zRotate(45);
        this.beak.draw();
        popMatrix()

        pushMatrix()
        translate([-0.05, -0.2, -0.09]);
        this.eyeL.draw();
        this.innerEyeL.draw();
        popMatrix()

        pushMatrix()
        translate([-0.05, -0.2, -0.31]);
        this.eyeR.draw();
        translate([0, 0, -0.11]);
        this.innerEyeR.draw();
        popMatrix()
	popMatrix();
}
