// LIGHTBOX
document.querySelectorAll('.lightbox').forEach(img => {
    img.addEventListener('click', () => {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '0';
        popup.style.left = '0';
        popup.style.width = '100%';
        popup.style.height = '100%';
        popup.style.background = 'rgba(0,0,0,0.8)';
        popup.style.display = 'flex';
        popup.style.justifyContent = 'center';
        popup.style.alignItems = 'center';
        popup.style.cursor = 'pointer';
        const popImg = document.createElement('img');
        popImg.src = img.src;
        popImg.style.maxWidth = '80%';
        popImg.style.maxHeight = '80%';
        popup.appendChild(popImg);
        document.body.appendChild(popup);
        popup.addEventListener('click', () => popup.remove());
    });
});