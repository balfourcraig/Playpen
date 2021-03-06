function getMode(){
	return document.getElementById('harmonySelect').value;
	//return document.querySelector('input[name="drawMode"]:checked').value;
}

function setUp(){
	const sizeCalc = document.getElementById('sizeCalc');
	
	const backingC = document.getElementById('backingCanv');
	const c = document.getElementById('canv');
	const w = sizeCalc.getBoundingClientRect().width;
	const h = w;
	
	let currentPointDetails = [];
	let currentHarmony = '';
	
	document.getElementById('sizeCalc').style.height = h + 'px';
	backingC.setAttribute('width', w);
	backingC.setAttribute('height', h);
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	const ctx = c.getContext('2d');
	const backingCtx = backingC.getContext('2d');
	const center = {x: w/2, y: h/2};
	const radius = w * 0.4;
	let sat = parseFloat(document.getElementById('saturationInput').value);
	paintCircle(center, radius);

	document.getElementById('saturationInput').addEventListener('input', () => {
		sat = parseFloat(document.getElementById('saturationInput').value);
		paintCircle();
	});
	c.addEventListener('mousemove', mouseMove);
	c.addEventListener('mousedown', mouseClick);
	
	function mouseMove(e){
		if(e && e.clientX && e.clientY) {
			let canvRect = c.getBoundingClientRect();
			mousePos = {x: e.clientX - canvRect.left, y: e.clientY - canvRect.top};
			const mode = getMode();
			if(mode === 'free'){
				freeMove(mousePos);
			}
			else if (mode === 'comp'){
				complementaryMove(mousePos);
			}
			else if (mode === 'tri'){
				triadicMove(mousePos);
			}
			else if (mode === 'square'){
				squareMove(mousePos);
			}
			else if (mode === 'analogous'){
				analogousMove(mousePos);
			}
		}
	}
	
	function mouseClick(e){
		appendLine(currentPointDetails, currentHarmony);
	}
	
	function squareMove(mousePos){
		ctx.clearRect(0,0,w,h);
		const points = mirrorAroundCenter(mousePos, 4);
		const details = [];
		for(let i = 0; i < points.length; i++){
			const p = points[i];
			const d = getPointDetails(p);
			details.push(d);
			ctx.strokeStyle = ctx.strokeStyle = 'hsl(0,0%,' + ((1-d.hsl[2]) * 100) + '%)';;
			
			ctx.beginPath();
			ctx.moveTo(p.x, p.y);
			ctx.lineTo(points[(i+1)%points.length].x, points[(i+1)%points.length].y);
			ctx.stroke();
			highlightPoint(d, 10);
		}
		previewColors(details, 'Square');
	}
	
	function triadicMove(mousePos){
		ctx.clearRect(0,0,w,h);
		const points = mirrorAroundCenter(mousePos, 3);
		const details = [];
		for(let p of points){
			details.push(getPointDetails(p));
			const grad = ctx.createLinearGradient(p.x, p.y, center.x, center.y);
			grad.addColorStop(0, 'white');
			grad.addColorStop(1, 'black');
			ctx.strokeStyle = grad;
			
			ctx.beginPath();
			ctx.moveTo(p.x, p.y);
			ctx.lineTo(center.x, center.y);
			ctx.stroke();
			highlightPoint(getPointDetails(p), 10);
		}
		previewColors(details, 'Triadic');
	}
	
	function analogousMove(mousePos){
		ctx.clearRect(0,0,w,h);
		const details = [];
		const initialAngle = angleBetweenPoints(mousePos.x, mousePos.y, center.x, center.y);
		const dist = distToPoint(mousePos.x, mousePos.y, center);
		const angle = 0.3;
		for(let i = -2; i < 3; i++){
			const x = Math.sin(initialAngle + i * angle) * dist + center.x;
			const y = Math.cos(initialAngle + i * angle) * dist + center.y;
			const p = getPointDetails({x,y});
			
			const grad = ctx.createLinearGradient(p.point.x, p.point.y, center.x, center.y);
			grad.addColorStop(0, 'white');
			grad.addColorStop(1, 'black');
			ctx.strokeStyle = grad;
			
			ctx.beginPath();
			ctx.moveTo(p.point.x, p.point.y);
			ctx.lineTo(center.x, center.y);
			ctx.stroke();
			
			highlightPoint(p,10);
			details.push(p);
		}
		previewColors(details, 'Analogous');
	}
	
	function mirrorAroundCenter(point, reflections){
		const initialAngle = angleBetweenPoints(point.x, point.y, center.x, center.y);
		const dist = distToPoint(point.x, point.y, center);
		
		const reflectAngle = (Math.PI * 2) / reflections;
		const points = [];
		points.push(point);
		for(let i = 1; i < reflections; i++){
			const x = Math.sin(initialAngle + i * reflectAngle) * dist + center.x;
			const y = Math.cos(initialAngle + i * reflectAngle) * dist + center.y;
			points.push({x,y});
		}
		return points;
	}
	
	function complementaryMove(mousePos){
		ctx.clearRect(0,0,w,h);
		const comp = pointReflect(mousePos, center, -2);
		const mouseDetails = getPointDetails(mousePos);
		const compDetails = getPointDetails(comp);
		
		const grad = ctx.createLinearGradient(mousePos.x, mousePos.y, comp.x, comp.y);
		grad.addColorStop(0, 'white');
		grad.addColorStop(0.5, 'black');
		grad.addColorStop(1, 'white');
		ctx.fillStyle = grad;
		ctx.strokeStyle = grad;
		
		ctx.beginPath();
		ctx.moveTo(mousePos.x, mousePos.y);
		ctx.lineTo(comp.x, comp.y);
		ctx.stroke();
		highlightPoint(compDetails, 10);
		highlightPoint(mouseDetails, 10);
		previewColors([mouseDetails, compDetails], 'Complementary');
	}

	function freeMove(mousePos) {
		ctx.clearRect(0,0,w,h);
		const relativeDist = distToPoint(mousePos.x, mousePos.y, center)/radius;
		if(relativeDist > 1){
			
		}
		const details = getPointDetails(mousePos);
		highlightPoint(details, 10);
		previewColors([details], 'Free');
	}

	function highlightPoint(details, size){
		ctx.fillStyle = 'hsl(' + (details.hsl[0] * 360) + ',' + (details.hsl[1] * 100) + '%,' + (details.hsl[2] * 100) + '%)';
		ctx.strokeStyle = 'hsl(' + (details.hsl[0] * 360 + 180) + ',' + (details.hsl[1] * 100) + '%,' + ((1-details.hsl[2]) * 100) + '%)';
		
		const halfSize = size / 2;
		ctx.fillRect(details.point.x -halfSize, details.point.y -halfSize, size, size);
		ctx.strokeRect(details.point.x -halfSize, details.point.y -halfSize, size, size);
		if(document.getElementById('showLabelsInput').checked){
			drawTextBG(ctx, details.hex, 20, details.point.x, details.point.y);
		}
	}
	
	function previewColors(details, harmony){
		const blockWidth = w/details.length;
		const blockHeight = h * 0.05;
		let offSet = 0;
		for(let i = 0; i < details.length; i++){
			ctx.fillStyle = details[i].hex;
			ctx.fillRect(offSet, 0, blockWidth, blockHeight);
			ctx.fillRect(offSet, h - blockHeight, blockWidth, blockHeight);
			offSet += blockWidth;
		}
		currentHarmony = harmony;
		currentPointDetails = details;
	}
	
	function appendLine(colorDetails, harmony){
		const line = document.createElement('div');
		line.setAttribute('class', 'line');
		for(let d of colorDetails){
			const hexInput = document.createElement('input');
			hexInput.value = d.hex;
			hexInput.setAttribute('style', 'border-color: ' + d.hex);
			line.appendChild(hexInput);
		}
		const harmonyLabel = document.createElement('label');
		harmonyLabel.setAttribute('class', 'harmony');
		harmonyLabel.innerText = harmony;
		line.appendChild(harmonyLabel);
		
		const deleteBtn = document.createElement('button');
		deleteBtn.innerText = 'X';
		deleteBtn.addEventListener('click', () => {
			line.parentElement.removeChild(line);
		});
		line.appendChild(deleteBtn);
		document.getElementById('savedArea').prepend(line);
	}
	
	function getPointDetails(point){
		const hsl = colorAtPoint(point.x, point.y);
		const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
		const hex = RgbToHex(rgb[0], rgb[1], rgb[2])
		const details = {
			point,
			hsl,
			rgb,
			hex
		};
		return details;
	}
	
	function RgbToHex(r, g, b){
		
		let hexColors = [];
		hexColors.push(round(r).toString(16));
		hexColors.push(round(g).toString(16));
		hexColors.push(round(b).toString(16));
		for(let i = 0; i < hexColors.length; i++){
			if(hexColors[i].length === 1){
				hexColors[i] = '0' + hexColors[i];
			}
		}
		return '#' + hexColors[0] + hexColors[1] + hexColors[2];
	}
	
	function paintCircle(){
		const imgData = backingCtx.createImageData(w, h);
		for(let row = 0; row < h; row++){
			for(let col = 0; col < w; col++){
				const destOffset = (row * w + col) * 4;
				const hslColor = colorAtPoint(col, row);
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
			return [angle, sat, 1-distMapped];
		}
	}
}

function drawTextBG(ctx, txt, font, x, y) {
    ctx.save();
    ctx.font = font + 'px consolas';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#000';
    var width = ctx.measureText(txt).width;
    ctx.fillRect(x, y, width, font);
    ctx.fillStyle = '#fff';
    ctx.fillText(txt, x, y);
    ctx.restore();
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