let drawLayer = null;
let mapLayer = null;
let drawCtx = null;
let mapCtx = null;

let houseWidthMetres = 11.5;
let houseLengthMetres = 14;

let globablOffset = {x: 1, y: 1};
let globalOrigin = null;
let mousePos = null;

let w = 0;
let h = 0;

let scaleFactor = 1;

let currentHovered = [];
let hoverChanged = false;

function setUp(){
	drawLayer = document.getElementById('drawLayer');
	mapLayer = document.getElementById('mapLayer');
	w = document.getElementById('sizeCalc').getBoundingClientRect().width;
	h = w * (houseLengthMetres / houseWidthMetres);

	scaleFactor = w / houseWidthMetres;

	document.getElementById('sizeCalc').style.height = h + 'px';
	drawLayer.setAttribute('width', w);
	drawLayer.setAttribute('height', h);
	mapLayer.setAttribute('width', w);
	mapLayer.setAttribute('height', h);
	drawCtx = drawLayer.getContext('2d');
	mapCtx = mapLayer.getContext('2d');
	mapCtx.lineWidth = 2;
	mapCtx.lineCap = 'round';
	mapCtx.strokeStyle = 'blue';
	mapCtx.fillStyle = 'white';
	drawCtx.lineWidth = 2;
    drawMap();
	drawLayer.addEventListener('mousemove', mouseMove);
	document.addEventListener('keydown', keyDown);
	document.addEventListener('mousedown', mouseDown);
	// document.addEventListener('contextmenu', function(event) {
	// 	event.preventDefault();
	// });
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
	if(mousePos){
		drawCtx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
		drawCtx.clearRect(0, 0, w, h);
		drawCtx.beginPath();
		drawCtx.moveTo(mousePos.x, 0);
		drawCtx.lineTo(mousePos.x, h);
		drawCtx.moveTo(0, mousePos.y);
		drawCtx.lineTo(w, mousePos.y);
		drawCtx.stroke();
		drawCross(globalOrigin);
	}
	if(globalOrigin){
		drawCtx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
		drawCtx.beginPath();
		drawCtx.moveTo(globalOrigin.x, globalOrigin.y);
		drawCtx.lineTo(mousePos.x, mousePos.y);
		drawCtx.stroke();
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
	if(house){
		inRooms = pointInRoom(mousePosMapped, house);
		if(arraysEqual(inRooms, currentHovered)){
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

function drawRoom(room, baseOffset){
    mapCtx.beginPath();
    mapCtx.moveTo((room.points[0].x + baseOffset.x + room.offset.x) * scaleFactor, (room.points[0].y + baseOffset.y + room.offset.y) * scaleFactor);
    for(let i = 1; i < room.points.length; i++){
        mapCtx.lineTo((room.points[i].x + baseOffset.x + room.offset.x) * scaleFactor, (room.points[i].y + baseOffset.y + room.offset.y) * scaleFactor);
    }
    mapCtx.closePath();
    mapCtx.strokeStyle = room.color ? room.color : 'black';
	if(room.mouseOver){
		mapCtx.fillStyle = room.color ? room.color : 'black';
		mapCtx.globalAlpha = 0.1;
		mapCtx.fill();
		mapCtx.globalAlpha = 1;
	}
 	mapCtx.stroke();
	
	if(room.doors && room.doors.length > 0){
		for(let i = 0; i < room.doors.length; i++){
			let door = room.doors[i];
			let doorPos = {x: (door.position.x + baseOffset.x + room.offset.x) * scaleFactor, y: (door.position.y + baseOffset.y + room.offset.y) * scaleFactor};
			let doorWidth = door.width * scaleFactor;
			let doorAngle = door.angle;
			mapCtx.beginPath();
			mapCtx.moveTo(doorPos.x, doorPos.y);
			mapCtx.lineTo(doorPos.x + doorWidth * Math.cos(doorAngle * Math.PI / 180), doorPos.y + doorWidth * Math.sin(doorAngle * Math.PI / 180));
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
	const mousePosReadout = document.getElementById('mousePosReadout');
	const distanceReadout = document.getElementById('distanceReadout');
	const inRoomsReadout = document.getElementById('inRoomsReadout');
	const areaReadout = document.getElementById('areaReadout');

	if(mousePos){
		mouseInRooms();
		if(currentHovered.length > 0){
			inRoomsReadout.innerText = 'In rooms: ' + currentHovered.map((room) => room.name).join(', ');
			areaReadout.innerText = 'Area: ' + areaOfPolygon(currentHovered[0].points).toFixed(2) + 'm²';
		}
		else{
			inRoomsReadout.innerText = 'In rooms: -';
			areaReadout.innerText = 'Area: -';
		}
		if(hoverChanged){
			console.log("draw")
			drawMap();
		}
	}
	else{
		inRoomsReadout.innerText = 'In rooms: -';
	}

	if(mousePos && globalOrigin){
		const xDist = ((globalOrigin.x - mousePos.x) / scaleFactor);
		const yDist = ((globalOrigin.y - mousePos.y) / scaleFactor);
		mousePosReadout.innerText = 'X: ' + xDist.toFixed(2) + 'm, Y: ' + yDist.toFixed(2) + 'm';

		const distance = Math.sqrt(xDist * xDist + yDist * yDist);
		distanceReadout.innerText = 'Distance: ' + distance.toFixed(2) + 'm';

		
	}
	else{
		mousePosReadout.innerText = 'X: -, Y: -';
		distanceReadout.innerText = 'Distance: -';
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
		mousePos = null;
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
