function get(id)
{
	return document.getElementById(id);
}

function setUpCSSSelect()
{
	swap();
	get('CSSSelectArea').removeAttribute('style');
	const cssSelect = get('CSSSelect');
	cssSelect.addEventListener('change', swap);
	
	function swap(){
		const val = get('CSSSelect').value
		get('styleSwap').setAttribute('href', val + '.css');
	}
}

document.addEventListener('DOMContentLoaded', (e) =>
{
	setUpCSSSelect();
}
);
