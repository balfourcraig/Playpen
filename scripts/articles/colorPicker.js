function getDrawingMode(){
	return document.querySelector('input[name="drawMode"]:checked').value;
}

function setUp(){
	const sizeCalc = document.getElementById('sizeCalc');
	
	const backingC = document.getElementById('backingCanv');
	const c = document.getElementById('canv');
	const w = sizeCalc.getBoundingClientRect().width;
	const h = w;
	
	document.getElementById('sizeCalc').style.height = h + 'px';
	backingC.setAttribute('width', w);
	backingC.setAttribute('height', h);
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	const ctx = c.getContext('2d');
	const backingCtx = backingC.getContext('2d');
	const center = {x: w/2, y: h/2};
	const radius = w * 0.4;
	paintCircle(center, radius);
	
	document.getElementById('saturationInput').addEventListener('input', paintCircle);
	c.addEventListener('mousemove', mouseMove);
	
	function mouseMove(e){
		if(e && e.clientX && e.clientY) {
			let canvRect = c.getBoundingClientRect();
			mousePos = {x: e.clientX - canvRect.left, y: e.clientY - canvRect.top};
			ctx.clearRect(0,0,w,h);
			const sat = parseFloat(document.getElementById('saturationInput').value);
			const hslColor = colorAtPoint(mousePos.x, mousePos.y);
			ctx.fillStyle = 'hsl(' + (hslColor[0] * 360) + ',' + (sat * 100) + '%,' + (hslColor[2] * 100) + '%)';
			
			ctx.fillRect(mousePos.x -5, mousePos.y -5, 10, 10);
			ctx.strokeRect(mousePos.x -5, mousePos.y -5, 10, 10);
		}
	}
	
	function paintCircle(){
		const imgData = backingCtx.createImageData(w, h);
		const sat = parseFloat(document.getElementById('saturationInput').value);
		for(let row = 0; row < h; row++){
			for(let col = 0; col < w; col++){
				const destOffset = ((h - row) * w + col) * 4;
				const hslColor = colorAtPoint(row, col);
				const rgbColor = hslToRgb(hslColor[0],sat,hslColor[2])
				imgData.data[destOffset + 0] = rgbColor[0];
				imgData.data[destOffset + 1] = rgbColor[1];
				imgData.data[destOffset + 2] = rgbColor[2];
				imgData.data[destOffset + 3] = 255;
			}
		}
		backingCtx.putImageData(imgData, 0, 0); 
	}
	
	function hslToRgb(h, s, l){
		let r = 0;
		let g = 0;
		let b = 0;

		if(s == 0){
			r = g = b = l; // achromatic
		}else{
			function hue2rgb(p, q, t){
				if(t < 0) t += 1;
				if(t > 1) t -= 1;
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}

			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}
		return [r * 255, g * 255, b * 255];
	}
	
	function colorAtPoint(x, y){
		let distMapped = distToPoint(x, y, center)/radius;
		
		if(distMapped > 1){
			return [0,0,0];
		}
		else{
			const angle = angleBetweenPoints(x, y, center.x, center.y) / (Math.PI * 2);
			return [angle, 0, distMapped];
		}
	}
}

function distToPoint(x, y, p2){
	const dX = x - p2.x;
	const dY = y - p2.y;
	return Math.sqrt((dX * dX) + (dY * dY));
}

function angleBetweenPoints(x1, y1, x2, y2){
	return Math.atan2(x1-x2,y1-y2);
}

function angleBetweenVectors(x, y, b){
	const magA = Math.sqrt(x * x + y * y);
	const magB = Math.sqrt(b.x * b.x + b.y * b.y);
	
	const cosTheta = dot(x,y,b) / (magA * magB);
	return Math.acos(cosTheta);
}

function dot(x, y, b){
	return x * b.x + y * b.y;
}

window.addEventListener('DOMContentLoaded', () => {
	setUp();
});