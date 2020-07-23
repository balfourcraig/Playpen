let animationID = null;

function setUp(){
	const C1 = 32.703;

	const notes = [
		{name: 'C', isBlack: false},
		{name: 'C#', isBlack: true},
		{name: 'D', isBlack: false},
		{name: 'D#', isBlack: true},
		{name: 'E', isBlack: false},
		{name: 'F', isBlack: false},
		{name: 'F#', isBlack: true},
		{name: 'G', isBlack: false},
		{name: 'G#', isBlack: true},
		{name: 'A', isBlack: false},
		{name: 'A#', isBlack: true},
		{name: 'B', isBlack: false},
		//{name: 'C\'', isBlack: true}
	];
	
	const octaves = [];
	
	for(let i = 1; i < 8; i++){
		const oct = [];
		const baseNote = C1 * Math.pow(2,i);
		for(let x = 0; x < notes.length; x++){
			const note = {name: notes[x].name + i, freq: baseNote * Math.pow(2, x/12), isBlack: notes[x].isBlack};
			oct.push(note);
		}
		octaves.push(oct);
	}

	const piano = document.getElementById('piano');
	
	let keyCount = 0;
	for(let i = 0; i < octaves.length; i++){
		for(let x = 0; x < octaves[i].length; x++){
			keyCount++;
			const note = octaves[i][x];
			const key = document.createElement('button');
			key.innerText = note.name;
			key.addEventListener('click', () => {
				playNote(note.freq, 2);
			});
			key.setAttribute('class', note.isBlack ? 'keyBlack' : 'keyWhite');
			piano.appendChild(key);
		}
		//piano.appendChild(document.createElement('br'));				
	}
	console.log(keyCount);
}

function playNote(frequency, time){
	const aCtx = new AudioContext(); 
	
	const gainNode = aCtx.createGain();
	gainNode.gain.value = 0.3;
	gainNode.connect(aCtx.destination);
	
	const distortion = aCtx.createWaveShaper();
	distortion.curve = makeDistortionCurve(50);
	//distortion.oversample = '4x';
	distortion.connect(gainNode)
	
	
	const osc = aCtx.createOscillator();
	osc.frequency.value = frequency;
	osc.type = 'sine';
	osc.connect(distortion);
	osc.start();
	osc.stop(aCtx.currentTime + time);
}

function makeDistortionCurve(amount) {
	var k = typeof amount === 'number' ? amount : 50,
	n_samples = 64,
	curve = new Float32Array(n_samples),
	deg = Math.PI / 180,
	i = 0,
	x;
	for ( ; i < n_samples; ++i ) {
		x = i * 2 / n_samples - 1;
		curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
	}
  return curve;
};

function song(){
	const G4 = 440 * Math.pow(2, -2/12); 
	const A4 = 440;
	const F4 = 440 * Math.pow(2, -4/12);
	const F3 = 440 * Math.pow(2, -16/12);
	const C4 = 440 * Math.pow(2, -9/12);

	let audioCtx = new AudioContext();
	let osc = audioCtx.createOscillator();

	let t = audioCtx.currentTime;
	osc.frequency.setValueAtTime(G4, t);
	osc.frequency.setValueAtTime(G4, t + 0.95);
	osc.frequency.exponentialRampToValueAtTime(A4, t + 1);
	osc.frequency.setValueAtTime(A4, t + 1.95);
	osc.frequency.exponentialRampToValueAtTime(F4, t + 2);
	osc.frequency.setValueAtTime(F4, t + 2.95);
	osc.frequency.exponentialRampToValueAtTime(F3, t + 3);
	osc.frequency.setValueAtTime(F3, t + 3.95);
	osc.frequency.exponentialRampToValueAtTime(C4, t + 4);

	osc.connect(audioCtx.destination);			
	
	osc.start();
	osc.stop(audioCtx.currentTime + 6);
}

window.addEventListener('DOMContentLoaded', () => {
	setUp();
	document.getElementById('song').addEventListener('click',song);
});