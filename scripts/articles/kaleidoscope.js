let animationID = null;
let h = 1;
let w = 1;
let ctx = null;
let backCtx = null;
let center = null;

let backColor = randomColor();
let segments = 8;

let backgroundObjects = [];

function setUp(){
	const c = document.getElementById('canv');
	const backC = document.getElementById('backCanv'); //document.createElement('canvas');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	h = w;
	center = {x: w/2, y: h/2};
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	ctx = c.getContext('2d');
	
	backC.setAttribute('width', w);
	backC.setAttribute('height', h);
	backCtx = backC.getContext('2d');
	
	const numObjects = 350;
	backCtx.lineWidth = 10;
	const half = w/2;
	for(let i = 0; i < numObjects; i++){
		if(Math.random() > 0.1){
			backgroundObjects.push({
				type: 'circle',
				x: Math.random() * half + half,
				y: Math.random() * half + half,
				radius: Math.random() * w * 0.06,
				color: randomColor()
			});
		}
		else{
			backgroundObjects.push({
				type: 'line',
				xFrom: Math.random() * half + half,
				yFrom: Math.random() * half + half,
				xTo: Math.random() * half + half,
				yTo: Math.random() * half + half,
				radius: Math.random() * w * 0.04,
				color: randomColor()
			});
		}
	}
	
	setInterval(() => {
		drawBackground();
		//drawSimpleBackground();
		drawKaleidoscope();
	}, 150);
}

function drawCircle(ctx, x, y, radius, color, fill){
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2*Math.PI);
	if(fill){
		ctx.fillStyle = color;
		ctx.fill();
	}
	else{
		ctx.strokeStyle = color;
		ctx.stroke();
	}
}

function angleBetweenPoints(x1, y1, x2, y2){
	return Math.atan2(x1-x2,y1-y2);
}

function pointToAngle(p){
	const mappedX = p.x - (w/2);
	const mappedY = p.y - (h/2);
	return Math.atan2(mappedX, mappedY);
}

function filterGlow(ctx){
	const imgData = ctx.getImageData(0,0, w, h);
	for(let row = 0; row < h; row++){
		for(let col = 0; col < w; col++){
			const destOffset = (row * w + col) * 4;
			let brightness = (imgData.data[destOffset + 0] + imgData.data[destOffset + 1] + imgData.data[destOffset + 2]) / (255 * 3);
			brightness = Math.sqrt(brightness) + 1;
			
			imgData.data[destOffset + 0] = imgData.data[destOffset + 0] * brightness;
			imgData.data[destOffset + 1] = imgData.data[destOffset + 1] * brightness;
			imgData.data[destOffset + 2] = imgData.data[destOffset + 2] * brightness;
			imgData.data[destOffset + 3] = 255;
		}
	}
	ctx.putImageData(imgData, 0, 0); 
}

function translatePoint(p){
	let dist = distance(p, center);
	if(dist > w/2)
		dist -= (dist - w/2) * 2;
		
	let angle = angleBetweenPoints(p.x, p.y, center.x, center.y);
	if(angle < 0)
		angle = Math.abs(angle);
		//angle += Math.PI;
	const mappedAngle = (angle / (Math.PI * 2)) * segments;
	let angleProgression = mappedAngle - (~~mappedAngle);
	if(angleProgression > 0.5)
		angleProgression = 1-angleProgression;
	const srcAngle = ((angleProgression/segments) * Math.PI * 2);
	
	let srcPoint = {
		x: center.x + (Math.cos(srcAngle) * dist),
		y: center.y + (Math.sin(srcAngle) * dist)
	};
	return srcPoint;
}

function drawKaleidoscope(){
	segments = parseFloat(document.getElementById('segmentsInput').value);
	const imgData = backCtx.getImageData(0,0, w, h);
	const destImgDate = ctx.createImageData(w,h);
	for(let row = 0; row < h; row++){
		for(let col = 0; col < w; col++){
			const destOffset = (row * w + col) * 4;
			const srcPoint = translatePoint({x: col, y: row});
			const srcOffset = ((~~srcPoint.y * w + ~~srcPoint.x)) * 4;

			destImgDate.data[destOffset + 0] = imgData.data[srcOffset + 0];
			destImgDate.data[destOffset + 1] = imgData.data[srcOffset + 1];
			destImgDate.data[destOffset + 2] = imgData.data[srcOffset + 2];
			destImgDate.data[destOffset + 3] = 255;
		}
	}
	ctx.putImageData(destImgDate, 0, 0); 
}

function drawSimpleBackground(){
	backCtx.fillStyle = 'blue';
	const numCircles = 10;
	for(let i = 0; i < numCircles; i++){
		drawCircle(backCtx, Math.random() * w, Math.random() * h, Math.random() * w * 0.3, randomColor(), true);
	}
}

let firstFrame = true;
function drawBackground(){
	const rippleStrength = parseFloat(document.getElementById('rippleStrengthInput').value);
	if(rippleStrength || firstFrame){
		firstFrame = false;
		backCtx.globalAlpha = 1;
		backCtx.fillStyle = backColor;
		backCtx.fillRect(0,0,w,h);

		backCtx.globalAlpha = 0.6;
		backCtx.lineWidth = 10;
		const half = w/2;
		for(let o of backgroundObjects){
			if(o.type === 'circle'){
				drawCircle(backCtx, o.x, o.y, o.radius, o.color, true);
			}
			else if(o.type === 'line'){
				backCtx.strokeStyle = o.color;
				backCtx.beginPath();
				backCtx.moveTo(o.xFrom, o.yFrom);
				backCtx.lineTo(o.xTo, o.yTo);
				backCtx.stroke();
			}
		}
		if(rippleStrength){
			filterRipple(backCtx, half, half, half, half, rippleStrength);
		}
	}
}


function setUpSliderReadout(sliderName, readoutName){
	document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	document.getElementById(sliderName).addEventListener('input', () => {
		document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	});
}

window.addEventListener('DOMContentLoaded', () => {
	setUp();
	document.getElementById('segmentsInput').addEventListener('input', drawKaleidoscope);
});