let barTimeout = null;

function train(){
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	const h = w;
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	const ctx = c.getContext('2d');
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	const words = 'The quick brown fox jumps over the lazy dog';
	let wordIndex = 0;
	
	let eyeAngle = Math.PI;
	const eyeRadius = ~~(w/8);
	const eyeSwapsPerBarSwap = 2;
	const updateDelay = 1000;
	let eyeChangeOnly = 0;
	const eyeDotRadius =  ~~(w/80);
	ctx.font = eyeDotRadius + 'px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	
	drawTraining(true);

	function drawTraining(isRow){
		ctx.fillStyle = isRow ? '#0f0' : '#f0f';
		ctx.strokeStyle = 'none';
		ctx.fillRect(0, 0, w, w);
		
		const height = parseInt(document.getElementById('barSizeInput').value);
		let pos = 0;
		
		ctx.fillStyle = 'black';
		while(pos < w){
			if(isRow)
				ctx.fillRect(0, pos, w, height);
			else
				ctx.fillRect(pos, 0, height, h);
			pos += height * 2;
		}
		drawEyePoint();
		eyeChangeOnly += 1;
		eyeChangeOnly %= eyeSwapsPerBarSwap;
		
		setTimeout(() => drawTraining(eyeChangeOnly === 0 ? !isRow : isRow), updateDelay);
		
		function drawEyePoint(){
			ctx.fillStyle = 'black';
			ctx.strokeStyle = 'white';
			const x = Math.sin(eyeAngle) * eyeRadius + w/2;
			const y = Math.cos(eyeAngle) * eyeRadius + h/2;
			ctx.beginPath();
			ctx.arc(x, y, eyeDotRadius, 0, 2 * Math.PI);
			ctx.fill(); 
			ctx.stroke();
			ctx.fillStyle = 'white';
			ctx.fillText(words[wordIndex++], x ,y);
			eyeAngle += 0.6;
		}
	}
}

function testing(rotated){
	const c = document.createElement('canvas');
	const w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	const h = w;
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	const ctx = c.getContext('2d');
	
	const canvResult = document.getElementById('canvResult');
	canvResult.innerHTML = '';
	canvResult.appendChild(c);
	
	const words = 'The quick brown fox jumps over the lazy dog';
	let wordIndex = 0;
	
	let eyeAngle = Math.PI;
	const eyeRadius = ~~(w/8);
	const eyeSwapsPerBarSwap = 2;
	const updateDelay = 1000;
	let eyeChangeOnly = 0;
	const eyeDotRadius =  ~~(w/80);
	ctx.font = eyeDotRadius + 'px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	
	drawTesting(0, rotated);
	//drawTesting(1, !rotated);
	//drawTesting(2, !rotated);
	//drawTesting(3, rotated);

	function drawTesting(position, useColumns){
		const height = parseInt(document.getElementById('barSizeInput').value);
		let pos = height;
		
		ctx.fillStyle = 'black';
		while(pos < w/2){
			let x;
			let y;
			let rowWidth;
			let rowHeight;
			
			if(useColumns){
				rowWidth = height;
				rowHeight = w/2;
			}
			else{
				rowWidth = w/2;
				rowHeight = height;
			}
			
			if(position === 0){
				x = 0;
				y = pos;
			}
			else if (position === 1){
				x = pos + w/2;
				y = 0;
			}
			else if (position === 2){
				x = pos;
				y = w/2;
			}
			else if (position === 3){
				x = w/2;
				y = pos + w/2;
			}
			ctx.fillRect(x, y, rowWidth, rowHeight);
			pos += height * 2;
		}
	}
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click', () => train());
	document.getElementById('testBtn').addEventListener('click', () => testing(true));
	document.getElementById('testRotatedBtn').addEventListener('click', () => testing(false));
});