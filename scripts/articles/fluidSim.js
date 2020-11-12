let animationID = null;
let c = null;
let ctx = null;
let w = 0;
let h = 0;

let padding = 0;
let dotSize = 0;

let gridSize = 100;
let grid;

function setUp(){
	c = document.getElementById('canv');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	h = w;
	c.setAttribute('width', w);
	c.setAttribute('height', h);
	ctx = c.getContext('2d');
	
	padding = 0.5 * w/gridSize;
	dotSize = padding * 2;
	
	grid = [];
	for(let x = 0; x < gridSize; x++){
		grid[x] = [];
		for(let y = 0; y < gridSize; y++){
			grid[x][y] = {
				v: {
					x: Math.sin(1 * Math.PI * 2 * mapLinear(y, 0, gridSize, -1, 1)),
					y: Math.cos(1 * Math.PI * 2 * mapLinear(x, 0, gridSize, -1, 1))
				},
				d: Math.sin(1 * Math.PI * 2 * mapLinear(y, 0, gridSize, -1, 1)) * Math.cos(1 * Math.PI * 2 * mapLinear(x, 0, gridSize, -1, 1)),
				x: mapLinear(x, 0, gridSize - 1, padding, w - padding),
				y: mapLinear(y, 0, gridSize - 1, padding, h - padding)
			};
		}
	}
	setInterval(() => {
		updateGrid();
		draw();
	},50);

}

function vecToAngleDeg(vec){
	const rad = Math.atan2(vec.x, vec.y);
	return rad * (180 / Math.PI);
}

function invertVelocity(vec){
	return {x: vec.x * -1, y: vec.y * -1};
}

function vecMag(vec){
	return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

function updateGrid(){
	for(let x = 0; x < gridSize; x++){
		for(let y = 0; y < gridSize; y++){
			const cell = grid[x][y];
			const vi = invertVelocity(cell.v);
			const oldX = x + vi.x;
			const oldY = y + vi.y;

			const d = grid[clamp(round(oldX), 0, gridSize - 1)][clamp(round(oldY), 0, gridSize - 1)].d; //this is shit! Use linear interpolate
			cell.d = d;
		}
	}
}

function draw(){
	ctx.fillStyle = 'silver';
	ctx.fillRect(0,0,w,h);

	ctx.fillStyle = 'red';
	for(let x = 0; x < gridSize; x++){
		for(let y = 0; y < gridSize; y++){
			ctx.fillStyle = 'hsl(' + vecToAngleDeg(grid[x][y].v) + ',100%,' + (grid[x][y].d * 100) + '%)';
			ctx.fillRect(grid[x][y].x - dotSize/2, grid[x][y].y - dotSize/2, dotSize,dotSize);
		}
	}
}

window.addEventListener('DOMContentLoaded', () => {
	setUp();
});