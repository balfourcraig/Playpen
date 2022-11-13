const strokeStartColor = 'green';
const strokeEndColor = 'orange';
const strokeJoinColor = 'orange';
const strokeDelay = 100;

let timeoutId = null;

const linkedLex = (line) => {
	clearTimeout(timeoutId);
	console.log(`lexing ${line}`);
	let letters = [];
	
	
	const resultArea = document.getElementById('nameList');
	const c = document.createElement('canvas');
	const scale = 100;
	const w = 9 * scale;
	const h = scale;
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	const ctx = c.getContext('2d');
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'black';
	ctx.fillStyle = 'rgb(255,230,200)';
	ctx.fillRect(0, 0, w, h);
	resultArea.appendChild(c);
	const letterInstructions = [];
	for(const c of line){
		console.log(c);
		if(c === 'T'){
			letterInstructions.push(letter_T());
		}
		else if (c === 't'){
			letterInstructions.push(letter_t());
		}
		else if (c === 'h'){
			letterInstructions.push(letter_h());
		}
		else if (c === 'e'){
			letterInstructions.push(letter_e());
		}
	}
	let penPos = {x: 0, y: 0.9};
	let prevEnd = penPos;
	let steps = [];
	for(let inst of letterInstructions){
		if(inst.join){
			steps.push(() => {
				joinLetters(ctx, prevEnd, inst.penStart, scale, penPos);
			});
		}
		for(let i of inst.instructions){
			steps.push(() => {
				i(ctx, penPos, scale);
			});
		}
		steps.push(() => {
			penPos.x += inst.penEnd.x * scale;
			penPos.y += inst.penEnd.x * scale;
			prevEnd = inst.penEnd;
		});
	}
	animateLine(steps, 0);
}

const animateLine = (allActions, index) => {
	if(index < allActions.length){
		allActions[index]();
		timeoutId = setTimeout(() => {
			animateLine(allActions, index + 1);
		}, strokeDelay);
	}
}