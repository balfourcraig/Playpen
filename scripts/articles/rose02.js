let animationID = null;

let c;
let w
let h;
let ctx;
let center;

let petalWidth = 0.7;

let colorPos = 0;

const colors = [];

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
	
	const maxPetals = parseInt(document.getElementById('NumPetalsInput').getAttribute('max'));
	for(let i = 0; i < maxPetals; i++){
		colors.push(randomRedShade());
	}
}

function drawPattern(){
	ctx.clearRect(0,0,w,h);
	petalWidth = parseFloat(document.getElementById('PetalWidthInput').value);
	const offsetMultiplier = parseFloat(document.getElementById('PetalClumpInput').value);
	const numPetals = parseInt(document.getElementById('NumPetalsInput').value);
	window.cancelAnimationFrame(animationID);
	
	const colorShift = parseInt(document.getElementById('colourShiftSelect').value);
	colorPos += colorShift;
	
	ctx.globalAlpha = 0.95;
	
	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.strokeStyle = 'none';
	ctx.beginPath();
	ctx.rect(0, 0, w, w);
	ctx.fill();

	if(document.getElementById('BackCircleInput').checked){
		const circleGrad = ctx.createRadialGradient(center.x, center.y, w * 0.05, center.x, center.y, w * 0.2);
		circleGrad.addColorStop(0, "darkred");
		circleGrad.addColorStop(1, "transparent");
		drawCircle(ctx, center, w*0.2, circleGrad);
	}
	
	for(let i = numPetals; i >= 0; i -= 1){
		const angle = i * goldenAngleRad;
		const offset = i * w * offsetMultiplier;
		
		const x = Math.cos(angle) * offset + center.x;
		const y = Math.sin(angle) * offset + center.y;
		
		const p = {x:x, y:y};
		
		const radius = Math.sqrt(i) * (w * 0.02) + (w * 0.02);
		
		let color = randomRedShade();

		drawLeafAtPoint(p, radius, angle, colors[(i + colorPos) % numPetals]);
	}
	//centerGrad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, w*0.02);
	//centerGrad.addColorStop(0.5, '#b30000');
	//centerGrad.addColorStop(1, "transparent");
	//drawCircle(ctx, center, w*0.04, centerGrad);
}

function drawCircle(ctx, center, radius, color){
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.fill();
}

function drawLeafAtPoint(p, size, angle, color){
	const leafTip = {
		x: Math.cos(angle) * size + p.x,
		y: Math.sin(angle) * size + p.y
	};
	
	const leftControl1 = {
		x: Math.cos(angle + 0.7 * petalWidth) * (size * 0.9) + p.x,
		y: Math.sin(angle + 0.7 * petalWidth) * (size * 0.9) + p.y 
	};
	
	const leftControl2 = {
		x: Math.cos(angle + 0.1 * petalWidth) * (size * 0.8) + p.x,
		y: Math.sin(angle + 0.1 * petalWidth) * (size * 0.8) + p.y 
	};
	
	const rightControl1 = {
		x: Math.cos(angle - 0.7 * petalWidth) * (size * 0.9) + p.x,
		y: Math.sin(angle - 0.7 * petalWidth) * (size * 0.9) + p.y 
	};
	
	const rightControl2 = {
		x: Math.cos(angle - 0.1 * petalWidth) * (size * 0.8) + p.x,
		y: Math.sin(angle - 0.1 * petalWidth) * (size * 0.8) + p.y 
	};
	
	ctx.beginPath();
	ctx.moveTo(p.x, p.y);
	ctx.bezierCurveTo(leftControl1.x, leftControl1.y, leftControl2.x, leftControl2.y, leafTip.x, leafTip.y);
	ctx.bezierCurveTo(rightControl2.x, rightControl2.y, rightControl1.x, rightControl1.y, p.x, p.y);
	
	const grad = ctx.createLinearGradient(p.x, p.y, leafTip.x, leafTip.y);
	grad.addColorStop(0.2, 'darkred');
	grad.addColorStop(1, color);
	ctx.fillStyle = grad;
	ctx.fill();
}

window.addEventListener('DOMContentLoaded', () => {
	setUp();
	
	//document.getElementById('drawBtn').addEventListener('click', () => {
		setInterval(drawPattern, 120);
	//});
});