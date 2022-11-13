const letter_t = () => {
	return {
		instructions:[
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.2, y: 0.9}, {x: 0.35, y: 0.7}, {x: 0.3, y: 0.1}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.3, y: 0.1}, {x: 0.25, y: 0.95}, {x: 0.4, y: 0.9}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				lineTo(ctx, {x: 0.1, y: 0.32}, {x: 0.45, y: 0.28}, scale, penPos);
			},
		],
		penStart: {x: 0.2, y: 0.9},
		penEnd: {x: 0.4, y: 0.9},
		join: true
	}
}

const letter_h = () => {
	return {
		instructions:[
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.1, y: 0.8}, {x: 0.2, y: 0.5}, {x: 0.25, y: 0.1}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				lineTo(ctx, {x: 0.25, y: 0.1}, {x: 0.2, y: 0.9}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.2, y: 0.9}, {x: 0.2, y: 0.5}, {x: 0.35, y: 0.5}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.35, y: 0.5}, {x: 0.55, y: 0.5}, {x: 0.55, y: 0.9}, scale, penPos);
			},
		],
		penStart: {x: 0.1, y: 0.8},
		penEnd: {x: 0.55, y: 0.9},
		join: true
	}
}

const letter_e = () => {
	return {
		instructions:[
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.1, y: 0.7}, {x: 0.5, y: 0.75}, {x: 0.4, y: 0.55}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				bezierTo(ctx, {x: 0.4, y: 0.55}, {x: 0.2, y: 0.3}, {x: 0.05, y: 0.7}, {x: 0.15, y: 0.8}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.15, y: 0.8}, {x: 0.25, y: 1.1}, {x: 0.4, y: 0.85}, scale, penPos);
			},
		],
		penStart: {x: 0.1, y: 0.7},
		penEnd: {x: 0.4, y: 0.85},
		join: true
	}
}

const letter_T = () => {
	return {
		instructions:[
			(ctx, penPos, scale) => {
				lineTo(ctx, {x: 0.1, y: 0.12}, {x: 0.6, y: 0.08}, scale, penPos);
				
			},
			(ctx, penPos, scale) => {
				lineTo(ctx, {x: 0.35, y: 0.1}, {x: 0.35, y: 0.9}, scale, penPos);
				
			},
		],
		penStart: {x: 0.1, y: 0.1},
		penEnd: {x: 0.6, y: 0.9},
		join: false
	}
}