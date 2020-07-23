let seed = 1;
function random() {
	const x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}

function seedRandomNumber(){
	const radioRandom = document.getElementById('radioRandom').checked;
	const radioNumber = document.getElementById('radioNumber').checked;
	const radioText = document.getElementById('radioText').checked;
	
	if(document.getElementById('radioRandom').checked)
		seed = Math.floor(Math.random() * 100000 + 3);
	else if (document.getElementById('radioNumber').checked){
		const val = document.getElementById('seedNumInput').value;
		if(val)
			seed = parseInt(val);
		else
			seed = Math.floor(Math.random() * 10000 + 3);
	}
	else if (document.getElementById('radioText').checked)
		seed = stringHash(document.getElementById('seedTextInput').value, 57);
	else
		seed = 1;
}

function shuffleInplaceSeedable(arr){
	let n = arr.length;
	while(n > 0){
		const r = Math.floor(random() * n);
		const temp = arr[r];
		arr[r] = arr[n-1];
		arr[n-1] = temp;
		n--;
	}
}
let animationID = null;
function drawPattern(){
	seedRandomNumber();
	
	document.getElementById('drawBtn').setAttribute('style','display:none');
	document.getElementById('stopDrawingBtn').removeAttribute('style');
	
	window.cancelAnimationFrame(animationID);
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	
	const animate = document.getElementById('animateInput').checked;
	xNodes = Math.max(1, parseInt(document.getElementById('xNodesInput').value));
	yNodes = Math.max(1, parseInt(document.getElementById('yNodesInput').value));
	const waterLevel = Math.max(0, Math.min(1, parseFloat(document.getElementById('waterLevelInput').value))) /2;
	const h = w * (yNodes/xNodes);
	
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	const ctx = c.getContext('2d');
	
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'black';
	ctx.beginPath();
	ctx.rect(0, 0, w, h);
	ctx.fill();
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.lineCap = 'round';

	ctx.fillStyle = 'black';
	ctx.strokeStyle = 'black';
	
	const topLeft = MapPointSpace({x: -0.5, y: -0.5}, -2, xNodes+1, 0, w, -2, yNodes+1,0,h);
	const rectWidth = mapLinear(xNodes - 2, -2, xNodes + 1, 0, w);
	const rectHeight = mapLinear(yNodes -2, -2, yNodes + 1, 0, h);
	ctx.beginPath();
	ctx.rect(topLeft.x, topLeft.y, rectWidth, rectHeight);
	ctx.stroke();

	const nodes = [];
	for(let col = 0; col < xNodes; col++){
		for(let row = 0; row < yNodes; row++){
			nodes[row * xNodes + col] = mazeNode({x: col, y: row});
			if(col > 0){
				addWall(nodes[row * xNodes + col], nodes[row * xNodes + (col-1)]);
			}
			if(row > 0){
				addWall(nodes[row * xNodes + col], nodes[(row-1) * xNodes + col]);
			}
		}
	}
	
	//const start = nodes[getRandomInt(0, xNodes * yNodes)];
	const start = nodes[Math.floor(random() * xNodes * yNodes)];
	let end = start;
	
	let stack = [];
	stack.push(start);
	let maxDepth = 0;
	
	orderedNodes = [];
	
	while(stack.length > 0){
		const current = stack.pop();
		current.visited = true;
		orderedNodes.push(current);
		if(current.solutionDepth > maxDepth){
			maxDepth = current.solutionDepth;
			end = current;
		}
		shuffleInplaceSeedable(current.walls);
		for(let i = 0; i < current.walls.length; i++){
			const wall = current.walls[i];
			if(!wall.visited){
				wall.visited = true;
				stack.push(wall);
				wall.parent = current;
				wall.solutionDepth = current.solutionDepth + 1;
			}
		}
	}
	
	let backtrack = end;
	while(backtrack != null){
		backtrack.onHotPath = true;
		backtrack = backtrack.parent;
	}
	
	const drawings = [];

	let endDrawn = false;
	for(let j = 0; j < orderedNodes.length; j++){
		const n = orderedNodes[j];
		drawings.push(() => {
			const landHeight = n.solutionDepth / maxDepth;
			if(landHeight < waterLevel){
				ctx.fillStyle = 'hsl(' + mapLinear(landHeight, 0, waterLevel, 190, 210) + ', 80%, 50%)';
			}
			else if (landHeight > (1- waterLevel)){//Check either extremes
				ctx.fillStyle = 'hsl(' + mapLinear(landHeight, 1, 1-waterLevel, 190, 210) + ', 80%, 50%)';
			}
			else{
				ctx.fillStyle = 'hsl(' + mapLinear(landHeight, waterLevel, 1, 55, 144) + ', 65%, 50%)';
			}

			ctx.fillRect(
				mapLinear(n.location.x - 0.5, -2, xNodes + 1, 0, w),
				mapLinear(n.location.y - 0.5, -2, yNodes + 1, 0, h),
				mapLinear(1.05, 0, xNodes + 3, 0, w),
				mapLinear(1.05, 0, yNodes + 3, 0, h),
			);
		});
	}
	
	if(animate){
		animateLine(drawings, 0);
	}
	else{
		for(let i = 0; i < drawings.length; i++){
			drawings[i]();
		}
		document.getElementById('drawBtn').removeAttribute('style');
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
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
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
	}
}

function addWall(node1, node2){
	node1.walls.push(node2);
	node2.walls.push(node1);
}

function mazeNode(location){
	return {
		location: location,
		walls: [],
		visited: false,
		parent: null,
		onHotPath: false,
		solutionDepth: 0
	};
}

function updateTabs(){
	const radioRandom = document.getElementById('radioRandom').checked;
	const radioNumber = document.getElementById('radioNumber').checked;
	const radioText = document.getElementById('radioText').checked;
	
	const tabRandom = document.getElementById('tabRandom');
	const tabNumber = document.getElementById('tabNumber');
	const tabText = document.getElementById('tabText');
	
	if(radioRandom)
		tabRandom.classList.add('open');
	else
		tabRandom.classList.remove('open');

	if(radioNumber)
		tabNumber.classList.add('open');
	else
		tabNumber.classList.remove('open');
		
	if(radioText)
		tabText.classList.add('open');
	else
		tabText.classList.remove('open');
	drawPattern();
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click', drawPattern);
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
	document.getElementById('radioRandom').addEventListener('change',updateTabs);
	document.getElementById('radioNumber').addEventListener('change',updateTabs);
	document.getElementById('radioText').addEventListener('change',updateTabs);

	document.getElementById('seedNumInput').addEventListener('input', drawPattern);
	document.getElementById('seedTextInput').addEventListener('input', drawPattern);
	
	const urlParams = getUrlVars();
	if(urlParams['waterLevel']){
		document.getElementById('waterLevelInput').value = urlParams['waterLevel'];
	}
	if(urlParams['numSeed']){
		document.getElementById('seedNumInput').value = urlParams['numSeed'];
		document.getElementById('radioNumber').checked = true;
	}
	else if (urlParams['textSeed']){
		document.getElementById('seedTextInput').value = urlParams['textSeed'];
		document.getElementById('radioText').checked = true;
	}
	
	updateTabs();
});