let animationID = null;
let drops = [];
let c;
let ctx;
let isSetUp = false;
let lastMousePos = null;

function setUp(){
	window.cancelAnimationFrame(animationID);

	document.getElementById('drawBtn').setAttribute('style','display:none');
	document.getElementById('stopDrawingBtn').removeAttribute('style');
	isSetUp = true;
	
	window.cancelAnimationFrame(animationID);
	c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	ctx = c.getContext('2d');
	const center = {x: w/2.0, y: w/2.0};
	c.addEventListener('mousemove', onMouseOver);
	c.addEventListener('mouseleave', () => {
		lastMousePos = null;
	});

	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);

	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, w, w);

	ctx.lineCap = 'round';
	ctx.lineWidth = 16;
	//const drop1 = {point: {x: w / 2, y: 0}, speed: 1};
	//const drops = [drop1];
	drops = [];

	animationID = window.requestAnimationFrame(() => {
		drawDots();
	});
	
	const acceleration = 1.02;

	function drawDots(){
		ctx.fillStyle = 'rgba(256,256,256,0.1)';
		ctx.fillRect(0, 0, w, w);

		if(Math.random() < parseFloat(document.getElementById('rateInput').value)){
			drops.push(dropAtPoint({x: ~~(Math.random() * w), y: ~~(mapLinear(Math.random(), 0, 1, -w*0.2 , w*0.9))}, document.getElementById('splashInput').checked));
		}
		
		if(lastMousePos && document.getElementById('mouseInput').checked && Math.random() < parseFloat(document.getElementById('rateInput').value)){
			drops.push(dropAtPoint(lastMousePos, document.getElementById('splashInput').checked));
		}

		for(let i = 0; i < drops.length; i++){
			const d = drops[i];

			d.speed *= acceleration;
			const pointTo = {x: d.point.x, y: d.point.y + d.speed};
			
			ctx.lineWidth = d.rad;
			drawLine(ctx, d.point, pointTo, d.color);
			d.point = pointTo;
			
			if(pointTo.y > w){
				drops.splice(i,1);
				i--;
			}
		}
		animationID = window.requestAnimationFrame(() => {
			drawDots();
		});
	}
	
	function onMouseOver(e){
		if(isSetUp){
			let canvRect = c.getBoundingClientRect();
			lastMousePos = {x: e.clientX - canvRect.left, y: e.clientY - canvRect.top};
			
			//const newDrop = dropAtPoint(mousePoint, document.getElementById('splashInput').checked);
			//drops.push(newDrop);
		}
	}
	
	function dropAtPoint(point, drawSplash){
		const h = mapLinear(Math.random(), 0, 1, 195, 230);
		const s = mapLinear(Math.random(), 0, 1, 85, 100);
		const l = mapLinear(Math.random(), 0, 1, 75, 95);
		const color = 'hsl(' + h + ',' + s + '%,' + l + '%)';
		const rad = mapLinear(Math.random(), 0, 1, 15, 20);
		if(drawSplash)
			drawCircle(ctx, point, rad * 1.2, color);
		
		return {point: point, speed: 1, color: color, rad: rad};
	}
}

function drawLine(ctx, start, end, color){
	ctx.strokeStyle = color;

	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(end.x,end.y);
	ctx.stroke();
}

function drawCircle(ctx, center, radius, color){
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.fill();
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click', setUp);
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		isSetUp = false;
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
});