function drawKaleidoscope(backCtx, ctx, x, y, w, h, center){
	segments = parseFloat(document.getElementById('segmentsInput').value);
	const imgData = backCtx.getImageData(x, y, w, h);
	const destImgDate = ctx.createImageData(w,h);
	for(let row = 0; row < h; row++){
		for(let col = 0; col < w; col++){
			const destOffset = (row * w + col) * 4;
			const srcPoint = translatePoint({x: col, y: row});
			const srcOffset = ((~~srcPoint.y * w + ~~srcPoint.x)) * 4;

			destImgDate.data[destOffset + 0] = imgData.data[srcOffset + 0];
			destImgDate.data[destOffset + 1] = imgData.data[srcOffset + 1];
			destImgDate.data[destOffset + 2] = imgData.data[srcOffset + 2];
			destImgDate.data[destOffset + 3] = 255;
		}
	}
	ctx.putImageData(destImgDate, x, y);
	
	function translatePoint(p){
		let dist = distance(p, center);
		if(dist > center.x){
			const diff = dist - center.x;
			dist -= (diff * 2);
		}
			
		let angle = angleBetweenPoints(p.x, p.y, center.x, center.y);
		if(angle < 0)
			angle = Math.abs(angle);
		const mappedAngle = (angle / (Math.PI * 2)) * segments;
		let angleProgression = mappedAngle - (~~mappedAngle);
		if(angleProgression > 0.5)
			angleProgression = 1-angleProgression;
		const srcAngle = ((angleProgression/segments) * Math.PI * 2);
		
		let srcPoint = {
			x: center.x + (Math.cos(srcAngle) * dist),
			y: center.y + (Math.sin(srcAngle) * dist)
		};
		return srcPoint;
	}
	
	function angleBetweenPoints(x1, y1, x2, y2){
		return Math.atan2(x1-x2,y1-y2);
	}
}

let ripplePos = 0;
function filterRipple(ctx, x, y, w, h, choppiness){
	const srcData = ctx.getImageData(x, y, w, h);
	const destData = ctx.createImageData(w, h);
	
	for(let row = 0; row < h; row++){
		for(let col = 0; col < w; col++){
			const destOffset = (row * w + col) * 4;
			let lightness = 1;//(row/h + 0.3);
			
			let shiftedRow = 0;
			let shiftedCol = 0;
			
			if(choppiness === 0){
				shiftedRow = row;
				shiftedCol = col;
			}
			else{
				let colShift = row/h;
				colShift = 
					Math.cos((colShift + ripplePos) * 50) 
					+ (Math.cos((colShift + (1-ripplePos) * 0.3 ) * 300) * 0.2)
					+ Math.sin((colShift + (1-ripplePos)) * 50 * 1.5);
				colShift += 0.5;
				colShift *= 10;
				//colShift *= (1 - row/h + 0.1) * 2;
				colShift *= choppiness;
				colShift = ~~colShift;
				
				let rowShift = col/w;
				rowShift =
					Math.cos((rowShift + ripplePos) * 70)
					+ (Math.cos((rowShift + (ripplePos)) * 120) * 0.3)
					+ (Math.cos((rowShift + (1-ripplePos)) * 90) * 0.5);
				rowShift + 0.5;
				rowShift *= 2;
				//rowShift *= (1 - row/h + 0.1) * 2;
				rowShift *= choppiness;
				rowShift = ~~rowShift;

				shiftedRow = row + rowShift;
				shiftedCol = col + colShift;
				
				if(shiftedRow >= h)
					shiftedRow -= (shiftedRow - h) * 2;
				else if(shiftedRow <= 0)
					shiftedRow = Math.abs(shiftedRow);
				if(shiftedCol >= w)
					shiftedCol -= (shiftedCol - w) * 2;
				else if(shiftedCol <= 0)
					shiftedCol = Math.abs(shiftedCol);
			}
			const srcOffset = (shiftedRow * w + shiftedCol) * 4;
			destData.data[destOffset] = 0.7 * lightness * srcData.data[srcOffset];
			destData.data[destOffset + 1] = lightness * srcData.data[srcOffset + 1];
			destData.data[destOffset + 2] = 1.2 * lightness * srcData.data[srcOffset + 2];
			destData.data[destOffset + 3] = 255;
		}
	}
	ripplePos = (ripplePos + 0.002) % 1;
	ctx.putImageData(destData, x, y); 
}

function filterVHS(ctx, x, y, w, h, strength){
	if(strength){
		const srcVHSData = ctx.getImageData(x, y, w, h);
		const destVHSData = ctx.createImageData(w, h);
		for(let row = 0; row < h; row++){
			for(let col = 0; col < w; col++){
				const destOffset = (row * w + col) * 4;
				
				const rOffset = (row * w + (col - strength)) * 4;
				const gOffset = (row * w + (col)) * 4;
				const bOffset = (row * w + (col + strength)) * 4;
				
				destVHSData.data[destOffset] = srcVHSData.data[rOffset];
				destVHSData.data[destOffset + 1] = srcVHSData.data[gOffset + 1];
				destVHSData.data[destOffset + 2] = srcVHSData.data[bOffset + 2];
				destVHSData.data[destOffset + 3] = 255;
			}
		}
		ctx.putImageData(destVHSData, 0, 0);
	}
}

function filterVignette(ctx, x, y, w, h, strength){
	if(strength){
		const vignetteGrad = ctx.createRadialGradient(w/2, h/2, w/4, w/2, h/2, w/2);
		vignetteGrad.addColorStop(0, 'transparent');
		vignetteGrad.addColorStop(1, 'rgba(0,0,0,' + strength + ')');
		ctx.fillStyle = vignetteGrad;
		ctx.fillRect(x,y,w,h);
	}
}