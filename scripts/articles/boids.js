const debugLines = false;

let animationID = null;
let h = 1;
let w = 1;
let ctx = null;

let boids = null;
let mouseOver = false;
let mousePos = null;
let sight = 50;

const globalSpeed = 12;

let fieldOfView = 2;

let maxBoids = 1;
const boidSize = 8;
const chonkiness = 0.5;

function setUp(){
	maxBoids = parseInt(document.getElementById('numBoidsInput').getAttribute('max'));
	const c = document.getElementById('canv');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	h = w;
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	ctx = c.getContext('2d');
	
	let numBoids = parseInt(document.getElementById('numBoidsInput').value);
	boids = [];
	for(let i = 0; i < numBoids; i++){
		boids.push(createBoidAtRandom());
	}
	
	c.addEventListener('mouseover', (e) => {
		mouseOver = true;
	});
	c.addEventListener('mouseleave', (e) => {
		mouseOver = false;
		mousePos = null;
	});
	c.addEventListener('mousemove', (e) => {
		if(e && e.clientX && e.clientY) {
			let canvRect = c.getBoundingClientRect();
			mousePos = {x: e.clientX - canvRect.left, y: e.clientY - canvRect.top};
		}
	});
	c.addEventListener('mousedown', mouseDown);
	
	setInterval(draw, 50);
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
		color: 'hsl(' + (Math.random() * 90 + 180) + ',50%,50%)'
	}
}

function mouseDown(e) {
	if(boids.length < maxBoids && e && e.clientX && e.clientY) {
		const c = document.getElementById('canv');
		let canvRect = c.getBoundingClientRect();
		mousePos = {x: e.clientX - canvRect.left, y: e.clientY - canvRect.top};		
		boids.push(createBoidAtPosition(mousePos));
		document.getElementById('numBoidsInput').value = boids.length;
		document.getElementById('numBoidsInput').dispatchEvent(new Event('change'));
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
	const heading = Math.atan2(boid.velocity.x, boid.velocity.y);
	for(let otherBoid of boids){
		if(otherBoid != boid){
			const scaledDist = 1 - (dist(boid.position, otherBoid.position) / sight);
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
	const centeringFactor = 0.3;
	
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
		boid.velocity.x += (centerX - boid.position.x) * centeringFactor * avgDist;
		boid.velocity.y += (centerY - boid.position.y) * centeringFactor * avgDist;
	}
}

function avoidOther(boid, neighbours){
	const avoidFactor = 0.05;
	let moveX = 0;
	let moveY = 0;
	for(let n of neighbours){
		moveX += (boid.position.x - n.boid.position.x) * n.dist * n.dist;
		moveY += (boid.position.y - n.boid.position.y) * n.dist * n.dist;
	}
	boid.velocity.x += moveX * avoidFactor;
	boid.velocity.y += moveY * avoidFactor;
}

function avoidMouse(boid){
	const avoidFactor = 0.2;
	if(mousePos && mouseOver){
		const scaledDist = 1 - (dist(boid.position, mousePos) / (sight * 2));
		if(scaledDist < 1 && scaledDist > 0){
			boid.velocity.x += (boid.position.x - mousePos.x) * scaledDist * scaledDist * avoidFactor;
			boid.velocity.y += (boid.position.y - mousePos.y) * scaledDist * scaledDist * avoidFactor;
		}
	}
}

function avoidWalls(boid){
	const avoidFactor = 2;
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
	
	boid.velocity.x += moveX * avoidFactor;
	boid.velocity.y += moveY * avoidFactor;
}

function matchVelocity(boid, neighbours){
	const matchingFactor = 0.1;
	
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
		
		boid.velocity.x += (avgDx - boid.velocity.x) * matchingFactor;
		boid.velocity.y += (avgDy - boid.velocity.y) * matchingFactor;
	}
}

function drawBoid(boid, showDebugLines, neighbours){
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
		
		drawCircle(ctx, boid.position, sight, 'blue');

		ctx.strokeStyle = 'red';
		for(let n of neighbours){
			ctx.beginPath();
			ctx.moveTo(n.boid.position.x, n.boid.position.y);
			ctx.lineTo(boid.position.x, boid.position.y);
			ctx.stroke();
		}
	}
}

function limitSpeed(boid){
	const upperSpeedLimit = globalSpeed * 1.5;
	const lowerSpeedLimit = globalSpeed * 0.5;
	
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

function drawCircle(ctx, center, radius, color){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.stroke();
}

function dist(p1, p2){
	const diffX = p1.x - p2.x;
	const diffY = p1.y - p2.y;
	return Math.sqrt(diffX * diffX + diffY * diffY);
}

function draw(){
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
	
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, w, h);
	for(let boid of boids){
		const neighbours = getNeighbours(boid);
		flyTowardsCenter(boid, neighbours);
		avoidOther(boid, neighbours);
		matchVelocity(boid, neighbours);
		avoidMouse(boid);
		avoidWalls(boid);
		limitSpeed(boid);
		updateBoidPos(boid);
		drawBoid(boid, debugLines, neighbours);
	}
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