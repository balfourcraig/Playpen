let animationID = null;

function drawPattern(){
	let x = 0;
	let y = 0;
	
	const a = parseFloat(document.getElementById('A_Input').value);
	const b = parseFloat(document.getElementById('B_Input').value);
	const c = parseFloat(document.getElementById('C_Input').value);
	const d = parseFloat(document.getElementById('D_Input').value);
	const e = parseFloat(document.getElementById('E_Input').value);
	const f = parseFloat(document.getElementById('F_Input').value);
	const g = parseFloat(document.getElementById('G_Input').value);
	const h = parseFloat(document.getElementById('H_Input').value);
	const i = parseFloat(document.getElementById('I_Input').value);
	const j = parseFloat(document.getElementById('J_Input').value);
	const k = parseFloat(document.getElementById('K_Input').value);
	const l = parseFloat(document.getElementById('L_Input').value);
	const m = parseFloat(document.getElementById('M_Input').value);
	
	document.getElementById('drawBtn').setAttribute('style','display:none');
	document.getElementById('stopDrawingBtn').removeAttribute('style');
	
	const canv = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	const height = w * 1.2;
	canv.setAttribute('width', w);
	canv.setAttribute('height', height);
	const ctx = canv.getContext('2d');
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(canv);
	
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, c.width, c.height);
	
	const iterationsPerFrame = parseInt(document.getElementById('iterationsInput').value);
	const frames = parseInt(document.getElementById('framesInput').value);
	const opacity = parseFloat(document.getElementById('opacityInput').value);
	
	for(let f = 0; f < frames; f++){
		const color = 'hsla(' + (f/frames * 100 + 30) + ',60%,50%,' + opacity + ')';
		for(let i = 0; i < iterationsPerFrame; i++){
			update(color);
		}
	}
	document.getElementById('drawBtn').removeAttribute('style');
	document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
	
	function frame(count){
		const color = 'hsla(' + (count/frames * 100 + 30) + ',60%,50%,' + opacity + ')';
		for (let i = 0; i < iterationsPerFrame; i++)
			update(color);
		if(count < frames){
			animationID = window.requestAnimationFrame(() => {
				frame(count + 1);
			});
		}
		else{
			document.getElementById('drawBtn').removeAttribute('style');
			document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		}
	}
	
	function update(color) {
		let nextX, nextY;
		let r = Math.random();

		if (r < 0.01) {
			nextX =  0;
			nextY =  a * y;
		} else if (r < 0.86) {
			nextX =  b * x + c * y;
			nextY = -c * x + b * y + 1.6;
			
		} else if (r < 0.93) {
			nextX =  d * x - e * y;
			nextY =  f * x + g * y + h;
		} else {
			nextX = -i * x + j * y;
			nextY =  k * x + l * y + m;
		}

		// Scaling and positioning
		let plotX = w * (x + 3) / 6;
		let plotY = height - height * ((y + 2) / 14);

		ctx.fillStyle = color;
		ctx.fillRect(plotX, plotY, 1, 1);

		x = nextX;
		y = nextY;
	}
}

function inputDraw(letter){
	const inp = document.getElementById(letter + '_Input');
	const lab =	document.getElementById(letter + '_label');
	
	lab.innerText = letter + ' (' + inp.value + ')';
	drawPattern();
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click',drawPattern);
	
	document.getElementById('A_Input').addEventListener('input', () => inputDraw('A'));
	document.getElementById('B_Input').addEventListener('input', () => inputDraw('B'));
	document.getElementById('C_Input').addEventListener('input', () => inputDraw('C'));
	document.getElementById('D_Input').addEventListener('input', () => inputDraw('D'));
	document.getElementById('E_Input').addEventListener('input', () => inputDraw('E'));
	document.getElementById('F_Input').addEventListener('input', () => inputDraw('F'));
	document.getElementById('G_Input').addEventListener('input', () => inputDraw('G'));
	document.getElementById('H_Input').addEventListener('input', () => inputDraw('H'));
	document.getElementById('I_Input').addEventListener('input', () => inputDraw('I'));
	document.getElementById('J_Input').addEventListener('input', () => inputDraw('J'));
	document.getElementById('K_Input').addEventListener('input', () => inputDraw('K'));
	document.getElementById('L_Input').addEventListener('input', () => inputDraw('L'));
	document.getElementById('M_Input').addEventListener('input', () => inputDraw('M'));
	
	document.getElementById('stopDrawingBtn').addEventListener('click', () => {
		cancelAnimationFrame(animationID);
		document.getElementById('stopDrawingBtn').setAttribute('style','display:none');
		document.getElementById('drawBtn').removeAttribute('style');
	});
});