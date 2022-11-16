const letter_a = () => {
	return {
		instructions:[
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.05, y: 0.75}, {x: 0.15, y: 0.55}, {x: 0.4, y: 0.6}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				bezierTo(ctx, {x: 0.4, y: 0.6}, {x: -0.1, y: 0.7}, {x: 0.3, y: 1}, {x: 0.45, y: 0.8}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.45, y: 0.8}, {x: 0.5, y: 0.3}, {x: 0.2, y: 0.5}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				bezierTo(ctx, {x: 0.2, y: 0.5}, {x: 0.7, y: 0.2}, {x: 0.25, y: 1.2}, {x: 0.55, y: 0.8}, scale, penPos);
			},
		],
		penStart: {x: 0.05, y: 0.75},
		penEnd: {x: 0.55, y: 0.8},
		widthOveride: 0,
		join: true
	}
}

const letter_b = () => {
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
				bezierTo(ctx, {x: 0.35, y: 0.5}, {x: 0.55, y: 0.5}, {x: 0.55, y: 0.9}, {x: 0.15, y: 0.9}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				lineTo(ctx, {x: 0.15, y: 0.9}, {x: 0.45, y: 0.88}, scale, penPos);
			},
		],
		penStart: {x: 0.1, y: 0.8},
		penEnd: {x: 0.45, y: 0.88},
		join: true
	}
}

const letter_c = () => {
	return {
		instructions:[
			(ctx, penPos, scale) => {
				bezierTo(ctx, {x: 0.1, y: 0.9}, {x: 0.2, y: 0.8}, {x: 0.25, y: 0.45}, {x: 0.6, y: 0.55}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				bezierTo(ctx, {x: 0.6, y: 0.55}, {x: 0.25, y: 0.45}, {x: 0.1, y: 1.0}, {x: 0.6, y: 0.9}, scale, penPos);
			},
		],
		penStart: {x: 0.1, y: 0.9},
		penEnd: {x: 0.6, y: 0.9},
		join: true
	}
}

const letter_d = () => {
	return {
		instructions:[
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.05, y: 0.75}, {x: 0.15, y: 0.55}, {x: 0.4, y: 0.6}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				bezierTo(ctx, {x: 0.4, y: 0.6}, {x: -0.1, y: 0.7}, {x: 0.3, y: 1}, {x: 0.4, y: 0.8}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.4, y: 0.8}, {x: 0.55, y: 0.7}, {x: 0.5, y: 0.1}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.5, y: 0.1}, {x: 0.35, y: 0.95}, {x: 0.6, y: 0.9}, scale, penPos);
			},
		],
		penStart: {x: 0.05, y: 0.75},
		penEnd: {x: 0.6, y: 0.9},
		widthOveride: 0,
		join: true
	}
}

const letter_e = () => {
	return {
		instructions:[
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.1, y: 0.8}, {x: 0.5, y: 0.75}, {x: 0.4, y: 0.55}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				bezierTo(ctx, {x: 0.4, y: 0.55}, {x: 0.2, y: 0.4}, {x: 0.05, y: 0.7}, {x: 0.15, y: 0.8}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.15, y: 0.8}, {x: 0.25, y: 1.1}, {x: 0.4, y: 0.85}, scale, penPos);
			},
		],
		penStart: {x: 0.1, y: 0.8},
		penEnd: {x: 0.4, y: 0.85},
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

const letter_i = () => {
	return {
		instructions:[
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.1, y: 0.9}, {x: 0.25, y: 0.7}, {x: 0.2, y: 0.5}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.2, y: 0.5}, {x: 0.15, y: 0.95}, {x: 0.3, y: 0.9}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				circleAt(ctx, {x: 0.2, y: 0.35}, 0.03, scale, penPos, strokeStartColor);
			},
		],
		penStart: {x: 0.1, y: 0.9},
		penEnd: {x: 0.3, y: 0.9},
		join: true
	}
}

const letter_l = () => {
	return {
		instructions:[
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.2, y: 0.9}, {x: 0.35, y: 0.7}, {x: 0.3, y: 0.1}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				quadraticTo(ctx, {x: 0.3, y: 0.1}, {x: 0.25, y: 0.95}, {x: 0.4, y: 0.9}, scale, penPos);
			},
		],
		penStart: {x: 0.2, y: 0.9},
		penEnd: {x: 0.4, y: 0.9},
		join: true
	}
}

const letter_o = () => {
	return {
		instructions:[
			(ctx, penPos, scale) => {
				lineTo(ctx, {x: 0.1, y: 0.55}, {x: 0.25, y: 0.5}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				bezierTo(ctx, {x: 0.25, y: 0.5}, {x: 0.0, y: 0.55}, {x: 0.0, y: 0.9}, {x: 0.3, y: 0.9}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				bezierTo(ctx, {x: 0.3, y: 0.9}, {x: 0.55, y: 0.9}, {x: 0.55, y: 0.55}, {x: 0.35, y: 0.5}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				lineTo(ctx, {x: 0.35, y: 0.5}, {x: 0.5, y: 0.55}, scale, penPos);
			},
		],
		penStart: {x: 0.1, y: 0.55},
		penEnd: {x: 0.5, y: 0.55},
		join: true
	}
}

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

const letter_unknown = () => {
	return {
		instructions:[
			(ctx, penPos, scale) => {
				lineTo(ctx, {x: 0.1, y: 0.9}, {x: 0.5, y: 0.1}, scale, penPos);
			},
			(ctx, penPos, scale) => {
				lineTo(ctx, {x: 0.1, y: 0.1}, {x: 0.5, y: 0.9}, scale, penPos);
			},
		],
		penStart: {x: 0.1, y: 0.9},
		penEnd: {x: 0.5, y: 0.9},
		join: true
	}
}