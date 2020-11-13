let animationID = null;
let c = null;
let ctx = null;
let w = 0;
let h = 0;

let padding = 0;
let dotSize = 0;

let gridSize = 100;
let grid;

function makeBlankGrid(){
	const g = [];
	for(let x = 0; x < gridSize; x++){
		g[x] = [];
	}
	return g;
}

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
					x: Math.sin(Math.PI * 2 * mapLinear(y, 0, gridSize, -1, 1)),
					y: Math.cos(Math.PI * 2 * mapLinear(x, 0, gridSize, -1, 1))
				},
				d: Math.random(),// Math.sin(1 * Math.PI * 2 * mapLinear(y, 0, gridSize, -1, 1)) * Math.cos(1 * Math.PI * 2 * mapLinear(x, 0, gridSize, -1, 1)),
				x: mapLinear(x, 0, gridSize - 1, padding, w - padding),
				y: mapLinear(y, 0, gridSize - 1, padding, h - padding),
				color: ''//'hsl(' + vecToAngleDeg(grid[x][y].v) + ',100%,' + (grid[x][y].d * 100) + '%)'
			};
			grid[x][y].color = vecToAngleDeg(grid[x][y].v);
		}
	}
	setInterval(() => {
		updateGrid();
		draw();
	},100);

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
	let newGrid = makeBlankGrid();
	for(let x = 0; x < gridSize; x++){
		for(let y = 0; y < gridSize; y++){
			const cell = grid[x][y];
			const newCell = {
				x: cell.x,
				y: cell.y,
				color: cell.color
			};
			
			const vi = invertVelocity(cell.v);
			const oldX = x - vi.x;
			const oldY = y - vi.y;
			
			if(oldX <= 0 || oldX >= gridSize-1 || oldY <= 0 || oldY >= gridSize-1){
				newCell.v = vi;
			}
			else{
				const xLow = ~~oldX;
				const xHigh = xLow + 1;
				const xFrac = oldX - xLow;

				const yLow = ~~oldY;
				const yHigh = yLow + 1;
				const yFrac = oldY - yLow;

				const cornerA = grid[xLow][yLow];
				const cornerB = grid[xLow][yHigh];
				const cornerC = grid[xHigh][yLow];
				const cornerD = grid[xHigh][yHigh];
				
				const topRailX = cornerB.v.x * xFrac + cornerA.v.x * (1- xFrac);
				const bottomRailX = cornerD.v.x * xFrac + cornerC.v.x * (1- xFrac);
				const midRailX = topRailX * yFrac + bottomRailX * (1- yFrac);
				
				const topRailY = cornerB.v.y * xFrac + cornerA.v.y * (1- xFrac);
				const bottomRailY = cornerD.v.y * xFrac + cornerC.v.y * (1- xFrac);
				const midRailY = topRailY * yFrac + bottomRailY * (1- yFrac);
				
				const topRailColor = cornerB.color * xFrac + cornerA.color * (1- xFrac);
				const bottomRailColor = cornerD.color * xFrac + cornerC.color * (1- xFrac);
				const midRailColor = topRailColor * yFrac + bottomRailColor * (1- yFrac);

				newCell.v = {x: midRailX, y: midRailY};
				newCell.color = midRailColor;
			}
			newGrid[x][y] = newCell;
			
			//if(oldX < 0 || oldX >= gridSize || oldY < 0 || oldY >= gridSize){
				//cell.v = vi;
			//}
			//else{
				//const d = grid[clamp(round(oldX), 0, gridSize - 1)][clamp(round(oldY), 0, gridSize - 1)].d; //this is shit! Use linear interpolate
				////const v = grid[clamp(round(oldX), 0, gridSize - 1)][clamp(round(oldY), 0, gridSize - 1)].v; //this is shit! Use linear interpolate
				//cell.d = d;
				////cell.v = {x: (v.x + cell.v.x)/2, y: (v.y + cell.v.y)/2};
			//}
		}
	}
	grid = newGrid;
}

function draw(){
	ctx.fillStyle = 'silver';
	ctx.fillRect(0,0,w,h);

	ctx.fillStyle = 'red';
	for(let x = 0; x < gridSize; x++){
		for(let y = 0; y < gridSize; y++){
			//ctx.fillStyle = 'hsl(' + vecToAngleDeg(grid[x][y].v) + ',100%,' + (grid[x][y].d * 100) + '%)';
			ctx.fillStyle = 'hsl(' + grid[x][y].color + ',100%,50%)';
			ctx.fillRect(grid[x][y].x - dotSize/2, grid[x][y].y - dotSize/2, dotSize,dotSize);
		}
	}
}

window.addEventListener('DOMContentLoaded', () => {
	setUp();
});