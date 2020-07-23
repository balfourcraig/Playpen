let w = 0;
let center;
let radius;

const angles = [];
const colors = [];


function setUp(){
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	center = {x: w/2.0, y: w/2.0};
	radius = w * 0.4;
	
	for(let a = Math.random() * 0.3 + 0.1; a < Math.PI * 2; a += Math.random() * 0.7 + 0.2) {
		angles.push(a);
		const colorNum = nextGoldenRand();
		const colBright = 'hsl(' + (colorNum * 360) + ', 80%, 60%)';
		const colDim = 'hsl(' + (colorNum * 360) + ', 10%, 60%)';
		colors.push({dim: colDim, bright: colBright});
	}
	const c = document.createElement('canvas');
	c.id = 'pieCanvas';
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	
	const canvResult = document.getElementById('canvResult');
	canvResult.appendChild(c);
	
	canvResult.addEventListener('mousemove',drawPattern);
}

function drawPattern(e){
	const baseExplodeAmount = parseInt(document.getElementById('baseExplodeInput').value);
	const hoverExplodeAmount = parseInt(document.getElementById('hoverExplodeInput').value);
	const baseBulgeAmount = parseFloat(document.getElementById('baseBulgeInput').value);
	const hoverBulgeAmount = parseFloat(document.getElementById('hoverBulgeInput').value);

	const c = document.getElementById('pieCanvas');
	c.id = 'pieCanvas';
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	const ctx = c.getContext('2d');

	const rect = c.getBoundingClientRect();
	
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'black';
	ctx.strokeWidth = 0;
	ctx.beginPath();
	ctx.rect(0, 0, w, w);
	ctx.fill();
	
	const mouseX = e ? e.clientX - rect.left : 0;
	const mouseY = e ? e.clientY - rect.top : 0;
	const mousePoint = {x:mouseX, y:mouseY};
	const mouseDist = distance(mousePoint, center) - baseExplodeAmount;
	const xDiff = mouseX - center.x ;
	const yDiff = mouseY - center.y;
	const mouseAngle = mouseDist < radius ? (Math.atan2(xDiff, yDiff) + Math.PI * 2) % (Math.PI * 2) : 0;
	let mouseFound = false;
	for(let i = 0; i < angles.length; i++){
		const point = pointByAngle(center, radius, angles[i]);
		const lastPoint = pointByAngle(center, radius, angles[(i + angles.length - 1) % angles.length]); //store from last round
		
		const mid = midpoint(point, lastPoint);
		let halfAngle = (angles[i] + angles[(i + angles.length - 1) % angles.length]) /2;
		if(i === 0){
			halfAngle += Math.PI;
		}
		const circlePoint = pointByAngle(center, radius, halfAngle);
		let reflected;

		let xOffset = Math.sin(halfAngle);
		let yOffset = Math.cos(halfAngle);

		if(mouseDist < radius && !mouseFound && (mouseAngle <= angles[i] || mouseAngle >= angles[angles.length-1])){
			mouseFound = true;
			ctx.fillStyle = colors[i].bright;
			reflected = pointReflect(circlePoint, mid, hoverBulgeAmount);
			xOffset *= baseExplodeAmount + hoverExplodeAmount;
			yOffset *= baseExplodeAmount + hoverExplodeAmount;
			ctx.shadowColor = 'rgba(0,0,0,0.5)';
			ctx.shadowBlur = 15;
		}
		else{						
			reflected = pointReflect(circlePoint, mid, baseBulgeAmount);
			ctx.fillStyle = colors[i].dim;
			ctx.shadowColor = 'transparent';
			ctx.shadowBlur = 0;
			xOffset *= baseExplodeAmount;
			yOffset *= baseExplodeAmount;
		}
		ctx.shadowOffsetX = -xOffset;
		ctx.shadowOffsetY = -yOffset;
		
		ctx.beginPath();
		ctx.moveTo(center.x + xOffset, center.y + yOffset);
		ctx.lineTo(point.x + xOffset, point.y + yOffset);
		ctx.quadraticCurveTo(reflected.x + xOffset, reflected.y + yOffset, lastPoint.x + xOffset, lastPoint.y + yOffset);
		ctx.fill();
	}
}

window.addEventListener('DOMContentLoaded', () => {
	setUp();
	drawPattern();
	document.getElementById('baseExplodeInput').addEventListener('input', drawPattern);
	document.getElementById('baseBulgeInput').addEventListener('input', drawPattern);
});