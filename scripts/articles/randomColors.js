let width = Math.random();

let animationID = null;

function goldenRand(minSat, maxSat, minLight, maxLight){
	randh += golden_ratio;
	randh %= 1;
	
	let sat = getRandomInt(minSat, maxSat);
	let light = getRandomInt(minLight, maxLight);
	
	return 'hsl(' + (randh * 360) + ', ' + sat + '%, ' + light + '%)';
}

function drawPattern(){
	window.cancelAnimationFrame(animationID);
	const holder = document.getElementById('resultHolder');
	
	const animate = document.getElementById('animateInput').checked;
	
	const sat1 = parseInt(document.getElementById('satMinInput').value);
	const sat2 = parseInt(document.getElementById('satMaxInput').value);
	
	const light1 = parseInt(document.getElementById('lightMinInput').value);
	const light2 = parseInt(document.getElementById('lightMaxInput').value);
	
	const satMin = Math.min(sat1, sat2);
	const satMax = Math.max(sat1, sat2);
	
	const lightMin = Math.min(light1, light2);
	const lightMax = Math.max(light1, light2);
	
	const rows = parseInt(document.getElementById('rowInput').value)
	holder.innerHTML = '';
	
	const drawings = [];
	for(let i = 0; i < rows; i++){
		drawings.push(() => {
			const block = document.createElement('div');
			
			//width += golden_ratio;
			//width %= 1;

			block.setAttribute('class', 'colorBlock');
			block.setAttribute('style', 'background-color:' + goldenRand(satMin, satMax, lightMin, lightMax) + '; width:' + (Math.floor(Math.random() * 50 + 5)) + '%');
			holder.appendChild(block);
		});
	}
	if(animate){
		animationID = window.requestAnimationFrame(() => {
			drawBlock(drawings, 0);
		});
	}
	else{
		for(let i = 0; i < drawings.length; i++){
			drawings[i]();
		}
	}
	
}

function drawBlock(drawings, index){
	if(index < drawings.length){
		drawings[index]();
		animationID = window.requestAnimationFrame(() => {
			drawBlock(drawings, index + 1);
		});
	}
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('drawBtn').addEventListener('click', drawPattern);
	
	document.getElementById('satMinInput').addEventListener('input', () => {
		document.getElementById('satMinLbl').innerText = 'Min Saturation (' + document.getElementById('satMinInput').value + '%)';
	});
	
	document.getElementById('satMaxInput').addEventListener('input', () => {
		document.getElementById('satMaxLbl').innerText = 'Max Saturation (' + document.getElementById('satMaxInput').value + '%)';
	});
});