let animationID = null;
const radiusMultiplier = 0.21;

function drawPattern(){
	document.getElementById('drawBtn').setAttribute('style','display:none');
	document.getElementById('stopDrawingBtn').removeAttribute('style');
	
	window.cancelAnimationFrame(animationID);
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	const ctx = c.getContext('2d');
	const center = {x: w/2.0, y: w/2.0};

	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.strokeStyle = 'none';
	ctx.fillRect(0, 0, w, w);
	
	const animate = document.getElementById('animateInput').checked;
	const randRot = document.getElementById('rotInput').checked;
	const sqrt = document.getElementById('sqrtDistInput').checked;
	//const down = document.getElementById('countDownInput').checked;
	const drawDir = document.getElementById('drawDirInput').value;
	const colorType = document.getElementById('colorModeSelect').value;

	const drawings = [];
	ctx.globalAlpha = 0.6;
	const colors = [];
	if(colorType === 'fib'){
		for(let i = 0; i < 10; i++){
			colors.push(nextGoldenColor(80,55));
		}
	}
	
	let flatColor = 'black';
	if (colorType ==='mono')
		flatColor = nextGoldenColor(80,55);
	
	drawPineCone(ctx, center, w/2.5, colorType, 0, 2, 1);
	
	document.getElementById('drawBtn').removeAttribute('style');
	document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
}

function drawPineCone(ctx, coneCentre, totalRadius, colorType, baseAngle, depth, baseOpacity){
	//drawCircle(ctx, coneCentre, totalRadius, `hsl(${radToDeg((baseAngle))},90%,50%)`);
	const indexes = [];
	for(let i = 0; i < 100; i++){
		indexes.push(i);
	}
	for(let j = 0; j < indexes.length; j++){
		const i = indexes[j];
		const angle = i * goldenAngleRad;
		const offset = (i+1) * totalRadius/indexes.length;
		const x = Math.cos(angle) * offset + coneCentre.x;
		const y = Math.sin(angle) * offset + coneCentre.y;
		
		const p = {x:x, y:y};
		
		const rad = (totalRadius * radiusMultiplier);
		const opacity = 1- (i/(indexes.length));
		ctx.globalAlpha = (baseOpacity + opacity)/2;
		
		if(depth === 0 || rad < 0.5){
			let color;
			
			if(colorType === 'fib'){
				if (i % 144 === 0)
					color = colors[1];
				else if (i % 89 === 0)
					color = colors[2];
				else if (i % 55 === 0)
					color = colors[3];
				else if (i % 34 === 0)
					color = colors[4];
				else if (i % 21 === 0)
					color = colors[5];
				else if (i % 13 === 0)
					color = colors[6];
				else if (i % 8 === 0)
					color = colors[7];
				else if (i % 5 === 0)
					color = colors[8];
				else if (i % 3 === 0)
					color = colors[9];
				else
					color = colors[0];
			}
			else if (colorType == 'wheel')
				color = `hsl(${radToDeg((angle + baseAngle))},90%,50%)`; //nextGoldenColor(90,50);
			else if (colorType === 'rand')
				color = randomColor();
			else
				color = flatColor;

			drawCircle(ctx, p, rad, color);
		}
		else{
			drawPineCone(ctx, p, rad, colorType, angle, depth -1, opacity);
		}
	}
}

function drawCircle(ctx, center, radius, color){
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.fill();
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click', drawPattern);
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
});