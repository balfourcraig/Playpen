const buildLinked = (line) => {
	linkedLex(line);
}

const joinLetters = (ctx, start, end, scale, penPos) => {
	const halfX = (penPos.x + penPos.x + end.x * scale) / 2;
	const heightDiff = start.y - end.y;
	ctx.beginPath();
	ctx.moveTo(penPos.x, start.y * scale);
	//ctx.lineTo(penPos.x + end.x * scale, end.y * scale);
	//ctx.bezierCurveTo(halfX, start.y * scale, halfX, end.y * scale, penPos.x + end.x * scale, end.y * scale);
	ctx.quadraticCurveTo(halfX, (start.y * scale) * 1.1, penPos.x + end.x * scale, end.y * scale);
	
	ctx.strokeStyle = strokeJoinColor;
	ctx.stroke();
}

const lineTo = (ctx, start, end, scale, penPos) => {
	ctx.beginPath();
	ctx.moveTo(penPos.x + start.x * scale, start.y * scale);
	ctx.lineTo(penPos.x + end.x * scale, end.y * scale);
	const grad = ctx.createLinearGradient(penPos.x + start.x * scale, start.y * scale, penPos.x + end.x * scale, end.y * scale);
	grad.addColorStop(0, strokeStartColor);
	grad.addColorStop(1, strokeEndColor);
	ctx.strokeStyle = grad;
	ctx.stroke();
}

const quadraticTo = (ctx, start, control, end, scale, penPos) => {
	ctx.beginPath();
	ctx.moveTo(penPos.x + start.x * scale, start.y * scale);
	ctx.quadraticCurveTo(penPos.x + control.x * scale, control.y * scale, penPos.x + end.x * scale, end.y * scale);
	const grad = ctx.createLinearGradient(penPos.x + start.x * scale, start.y * scale, penPos.x + end.x * scale, end.y * scale);
	grad.addColorStop(0, strokeStartColor);
	grad.addColorStop(1, strokeEndColor);
	ctx.strokeStyle = grad;
	ctx.stroke();
}

const bezierTo = (ctx, start, control1, control2, end, scale, penPos) => {
	ctx.beginPath();
	ctx.moveTo(penPos.x + start.x * scale, start.y * scale);
	ctx.bezierCurveTo(penPos.x + control1.x * scale, control1.y * scale, penPos.x + control2.x * scale, control2.y * scale, penPos.x + end.x * scale, end.y * scale);
	const grad = ctx.createLinearGradient(penPos.x + start.x * scale, start.y * scale, penPos.x + end.x * scale, end.y * scale);
	grad.addColorStop(0, strokeStartColor);
	grad.addColorStop(1, strokeEndColor);
	ctx.strokeStyle = grad;
	ctx.stroke();
}

const circleAt = (ctx, center, radius, scale, penPos, color) => {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(penPos.x + center.x * scale, center.y * scale, radius * scale, 0, 2 * Math.PI);
	ctx.fill();
}

function drawCircle(ctx, center, radius, color){
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.fill();
}