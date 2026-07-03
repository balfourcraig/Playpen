
function highlightImage(image){
    let highlightBlock = document.createElement('div');
    highlightBlock.classList.add('imageBlocker');

    let bigImg = document.createElement('img');
    bigImg.src = image.src;

    highlightBlock.appendChild(bigImg);

    highlightBlock.addEventListener('click', () => {
        document.body.removeChild(highlightBlock);
    });
    
    document.body.appendChild(highlightBlock);
}

window.addEventListener('DOMContentLoaded', () => {
	let images = document.querySelectorAll('.imageGallery .imageBlock img');
    for(let i of images){
        i.addEventListener('click', () => highlightImage(i))
    }
});