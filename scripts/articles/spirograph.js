let animationID = null;
let drawing = false;

const PI2 = Math.PI * 2;

let loops = 0;

function setUp(){
	document.getElementById('drawBtn').setAttribute('style','display:none');
	document.getElementById('stopDrawingBtn').removeAttribute('style');
	
	window.cancelAnimationFrame(animationID);
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	c.setAttribute('width', w);
	c.setAttribute('height', w);
	const ctx = c.getContext('2d');
	
	ctx.lineWidth = 2;
	const center = {x: w/2.0, y: w/2.0};
	const radius = w * 0.45;
	const r1 = radius;
	const r2 = radius * parseFloat(document.getElementById('r2Input').value);
	const r3 = r2 * parseFloat(document.getElementById('r3Input').value);
	const rDiff = r1 - r2;

	const rRatio = r1/r2;
	
	let theta1 = Math.PI;
	let theta2 = 0;
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'black';
	ctx.fillRect(0, 0, w, w);
	drawCircle(ctx, center, r1, 'blue');
	
	ctx.globalCompositeOperation = 'multiply';
	
	let prevPoint = null;
	loops = 0;
	
	drawing = true;
	drawPattern();
	
	function drawPattern(){
		if(drawing){

			//theta1 += goldenAngleRad;
			theta1 += 0.1;
			//theta1 = theta1 % (Math.PI * 2);
			//if(theta1 >= Math.PI * 2)
				//drawing = false;
				
			//loopsdocument.getElementById('theta1Readout').innerText = theta1;
				
			const x1 = Math.sin(theta1) * r1 + center.x;
			const y1 = Math.cos(theta1) * r1 + center.y;
			
			//ctx.strokeStyle = 'red';
			//ctx.beginPath();
			//ctx.moveTo(center.x, center.y);
			//ctx.lineTo(x1, y1);
			//ctx.stroke();

			const xCent = Math.sin(theta1) * rDiff + center.x;
			const yCent = Math.cos(theta1) * rDiff + center.y;
			
			//drawCircle(ctx, {x:xCent, y:yCent}, r2, 'green');

			theta2 = Math.PI * 2 - (theta1 * rRatio);// % (Math.PI * 2);
			//document.getElementById('theta2Readout').innerText = theta2;
			
			const x2 = Math.sin(theta2) * r2 + xCent;
			const y2 = Math.cos(theta2) * r2 + yCent;
			
			//ctx.strokeStyle = 'red';
			//ctx.beginPath();
			//ctx.moveTo(xCent, yCent);
			//ctx.lineTo(x2, y2);
			//ctx.stroke();

			const x3 = Math.sin(theta2) * r3 + xCent;
			const y3 = Math.cos(theta2) * r3 + yCent;
			
			if(prevPoint){
				ctx.strokeStyle = 'orange';
				ctx.beginPath();
				ctx.moveTo(prevPoint.x, prevPoint.y);
				ctx.lineTo(x3, y3);
				ctx.stroke();
			}
			prevPoint = {x: x3, y: y3};
			//drawCircle(ctx, {x:x3, y:y3}, 2, 'orange');
			
			if(theta1 > loops * PI2)
				loops++;
				
			document.getElementById('theta2Readout').innerText = loops;
			animationID = window.requestAnimationFrame(() =>{
				drawPattern();
			});
		}
		else{
			document.getElementById('drawBtn').removeAttribute('style');
			document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		}
	}
}

function drawCircle(ctx, center, radius, color){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.stroke();
}

window.addEventListener('DOMContentLoaded', () => {
	//setUp();
	document.getElementById('drawBtn').addEventListener('click', setUp);
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		drawing = false;
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});

});