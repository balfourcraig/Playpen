const fieldOfView = 90;
const stars = [//use objects to describe colour etc
	
];

function setUp(){
	for(i = 0; i < 12; i++){
		stars.push({x: 360/12 * i, name: i});
	}
}

function drawPattern(){
	const angle = parseInt(document.getElementById('viewDirectionInput').value) + 180;
	document.getElementById('viewDirLabel').innerText = 'View Direction: ' + angle;
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	c.setAttribute('width', w);
	const h = 100;
	c.setAttribute('height', 100);
	const ctx = c.getContext('2d');
	const center = {x: w/2.0, y: h/2.0};

	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, w, w);
	ctx.font = "12px Arial";
	
	for(let i = 0; i < stars.length; i++){
		let pos = null;
		if(stars[i].x> angle - fieldOfView && stars[i].x < angle + fieldOfView){
			pos = mapLinear(stars[i].x, angle - fieldOfView, angle + fieldOfView, 0, w);
		}
		else if (angle - fieldOfView < 0 && stars[i].x > fullMod(angle - fieldOfView, 360)){
			pos = mapLinear(stars[i].x - 360, angle - fieldOfView, angle + fieldOfView, 0, w);
		}
		else if(angle + fieldOfView > 360 && stars[i].x < angle + fieldOfView - 360){
			pos = mapLinear(stars[i].x + 360, angle - fieldOfView, angle + fieldOfView, 0, w);
		}
		if(pos){
			drawCircleFade({x: pos, y: h/2}, 4, 'white');
			ctx.fillStyle = 'lime';
			ctx.fillText(stars[i].name, pos, h/2);
		}				
	}
	
	function drawCircleFade(center, radius, color){
		const grad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius);
		grad.addColorStop(0, color);
		grad.addColorStop(1, 'transparent');
		ctx.fillStyle = grad;

		ctx.beginPath();
		ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
		ctx.fill();
	}
}

window.addEventListener('DOMContentLoaded', () => {
	setUp();
	drawPattern();
	document.getElementById('viewDirectionInput').addEventListener('input', () => {
		drawPattern();
	});
});