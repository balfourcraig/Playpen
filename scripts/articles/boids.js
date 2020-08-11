const debugLines = false;

let animationID = null;
let h = 1;
let w = 1;
let ctx = null;

let boids = null;
let mouseOver = false;
let mousePos = null;
let sight = 75;

const boidSize = 10;
const chonkiness = 0.5;

function setUp(){
	const c = document.getElementById('canv');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	h = w;
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	ctx = c.getContext('2d');
	
	let numBoids = 300;
	boids = [];
	for(let i = 0; i < numBoids; i++){
		boids.push(createBoid({x: Math.random() * w, y: Math.random() * h}));
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
	
	setInterval(draw, 50);
}

function createBoid(position){
	const speed = 10;
	return {
		position: position,
		velocity: {
			x: Math.random() * speed * 2 - speed,
			y: Math.random() * speed * 2 - speed
		},
		color: 'hsl(' + (Math.random() * 90 + 180) + ',50%,50%)'
	}
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

function flyTowardsCenter(boid){
	const centeringFactor = 0.05;
	
	let centerX = 0;
	let centerY = 0;
	let numNeighbours = 0;
	
	for(let otherBoid of boids){
		if(otherBoid != boid && dist(boid.position, otherBoid.position) < sight){
			centerX += otherBoid.position.x;
			centerY += otherBoid.position.y;
			numNeighbours++;
		}
	}
	
	if(numNeighbours){
		centerX /= numNeighbours;
		centerY /= numNeighbours;
		
		boid.velocity.x += (centerX - boid.position.x) * centeringFactor;
		boid.velocity.y += (centerY - boid.position.y) * centeringFactor;
	}
}

function avoidOther(boid){
	const avoidFactor = 0.02;
	let moveX = 0;
	let moveY = 0;
	for(let otherBoid of boids){
		if(otherBoid != boid){
			const scaledDist = 1 - (dist(boid.position, otherBoid.position) / sight);
			if(scaledDist < 1 && scaledDist > 0){
				moveX += (boid.position.x - otherBoid.position.x) * scaledDist;
				moveY += (boid.position.y - otherBoid.position.y) * scaledDist;
			}
		}
	}
	boid.velocity.x += moveX * avoidFactor;
	boid.velocity.y += moveY * avoidFactor;
}

function avoidMouse(boid){
	const avoidFactor = 0.2;
	if(mousePos && mouseOver){
		const scaledDist = 1 - (dist(boid.position, mousePos) / sight);
		if(scaledDist < 1 && scaledDist > 0){
			boid.velocity.x += (boid.position.x - mousePos.x) * scaledDist * avoidFactor;
			boid.velocity.y += (boid.position.y - mousePos.y) * scaledDist * avoidFactor;
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

function matchVelocity(boid){
	const matchingFactor = 0.05;
	
	let avgDx = 0;
	let avgDy = 0;
	let numNeighbours = 0;
	
	for(let otherBoid of boids){
		if(otherBoid != boid && dist(otherBoid.position, boid.position) < sight){
			avgDx += otherBoid.velocity.x;
			avgDy += otherBoid.velocity.y;
			numNeighbours++;
		}
	}
	if(numNeighbours){
		avgDx /= numNeighbours;
		avgDy /= numNeighbours;
		
		boid.velocity.x += (avgDx - boid.velocity.x) * matchingFactor;
		boid.velocity.y += (avgDy - boid.velocity.y) * matchingFactor;
	}
}

function drawBoid(boid, showDebugLines){
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

		drawCircle(ctx, boid.position, sight, 'blue');
		
		ctx.strokeStyle = 'red';
		for(let i = 0; i < boids.length; i++){
			if(boids[i] != boid){
				if(dist(boids[i].position, boid.position) < sight){
					ctx.beginPath();
					ctx.moveTo(boids[i].position.x, boids[i].position.y);
					ctx.lineTo(boid.position.x, boid.position.y);
					ctx.stroke();
				}
			}
		}
	}
	
	
}

function limitSpeed(boid){
	const speedLimit = 15;
	
	const speed = Math.sqrt(boid.velocity.x * boid.velocity.x + boid.velocity.y * boid.velocity.y);
	if(speed > speedLimit){
		boid.velocity.x = (boid.velocity.x / speed) * speedLimit;
		boid.velocity.y = (boid.velocity.y / speed) * speedLimit;
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
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, w, h);
	console.log(mouseOver);
	for(let boid of boids){
		flyTowardsCenter(boid);
		avoidOther(boid);
		matchVelocity(boid);
		avoidMouse(boid);
		avoidWalls(boid);
		limitSpeed(boid);
		updateBoidPos(boid);
		drawBoid(boid, debugLines);
	}
}

window.addEventListener('DOMContentLoaded', () => {
	setUp();
});