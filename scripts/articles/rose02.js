let animationID = null;

let c;
let w
let h;
let ctx;
let center;

function randomRedShade(){
	const hue = getRandomInt(350,370) + 'deg';
	const sat = getRandomInt(80,100) + '%';
	const val = getRandomInt(50,70) + '%';
	return 'hsl(' + hue + ',' + sat + ',' + val + ')';
}


function setUp(){
	c = document.createElement('canvas');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	h = w;
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	ctx = c.getContext('2d');
	center = {x: w/2.0, y: w/2.0};
	
	//ctx.globalCompositeOperation = 'multiply';
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
}

function drawPattern(){
	document.getElementById('drawBtn').setAttribute('style','display:none');
	
	window.cancelAnimationFrame(animationID);
	setUp();
	
	ctx.globalAlpha = 0.95;
	
	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.strokeStyle = 'none';
	ctx.beginPath();
	ctx.rect(0, 0, w, w);
	ctx.fill();
	
	const animate = document.getElementById('animateInput').checked;

	
	const rotation = Math.random() * Math.PI * 2 ;

	const drawings = [];

	const indexes = [];
	for(let i = 0; i < 100; i++){
		indexes.push(i);
	}
	drawings.push(() => drawCircle(ctx, center, w*0.25, 'darkred'));
	for(let j = indexes.length-1; j > 2; j -= 1){
		const i = indexes[j];
		const angle = i * goldenAngleRad + rotation;
		const offset = i * w * 0.0029;
		
		const x = Math.cos(angle) * offset + center.x;
		const y = Math.sin(angle) * offset + center.y;
		
		const p = {x:x, y:y};
		
		const radius = Math.sqrt(i) * (w * 0.02) + (w * 0.02);
		
		let color = randomRedShade();
		console.log(p);
		drawings.push(() => drawLeafAtPoint(p, radius, angle));
	}
	if(animate){
		animateLine(drawings, 0);
	}
	else{
		for(let i = 0; i < drawings.length; i++){
			drawings[i]();
		}
		document.getElementById('drawBtn').removeAttribute('style');
	}
}

function animateLine(allActions, index){
	if(index < allActions.length){
		allActions[index]();

			animationID = window.requestAnimationFrame(() => {
				animateLine(allActions, index + 1);
			});

	}
	else{
		document.getElementById('drawBtn').removeAttribute('style');
	}
}

function drawCircle(ctx, center, radius, color){
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.fill();
}

function drawLeafAtPoint(p, size, angle){
	const leafTip = {
		x: Math.cos(angle) * size + p.x,
		y: Math.sin(angle) * size + p.y
	};
	
	const leftControl1 = {
		x: Math.cos(angle + 0.7) * (size * 0.9) + p.x,
		y: Math.sin(angle + 0.7) * (size * 0.9) + p.y 
	};
	
	const leftControl2 = {
		x: Math.cos(angle + 0.1) * (size * 0.8) + p.x,
		y: Math.sin(angle + 0.1) * (size * 0.8) + p.y 
	};
	
	const rightControl1 = {
		x: Math.cos(angle - 0.7) * (size * 0.9) + p.x,
		y: Math.sin(angle - 0.7) * (size * 0.9) + p.y 
	};
	
	const rightControl2 = {
		x: Math.cos(angle - 0.1) * (size * 0.8) + p.x,
		y: Math.sin(angle - 0.1) * (size * 0.8) + p.y 
	};
	
	ctx.beginPath();
	ctx.moveTo(p.x, p.y);
	ctx.bezierCurveTo(leftControl1.x, leftControl1.y, leftControl2.x, leftControl2.y, leafTip.x, leafTip.y);
	ctx.bezierCurveTo(rightControl2.x, rightControl2.y, rightControl1.x, rightControl1.y, p.x, p.y);
	
	const grad = ctx.createLinearGradient(p.x, p.y, leafTip.x, leafTip.y);
	grad.addColorStop(0.2, 'darkred');
	grad.addColorStop(1, randomRedShade());
	ctx.fillStyle = grad;
	ctx.fill();
}

window.addEventListener('DOMContentLoaded', () => {
	setUp();
	
	document.getElementById('drawBtn').addEventListener('click', drawPattern);
});