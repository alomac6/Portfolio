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
        closeButton.style.display='flex';
        overlay.style.display='block';
    }
    function closeMenu(){
        navbar.classList.remove('side-menu');
        openButton.style.display='flex';
        closeButton.style.display='none';
    }
    const themeButton = document.querySelector('.themeChange');
    const htmlElement = document.documentElement;
    function applyTheme(theme) {
    const lightIcon = document.getElementById('sun');
    const darkIcon = document.getElementById('eclipse');
    localStorage.getItem('theme');
    const validTheme = theme === 'dark' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', validTheme);
    localStorage.setItem('theme', validTheme);
         if(validTheme==='dark'){
            lightIcon.style.display = 'flex';
            darkIcon.style.display = 'none';
        }
        else{
            lightIcon.style.display = 'none';
            darkIcon.style.display = 'flex';
        }
    }
    function themeSwitch() {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    }
    applyTheme(localStorage.getItem('theme'));
    themeButton.addEventListener('click', themeSwitch);
    openButton.addEventListener('click', openMenu);
    closeButton.addEventListener('click', closeMenu);
    main.addEventListener('click', closeMenu);
    links.addEventListener('click', closeMenu);
})

