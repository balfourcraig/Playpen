let drawLayer = null;
let mapLayer = null;
let lightsLayer = null;
let drawCtx = null;
let mapCtx = null;
let lightsCtx = null;

let houseWidthMetres = 11.5;
let houseLengthMetres = 14;

let globablOffset = {x: 1, y: 1};
let globalOrigin = null;
let mousePos = null;

let w = 0;
let h = 0;

let scaleFactor = 1;

let currentHovered = [];
let currentDoors = [];
let hoverChanged = false;

function setUp(){
	drawLayer = document.getElementById('drawLayer');
	mapLayer = document.getElementById('mapLayer');
	lightsLayer = document.getElementById('lightsLayer');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	h = w * (houseLengthMetres / houseWidthMetres);

	scaleFactor = w / houseWidthMetres;

	document.getElementById('sizeCalc').style.height = h + 'px';
	drawLayer.setAttribute('width', w);
	drawLayer.setAttribute('height', h);
	mapLayer.setAttribute('width', w);
	mapLayer.setAttribute('height', h);
	lightsLayer.setAttribute('width', w);
	lightsLayer.setAttribute('height', h);
	drawCtx = drawLayer.getContext('2d');
	mapCtx = mapLayer.getContext('2d');
	lightsCtx = lightsLayer.getContext('2d');
	lightsCtx.globalAlpha = 0.8;
	mapCtx.lineWidth = 2;
	mapCtx.lineCap = 'round';
	mapCtx.strokeStyle = 'blue';
	mapCtx.fillStyle = 'white';
	mapCtx.textAlign = "center";
	drawCtx.lineWidth = 2;
	const chkLights = document.getElementById('chkShowLights');
	if(chkLights.checked)
		drawLights(house, globablOffset);
	
    drawMap();
	chkLights.addEventListener('change', () => {
		if(chkLights.checked){
			drawLights(house, globablOffset);
		}
		else{
			lightsCtx.clearRect(0,0,w,h);
		}
	});
	drawLayer.addEventListener('mousemove', mouseMove);
	document.addEventListener('keydown', keyDown);
	document.addEventListener('mousedown', mouseDown);

	document.getElementById('btnZoomIn').addEventListener('click', () => zoomMap(10));
	document.getElementById('btnZoomOut').addEventListener('click', () => zoomMap(-10));
	document.getElementById('btnZoomReset').addEventListener('click', zoomReset);

	document.getElementById('btnMoveUp').addEventListener('click', () => moveMap({x: 0, y: 1}));
	document.getElementById('btnMoveDown').addEventListener('click', () => moveMap({x: 0, y: -1}));
	document.getElementById('btnMoveLeft').addEventListener('click', () => moveMap({x: 1, y: 0}));
	document.getElementById('btnMoveRight').addEventListener('click', () => moveMap({x: -1, y: 0}));

	// document.addEventListener('contextmenu', function(event) {
	// 	event.preventDefault();
	// });
}

function drawLights(room, baseOffset){
	if(room.lights && room.lights.length > 0){
		for(let l of room.lights){
			const lPos = {
				x: (l.position.x + baseOffset.x + room.offset.x) * scaleFactor,
				y: (l.position.y + baseOffset.y + room.offset.y) * scaleFactor
			};
			const lightGrad = lightsCtx.createRadialGradient(
				lPos.x,
				lPos.y,
				(l.brightness * scaleFactor) /10,
				lPos.x,
				lPos.y,
				(l.brightness * scaleFactor) /2
			)
			lightGrad.addColorStop(0, l.color);
			lightGrad.addColorStop(1, 'rgba(255,255,255,0)');

			lightsCtx.fillStyle = lightGrad;
			lightsCtx.fillRect(
				lPos.x - (l.brightness * scaleFactor / 2),
				lPos.y - (l.brightness * scaleFactor / 2),
				l.brightness * scaleFactor,
				l.brightness * scaleFactor
			);

			drawCircle(lightsCtx, lPos, 5, 'white')
		}
	}

	if(room.subParts && room.subParts.length > 0){
		for(let i = 0; i < room.subParts.length; i++){
			drawLights(room.subParts[i], {x: baseOffset.x + room.offset.x, y: baseOffset.y + room.offset.y});
		}
	}
}

function drawCircle(ctx, position, radius, color){
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
	ctx.fill();
}

function distToLine(point, line){	
	if(line.from.x > line.to.x){
		const temp = line.from;
		line.from = line.to;
		line.to = temp;
	}
	
	let iX = 0;
	let iY = 0;
	
	if(Math.abs(line.from.y - line.to.y) < 0.01){//flat
		iX = point.x;
		iY = line.from.y;
	}
	else if(Math.abs(line.from.x - line.to.x) < 0.01){//vertical
		iX = line.from.x;
		iY = point.y
	}
	else{
		const lM = (line.to.y - line.from.y) / (line.to.x - line.from.x);
		const pM = (line.from.x - line.to.x) / (line.to.y - line.from.y);
		const lC = line.from.y - lM * line.from.x;
		const pC = point.y - pM * point.x;
		
		iX = -(lC - pC) / (lM - pM);
		iY = -(lM * -iX) + lC;
	}

	if(
		(line.from.x < line.to.x && iX < line.from.x)
		|| (line.to.x < line.from.x && iX < line.to.x)
		|| (line.from.x > line.to.x && iX > line.from.x)
		|| (line.to.x > line.from.x && iX > line.to.x)
		|| (line.from.y < line.to.y && iY < line.from.y)
		|| (line.to.y < line.from.y && iY < line.to.y)
		|| (line.from.y > line.to.y && iY > line.from.y)
		|| (line.to.y > line.from.y && iY > line.to.y)
		)
	{
		return minPoints(point, line.from, line.to);
	}
	else
	{
		const deltaX = Math.abs(point.x - iX);
		const deltaY = Math.abs(point.y - iY);
		const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		
		return dist;
	}
}

function minPoints(p1, p2, p3){
	return Math.min(distance(p1, p2), distance(p1, p3));
}

function zoomMap(factor){
	scaleFactor += factor;
	drawMap();
}

function zoomReset(){
	scaleFactor = w / houseWidthMetres;
	globablOffset = {x: 1, y: 1};
	drawMap();
}

function moveMap(moveBy){
	globablOffset.x += moveBy.x;
	globablOffset.y += moveBy.y;
	drawMap();
}

function arraysEqual(arr1, arr2){
	if(arr1 === null || arr2 === null)
		return false;
	if(arr1.length !== arr2.length){
		return false;
	}
	for(let i = 0; i < arr1.length; i++){
		if(arr1[i] !== arr2[i]){
			return false;
		}
	}
	return true;
}

function drawMap(){
	mapCtx.clearRect(0, 0, w, h);
	drawRoom(house, globablOffset);
}

function drawCross(point){
	drawCtx.beginPath();
	let crossSize = 3;
	drawCtx.moveTo(point.x - crossSize, point.y - crossSize);
	drawCtx.lineTo(point.x + crossSize, point.y + crossSize);
	drawCtx.moveTo(point.x - crossSize, point.y + crossSize);
	drawCtx.lineTo(point.x + crossSize, point.y - crossSize);
	drawCtx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
	drawCtx.stroke();

}

function drawMousePos(){
	const showChk = document.getElementById('chkShowCursor').checked;
	drawCtx.clearRect(0, 0, w, h);
	if(mousePos && showChk){
		drawCtx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
		drawCtx.beginPath();
		drawCtx.moveTo(mousePos.x, 0);
		drawCtx.lineTo(mousePos.x, h);
		drawCtx.moveTo(0, mousePos.y);
		drawCtx.lineTo(w, mousePos.y);
		drawCtx.stroke();
		drawCross(mousePos);
	}
	if(globalOrigin){
		drawCtx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
		drawCtx.beginPath();
		drawCtx.moveTo(globalOrigin.x, globalOrigin.y);
		drawCtx.lineTo(mousePos.x, mousePos.y);
		drawCtx.stroke();
		drawCross(globalOrigin);
	}
}

function resetMouseOverRooms(room){
	room.mouseOver = false;
	if(room.subParts && room.subParts.length > 0){
		for(let i = 0; i < room.subParts.length; i++){
			resetMouseOverRooms(room.subParts[i]);
		}
	}

}

function mouseInRooms(){
	let mousePosMapped = {x: (mousePos.x / scaleFactor) - globablOffset.x, y: (mousePos.y / scaleFactor) - globablOffset.y};
	let inRooms = null;
	let prevDoors = [];
	for(let d of currentDoors){
		prevDoors.push(d);
	}
	currentDoors = [];
	if(house){
		inRooms = pointInRoom(mousePosMapped, house);
		
		if(arraysEqual(prevDoors, currentDoors) && arraysEqual(inRooms, currentHovered)){
			hoverChanged = false;
			return;
		}
		hoverChanged = true;
		currentHovered = inRooms;
		resetMouseOverRooms(house);
		for(let room of inRooms){
			room.mouseOver = true;
		}
	}
}

function pointInRoom(point, room){
	let inside = [];
	point = {x: point.x - room.offset.x, y: point.y - room.offset.y};
	if(room.points){
		if(pointInPolygon(point, room.points)){
			inside.push(room);
		}
	}
	if(room.doors && room.doors.length > 0){
		for(let d of room.doors){
			d.near = pointNearDoor(point, d, 0.1);
			if(d.near){
				currentDoors.push(d);
			}
		}
	}
	if(room.subParts && room.subParts.length > 0){
		for(let i = 0; i < room.subParts.length; i++){
			let inSubRoom = pointInRoom(point, room.subParts[i]);
			if(inSubRoom.length > 0){
				inside = inside.concat(inSubRoom);
			}
		}
	}
	return inside;
}

function pointNearDoor(point, door, threshold){
	let doorLine = {
		from: door.position,
		to: {
			x: door.position.x + door.width * Math.cos(door.angle * Math.PI / 180),
			y: door.position.y + door.width * Math.sin(door.angle * Math.PI / 180)
		}
	};

	let doorDist = distToLine(point, doorLine);

	return doorDist < threshold
}

function pointInPolygon(point, polygon) {
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x;
        const yi = polygon[i].y;
        const xj = polygon[j].x;
        const yj = polygon[j].y;

        const intersect = ((yi > point.y) !== (yj > point.y)) &&
            (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);

        if (intersect) inside = !inside;
    }

    return inside;
}

function areaOfPolygon(polygon){
	let area = 0;
	for(let i = 0; i < polygon.length; i++){
		let j = (i + 1) % polygon.length;
		area += polygon[i].x * polygon[j].y;
		area -= polygon[j].x * polygon[i].y;
	}
	return area / 2;
}

function perimeterOfPolygon(polygon){
	let dist = 0;
	for(let i = 0; i < polygon.length; i++){
		let j = (i + 1) % polygon.length;
		dist += distance(polygon[i], polygon[j]);
	}
	return dist;
}

function drawRoom(room, baseOffset){
	mapCtx.strokeStyle = room.color ? room.color : 'black';
	mapCtx.fillStyle = room.color ? room.color : 'black';
	mapCtx.beginPath();
    mapCtx.moveTo((room.points[0].x + baseOffset.x + room.offset.x) * scaleFactor, (room.points[0].y + baseOffset.y + room.offset.y) * scaleFactor);
    for(let i = 1; i < room.points.length; i++){
        mapCtx.lineTo((room.points[i].x + baseOffset.x + room.offset.x) * scaleFactor, (room.points[i].y + baseOffset.y + room.offset.y) * scaleFactor);
    
		if(room.mouseOver){
			const mid = midpoint(room.points[i - 1], room.points[i]);
			const dist = distance(room.points[i - 1], room.points[i]);
			mapCtx.fillText(roundToPrecision(dist, 2) + 'm', (mid.x + baseOffset.x + room.offset.x) * scaleFactor, (mid.y + baseOffset.y + room.offset.y) * scaleFactor )
			
		}
	}
    mapCtx.closePath();

	if(room.mouseOver){
		const mid = midpoint(room.points[0], room.points[room.points.length -1]);
		const dist = distance(room.points[0], room.points[room.points.length -1]);
		mapCtx.fillText(roundToPrecision(dist, 2) + 'm', (mid.x + baseOffset.x + room.offset.x) * scaleFactor, (mid.y + baseOffset.y + room.offset.y) * scaleFactor )
		
	}
    
	if(room.mouseOver){
		mapCtx.globalAlpha = 0.1;
		mapCtx.fill();
		mapCtx.globalAlpha = 1;
	}
 	mapCtx.stroke();
	
	if(room.windows && room.windows.length > 0){
		for(let i = 0; i < room.windows.length; i++){
			let window = room.windows[i];
			let windowPos = {x: (window.position.x + baseOffset.x + room.offset.x) * scaleFactor, y: (window.position.y + baseOffset.y + room.offset.y) * scaleFactor};
			let windowWidth = window.width * scaleFactor;
			let windowAngle = window.angle;
			mapCtx.beginPath();
			mapCtx.moveTo(windowPos.x, windowPos.y);
			mapCtx.lineTo(windowPos.x + windowWidth * Math.cos(windowAngle * Math.PI / 180), windowPos.y + windowWidth * Math.sin(windowAngle * Math.PI / 180));
			mapCtx.strokeStyle = window.color ? window.color : 'black';
			mapCtx.lineWidth = 3;
			mapCtx.stroke();
			mapCtx.lineWidth = 1;
			mapCtx.beginPath();
			mapCtx.moveTo(windowPos.x, windowPos.y);
			mapCtx.strokeStyle = window.color ? window.color : 'black';
			mapCtx.stroke();
		}
	}

	if(room.doors && room.doors.length > 0){
		for(let i = 0; i < room.doors.length; i++){
			let door = room.doors[i];
			let doorPos = {x: (door.position.x + baseOffset.x + room.offset.x) * scaleFactor, y: (door.position.y + baseOffset.y + room.offset.y) * scaleFactor};
			let doorWidth = door.width * scaleFactor;
			let doorAngle = door.angle;
			

			mapCtx.beginPath();
			mapCtx.moveTo(doorPos.x, doorPos.y);
			mapCtx.lineTo(doorPos.x + doorWidth * Math.cos(doorAngle * Math.PI / 180), doorPos.y + doorWidth * Math.sin(doorAngle * Math.PI / 180));
			if(door.near)
				mapCtx.strokeStyle = 'red';
			else
				mapCtx.strokeStyle = door.color ? door.color : 'black';
			mapCtx.lineWidth = 4;
			mapCtx.stroke();
			mapCtx.lineWidth = 1;
			if(door.sliding){
				mapCtx.beginPath();
				mapCtx.moveTo(doorPos.x, doorPos.y);
				mapCtx.lineTo(doorPos.x + doorWidth * Math.cos((doorAngle + 180) * Math.PI / 180), doorPos.y + doorWidth * Math.sin((doorAngle + 180) * Math.PI / 180));
				mapCtx.strokeStyle = door.color ? door.color : 'black';
				mapCtx.stroke();
			}
			else{
				if(door.openInwards){
					mapCtx.beginPath();
					mapCtx.moveTo(doorPos.x, doorPos.y);
					mapCtx.arc(doorPos.x, doorPos.y, doorWidth, doorAngle * Math.PI / 180, (doorAngle + 90) * Math.PI / 180);
					mapCtx.strokeStyle = door.color ? door.color : 'black';
					mapCtx.stroke();
				}
				else{
					mapCtx.beginPath();
					mapCtx.moveTo(doorPos.x, doorPos.y);
					mapCtx.arc(doorPos.x, doorPos.y, doorWidth, doorAngle * Math.PI / 180, (doorAngle - 90) * Math.PI / 180, true);
					mapCtx.strokeStyle = door.color ? door.color : 'black';
					mapCtx.stroke();
				}
			}
		}
	}
   
	if(room.subParts && room.subParts.length > 0){
		for(let i = 0; i < room.subParts.length; i++){
			drawRoom(room.subParts[i], {x: baseOffset.x + room.offset.x, y: baseOffset.y + room.offset.y});
		}
	}
}

function mouseMove(event){
	let x = event.offsetX;
	let y = event.offsetY;
	mousePos = {x: x, y: y};
	updateReadouts();
	drawMousePos();
}

function updateReadouts(){
	const areaReadout = document.getElementById('areaReadout');
	if(mousePos){
		mouseInRooms();
		areaReadout.innerHTML = '';
		if(currentHovered.length > 0){
			const inRoomsReadout = document.createElement('li');
			inRoomsReadout.innerText = currentHovered.map((room) => room.name).join(', ');
			areaReadout.appendChild(inRoomsReadout);

			for(let r of currentHovered){
				const areaLi = document.createElement('li');
				areaLi.innerText = `${r.name} Area: ${areaOfPolygon(r.points).toFixed(2)}m²`;
				areaReadout.appendChild(areaLi);

				const perimeterLi = document.createElement('li');
				perimeterLi.innerText = `${r.name} Perimeter ${perimeterOfPolygon(r.points).toFixed(2)}m`;
				areaReadout.appendChild(perimeterLi);
			}
		}
		if(currentDoors && currentDoors.length > 0){
			for(let d of currentDoors){
				const doorLi = document.createElement('li');
				doorLi.innerText = `${d.name} width: ${d.width}m`;
				areaReadout.appendChild(doorLi);
			}
		}
		if(hoverChanged){
			console.log("draw")
			drawMap();
		}
	}

	if(mousePos && globalOrigin){
		const xDist = ((globalOrigin.x - mousePos.x) / scaleFactor);
		const yDist = ((globalOrigin.y - mousePos.y) / scaleFactor);
		const mousePosReadout = document.createElement('li');
		mousePosReadout.innerText = 'X: ' + xDist.toFixed(2) + 'm, Y: ' + yDist.toFixed(2) + 'm';
		areaReadout.appendChild(mousePosReadout);

		const distance = Math.sqrt(xDist * xDist + yDist * yDist);
		const distanceReadout = document.createElement('li');
		distanceReadout.innerText = 'Distance: ' + distance.toFixed(2) + 'm';
		areaReadout.appendChild(distanceReadout);
	}
}

function keyDown(event){
	if(event.key === 'o'){
		globalOrigin = mousePos;
		updateReadouts();
		drawMap();
		drawMousePos();
	}
	else if(event.key === 'Escape' || event.key === 'Esc' || event.key === 'esc' || event.key === 'ESC'){
		globalOrigin = null;
		//mousePos = null;
		updateReadouts();
		drawMap();
		drawMousePos();
	}
}

function mouseDown(event){
	if(event.button === 0){
		globalOrigin = mousePos;
		updateReadouts();
		drawMap();
		drawMousePos();
	}
	// else if (event.button === 2){
	// 	event.preventDefault();
	// 	globalOrigin = null;
	// 	mousePos = null;
	// 	updateReadouts();
	// 	drawMap();
	// 	drawMousePos();
	// }
}

document.addEventListener('DOMContentLoaded', setUp);
