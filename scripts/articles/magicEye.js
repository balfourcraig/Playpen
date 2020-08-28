let animationID = null;
let h = 1;
let w = 1;
let ctx = null;
let depthCtx = null;

const DPI = 72; //Output device has 72 pixels per inch
const E = round(DPI * 2.5); //Eye separation is assumed to be 2.5 inches
const mu = (1/3); //Depth of field (fraction of viewing distance)
const separation = (Z) => round((1 - mu * Z) * E/(2-mu*Z));
const far = separation(0);
const maxX = 256;
const maxY = 256;

function setUp(){
	const c = document.getElementById('canv');
	const depthC = document.getElementById('depthCanv');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	h = w;
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	ctx = c.getContext('2d');
	
	depthC.setAttribute('width', w);
	depthC.setAttribute('height', h);
	depthCtx = depthC.getContext('2d');
	
	draw();
}

function drawBackground(numSegments){
	const segWidth = ~~(w/numSegments);
	
	const noisePasses = [
		{size: 20, opacity: 1},
		{size: 17, opacity: 0.6},
		{size: 13, opacity: 0.5},
		{size: 9, opacity: 0.4},
		{size: 5, opacity: 0.3},
		{size: 2, opacity: 0.2},
		{size: 1, opacity: 0.1},
	];
	
	for(let pass of noisePasses){
		ctx.globalAlpha = pass.opacity;
		for(let row = 0; row < h; row += pass.size){
			for(let col = 0; col < segWidth; col += pass.size){
				ctx.fillStyle = randomColor();
				ctx.fillRect(col, row, pass.size, pass.size);
			}
		}
	}
	
	const destData = ctx.getImageData(0, 0, segWidth, h);

	let offset = 0;
	for(let i = 0; i < numSegments; i++){
		ctx.putImageData(destData, offset, 0);
		offset += segWidth;
	}
}

function drawDepthMap(){
	depthCtx.fillStyle = 'black';
	depthCtx.fillRect(0,0,w,h);
	
	
	const grad = depthCtx.createRadialGradient(w/2, h/2, w/8, w/2, h/2, w/4);
	grad.addColorStop(0, 'white');
	grad.addColorStop(1, 'transparent');
	depthCtx.fillStyle = grad;
	depthCtx.fillRect(0,0,w,h);

}



function applyDepthMap(segments){
	const srcData = ctx.getImageData(0, 0, w, h);
	const depthData = depthCtx.getImageData(0, 0, w, h).data;
	const destData = ctx.createImageData(w, h);
	for(let row = 0; row < h; row += 1){
		for(let col = 0; col < w; col += 1){
			const destOffset = (row * w + col) * 4;
			
			//const depth = (depthData[destOffset] + depthData[destOffset + 1] + depthData[destOffset + 2]) / (3 * 255); //All channels
			const depth = depthData[destOffset] / 255; //Red channel only. Faster but won't work with full colour images
			let depthOffset = depth * 15;
			let seg = ((col / w) * segments);
			let segProgress = Math.abs((seg - ~~seg) - 0.5);
			segProgress = segProgress;
			seg -= segments /2;
			seg = ~~seg;
			const segOffset = Math.abs(seg) * 0.5;
			
			//depthOffset *= segOffset;
			depthOffset *= segProgress;
			
			depthOffset = ~~depthOffset;
			let pxOffset = (row * w + (col + depthOffset)) * 4;


			destData.data[destOffset] = srcData.data[pxOffset];
			destData.data[destOffset + 1] = srcData.data[pxOffset + 1];
			destData.data[destOffset + 2] = srcData.data[pxOffset + 2];
			destData.data[destOffset + 3] = 255;
		}
	}
	ctx.putImageData(destData, 0, 0);
}

function draw(){
	const segments = 8;
	drawDepthMap();
	drawBackground(segments);
	applyDepthMap(segments);
}

function setUpSliderReadout(sliderName, readoutName){
	document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	document.getElementById(sliderName).addEventListener('input', () => {
		document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	});
}

window.addEventListener('DOMContentLoaded', () => {
	setUp();
});