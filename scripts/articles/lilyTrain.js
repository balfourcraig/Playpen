function showText(textToShow){
	document.body.innerHTML = "<h1>" + textToShow + "</h1>";
}

document.addEventListener('DOMContentLoaded', () => {//Wait till the DOM has finished loading or body is null
    showText("Hello world");
});