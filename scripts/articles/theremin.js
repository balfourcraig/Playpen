const golden_ratio= 0.618033988749895;
let randh = Math.random();
let w = 0;
let osc;
let gainNode;
let mousePosArr = [];
let started = false;
let ctx;

function setUp(){
	started = true;
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	console.log('setup');
	const c = document.createElement('canvas');
	c.id = 'pieCanvas';
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	ctx = c.getContext('2d');
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	mousePosArr = [];
	const aCtx = new AudioContext(); 
	
	gainNode = aCtx.createGain();
	gainNode.gain.value = 0.3;
	gainNode.connect(aCtx.destination);
	

	osc = aCtx.createOscillator();
	osc.frequency.value = 0;
	osc.type = 'sine';
	osc.connect(gainNode);
	osc.start();
	
	canvResult.addEventListener('mousemove', drawPattern);
	canvResult.addEventListener('touchmove', drawPattern);
	
	document.getElementById('startBtn').style.display = 'none';
	document.getElementById('stopDrawingBtn').style.display = 'block';
	drawPattern();
}

function drawPattern(e){
	const invertColor = document.getElementById('invertInput').checked;
	const baseFreq = Math.max(100, Math.min(20000, parseInt(document.getElementById('baseFreqInput').value)));
	const maxTrails = Math.max(0, parseInt(document.getElementById('maxTrailsInput').value));
	const trailWidth = Math.max(1, parseInt(document.getElementById('lineWidthInput').value));
	const gridLines = Math.max(0, parseInt(document.getElementById('gridLinesInput').value));
	const showLines = document.getElementById('showLinesInput').checked && maxTrails > 0;
	const waveType = document.getElementById('waveTypeSelect').value;
	const baseVolume = Math.max(0, Math.min(100, parseInt(document.getElementById('baseVolumeInput').value))) / 100;
	
	if(waveType != osc.type)
		osc.type = waveType;
	
	if(started){
		ctx.globalCompositeOperation = invertColor ? 'screen' : 'source-over';
	
		ctx.clearRect(0, 0, w, w);
		ctx.strokeStyle = 'black';
		ctx.fillStyle = invertColor ? 'black' : 'white';
		ctx.fillRect(0, 0, w, w);
		const c = document.getElementById('pieCanvas');

		if(e) {
			const rect = c.getBoundingClientRect();
		
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;
			
			const xMapped = (0.9 * Math.pow(mouseX / rect.width, 1.5)) + 0.1;
			const yMapped = mouseY / rect.height;
			
			osc.frequency.value = xMapped * baseFreq;
			gainNode.gain.value = yMapped * baseVolume;
			const mousePoint = {x: mouseX, y: mouseY};
			
			if(showLines){
				if(mousePosArr.length < maxTrails){
					mousePosArr.unshift({point: mousePoint});
				}
				else{
					for(let i = Math.min(mousePosArr.length -1, maxTrails); i > 0; i--){
						mousePosArr[i] = mousePosArr[i - 1];
					}
					mousePosArr[0] = {point: mousePoint};
				}

				if(mousePosArr.length > 1 && maxTrails > 1){
					ctx.lineWidth = trailWidth;
					for(let i = 1; i < Math.min(mousePosArr.length, maxTrails); i++){
						const grad = ctx.createLinearGradient(mousePosArr[0].point.x, mousePosArr[0].point.y, mousePosArr[i].point.x, mousePosArr[i].point.y);
						grad.addColorStop(1, 'rgba(255,255,255,0)');
						grad.addColorStop(0.2, 'hsla(' + (i/Math.min(mousePosArr.length, maxTrails) * 360) + ',' + (yMapped * 80 + 20) + '%, 50%,' + (0.2 + 0.8 * yMapped) + ')');
						grad.addColorStop(0, 'rgba(255,255,255,0)');
						ctx.strokeStyle = grad;
						
						ctx.beginPath();
						ctx.moveTo(mousePosArr[0].point.x, mousePosArr[0].point.y);
						ctx.lineTo(mousePosArr[i].point.x, mousePosArr[i].point.y);
						ctx.stroke();
					}
					ctx.lineWidth = 1;
				}
			}
			drawCircle(ctx, mousePoint, trailWidth * 1.5,  invertColor ? 'white' : 'black');
		}
		if(gridLines > 0){
			drawSquareGrid(ctx, w, gridLines, invertColor ? 'white' : 'black');
		}
	}
}

function drawSquareGrid(ctx, w, squares, color){
	const oldStrokeStyle = ctx.strokeStyle;
	ctx.strokeStyle = color;
	ctx.beginPath();
	for(let i = 1; i < squares; i++){
		const xPoint = (w / squares) * i;
		ctx.moveTo(xPoint, 0);
		ctx.lineTo(xPoint, w);
		ctx.moveTo(0, xPoint);
		ctx.lineTo(w, xPoint);
	}
	ctx.stroke();
	ctx.strokeStyle = oldStrokeStyle;
}

function drawCircle(ctx, center, radius, color){
	const oldStrokeStyle = ctx.strokeStyle;
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.fill();
	ctx.strokeStyle = oldStrokeStyle;
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('startBtn').addEventListener('click', setUp);
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		osc.stop();
		started = false;
		ctx.fillStyle = 'white';
		ctx.fillRect(0,0,w,w);
		document.getElementById('stopDrawingBtn').style.display = 'none';
		document.getElementById('startBtn').style.display = 'block';
	});
});