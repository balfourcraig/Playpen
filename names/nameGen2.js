function printNames(numToPrint, append){
	const nameList = document.getElementById('nameList');
	const genderFilter = document.getElementById('genderSelect').value;
	const warnings = document.getElementById('warnings');
	warnings.innerHTML = '';
	let nameFunc;
	const allNameFuncs = [latinName, germanicName, maoriName];
	switch(document.getElementById('cultureSelect').value){
		case 'latin':
			nameFunc = latinName;
			break;
		case 'germanic':
			nameFunc = germanicName;
			break;
		case 'maori':
			nameFunc = maoriName;
			warnings.innerText = 'Notice: No distinction between Maori M and F names';
			break;
		case 'any':
			nameFunc = (gender) => {
				return allNameFuncs[getRandomInt(0, allNameFuncs.length-1)](gender);
			};
			break;
		default:
			nameFunc = (x) => console.log('Unknown culture');
	}
	
	if(!append){
		nameList.innerHTML = '';
	}
	const table = document.createElement('table');
	
	const headerRow = document.createElement('tr');
	const headings = ['Name','Culture','Gender'];
	for(let i = 0; i < headings.length; i++){
		const h = document.createElement('th');
		h.innerText = headings[i];
		headerRow.appendChild(h);
	}
	table.appendChild(headerRow);
	
	for(let i = 0; i < numToPrint; i++){
		const row = document.createElement('tr');
		
		const item = document.createElement('td');
		let gender = genderFilter;
		if(gender === 'MF')
			gender = Math.random() > 0.5 ? 'M' : 'F';
		
		const gen = nameFunc(gender);
		item.innerHTML = gen.value;
		row.setAttribute('class', 'gender' + gen.gender);
		row.appendChild(item);
		
		const cultureItem = document.createElement('td');
		cultureItem.innerText = gen.culture;
		row.appendChild(cultureItem);

		const genderItem = document.createElement('td');
		genderItem.innerText = gen.gender;
		row.appendChild(genderItem);

		table.appendChild(row);
	}
	nameList.appendChild(table);
	const moreBtn = document.createElement('button');
	moreBtn.innerText = '10 more...';
	moreBtn.addEventListener('click', () => {
		printNames(15, true);
		moreBtn.parentElement.removeChild(moreBtn);
	});
	nameList.appendChild(moreBtn);
}

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('genBtn').addEventListener('click',() => {
		const numToPrint = parseInt(document.getElementById('numNamesInput').value);
		printNames(numToPrint, false);
	});
});