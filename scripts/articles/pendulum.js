let animationID = null;
let init = {};

function blankCanvas(){
	window.cancelAnimationFrame(animationID);
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	const ctx = c.getContext('2d');
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	ctx.fillStyle = '#eee';
	ctx.fillRect(0, 0, w, w);
}

function drawPattern(){
	document.getElementById('drawBtn').setAttribute('style','display:none');
	document.getElementById('stopDrawingBtn').removeAttribute('style');
	
	window.cancelAnimationFrame(animationID);
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	const ctx = c.getContext('2d');
	ctx.lineWidth = parseFloat(document.getElementById('lineWidthInput').value);
	const center = {x: w/2.0, y: w/2.0};
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);

	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, w, w);
	
	var g      = 9.8;
	var time   = 0.05;

	clearInterval(init);
	
	const templatePendulum = {
		d2Theta1 : 0,
		d2Theta2 : 0,
		dTheta1  : 0,
		dTheta2  : 0,
		Theta1   : parseFloat(document.getElementById('theta1InitialInput').value)*(Math.PI)/2,
		Theta2   : parseFloat(document.getElementById('theta2InitialInput').value)*(Math.PI)/2,
		m1     : parseFloat(document.getElementById('m1InitialInput').value),
		m2     : parseFloat(document.getElementById('m2InitialInput').value),
		l1     : w * 0.2,
		l2     : w * 0.2,
		X0     : center.x,
		Y0     : center.y,
		prevPoint: null,
		color: 'red',
	};
	
	const diffMult = parseFloat(document.getElementById('globalDiffMultiplier').value)
	
	const pendula = [templatePendulum];
	const diff = 1.3;
	ctx.globalAlpha = 0.3;
	
	const numPens = parseInt(document.getElementById('numLinesInput').value);
	
	const theta1Diff = templatePendulum.Theta1 * parseFloat(document.getElementById('theta1DiffInput').value) * diffMult;
	const theta2Diff = templatePendulum.Theta2 * parseFloat(document.getElementById('theta2DiffInput').value) * diffMult;

	const m1Diff = templatePendulum.m1 * parseFloat(document.getElementById('m1DiffInput').value) * diffMult;
	const m2Diff = templatePendulum.m2 * parseFloat(document.getElementById('m2DiffInput').value) * diffMult;
	
	for(let i = 0; i < numPens; i++){
		const pen = {
			d2Theta1 : templatePendulum.d2Theta1,
			d2Theta2 : templatePendulum.d2Theta2,
			dTheta1  : templatePendulum.dTheta1,
			dTheta2  : templatePendulum.dTheta2,
			Theta1   : templatePendulum.Theta1 - theta1Diff + ((theta1Diff / numPens) * i),
			Theta2   : templatePendulum.Theta2 - theta2Diff + ((theta2Diff / numPens) * i),
			m1     : templatePendulum.m1 - m1Diff + ((m1Diff / numPens) * i),
			m2     : templatePendulum.m2 - m2Diff + ((m2Diff / numPens) * i),
			l1     : templatePendulum.l1,
			l2     : templatePendulum.l2,
			X0     : templatePendulum.X0,
			Y0     : templatePendulum.Y0,
			prevPoint: null,
			color: 'hsl(' + (i * (360/numPens)) + ', 80%, 50%)',
		};
		pendula.push(pen);
	}

	init = setInterval(function(){
		ctx.globalAlpha = 0.005;
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, w, w);
		ctx.globalAlpha = 0.3;
		
		for(let i = 0; i < pendula.length; i++){
			animate(pendula[i], i > 0 ? pendula[i-1].prevPoint : null);
		}
	}, 1);
	
	function animate(pen, prevPoint) {
		const mu      =  1+pen.m1/pen.m2;
		pen.d2Theta1  =  (g*(Math.sin(pen.Theta2)*Math.cos(pen.Theta1-pen.Theta2)-mu*Math.sin(pen.Theta1))-(pen.l2*pen.dTheta2*pen.dTheta2+pen.l1*pen.dTheta1*pen.dTheta1*Math.cos(pen.Theta1-pen.Theta2))*Math.sin(pen.Theta1-pen.Theta2))/(pen.l1*(mu-Math.cos(pen.Theta1-pen.Theta2)*Math.cos(pen.Theta1-pen.Theta2)));
		pen.d2Theta2  =  (mu*g*(Math.sin(pen.Theta1)*Math.cos(pen.Theta1-pen.Theta2)-Math.sin(pen.Theta2))+(mu*pen.l1*pen.dTheta1*pen.dTheta1+pen.l2*pen.dTheta2*pen.dTheta2*Math.cos(pen.Theta1-pen.Theta2))*Math.sin(pen.Theta1-pen.Theta2))/(pen.l2*(mu-Math.cos(pen.Theta1-pen.Theta2)*Math.cos(pen.Theta1-pen.Theta2)));
		pen.dTheta1   += pen.d2Theta1*time;
		pen.dTheta2   += pen.d2Theta2*time;
		pen.Theta1    += pen.dTheta1*time;
		pen.Theta2    += pen.dTheta2*time;
		
		const x = pen.X0+pen.l1*Math.sin(pen.Theta1)+pen.l2*Math.sin(pen.Theta2);
		const y = pen.Y0+pen.l1*Math.cos(pen.Theta1)+pen.l2*Math.cos(pen.Theta2);
		
		const point = {x:x, y:y};
		if(pen.prevPoint){
			drawLineFlat(ctx, pen.prevPoint, point, pen.color);
		}
		pen.prevPoint = point;			
	}
}

function drawCircle(myCircle, context) {
	context.beginPath();
	context.arc(myCircle.x, myCircle.y, myCircle.mass, 0, 2 * Math.PI, false);
	context.fillStyle = '#000';
	context.fill();
	context.lineWidth = 5;
	context.strokeStyle = 'black';
	context.stroke();
}

function drawLine(myLine, context) {
	context.beginPath();
	context.moveTo(myLine.x0, myLine.y0);
	context.lineTo(myLine.x, myLine.y);
	context.strokeStyle = 'red';
	context.stroke();
}

function drawLineFlat(ctx, start, end, color){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(end.x,end.y);
	ctx.stroke();
}

//function drawCircle(ctx, center, radius, color){
	//ctx.strokeStyle = color;
	//ctx.beginPath();
	//ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	//ctx.stroke();
//}

function randomizeValue(){
	document.getElementById('theta1InitialInput').value = boundedRandom(0.05, 2);
	document.getElementById('theta1DiffInput').value = boundedRandom(-1, 1);
	document.getElementById('theta2InitialInput').value = boundedRandom(0.05, 2);
	document.getElementById('theta2DiffInput').value = boundedRandom(-1, 1) * 0.5;
	document.getElementById('numLinesInput').value = getRandomInt(15, 150);
	
	document.getElementById('m1InitialInput').value = boundedRandom(5, 25);
	document.getElementById('m1DiffInput').value = boundedRandom(-1, 1) * 0.5;
	
	document.getElementById('m2InitialInput').value = boundedRandom(5, 25);
	document.getElementById('m2DiffInput').value = boundedRandom(-1, 1) * 0.5;
}

window.addEventListener('DOMContentLoaded', () => {
	blankCanvas();
	document.getElementById('drawBtn').addEventListener('click', drawPattern);
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		clearInterval(init);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
	document.getElementById('randBtn').addEventListener('click', () => {
		randomizeValue();
		drawPattern();
	});
});