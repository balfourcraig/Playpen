let animationID = null;

let seed = 1;
function random() {
	const x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
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

function drawPattern(){
	seedRandomNumber();
	document.getElementById('drawBtn').setAttribute('style','display:none');
	document.getElementById('stopDrawingBtn').removeAttribute('style');
	
	window.cancelAnimationFrame(animationID);
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	
	const multipleEnds = document.getElementById('multipleEndsInput').checked;
	const animate = document.getElementById('animateInput').checked;
	//const showSolutions = document.getElementById('solutionsInput').checked;
	
	const solutionType = document.getElementById('solutionTypeSelect').value;
	
	const lineWidth = Math.max(1, parseInt(document.getElementById('lineWidthInput').value));
	xNodes = Math.max(1, parseInt(document.getElementById('xNodesInput').value));;
	yNodes = Math.max(1, parseInt(document.getElementById('yNodesInput').value));;
	
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
	
	ctx.lineWidth = lineWidth;
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
	
	const start = nodes[Math.floor(random() * xNodes * yNodes)]; //nodes[getRandomInt(0, xNodes)];
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
			if(!wall.to.visited){
				wall.to.visited = true;
				wall.walledOff = false;
				wall.mirror.walledOff = false;
				stack.push(wall.to);
				wall.to.parent = current;
				wall.to.solutionDepth = current.solutionDepth + 1;
			}
		}
	}
	
	let backtrack = end;
	while(backtrack != null){
		backtrack.onHotPath = true;
		backtrack = backtrack.parent;
	}
	
	const drawings = [];

	for(let j = orderedNodes.length-1; j >=0; j--){
		const n = orderedNodes[j];
		for(let i = 0; i < n.walls.length; i++){
			const wall = n.walls[i];
			if((wall.walledOff && wall.mirror.walledOff) && (!wall.drawn && !wall.mirror.drawn)) {
				const mid = midpoint(n.location, wall.to.location);
				const xDiff = (n.location.x - wall.to.location.x) / 2;
				const yDiff = (n.location.y - wall.to.location.y) / 2;
				const lineStart = {x: mid.x + yDiff, y: mid.y + xDiff};
				const lineEnd = {x: mid.x - yDiff, y: mid.y - xDiff};
				wall.drawn = true;
				wall.mirror.drawn = true;
				
				drawings.push(() => {
					ctx.beginPath();
					ctx.moveTo(mapLinear(lineStart.x, -2, xNodes + 1, 0, w), mapLinear(lineStart.y, -2, yNodes + 1, 0, h));
					ctx.lineTo(mapLinear(lineEnd.x, -2, xNodes + 1, 0, w), mapLinear(lineEnd.y, -2, yNodes + 1, 0, h));
					ctx.stroke();
				});
			}
		}
	}

	let endDrawn = false;
	for(let j = 0; j < orderedNodes.length; j++){
		const n = orderedNodes[j];
		if(solutionType === 'all' || (solutionType === 'main' && n.onHotPath)){
			drawings.push(() => {
				ctx.fillStyle = 'hsl(' + mapLinear(n.solutionDepth / maxDepth, 0, 1, 140, 0) + ', 60%, 50%)';
				if(!n.onHotPath){
					ctx.beginPath();
					ctx.arc(mapLinear(n.location.x,-2,xNodes+1,0,w),mapLinear(n.location.y,-2,yNodes+1,0,h),lineWidth, 0, Math.PI * 2);
					ctx.fill();
				}
				
				
				if(n.parent != null){
					ctx.strokeStyle = ctx.fillStyle;
					ctx.lineWidth = n.onHotPath ? lineWidth * 1.5 : lineWidth / 2;
					ctx.beginPath();
					ctx.moveTo(mapLinear(n.location.x, -2, xNodes + 1, 0, w), mapLinear(n.location.y, -2, yNodes + 1, 0, h));
					ctx.lineTo(mapLinear(n.parent.location.x, -2, xNodes + 1, 0, w), mapLinear(n.parent.location.y, -2, yNodes + 1, 0, h));
					ctx.stroke();
				}

				ctx.lineWidth = lineWidth;
				ctx.strokeStyle = 'black';
				ctx.fillStyle = 'black';
			});

		}
		if(multipleEnds && n.solutionDepth === maxDepth){
			drawings.push(() => {
				ctx.fillStyle = 'red';
				ctx.beginPath();
				ctx.arc(mapLinear(n.location.x,-2,xNodes+1,0,w), mapLinear(n.location.y,-2,yNodes+1, 0, h), lineWidth * 2, 0, Math.PI * 2);
				ctx.fill();
			});
			endDrawn = true;
		}
		else if (!multipleEnds && n === end){
			drawings.push(() => {
				ctx.fillStyle = 'red';
				ctx.beginPath();
				ctx.arc(mapLinear(n.location.x,-2,xNodes+1,0,w), mapLinear(n.location.y,-2,yNodes+1, 0, h), lineWidth * 2, 0, Math.PI * 2);
				ctx.fill();
			});
			endDrawn = true;
		}
		if(n.parent !== null && n.parent === start){
			drawings.push(() => {
				ctx.fillStyle = 'green';
				ctx.beginPath();
				ctx.arc(mapLinear(start.location.x,-2,xNodes+1,0,w), mapLinear(start.location.y,-2,yNodes+1, 0, h), lineWidth * 2, 0, Math.PI * 2);
				ctx.fill();
			});
		}
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
	//drawPattern();
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

	//document.getElementById('seedNumInput').addEventListener('input', drawPattern);
	//document.getElementById('seedTextInput').addEventListener('input', drawPattern);
	updateTabs();
});

function addWall(node1, node2){
	const to = mazeWall(node2);
	const from = mazeWall(node1);
	
	to.mirror = from;
	from.mirror = to;
	
	node1.walls.push(to);
	node2.walls.push(from);
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

function mazeWall(to){
	return {
		to: to,
		walledOff: true,
		drawn: false,
		mirror: null
	};
}