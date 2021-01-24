const m = 1.
const cm = 1e-2
const mm = 1e-3
const nm = 1e-9

let wavelength = 0;
let extent_x = 0;
let extent_y = 0;
let Nx = 0;
let Ny = 0;

let x = 0;
let y = 0;

let xx = 0;
let yy = 0;

let E = 0;

let lambda = 0;

function init(self, wavelength, extent_x, extent_y, Nx, Ny){
	x = linspace(-extent_x / 2, extent_x / 2, Nx)
    y = linspace(-extent_y / 2, extent_y / 2, Ny)
	xx = meshgrid(x,y);
	yy = meshgrid(x,y);
}

function linespace(start, stop, num){
	const diff = stop - start;
	const step = diff/(num-1);
	const arr = [];
	for(let i = start; i < stop; i += step){
		arr.push(i);
	}
	return arr;
}

function meshgrid(x, y){
	const arr = [];
	for(let i = 0; i < x.length; i++){
		const innerArr = [];
		for(let j = 0; j < y.length; y++){
			innerArr[j] = y[j];
		}
		arr[i] = innerArr;
	}
	return arr;
}