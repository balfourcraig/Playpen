let animationID = null;

let c;
let w
let h;
let ctx;
let center;

let petalWidth = 0.7;

let colorPos = 0;
let colorOffset = 0;

const colorVariations = [];

let posOffset = 0;

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
	ctx.globalAlpha = 0.95;

	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	const maxPetals = parseInt(document.getElementById('NumPetalsInput').getAttribute('max'));
	for(let i = 0; i < maxPetals; i++){
		colorVariations.push(Math.random());
	}
}

function drawPattern(){
	ctx.clearRect(0, 0, w, h);
	petalWidth = parseFloat(document.getElementById('PetalWidthInput').value);
	const offsetMultiplier = parseFloat(document.getElementById('PetalClumpInput').value);
	const numPetals = parseInt(document.getElementById('NumPetalsInput').value);
	const colorRangeOffset = parseFloat(document.getElementById('ColorOffsetInput').value);
	const colorRange = parseFloat(document.getElementById('ColorRangeInput').value);
	const colorVariationMultiplier = parseFloat(document.getElementById('ColorVariationInput').value);
	posOffset = posOffset + parseFloat(document.getElementById('SpinSpeedInput').value);
	if(posOffset > 1){
		colorOffset +=  1;
		posOffset = posOffset % 1;
	}

	if(document.getElementById('BackCircleInput').checked){
		const maxOffset = numPetals * w * offsetMultiplier;
		const backingColor = 'hsl(' + (colorRangeOffset + colorRange * 0.2) + ',90%,30%)';
		
		const circleGrad = ctx.createRadialGradient(center.x, center.y, maxOffset * 0.1, center.x, center.y, maxOffset * 0.9);
		circleGrad.addColorStop(0, backingColor);
		circleGrad.addColorStop(1, "transparent");
		drawCircle(ctx, center, maxOffset, circleGrad);
	}

	for(let i = numPetals-1; i >= 0; i -= 1){
		const j = i + posOffset;
		const angle = j * goldenAngleRad;
		const offset = j * w * offsetMultiplier;
		
		const x = Math.cos(angle) * offset + center.x;
		const y = Math.sin(angle) * offset + center.y;
		
		const p = {
			x:x, y:y
		};
		
		const halfNum = numPetals/2;
		let radiusMult = (-((j - halfNum) * (j - halfNum)) + (halfNum * halfNum)) / (halfNum * halfNum);
		const radius = radiusMult * w * 0.15;
		//let radius = Math.sqrt(j) * (w * 0.02);
		//if(i === numPetals){
			//radius *= 1 - posOffset;
		//}
		
		//let color = randomRedShade();
		//let color = colors[(i + colorPos + colorOffset) % numPetals];
		let variation =  colorVariations[fullMod(i - colorOffset, numPetals)];
		const colorAngle = ((j/numPetals) * colorRange + colorRangeOffset) + (variation * colorVariationMultiplier);
		const tipColor = 'hsl(' + colorAngle + ',90%,60%)';
		const rootColor = 'hsl(' + colorAngle + ',90%,20%)';
		drawLeafAtPoint(p, radius, angle, tipColor, rootColor);
	}
	
	
	
	animationID = requestAnimationFrame(() => {
		drawPattern();
	})
}

function drawCircle(ctx, center, radius, color){
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.fill();
}

function drawLeafAtPoint(p, size, angle, tipColor, rootColor){
	const leafBase = {
		x: Math.cos(angle) * (size * -0.2) + p.x,
		y: Math.sin(angle) * (size * -0.2) + p.y
	};
	const leafTip = {
		x: Math.cos(angle) * size + p.x,
		y: Math.sin(angle) * size + p.y
	};
	const leftControl1 = {
		x: Math.cos(angle + 0.4 * petalWidth * petalWidth) * (size * 0.9) + p.x,
		y: Math.sin(angle + 0.4 * petalWidth * petalWidth) * (size * 0.9) + p.y 
	};
	const leftControl2 = {
		x: Math.cos(angle + 0.1 * petalWidth) * (size * 0.8) + p.x,
		y: Math.sin(angle + 0.1 * petalWidth) * (size * 0.8) + p.y 
	};
	const rightControl1 = {
		x: Math.cos(angle - 0.4 * petalWidth * petalWidth) * (size * 0.9) + p.x,
		y: Math.sin(angle - 0.4 * petalWidth * petalWidth) * (size * 0.9) + p.y 
	};
	const rightControl2 = {
		x: Math.cos(angle - 0.1 * petalWidth) * (size * 0.8) + p.x,
		y: Math.sin(angle - 0.1 * petalWidth) * (size * 0.8) + p.y 
	};
	
	ctx.beginPath();
	ctx.moveTo(leafBase.x, leafBase.y);
	ctx.bezierCurveTo(leftControl1.x, leftControl1.y, leftControl2.x, leftControl2.y, leafTip.x, leafTip.y);
	ctx.bezierCurveTo(rightControl2.x, rightControl2.y, rightControl1.x, rightControl1.y, leafBase.x, leafBase.y);
	
	const grad = ctx.createLinearGradient(p.x, p.y, leafTip.x, leafTip.y);
	grad.addColorStop(0.2, rootColor);
	grad.addColorStop(1, tipColor);
	ctx.fillStyle = grad;
	ctx.fill();
}

window.addEventListener('DOMContentLoaded', () => {
	setUp();	
	drawPattern();
});