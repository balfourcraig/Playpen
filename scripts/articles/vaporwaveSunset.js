let linePositions = [];
let w = 1;
let h = 1;
let ctx = null;
let backgroundCircles = [];
let ripplePos = 0;

let birds = [];

function setUp(){
	//sun lines
	//linePositions = [];
	//const numSunLines = 4;
	//for(let i = 0; i < numSunLines; i++){
		//linePositions.push(i/numSunLines);
	//}
	setUpSunLines(parseInt(document.getElementById('sunLinesInput').value));
	
	const c = document.createElement('canvas');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	h = w * 0.8;
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
		const cr = Math.random() * w * 0.08 + (w * 0.05);
		const color = 'hsl(' + (Math.random() * 90 + 240) + ',40%,50%)';
		const speed = Math.random() * 2 + 0.5;
		backgroundCircles.push({center: {x: cx,y:cy}, radius: cr, color: color, speed: speed});
	}
	
	const maxBirds = parseInt(document.getElementById('maxBirdsInput').value);
	const numBirds = 1 + ~~(Math.random() * maxBirds);
	for(let i = 0; i < numBirds; i++){
		birds.push(createBird(false));
	}
}

function setUpSunLines(numLines){
	linePositions = [];
	for(let i = 0; i < numLines; i++){
		linePositions.push(i/numLines);
	}
}

function createBird(offscreen){
	const bird = { 
		x: offscreen ? (Math.random() < 0.5 ? 0 : w) : Math.random() * w,
		y: Math.random() * h * 0.3 + h * 0.1,
		speed: (Math.random() * 1.5 + 1) * (Math.random() < 0.5 ? -1 : 1),
		offset: Math.random() * Math.PI * 2,
		initialSize: 6
	};
	return bird;
}

function drawPattern(){
	ctx.clearRect(0, 0, w, h);

	const numSunLines = parseInt(document.getElementById('sunLinesInput').value);
	if(numSunLines != linePositions.length)
		setUpSunLines(numSunLines);

	//sun
	const sunCenter = {
		x: w * parseFloat(document.getElementById('SunXInput').value),
		y: h * (1 - parseFloat(document.getElementById('SunYInput').value))
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
	
	//mist
	const showMist = document.getElementById('showMistInput').checked;
	if(showMist){
		const mistUp = document.getElementById('mistUpInput').checked;
		for(let i = 0; i < backgroundCircles.length; i++){
			const mistGrad = ctx.createRadialGradient(backgroundCircles[i].center.x, backgroundCircles[i].center.y, 0, backgroundCircles[i].center.x, backgroundCircles[i].center.y, backgroundCircles[i].radius);
			mistGrad.addColorStop(0, backgroundCircles[i].color);
			mistGrad.addColorStop(1, 'transparent');
			
			drawCircle(ctx, backgroundCircles[i].center, backgroundCircles[i].radius, mistGrad);
			
			if(mistUp){
				backgroundCircles[i].center.y -= backgroundCircles[i].speed;
				if(backgroundCircles[i].center.y < -backgroundCircles[i].radius)
					backgroundCircles[i].center.y = h/2 + backgroundCircles[i].radius;
			}
			else{
				backgroundCircles[i].center.y += backgroundCircles[i].speed;
				if(backgroundCircles[i].center.y > h/2 + backgroundCircles[i].radius)
					backgroundCircles[i].center.y = -backgroundCircles[i].radius;
			}		
		}
		ctx.globalCompositeOperation = 'destination-over';
	}
	
	//sky
	const skyLinearGrad = ctx.createLinearGradient(0, 0, 0, h/2);
	skyLinearGrad.addColorStop(0, 'black');
	skyLinearGrad.addColorStop(1, '#cc33ff');
	ctx.fillStyle = skyLinearGrad;
	ctx.fillRect(0, 0, w, h);
	
	ctx.globalCompositeOperation = 'source-over';
	
	//birds
	const maxBirds = parseInt(document.getElementById('maxBirdsInput').value);
	if(birds.length < maxBirds && Math.random() < 0.01)
		birds.push(createBird(true));
	
	for(let i = 0; i < birds.length; i++){
		let birdPosY = Math.sin(birds[i].offset + (birds[i].x/w * Math.PI * 4));
		birdPosY += 0.5;
		birdPosY *= w * 0.05;
		birdPosY += birds[i].y;
		let birdSize = birds[i].speed < 0 ? (birds[i].x/w) : (1 - birds[i].x/w);
		birdSize = (birdSize * 0.7 + 0.3) * birds[i].initialSize;
		drawBird(ctx, {x: birds[i].x, y: birdPosY}, birdSize, 'black');
		birds[i].x += birds[i].speed;
		if(birds[i].x < - birds[i].initialSize || birds[i].x > w + birds[i].initialSize){
			removeFromArray(birds, birds[i]);
			i--;//is this needed?
		}
	}
	
	//Ripple reflection
	const choppiness = parseFloat(document.getElementById('ChoppinessInput').value);

	const srcData = ctx.getImageData(0, 0, w, h/2);
	const destData = ctx.createImageData(w, h/2);
	
	for(let row = 0; row < h/2; row++){
		for(let col = 0; col < w; col++){
			const destOffset = ((h/2 - row) * w + col) * 4;
			let lightness = (row/(h/2) + 0.3);
			
			let shiftedRow = 0;
			let shiftedCol = 0;
			
			if(choppiness === 0){
				shiftedRow = row;
				shiftedCol = col;
			}
			else{
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

				shiftedRow = row + rowShift;
				shiftedCol = col + colShift;
				
			}
			const srcOffset = (shiftedRow * w + shiftedCol) * 4;
			destData.data[destOffset] = 0.7 * lightness * srcData.data[srcOffset];
			destData.data[destOffset + 1] = lightness * srcData.data[srcOffset + 1];
			destData.data[destOffset + 2] = 1.2 * lightness * srcData.data[srcOffset + 2];
			destData.data[destOffset + 3] = 255;
		}
	}
	ripplePos = (ripplePos + 0.002) % 1;
	ctx.putImageData(destData, 0, h/2); 

	//VHS Filter
	const vhsAmount = parseInt(document.getElementById('vhsAmountInput').value);
	if(vhsAmount){
		const srcVHSData = ctx.getImageData(0, 0, w, h);
		const destVHSData = ctx.createImageData(w, h);
		for(let row = 0; row < h; row++){
			for(let col = 0; col < w; col++){
				const destOffset = (row * w + col) * 4;
				
				const rOffset = (row * w + (col - vhsAmount)) * 4;
				const gOffset = (row * w + (col)) * 4;
				const bOffset = (row * w + (col + vhsAmount)) * 4;
				
				destVHSData.data[destOffset] = srcVHSData.data[rOffset];
				destVHSData.data[destOffset + 1] = srcVHSData.data[gOffset + 1];
				destVHSData.data[destOffset + 2] = srcVHSData.data[bOffset + 2];
				destVHSData.data[destOffset + 3] = 255;
			}
		}
		ctx.putImageData(destVHSData, 0, 0);
	}
	
	//vignette
	const vignetteStrength = parseFloat(document.getElementById('vignetteInput').value);
	if(vignetteStrength){
		const vignetteGrad = ctx.createRadialGradient(w/2, h/2, w/4, w/2, h/2, w/2);
		vignetteGrad.addColorStop(0, 'transparent');
		vignetteGrad.addColorStop(1, 'rgba(0,0,0,' + vignetteStrength + ')');
		ctx.fillStyle = vignetteGrad;
		ctx.fillRect(0,0,w,h);
	}
}

function clamp(num, min, max){
	return num <= min ? min : num >= max ? max : num;
}

function drawBird(ctx, center, width, color){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(center.x - width, center.y - width * 0.3);
	ctx.lineTo(center.x, center.y);
	ctx.lineTo(center.x + width, center.y - width * 0.3);
	ctx.stroke();
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
	setUpSliderReadout('sunLinesInput','sunLinesReadout');
	setUpSliderReadout('vhsAmountInput','vhsAmountReadout');
	setUpSliderReadout('maxBirdsInput','maxBirdsReadout');
	setUp();
	setInterval(drawPattern, 50);
});