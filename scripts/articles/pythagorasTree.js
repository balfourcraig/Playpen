const maxDepth = 11;
let ctx;
let w;

let initialSeed = 1;
let c;
let seed = 1;
let lastMousePos;

function random() {
	const x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}

function setUp(){
	initialSeed = Math.random();
	
	c = document.createElement('canvas');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	ctx = c.getContext('2d');
	
	ctx.lineCap = 'round';
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	//canvRect = 

	canvResult.addEventListener('mousemove', drawPattern);
	canvResult.addEventListener('touchmove', drawPattern);
	applyURLParameters();
	drawPattern();
}

function applyURLParameters(){
	const urlVars = getUrlVars();
	if(urlVars['useColor']){
		document.getElementById('colorInput').checked = urlVars['useColor'] === 'true';
	}
	if(urlVars['rand']){
		document.getElementById('randInput').value = urlVars['rand'];
	}
	if(urlVars['branches']){
		document.getElementById('branchesInput').value = urlVars['branches'];
	}
	if(urlVars['roots']){
		document.getElementById('rootsInput').value = urlVars['roots'];
	}
	if(urlVars['xFrom']){
		document.getElementById('leanFromInput').value = urlVars['xFrom'];
	}
	if(urlVars['xTo']){
		document.getElementById('leanToInput').value = urlVars['xTo'];
	}
	if(urlVars['reflect']){
		document.getElementById('reflectInput').checked = urlVars['reflect'] === 'true';
	}
	if(urlVars['background']){
		document.getElementById('backgroundInput').checked = urlVars['background'] === 'true';
	}
}

function drawPattern(e){
	seed = initialSeed;
	const useColor = document.getElementById('colorInput').checked;
	const useBackground = document.getElementById('backgroundInput').checked;
	
	const rootColor = useColor ? '#853e00' : 'black';
	const branchColor = useColor ? '#a15a03' : 'black';
	const leafColor = useColor ? '#169403' : 'black';
	
	if(useBackground){
		const skyGrad = ctx.createLinearGradient(w / 2, 0 , w / 2 ,w);
		if(useColor){
			skyGrad.addColorStop(0, 'lightskyblue');
			skyGrad.addColorStop(0.48, 'silver');
			skyGrad.addColorStop(0.499, '#1c850c');
			skyGrad.addColorStop(0.5, '#4a2407');
			skyGrad.addColorStop(1, '#0f0701');
		}
		else{
			skyGrad.addColorStop(0, 'grey');
			skyGrad.addColorStop(0.499, 'silver');
			skyGrad.addColorStop(0.5, 'grey');
			skyGrad.addColorStop(1, 'black');
		}
		ctx.fillStyle = skyGrad;
	}
	else{
		ctx.fillStyle = 'white';
	}
	
	ctx.fillRect(0, 0, w, w);

	const branchDepth = parseInt(document.getElementById('branchesInput').value);
	const rootDepth = parseInt(document.getElementById('rootsInput').value);
	
	const leanFrom = parseFloat(document.getElementById('leanFromInput').value);
	const leanTo = parseFloat(document.getElementById('leanToInput').value);
	
	const randomFactor = parseFloat(document.getElementById('randInput').value);
	
	let leftSwing = 0.5;
	let rightSwing = 0.5;
	
	let canvRect = c.getBoundingClientRect();
	
	if(e && e.clientX && e.clientY) {
		lastMousePos = {x: e.clientX - canvRect.left, y: e.clientY - canvRect.top};
	}
	if(lastMousePos){
		const mouseX = lastMousePos.x;
		const mouseY = lastMousePos.y;
		const xMapped = mouseX / canvRect.width;
		//leftSwing = (1 - xMapped)  -2;
		//rightSwing = xMapped  -2;
		
		leftSwing = mapLinear(xMapped,0,1,leanTo,leanFrom);
		rightSwing = mapLinear(xMapped,0,1,leanFrom,leanTo);
		
		const yMapped = mouseY / canvRect.height * 2 + 0.2;
		leftSwing *= yMapped;
		rightSwing *= yMapped;
	}
	
	const reflectBranches = document.getElementById('reflectInput').checked;
	
	drawTree(w/2, w/2-1, 1, branchDepth, 0, w/10, Math.PI, false);
	
	ctx.fillStyle = rootColor;
	ctx.beginPath();
	ctx.arc(w/2, w/2, 10, 0, 2 * Math.PI);
	ctx.fill();
	
	drawTree(w/2, w/2+1, 1, rootDepth, 0, w/10, 0, true);
	
	function drawTree(x1, y1, depth, maxDepth, angle, length, angleOffset, isRoot){
		if(depth > maxDepth)
			return;
		
		if(isRoot)
			ctx.strokeStyle = rootColor;
		else if(depth == maxDepth)
			ctx.strokeStyle = leafColor;
		else
			ctx.strokeStyle = branchColor;
		
		ctx.lineWidth = maxDepth / depth;
		
		let randModifier = random() * randomFactor + (1 - randomFactor / 2);
		
		let x2 = Math.sin(angle + angleOffset) * length * randModifier + x1;
		let y2 = Math.cos(angle + angleOffset) * length * randModifier + y1;
		
		if(reflectBranches && (!isRoot && y2 > w/2 || isRoot &&  y2 < w/2)){
			angle += Math.PI;
			y2 = w/2 + 1 * (isRoot ? 1 : -1);
		}
		
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();

		drawTree(x2, y2, depth + 1, maxDepth, angle + leftSwing * (isRoot ? -1 : 1), length * 0.8, angleOffset, isRoot);
		drawTree(x2, y2, depth + 1, maxDepth, angle - rightSwing * (isRoot ? -1 : 1), length * 0.8, angleOffset, isRoot);
	}
}

window.addEventListener('DOMContentLoaded', () => {
	setUp();
	document.getElementById('branchesInput').addEventListener('input', drawPattern);
	document.getElementById('colorInput').addEventListener('change', drawPattern);
	document.getElementById('randInput').addEventListener('input', drawPattern);
	document.getElementById('rootsInput').addEventListener('input', drawPattern);
	document.getElementById('reflectInput').addEventListener('change', drawPattern);
	document.getElementById('backgroundInput').addEventListener('change', drawPattern);
});