document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const openButton = document.querySelector('.navbarOpen');
    const closeButton = document.querySelector('.navbarClose');
    const overlay = document.querySelector('.overlay');
    const main = document.querySelector('.main');
    const links = document.querySelectorAll('.menu a');
    function openMenu() {
        navbar.classList.add('side-menu');
        openButton.style.display='none';
        closeButton.style.display='block';
        overlay.style.display='block';
    }
    function closeMenu(){
        navbar.classList.remove('side-menu');
        openButton.style.display='block';
        closeButton.style.display='none';
    }
    openButton.addEventListener('click', openMenu);
    closeButton.addEventListener('click', closeMenu);
    main.addEventListener('click', closeMenu);
    links.addEventListener('click', closeMenu);
});

