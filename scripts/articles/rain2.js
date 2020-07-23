let animationID = null;
let c;
let ctx;
let isSetUp = false;
let lastMousePos = null;

function setUp(){
	const img = document.createElement('img');
	img.src = '../Images/RainBack.jpg';

	const dropImg = document.createElement('img');
	dropImg.src = '../Images/Drop02.png';
	
	const splashImgs = [];
	for(let i = 1; i <=3; i++){
		const splash01 = document.createElement('img');
		splash01.src = '../Images/GroundSplash0' + i + '.png';
		splashImgs.push(splash01);
	}
	
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

	const drops = [];
	const fadeDrops = [];
	const splashes = [];

	animationID = window.requestAnimationFrame(() => {
		drawDots();
	});
	
	const acceleration = 1.02;

	function drawDots(){
		//ctx.fillStyle = 'black';
		//ctx.fillRect(0, 0, w, w);
		//ctx.globalAlpha = 1;
		//ctx.globalCompositeOperation = 'source-over';
		ctx.drawImage(img, 0, 0, w, w);
		//ctx.globalCompositeOperation = 'screen';
		//ctx.globalAlpha = 0.5;
		
		const showSplashes = document.getElementById('splashInput').checked;
		
		if(Math.random() < parseFloat(document.getElementById('rateInput').value)){
			drops.push(dropAtPoint({x: ~~(Math.random() * w), y: ~~(mapLinear(Math.random(), 0, 1, -w*0.2 , w * 0.9))}, document.getElementById('splashInput').checked));
		}
		
		if(lastMousePos && document.getElementById('mouseInput').checked && Math.random() < parseFloat(document.getElementById('rateInput').value)){
			drops.push(dropAtPoint(lastMousePos, showSplashes));
		}

		for(let i = 0; i < drops.length; i++){
			const d = drops[i];

			d.speed *= acceleration;
			const pointTo = {x: d.point.x, y: d.point.y + d.speed};
			
			ctx.lineWidth = d.rad * 0.5;
			drawLine(ctx, d.start, pointTo, d.color);
			//drawCircle(ctx, pointTo, (d.rad * 1.1)/2, d.color);
			ctx.drawImage(dropImg, pointTo.x - d.rad/2, pointTo.y-d.rad/2, d.rad, d.rad);
			d.point = pointTo;
			
			if(pointTo.y > w){
				drops.splice(i,1);
				i--;
				fadeDrops.push(d);
				if(showSplashes)
					splashes.push({point: {x: d.point.x, y: w}, rad: 0.1, opacity: 1, glyphID: ~~(Math.random() * splashImgs.length)});
			}
		}
		for(let i = 0; i < fadeDrops.length; i++){
			const d = fadeDrops[i];
			
			const pointTo = {x: d.point.x, y: d.point.y + d.speed};
			d.start = {x: d.start.x, y: d.start.y + d.speed};
			
			ctx.lineWidth = d.rad;
			drawLine(ctx, d.start, pointTo);
			//drawCircle(ctx, pointTo, (d.rad * 1.2)/2, d.color);
			d.point = pointTo;
			
			if(d.start.y > w){
				fadeDrops.splice(i,1);
				i--;
			}
		}
		for(let i = 0; i < splashes.length; i++){
			const d = splashes[i];
			ctx.globalAlpha = d.opacity;
			//drawCircle(ctx, d.point, d.rad, d.color);
			splash = splashImgs[d.glyphID];
			ctx.drawImage(splash, d.point.x - d.rad/2, d.point.y - d.rad/2, d.rad, d.rad);
			d.opacity -= 0.04;
			d.rad += w*0.01;
			if(d.opacity <= 0){
				splashes.splice(i,1);
				i--;
			}
		}
		ctx.globalAlpha = 1;
		animationID = window.requestAnimationFrame(() => {
			drawDots();
		});
	}
	
	function onMouseOver(e){
		if(isSetUp){
			let canvRect = c.getBoundingClientRect();
			lastMousePos = {x: e.clientX - canvRect.left, y: e.clientY - canvRect.top};
		}
	}
	
	function dropAtPoint(point, drawSplash){
		const h = mapLinear(Math.random(), 0, 1, 195, 230);
		const s = mapLinear(Math.random(), 0, 1, 85, 100);
		const l = mapLinear(Math.random(), 0, 1, 75, 95);
		const color = 'hsl(' + h + ',' + s + '%,' + l + '%)';
		const rad = mapLinear(Math.random(), 0, 1, w * 0.02, w * 0.03);
		//if(drawSplash)
			//drawCircle(ctx, point, rad * 1.2, color);
		
		return {point: point, start: point, speed: 1, color: color, rad: rad};
	}
}

function drawLine(ctx, start, end){
	const grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
	grad.addColorStop(0, 'transparent');
	grad.addColorStop(1, 'rgba(0,0,0,0.2)');
	
	ctx.strokeStyle = grad;

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