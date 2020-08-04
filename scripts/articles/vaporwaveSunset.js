let linePositions = [];
let w = 1;
let h = 1;
let ctx = null;
let backgroundCircles = [];
let ripplePos = 0;

function setUp(){
	//sun lines
	linePositions = [];
	const numSunLines = 4;
	for(let i = 0; i < numSunLines; i++){
		linePositions.push(i/numSunLines);
	}
	
	const c = document.createElement('canvas');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	h = w;
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	ctx = c.getContext('2d');
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	backgroundCircles = [];
	for(let i = 0; i < 100; i++){
		const cx = Math.random() * w;
		const cy = Math.random() * (h/2);
		const cr = Math.random() * w * 0.1 + 10;
		const color = 'hsl(' + (Math.random() * 90 + 180) + ',40%,20%)';
		const speed = Math.random() * 2 + 0.5;
		backgroundCircles.push({center: {x: cx,y:cy}, radius: cr, color: color, speed: speed});
	}
}

function drawPattern(){
	ctx.clearRect(0, 0, w, h);

	//sun
	const sunCenter = {
		x: w * parseFloat(document.getElementById('SunXInput').value),
		y: h * parseFloat(document.getElementById('SunYInput').value)
	};
	const sunRadius =  w * parseFloat(document.getElementById('SunSizeInput').value);
	
	ctx.globalCompositeOperation = 'source-over';
	const sunLinearGrad = ctx.createLinearGradient(sunCenter.x, sunCenter.y - sunRadius, sunCenter.x, sunCenter.y + sunRadius);
	sunLinearGrad.addColorStop(0, 'orange');
	sunLinearGrad.addColorStop(1, 'red');
	drawCircle(ctx, sunCenter, sunRadius, sunLinearGrad);

	for(let i = 0; i < linePositions.length; i++){
		const lineWidth = (sunRadius * (1- linePositions[i]) * 0.1); 
		const yTop = sunCenter.y + (sunRadius * (1 - linePositions[i])) - lineWidth/2;
		ctx.clearRect(0, yTop, w, lineWidth);
		linePositions[i] = (linePositions[i] + 0.002) % 1;
	}
	ctx.globalCompositeOperation = 'destination-over';
	drawCircle(ctx, sunCenter, sunRadius, '#920');
	
	const sunRadialGrad = ctx.createRadialGradient(sunCenter.x, sunCenter.y, sunRadius * 0, sunCenter.x, sunCenter.y, sunRadius * 1.4);
	sunRadialGrad.addColorStop(0, 'orange');
	sunRadialGrad.addColorStop(1, 'transparent');
	drawCircle(ctx, sunCenter, sunRadius * 1.4, sunRadialGrad);
	
	for(let i = 0; i < backgroundCircles.length; i++){
		drawCircle(ctx, backgroundCircles[i].center, backgroundCircles[i].radius, backgroundCircles[i].color);
		backgroundCircles[i].center.y += backgroundCircles[i].speed;
		if(backgroundCircles[i].center.y > h/2 + backgroundCircles[i].radius)
			backgroundCircles[i].center.y = -backgroundCircles[i].radius;
	}
	
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, w, h);
	ctx.globalCompositeOperation = 'source-over';

	
	//Ripple reflection
	const srcData = ctx.getImageData(0, 0, w, h/2);
	const destData = ctx.getImageData(0, 0, w, h/2);
	const choppiness = parseFloat(document.getElementById('ChoppinessInput').value);
	for(let row = 0; row < h/2; row++){
		for(let col = 0; col < w; col++){
			const destOffset = ((h/2 - row) * w + col) * 4;
			let lightness = (1 - row/(h/2) + 0.3);
			
			let colShift = row/(h/2);
			colShift = 
				Math.cos((colShift + ripplePos) * 50) 
				+ (Math.cos((colShift + (1-ripplePos) * 0.3 ) * 300) * 0.2)
				+ Math.sin((colShift + (1-ripplePos)) * 50 * 1.5);
			colShift += 0.5;
			colShift *= 10;
			colShift *= (1 - row/(h/2) + 0.1) * 2;
			colShift *= choppiness;
			colShift = ~~colShift;
			
			let rowShift = col/w;
			rowShift =
				Math.cos((rowShift + ripplePos) * 70)
				+ (Math.cos((rowShift + (ripplePos)) * 120) * 0.3)
				+ (Math.cos((rowShift + (1-ripplePos)) * 90) * 0.5);
			rowShift + 0.5;
			rowShift *= 2;
			rowShift *= (1 - row/(h/2) + 0.1) * 2;
			rowShift *= choppiness;
			rowShift = ~~rowShift;

			const srcOffset = ((row + rowShift) * w + (col + colShift)) * 4;

			destData.data[destOffset] = 0.7 * lightness * srcData.data[srcOffset];
			destData.data[destOffset + 1] = lightness * srcData.data[srcOffset + 1];
			destData.data[destOffset + 2] = 1.2 * lightness * srcData.data[srcOffset + 2];
		}
	}
	ripplePos = (ripplePos + 0.002) % 1;
	
	ctx.putImageData(destData, 0, h/2); 
}

function drawCircle(ctx, center, radius, color){
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.fill();
}

function setUpSliderReadout(sliderName, readoutName){
	document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	document.getElementById(sliderName).addEventListener('input', () => {
		document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	});
}

window.addEventListener('DOMContentLoaded', () => {
	setUp();
	setInterval(drawPattern, 50);
});