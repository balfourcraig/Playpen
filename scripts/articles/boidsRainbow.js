const debugLines = false;

let animationID = null;
let h = 1;
let w = 1;
let c = null;
let ctx = null;

let boids = null;

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


function setUp(){
	maxBoids = parseInt(document.getElementById('numBoidsInput').getAttribute('max'));
	c = document.getElementById('canv');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	h = w;
	sight = w/10;
	document.getElementById('sizeCalc').style.height = h + 'px';
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	ctx = c.getContext('2d');
	ctx.lineWidth = 2;
	let numBoids = parseInt(document.getElementById('numBoidsInput').value);
	boids = [];
	for(let i = 0; i < numBoids-1; i++){
		boids.push(createBoidAtRandom());
	}
	
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
		color: 'hsl(' + (Math.random() * 140 + 80) + ',50%,50%)',
		role: 'prey'
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
		
		//ctx.fillStyle = boid.color;
		ctx.fillStyle = 'hsl(' + (heading * 180 / Math.PI) + 'deg,90%,50%)'
		ctx.beginPath();
		ctx.moveTo(noseX, noseY);
		ctx.lineTo(tail1X, tail1Y);
		ctx.lineTo(tail2X, tail2Y);
		ctx.closePath();
		ctx.fill();
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

function dist(p1, p2){
	const diffX = p1.x - p2.x;
	const diffY = p1.y - p2.y;
	return Math.sqrt(diffX * diffX + diffY * diffY);
}

function normalizeVector(vec){
	const length = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
	return {x: vec.x/length, y: vec.y/length};
}

function drawRainbow(){
	const pixelSize = 5;
	const pixelBorder = 0;
	for(let px = 0; px < w; px += pixelSize + pixelBorder){
		for(let py = 0; py < w; py += pixelSize + pixelBorder){
			const pixel = {x: px, y: py};
			let velocityAll = {x:0, y:0};
			for(let boid of boids){
				let dist = distance(pixel, boid.position)/w;
				dist *= dist * dist * dist;
				velocityAll.x += boid.velocity.x * (1/dist);
				velocityAll.y += boid.velocity.y * (1/dist);
				
			}
			//velocityAll = normalizeVector(velocityAll);
			const headAll = Math.atan2(velocityAll.x, velocityAll.y);
			const color = 'hsl(' + (headAll * 180 / Math.PI) + 'deg,90%,50%)';
			ctx.fillStyle = color;
			ctx.fillRect(px, py, pixelSize, pixelSize, color);
		}
	}
}

function draw(){
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

	ctx.clearRect(0,0,w,h);

	for(let boid of boids){
		const neighbours = getNeighbours(boid);
		if(boid.role === 'prey'){
			flyTowardsCenter(boid, neighbours);
			matchVelocity(boid, neighbours);
			avoidOther(boid, neighbours);
		}
		avoidWalls(boid);
		limitSpeed(boid);
		updateBoidPos(boid);
		//drawBoid(boid, debugLines, neighbours);
	}
	drawRainbow();
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