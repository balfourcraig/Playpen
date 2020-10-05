const debugLines = false;

let animationID = null;
let h = 1;
let w = 1;
let c = null;
let ctx = null;

let tailCtx = null;

let boids = null;
let mouseOver = false;
let mousePos = null;
let sight = 50;

let globalSpeed = 12;

let fieldOfView = 2;

let maxBoids = 1;
const chonkiness = 0.4;

let cohesion = 0;
let alignment = 0;
let separation = 0;
let mouseForce = 0;
let wallForce = 0;
let predatorForce = 0;

let obstacles = [];

let holding = null;
let anchorPoint = null;

function getDrawingMode(){
	return document.querySelector('input[name="drawMode"]:checked').value;
}

function fadeCanvas(ctx, fade){
	const srcData = ctx.getImageData(0, 0, w, h);

	for(let row = 0; row < h; row++){
		for(let col = 0; col < w; col++){
			const destOffset = ((h - row) * w + col) * 4;
			srcData.data[destOffset + 3] = Math.max(0, srcData.data[destOffset + 3] - fade);
		}
	}
	ctx.putImageData(srcData, 0, 0); 
}

function drawTails(){
	const tailLengthInput = parseInt(document.getElementById('tailLengthInput').value);
	if(tailLengthInput > 0){
		const tailLength = 51 - tailLengthInput;
		fadeCanvas(tailCtx, tailLength);
		for(let b of boids){
			tailCtx.strokeStyle = b.color;
			tailCtx.beginPath();
			tailCtx.moveTo(b.position.x, b.position.y);
			tailCtx.lineTo(b.position.x - b.velocity.x, b.position.y - b.velocity.y);
			tailCtx.stroke();
		}
	}
}

function setUpDemoObstacles(numObs){
	obstacles = [];
	for(let i = 0; i < numObs; i++){
		obstacles.push(
		{
			shapeType: 'circle',
			radius: Math.random() * 50 + 10,
			center: {
				x: Math.random() * (w - 2 * sight) + sight,
				y: Math.random() * (h - 2 * sight) + sight
			},
			dragable: true,
			color: randomColor()
		});
	}
}

function setUp(){
	maxBoids = parseInt(document.getElementById('numBoidsInput').getAttribute('max'));
	c = document.getElementById('canv');
	let tailC = document.getElementById('tailCanvas');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	h = w;
	document.getElementById('sizeCalc').style.height = h + 'px';
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	tailC.setAttribute('width', w);
	tailC.setAttribute('height', h);
	ctx = c.getContext('2d');
	tailCtx = tailC.getContext('2d');
	//tailCtx.globalAlpha = 0.2;
	tailCtx.strokeStyle = 'blue';
	tailCtx.fillStyle = 'white';
	ctx.lineWidth = 2;
	let numBoids = parseInt(document.getElementById('numBoidsInput').value);
	boids = [];
	for(let i = 0; i < numBoids-1; i++){
		boids.push(createBoidAtRandom());
	}
	
	//PREDATOR
	//boids.push(createPredatorAtRandom());
	
	c.addEventListener('mouseover', (e) => {
		mouseOver = true;
	});
	c.addEventListener('mouseleave', (e) => {
		mouseOver = false;
		mousePos = null;
	});
	c.addEventListener('mousemove', mouseMove);
	c.addEventListener('mousedown', mouseDown);
	c.addEventListener('mouseup', mouseUp);
	
	document.getElementById('tailLengthInput').addEventListener('change', () => {
		if(document.getElementById('tailLengthInput').value === '0'){
			tailCtx.clearRect(0,0,w,h);
		}
	})
	
	setUpDemoObstacles(4);
	
	setInterval(draw, 50);
}

function mouseUp(e){
	holding = null;
	const mode = getDrawingMode();
	if(mode === 'addCircle' && anchorPoint){
		let canvRect = c.getBoundingClientRect();
		mousePos = {x: e.clientX - canvRect.left, y: e.clientY - canvRect.top};
		const rad = distToPoint(anchorPoint, mousePos);
		const circle = {
			shapeType: 'circle',
			color: randomColor(),
			dragable: true,
			center: anchorPoint,
			radius: rad
		};
		obstacles.push(circle);
	}
	else if(mode === 'addLine' && anchorPoint){
		let canvRect = c.getBoundingClientRect();
		const mousePos = {x: e.clientX - canvRect.left, y: e.clientY - canvRect.top};
		const line = {
			shapeType: 'line',
			color: randomColor(),
			dragable: true,
			from: anchorPoint,
			to: mousePos,
		};
		obstacles.push(line);
	}
	anchorPoint = null;
}

function mouseDown(e) {
	if(e && e.clientX && e.clientY) {
		let canvRect = c.getBoundingClientRect();
		mousePos = {x: e.clientX - canvRect.left, y: e.clientY - canvRect.top};
		
		const mode = getDrawingMode();
		for(let i = 0; i < obstacles.length; i++){
			if(obstacles[i].dragable && (
				//(obstacles[i].shapeType === 'rect' && distToRect(mousePos, obstacles[i], w, true) === 0)
				 (obstacles[i].shapeType === 'circle' && distToCircle(mousePos, obstacles[i], w, true) === 0)
				|| (obstacles[i].shapeType === 'line' && distToLine(mousePos, obstacles[i], true, w) < 5)
			)){
				if(mode === 'drag'){
					holding = obstacles[i];
					return false;
				}
				else if (mode === 'delete'){
					const index = obstacles.indexOf(obstacles[i]);
					obstacles.splice(index, 1);
					return false;
				}
			}
		}
		if (mode === 'addCircle' || mode === 'addRect' || mode === 'addLine'){
			anchorPoint = mousePos;
		}
	}
}

function mouseMove(e){
	const mode = getDrawingMode();
	if(e && e.clientX && e.clientY) {
		let canvRect = c.getBoundingClientRect();
		mousePos = {x: e.clientX - canvRect.left, y: e.clientY - canvRect.top};
		
		lastMousePoint = mousePos;

		if(holding){
			if(holding.shapeType === 'circle'){
				holding.center = mousePos;
			}
			else if (holding.shapeType === 'line'){
				const lineWidth = holding.to.x - holding.from.x;
				const lineHeight = holding.to.y - holding.from.y;
				const newFrom = {
					x: mousePos.x - lineWidth/2,
					y: mousePos.y - lineHeight/2,
				};
				const newTo = {
					x: mousePos.x + lineWidth/2,
					y: mousePos.y + lineHeight/2,
				};
				holding.from = newFrom;
				holding.to = newTo;
			}
		}
		
		else if(holding){
			return false;
		}
	}
}

function invertVelocity(vec){
	return {x: vec.x * -1, y: vec.y * -1};
}

function createBoidAtRandom(){
	return createBoidAtPosition({x: Math.random() * (w - 2 * sight) + sight, y: Math.random() * (h - 2 * sight) + sight});
}

function createBoidAtPosition(position){
	const speed = globalSpeed;
	return {
		position: position,
		velocity: {
			x: Math.random() * speed * 2 - speed,
			y: Math.random() * speed * 2 - speed
		},
		color: 'hsl(' + (Math.random() * 140 + 80) + ',50%,50%)',
		role: 'prey'
	}
}

function createPredatorAtRandom(){
	const speed = globalSpeed;
	return {
		position: {x: Math.random() * (w - 2 * sight) + sight, y: Math.random() * (h - 2 * sight) + sight},
		velocity: {
			x: Math.random() * speed * 2 - speed,
			y: Math.random() * speed * 2 - speed
		},
		color: 'hsl(' + (Math.random() * 10) + ',50%,50%)',
		role: 'predator'
	}
}

function dot(a,b){
	return a.x * b.x + a.y * b.y;
}

function angleBetweenVectors(a, b){
	const magA = Math.sqrt(a.x * a.x + a.y * a.y);
	const magB = Math.sqrt(b.x * b.x + b.y * b.y);
	
	const cosTheta = dot(a,b) / (magA * magB);
	return Math.acos(cosTheta);
}

function getNeighbours(boid){
	const neighbours = [];
	for(let otherBoid of boids){
		if(otherBoid != boid){
			const scaledDist = 1 - (dist(boid.position, otherBoid.position) / (otherBoid.role === 'prey' ? sight : (sight * 3)));
			if(scaledDist < 1 && scaledDist > 0){
				distVec = {x: otherBoid.position.x - boid.position.x, y: otherBoid.position.y - boid.position.y};
				if(Math.abs(angleBetweenVectors(boid.velocity, distVec)) < fieldOfView){
					neighbours.push({boid: otherBoid, dist: scaledDist});
				}
			}
		}
	}
	return neighbours;
}

function updateBoidPos(boid){
	const newX = boid.position.x + boid.velocity.x;
	const newY = boid.position.y + boid.velocity.y;
	if(newX < 0 || newX > w){
		boid.velocity.x *= -1;//bounce
		//boid.position.x = w - boid.position.x;//teleport
	}
	else if(newY < 0 || newY > h){
		boid.velocity.y *= -1;//bounce
		//boid.position.y = h - boid.position.y;//teleport
	}
	else{
		boid.position.x = newX;
		boid.position.y = newY;
	}
}

function flyTowardsCenter(boid, neighbours){
	let centerX = 0;
	let centerY = 0;
	let avgDist = 0;
	let numNeighbours = 0;
	
	for(let n of neighbours){
		centerX += n.boid.position.x;
		centerY += n.boid.position.y;
		avgDist += n.dist * n.dist;
		numNeighbours++;
	}	
	if(numNeighbours){
		centerX /= numNeighbours;
		centerY /= numNeighbours;
		avgDist /= numNeighbours;
		boid.velocity.x += (centerX - boid.position.x) * cohesion * avgDist;
		boid.velocity.y += (centerY - boid.position.y) * cohesion * avgDist;
	}
}

function avoidOther(boid, neighbours){
	let moveX = 0;
	let moveY = 0;
	for(let n of neighbours){
		const dist = n.dist * n.dist;
		if(n.boid.role === 'prey'){
			moveX += (boid.position.x - n.boid.position.x) * dist;
			moveY += (boid.position.y - n.boid.position.y) * dist;
		}
		else{
			moveX += (boid.position.x - n.boid.position.x) * dist * predatorForce;
			moveY += (boid.position.y - n.boid.position.y) * dist * predatorForce;
		}
	}
	boid.velocity.x += moveX * separation;
	boid.velocity.y += moveY * separation;
}

function avoidMouse(boid){
	if(mousePos && mouseOver){
		const scaledDist = 1 - (dist(boid.position, mousePos) / (sight * 2));
		if(scaledDist < 1 && scaledDist > 0){
			boid.velocity.x += (boid.position.x - mousePos.x) * scaledDist * scaledDist * mouseForce;
			boid.velocity.y += (boid.position.y - mousePos.y) * scaledDist * scaledDist * mouseForce;
		}
	}
}

function avoidWalls(boid){
	let moveX = 0;
	let moveY = 0;
	
	if(boid.position.x < sight){
		moveX += 1 - (boid.position.x/sight);
	}
	if(boid.position.x > h - sight){
		moveX -= 1 - ((w - boid.position.x) / sight);
	}
	if(boid.position.y < sight){
		moveY += 1 - (boid.position.y/sight);
	}
	if(boid.position.y > h - sight){
		moveY -= 1 - ((h - boid.position.y) / sight);
	}
	
	boid.velocity.x += moveX * wallForce;
	boid.velocity.y += moveY * wallForce;
}

function nearestLinePoint(point, line, preventExtrapolation){
	if(line.from.x > line.to.x){
		const temp = line.from;
		line.from = line.to;
		line.to = temp;
	}
	
	let iX = 0;
	let iY = 0;
	
	if(Math.abs(line.from.y - line.to.y) < 0.01){//flat
		iX = point.x;
		iY = line.from.y;
	}
	else if(Math.abs(line.from.x - line.to.x) < 0.01){//vertical
		iX = line.from.x;
		iY = point.y
	}
	else{
		const lM = (line.to.y - line.from.y) / (line.to.x - line.from.x);
		const pM = (line.from.x - line.to.x) / (line.to.y - line.from.y);
		const lC = line.from.y - lM * line.from.x;
		const pC = point.y - pM * point.x;
		
		iX = -(lC - pC) / (lM - pM);
		iY = -(lM * -iX) + lC;
	}

	if(preventExtrapolation && (
		(line.from.x < line.to.x && iX < line.from.x)
		|| (line.to.x < line.from.x && iX < line.to.x)
		|| (line.from.x > line.to.x && iX > line.from.x)
		|| (line.to.x > line.from.x && iX > line.to.x)
		|| (line.from.y < line.to.y && iY < line.from.y)
		|| (line.to.y < line.from.y && iY < line.to.y)
		|| (line.from.y > line.to.y && iY > line.from.y)
		|| (line.to.y > line.from.y && iY > line.to.y)
		))
	{
		const distFrom = distToPoint(point, line.from);
		const distTo = distToPoint(point, line.to);
		if(distFrom < distTo){
			return line.from;
		}
		else{
			return line.to;
		}
	}
	else
	{
		return {x: iX, y: iY};
	}
}

function distToLine(point, line, preventExtrapolation){
	const p = nearestLinePoint(point, line, preventExtrapolation);
	return distToPoint(point, p);
}

function distToPoint(p1, p2){
	const dX = p1.x - p2.x;
	const dY = p1.y - p2.y;
	return Math.sqrt((dX * dX) + (dY * dY));
}

function distToCircle(p, circle, fill){
	const distToCenter = distToPoint(p, circle.center);
	if(distToCenter < circle.radius){
		if(fill)
			return 0;
		else
			return circle.radius - distToCenter;
	}
	else
		return distToCenter - circle.radius;
}

function avoidObstacles(boid){
	const obForce = wallForce * wallForce;
	let moveX = 0;
	let moveY = 0;
	for(let ob of obstacles){
		if(ob.shapeType === 'circle'){
			let dist = distToCircle(boid.position, ob, true) / sight;
			if(dist < 1){
				dist = (-1 * Math.log(dist) + 0.001) + 0.7;
				moveX += (boid.position.x - ob.center.x) / (sight) * dist;
				moveY += (boid.position.y - ob.center.y) / (sight) * dist;
			}
		}
		else if(ob.shapeType === 'line'){
			const p = nearestLinePoint(boid.position, ob, true);
			let dist = distToPoint(boid.position, p) / sight;
			if(dist < 1){
				dist = (-1 * Math.log(dist) + 0.001) + 0.7;
				moveX += (boid.position.x - p.x) / sight * dist;
				moveY += (boid.position.y - p.y) / sight * dist;
			}
		}
	}
	boid.velocity.x += moveX * obForce;
	boid.velocity.y += moveY * obForce;
}

function matchVelocity(boid, neighbours){
	let avgDx = 0;
	let avgDy = 0;
	let numNeighbours = 0;
	
	for(let n of neighbours){
		avgDx += n.boid.velocity.x * (1 - n.dist);
		avgDy += n.boid.velocity.y * (1 - n.dist);
		numNeighbours++;
	}
	if(numNeighbours){
		avgDx /= numNeighbours;
		avgDy /= numNeighbours;
		
		boid.velocity.x += (avgDx - boid.velocity.x) * alignment;
		boid.velocity.y += (avgDy - boid.velocity.y) * alignment;
	}
}

function drawBoid(boid, showDebugLines, neighbours){
	let boidSize = parseFloat(document.getElementById('boidSizeInput').value);
	if(boidSize > 0){
		if(boid.role === 'predator')
			boidSize *= 2;
		const heading = Math.atan2(boid.velocity.x, boid.velocity.y);
		
		const noseX = Math.sin(heading) * boidSize + boid.position.x;
		const noseY = Math.cos(heading) * boidSize + boid.position.y;
		
		const tail1X = Math.sin(heading + Math.PI - chonkiness) * boidSize + boid.position.x;
		const tail1Y = Math.cos(heading + Math.PI - chonkiness) * boidSize + boid.position.y;
		
		const tail2X = Math.sin(heading + Math.PI + chonkiness) * boidSize + boid.position.x;
		const tail2Y = Math.cos(heading + Math.PI + chonkiness) * boidSize + boid.position.y;
		
		ctx.fillStyle = boid.color;
		ctx.beginPath();
		ctx.moveTo(noseX, noseY);
		ctx.lineTo(tail1X, tail1Y);
		ctx.lineTo(tail2X, tail2Y);
		ctx.closePath();
		ctx.fill();
		
		if(showDebugLines){
			ctx.strokeStyle = 'green';
			const eyelineX = Math.sin(heading) * sight + boid.position.x;
			const eyelineY = Math.cos(heading) * sight + boid.position.y;
			ctx.beginPath();
			ctx.moveTo(boid.position.x, boid.position.y);
			ctx.lineTo(eyelineX, eyelineY);
			ctx.stroke();

			ctx.strokeStyle = 'blue';
			
			const fovStartX = Math.sin(heading - fieldOfView) * sight + boid.position.x;
			const fovStartY = Math.cos(heading - fieldOfView) * sight + boid.position.y;
			
			const fovEndX = Math.sin(heading + fieldOfView) * sight + boid.position.x;
			const fovEndY = Math.cos(heading + fieldOfView) * sight + boid.position.y;

			ctx.beginPath();
			ctx.moveTo(fovStartX, fovStartY);
			ctx.lineTo(boid.position.x, boid.position.y);
			ctx.lineTo(fovEndX, fovEndY);
			ctx.stroke();
			
			drawCircle(ctx, boid.position, sight, 'blue', false);

			ctx.strokeStyle = 'red';
			for(let n of neighbours){
				ctx.beginPath();
				ctx.moveTo(n.boid.position.x, n.boid.position.y);
				ctx.lineTo(boid.position.x, boid.position.y);
				ctx.stroke();
			}
		}
	}
}

function limitSpeed(boid){
	const upperSpeedLimit = globalSpeed * 1.5 * (boid.role === 'prey' ? 1 : 0.7);
	const lowerSpeedLimit = globalSpeed * 0.5 * (boid.role === 'prey' ? 1 : 0.7);
	
	const speed = Math.sqrt(boid.velocity.x * boid.velocity.x + boid.velocity.y * boid.velocity.y);
	if(speed > upperSpeedLimit){
		boid.velocity.x = (boid.velocity.x / speed) * upperSpeedLimit;
		boid.velocity.y = (boid.velocity.y / speed) * upperSpeedLimit;
	}
	else if(speed < lowerSpeedLimit){
		boid.velocity.x = (boid.velocity.x / speed) * lowerSpeedLimit;
		boid.velocity.y = (boid.velocity.y / speed) * lowerSpeedLimit;
	}
}

function drawCircle(ctx, center, radius, color, fill){
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	if(fill){
		ctx.fillStyle = color;
		ctx.fill();
	}
	else{
		ctx.strokeStyle = color;
		ctx.stroke();
	}
}

function dist(p1, p2){
	const diffX = p1.x - p2.x;
	const diffY = p1.y - p2.y;
	return Math.sqrt(diffX * diffX + diffY * diffY);
}

function draw(){
	const mode = getDrawingMode();
	cohesion = parseFloat(document.getElementById('cohesionInput').value);
	alignment = parseFloat(document.getElementById('alignmentInput').value);
	separation = parseFloat(document.getElementById('separationInput').value);
	globalSpeed = parseFloat(document.getElementById('speedInput').value);
	mouseForce = parseFloat(document.getElementById('mouseInput').value);
	wallForce = parseFloat(document.getElementById('wallInput').value);
	predatorForce = parseFloat(document.getElementById('predatorInput').value);
	
	const numBoids = parseInt(document.getElementById('numBoidsInput').value);
	if(numBoids > boids.length){
		for(let i = boids.length; i < numBoids; i++){
			boids.push(createBoidAtRandom());
		}
	}
	else if (numBoids < boids.length){
		const newBoids = [];
		for(let i = 0; i < numBoids; i++){
			newBoids.push(boids[i]);
		}
		boids = newBoids;
	}
	
	//ctx.fillStyle = 'white';
	//ctx.fillRect(0, 0, w, h);
	ctx.clearRect(0,0,w,h);
	for(let ob of obstacles){
		if(ob.shapeType === 'circle'){
			drawCircle(ctx, ob.center, ob.radius, ob.color, true);
		}
		else if(ob.shapeType === 'line'){
			ctx.strokeStyle = 'black';
			ctx.beginPath();
			ctx.moveTo(ob.from.x, ob.from.y);
			ctx.lineTo(ob.to.x, ob.to.y);
			ctx.stroke();
		}
	}

	if(mode === 'addCircle' && anchorPoint){
		const rad = distToPoint(anchorPoint, mousePos)
		drawCircle(ctx, anchorPoint, rad, 'black', false);
	}
	else if(mode === 'addLine' && anchorPoint){
		ctx.strokeStyle = 'black';
		ctx.beginPath();
		ctx.moveTo(anchorPoint.x, anchorPoint.y);
		ctx.lineTo(mousePos.x, mousePos.y);
		ctx.stroke();
	}

	for(let boid of boids){
		const neighbours = getNeighbours(boid);
		if(boid.role === 'prey'){
			flyTowardsCenter(boid, neighbours);
			matchVelocity(boid, neighbours);
			avoidOther(boid, neighbours);
		}
		
		
		if(mode === 'mousePush')
			avoidMouse(boid);
		avoidWalls(boid);
		avoidObstacles(boid);
		limitSpeed(boid);
		updateBoidPos(boid);
		drawBoid(boid, debugLines, neighbours);
	}
	drawTails();
}

function setUpSliderReadout(sliderName, readoutName){
	document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	document.getElementById(sliderName).addEventListener('input', () => {
		document.getElementById(readoutName).innerText = '(' + document.getElementById(sliderName).value + ')';
	});
}

window.addEventListener('DOMContentLoaded', () => {
	setUpSliderReadout('numBoidsInput', 'numBoidsReadout');
	setUp();
});