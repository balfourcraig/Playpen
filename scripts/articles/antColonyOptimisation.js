let c = null;
let ctx = null;

let mousePos = null;

let w = 0;
let h = 0;

let points = [];

function setUp(){
	c = document.getElementById('drawLayer');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	h = w;

	c.setAttribute('width', w);
	c.setAttribute('height', h);

	ctx = drawLayer.getContext('2d');

	ctx.lineWidth = 2;
	ctx.lineCap = 'round';
	ctx.strokeStyle = 'blue';
	ctx.fillStyle = 'white';
	ctx.lineWidth = 2;

    c.addEventListener('click', click);
    document.getElementById('solveBtn').addEventListener('click', solve);
    draw();
}

function solve(){
    updateGraph();
    let iterations = 0;
    while(iterations < 10){
        generateSolutions();
        daemonActions();
        pheromoneUpdate();
    }
}

function generateSolutions() {
    let ants = [];
    let antsPerPoint = 10;

    for (let p of points) {
        for (let i = 0; i < antsPerPoint; i++) {
            ants.push({ x: p.x, y: p.y, path: [p], visited: new Set([p]) });
        }
    }

    while (ants.length > 0) {
        for (let ant of ants) {
            let currentPoint = ant.path[ant.path.length - 1];
            let nextPoint = selectNextPoint(ant, currentPoint);
            if (nextPoint) {
                ant.path.push(nextPoint);
                ant.visited.add(nextPoint);
            } else {
                // Ant reached the end of the path, return to the starting point
                ant.path.push(ant.path[0]);
                ant.visited.add(ant.path[0]);
            }
        }
    }
}

function selectNextPoint(ant, currentPoint) {
    let unvisitedNeighbors = getUnvisitedNeighbors(currentPoint, ant.visited);
    if (unvisitedNeighbors.length === 0) return null; // No unvisited neighbors

    // Calculate probabilities for each neighbor
    let probabilities = [];
    let totalPheromone = 0;
    for (let neighbor of unvisitedNeighbors) {
        let pheromone = getPheromoneLevel(currentPoint, neighbor);
        let heuristic = getHeuristic(currentPoint, neighbor);
        probabilities.push({ point: neighbor, probability: pheromone * heuristic });
        totalPheromone += pheromone * heuristic;
    }

    // Normalize probabilities
    for (let prob of probabilities) {
        prob.probability /= totalPheromone;
    }

    // Select next point based on probabilities
    let random = Math.random();
    let cumulativeProbability = 0;
    for (let prob of probabilities) {
        cumulativeProbability += prob.probability;
        if (random <= cumulativeProbability) {
            return prob.point;
        }
    }

    // If for some reason, a point wasn't selected (e.g., precision errors)
    return probabilities[probabilities.length - 1].point;
}


// function generateSolutions(){
//     let ants = [];
//     let antsPerPoint = 10;
//     for(let p of points){
//         for(let i = 0; i < antsPerPoint; i++){
//             ants.push({x: p.x, y: p.y, path: [p]});
//         }
//     }
//     //todo
// }

function daemonActions(){
    
}

function pheromoneUpdate(){
    
}

function draw(){
    ctx.fillStyle = 'white';
    ctx.clearRect(0, 0, w, h);
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'red';
    for(let p of points){
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function click(e){
    let rect = c.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    let found = false;
    for(let p of points){
        if(Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2)) <= 10){
            found = true;
            break;
        }
    }

    points = points.filter(p => Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2)) >= 10);

    if(!found)
        points.push({x: x, y: y});
    draw();
}

function updateGraph(){
    for(let p of points){
        p.edges = [];
        for(let p2 of points){
            if(p != p2){
                p.edges.push({point: p2, pheromone: 0.1});
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', setUp);