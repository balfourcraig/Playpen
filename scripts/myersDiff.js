let downVector = [];
let upVector = [];
let dataA;
let dataB;


function diffText(a, b){
	dataA = makeDiffData(a);
	dataB = makeDiffData(b);
	
	const MAX = dataA.length + dataB.length + 1;
	downVector = [];
	upVector = [];
	for(let i = 0; i < MAX; i++){
		downVector[i] = 0;
		upVector[i] = 0;
	}

	LCS(0, dataA.length, 0, dataB.length);
	
	console.log(upVector);
	console.log(downVector);
	
	return createDiffs(dataA, dataB);
}

function createDiffs(){
	console.log(dataA);
	console.log(dataB);
	
	const itemList = [];
	
	let lineA = 0;
	let lineB = 0;
	
	while(lineA < dataA.length || lineB < dataB.length){
		if((lineA < dataA.length) && (!dataA.modified[lineA]) && (lineB < dataB.length && (!dataB.modified[lineB]))){
			lineA++;
			lineB++;
		}
		else{
			const startA = lineA;
			const startB = lineB;
			
			while (lineA < dataA.length && (lineB >= dataB.length || dataA.modified[lineA]))
				lineA++;
			
			while (lineB < dataB.length && (lineA >= dataA.length || dataB.modified[lineB]))
				lineB++;
			
			if((startA < lineA) || (startB < lineB)){
				itemList.push({
					startA: startA,
					startB: startB,
					deletedA: lineA - startA,
					insertedB: lineB - startB
				})
			}
		}
	}
	return itemList;
}

function makeDiffData(initData){
	const mod = [];
	for(let i = 0; i < initData.length + 2; i++){
		mod[i] = false;
	}
	return {length: initData.length, data: initData, modified: mod};
}

function LCS(lowerA, upperA, lowerB, upperB){
	// Fast walkthrough equal lines at the start
	while (lowerA < upperA && lowerB < upperB && dataA.data[lowerA] == dataB.data[lowerB]) {
		lowerA++;
		lowerB++;
	}
	
	// Fast walkthrough equal lines at the end
	while (lowerA < upperA && lowerB < upperB && dataA.data[upperA - 1] == dataB.data[upperB - 1]) {
		--upperA;
		--upperB;
	}
	
	if (lowerA == upperA) {
		// mark as inserted lines.
		while (lowerB < upperB)
			dataB.modified[lowerB++] = true;

	}
	else if (lowerB == upperB) {
		// mark as deleted lines.
		while (lowerA < upperA)
			dataA.modified[lowerA++] = true;
	}
	else {
		// Find the middle snakea and length of an optimal path for A and B
		const smsrd = SMS(lowerA, upperA, lowerB, upperB);
		// Debug.Write(2, "MiddleSnakeData", String.Format("{0},{1}", smsrd.x, smsrd.y));

		// The path is from LowerX to (x,y) and (x,y) to UpperX
		LCS(lowerA, smsrd.x, lowerB, smsrd.y);
		LCS(smsrd.x, upperA, smsrd.y, upperB);
	}
}

function SMS(lowerA, upperA, lowerB, upperB){
	const ret = {x: 0, y: 0};
	
	const max = dataA.length + dataB.length + 1;
	
	const downK = lowerA - lowerB;
	const upK = upperA - upperB;
	
	const delta = (upperA - lowerA) - (upperB - lowerB);
	const oddDelta = (delta & 1) != 0;
	
	const downOffset = max - downK;
	const upOffset = max - upK;
	const maxD = ((upperA - lowerA + upperB - lowerB) / 2) + 1;
	
	downVector[downOffset + downK + 1] = lowerA;
	upVector[upOffset + upK - 1] = upperA;
	
	for(let d = 0; d <= maxD; d++){
		for(let k = downK - d; k <= downK + d; k += 2){
			let x = 0;
			let y = 0;
			
			if(k == downK - d){
				x = downVector[downOffset + k + 1];//down
			}
			else{
				x = downVector[downOffset + k -1] + 1;//step to the right
				if((x < downK + d) && (downVector[downOffset + k + 1] >= x)){
					x = downVector[downOffset + k + 1];//down
				}
			}
			y = x - k;
			
			// find the end of the furthest reaching forward D-path in diagonal k.
			while ((x < upperA) && (y < upperB) && dataA.data[x] == dataB.data[y]) {
				x++;
				y++;
			}
			downVector[downOffset + 1] = x;
			
			//overlap?
			if(oddDelta && (upK - d < k) && (k < upK + d)){
				if(upVector[upOffset + k] <= downVector[downOffset + k]){
					ret.x = downVector[downOffset + k];
					ret.y = downVector[downOffset + k] - k;
					console.log("FIRST");
					console.log(ret);
					return ret;
				}
			}
		}
		
		//extend the reverse path
		for(let k = upK - d; k <= upK + d; k += 2){
			let x = 0;
			let y = 0;
			
			if(k == upK + d){
				x = upVector[upOffset + k -1];//up
			}
			else{
				x = upVector[upOffset + k + 1];//left
				if((k > upK -d) && (upVector[upOffset + k - 1] < x)){
					x = upVector[upOffset + k -1];
				}
			}
			y = x - k;
			
			while((x > lowerA) && (y > lowerB) && dataA.data[x-1] == dataB.data[y-1]){
				x--;
				y--;
			}
			upVector[upOffset + k] = x;
			
			//overlap?
			if(!oddDelta && (downK - d <= k) && (k <= downK + d)){
				if(upVector[upOffset + k] <= downVector[downOffset + k]){
					ret.x = downVector[downOffset + k];
					ret.y = downVector[downOffset + k] - k;
					console.log("SECOND");
					console.log(ret);
					return ret;
				}
			}
		}
	}
	
	console.log(downVector);
	console.log(upVector);
	
	alert('oh no');
}