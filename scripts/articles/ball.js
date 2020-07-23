let animationID = null;
let c = null;
let gc = null;
let ctx = null;
let gctx = null;
let w = 0;

let currentPos = 0;
let step = 0.01;

function setUp(){
	c = document.getElementById('ballCanv');
	gc = document.getElementById('graphCanv');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	c.setAttribute('width', w);
	c.setAttribute('height', w/4);
	gc.setAttribute('width', w);
	gc.setAttribute('height', w/2);
	ctx = c.getContext('2d');
	gctx = gc.getContext('2d');
}

function draw(){
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'black';
	ctx.beginPath();
	ctx.rect(0,0,w,w/4);
	ctx.fill();
	ctx.stroke();
	
	gctx.fillStyle = 'white';
	gctx.strokeStyle = 'black';
	gctx.beginPath();
	gctx.rect(0,0,w,w/2);
	gctx.fill();
	gctx.stroke();

	const cosPos = cosineInterpolate(w/20, w - (w/20), currentPos);
	ctx.fillStyle = 'red';
	ctx.beginPath();
	ctx.arc(cosPos, w/8 - (w/16), (w/20), 0, 2*Math.PI);
	ctx.fill();
	
	let linearPos = currentPos % 2;
	let backwards = false;
	if(linearPos > 1){
		linearPos = 2 - linearPos;
		backwards = true;
	}
	const mappedLinearPos = mapLinear(linearPos, 0, 1, w/20, w-(w/20));
	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.arc(mappedLinearPos, w/8 + (w/16), (w/20), 0, 2*Math.PI);
	ctx.fill();
	
	for(let i = 0; i < 10; i++){
		const cosX = cosineInterpolate(0, w, currentPos - (step * i));
		const cosY = cosineInterpolate(w/200, w/2 - w/200, cosX/w);
		
		let colorWeight = Math.floor(((i + 1)/11) * 255);
		gctx.fillStyle = 'rgb(255, ' + colorWeight + ', ' + colorWeight + ')';
		gctx.beginPath();
		gctx.arc(cosX, cosY, (w/200), 0, 2*Math.PI);
		gctx.fill();
		
		//let offset = 
		const linX = mapLinear(linearPos - (step * i), 0 , 1, w/200, w - w/200);
		const linY = mapLinear(linearPos - (step * i), 0 , 1, w/200, w/2 - w/200);
		
		if(backwards)
			colorWeight = 255 - colorWeight;
		gctx.fillStyle = 'rgb(' + colorWeight + ', 255, ' + colorWeight + ')';
		gctx.beginPath();
		gctx.arc(linX, linY, (w/200), 0, 2*Math.PI);
		gctx.fill();
	}
	currentPos += step;
	animationID = window.requestAnimationFrame(draw);
}

window.addEventListener('DOMContentLoaded', () => {
	setUp();
	draw();
});