document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const overlay = document.querySelector('.overlay');
    const links = document.querySelectorAll('.menu a');
    const navbarOpen = document.querySelector('.navbarOpen');
    let allSpans = [];
    allSpans = navbarOpen.querySelectorAll('span');
    function openMenu() {
        navbarOpen.classList.remove('close')
        navbarOpen.classList.add('open');
        navbar.classList.add('side-menu');
        overlay.style.display='block';
    }
    function closeMenu(){
        navbarOpen.classList.remove('open')
        navbarOpen.classList.add('close');
        navbar.classList.remove('side-menu');
    }
    function Menu(){
        if (navbarOpen.className === 'navbarOpen open'){
            closeMenu();
        }
        else{
            openMenu();
        }
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
    function hoverNavbarOpen(){
        allSpans.forEach(currentSpan => {
            currentSpan.classList.add('hovered');
        });
    }
    function nothoverNavbarOpen(){
        allSpans.forEach(currentSpan => {
            currentSpan.classList.remove('hovered');
        });
    }
    function themeSwitch() {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    }
    applyTheme(localStorage.getItem('theme'));
    themeButton.addEventListener('click', themeSwitch);
    navbarOpen.addEventListener('click', Menu);
    navbarOpen.addEventListener('mouseenter', hoverNavbarOpen);
    navbarOpen.addEventListener('mouseleave', nothoverNavbarOpen);
})

