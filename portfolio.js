document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const overlay = document.querySelector('.overlay');
    const navbarOpen = document.querySelector('.navbarOpen');
    const header = document.querySelector('header');
    const about = document.querySelector('.about');
    const backgroundSquaresContainer = document.getElementById("background-squares");
    const assemblyTargetElement = document.querySelector(".ProjectShowcase");
    const mainElement = document.querySelector("main");

    let allSpans = [];
    if (navbarOpen) {
        allSpans = navbarOpen.querySelectorAll('span');
    } else {
        console.warn("Element '.navbarOpen' not found.");
    }

    function openMenu() {
        if (navbarOpen) navbarOpen.classList.remove('close');
        if (navbarOpen) navbarOpen.classList.add('open');
        if (navbar) navbar.classList.add('side-menu');
        if (overlay) overlay.style.display = 'block';
        if (header) setTimeout(() => { header.style.zIndex = '40'; }, 100);
    }

    function closeMenu() {
        if (navbarOpen) navbarOpen.classList.remove('open');
        if (navbarOpen) navbarOpen.classList.add('close');
        if (navbar) navbar.classList.remove('side-menu');
    }

    function About() {
        if (about) {
            about.classList.add('appear');
        } else {
            console.warn("Element '.about' for About() function not found.");
        }
    }

    function Menu() {
        if (navbarOpen && navbarOpen.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    const themeButton = document.querySelector('.themeChange');
    const htmlElement = document.documentElement;

    function applyTheme(theme) {
        const lightIcon = document.getElementById('sun');
        const darkIcon = document.getElementById('eclipse');
        const currentTheme = localStorage.getItem('theme');
        const validTheme = theme || currentTheme || 'dark';
        htmlElement.setAttribute('data-theme', validTheme);
        localStorage.setItem('theme', validTheme);
        if (lightIcon && darkIcon) {
            if (validTheme === 'dark') {
                lightIcon.style.display = 'flex';
                darkIcon.style.display = 'none';
            } else {
                lightIcon.style.display = 'none';
                darkIcon.style.display = 'flex';
            }
        }
    }

    function hoverNavbarOpen() {
        if (allSpans) allSpans.forEach(s => s.classList.add('hovered'));
    }
    function nothoverNavbarOpen() {
        if (allSpans) allSpans.forEach(s => s.classList.remove('hovered'));
    }
    function themeSwitch() {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(currentTheme === 'light' ? 'dark' : 'light');
    }

    gsap.registerPlugin(ScrollTrigger);

    let finalAssemblyPosition = { x: 0, y: 0, width: 0, height: 0 }; // To store assembly details

    function SquaresForm() {
        if (!backgroundSquaresContainer || !mainElement) {
            console.error("Required elements for SquaresForm not found.");
            return;
        }
        backgroundSquaresContainer.innerHTML = '';
        const shapes = [];
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const mainRect = mainElement.getBoundingClientRect();
        const headerRect = header ? header.getBoundingClientRect() : { top: -1, left: -1, right: -1, bottom: -1, width: 0, height: 0 };

        let targetRectDims;
        if (assemblyTargetElement) {
            const currentTargetRect = assemblyTargetElement.getBoundingClientRect();
            targetRectDims = { width: currentTargetRect.width, height: currentTargetRect.height };
            finalAssemblyPosition.width = targetRectDims.width; // Store for sticking logic
            finalAssemblyPosition.height = targetRectDims.height; // Store for sticking logic
        } else {
            console.warn("Assembly target element (.ProjectShowcase) not found. Using fallback dimensions.");
            targetRectDims = { width: viewportWidth * 0.5, height: viewportHeight * 0.3 };
            finalAssemblyPosition.width = targetRectDims.width;
            finalAssemblyPosition.height = targetRectDims.height;
        }
        
        finalAssemblyPosition.x = (viewportWidth / 2) - (finalAssemblyPosition.width / 2);
        finalAssemblyPosition.y = (viewportHeight / 2) - (finalAssemblyPosition.height / 2);

        let individualSquareSize = Math.min(finalAssemblyPosition.width / 6, finalAssemblyPosition.height / 4);
        individualSquareSize = Math.max(15, Math.min(50, individualSquareSize));

        const numCols = Math.max(1, Math.floor(finalAssemblyPosition.width / individualSquareSize));
        const numRows = Math.max(1, Math.floor(finalAssemblyPosition.height / individualSquareSize));
        const totalSquares = numCols * numRows;

        if (totalSquares === 0 || !isFinite(numCols) || !isFinite(numRows)) {
            console.warn("Calculated totalSquares is 0 or grid dimensions are invalid.");
            return;
        }
        const actualSquareSize = individualSquareSize;
        const assembledGridWidth = numCols * actualSquareSize;
        const assembledGridHeight = numRows * actualSquareSize;
        const gridCenteringX = (finalAssemblyPosition.width - assembledGridWidth) / 2;
        const gridCenteringY = (finalAssemblyPosition.height - assembledGridHeight) / 2;

        for (let i = 0; i < totalSquares; i++) {
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("class", "bg-small-square");
            svg.setAttribute("width", actualSquareSize);
            svg.setAttribute("height", actualSquareSize);
            svg.setAttribute("viewBox", `0 0 ${actualSquareSize} ${actualSquareSize}`);
            const rect = document.createElementNS(svgNS, "rect");
            rect.setAttribute("width", actualSquareSize);
            rect.setAttribute("height", actualSquareSize);
            rect.setAttribute("x", 0); rect.setAttribute("y", 0);
            svg.appendChild(rect);
            backgroundSquaresContainer.appendChild(svg);
            shapes.push(svg);

            let initialX, initialY, attempts = 0;
            let positionIsValid = false;
            const maxAttempts = 50;
            while (!positionIsValid && attempts < maxAttempts) {
                const spawnSidePadding = actualSquareSize * 0.5;
                const leftSpawnRegionWidth = Math.max(0, mainRect.left - spawnSidePadding - actualSquareSize);
                const rightSpawnRegionStart = mainRect.right + spawnSidePadding;
                const rightSpawnRegionWidth = Math.max(0, viewportWidth - rightSpawnRegionStart - actualSquareSize);
                if (Math.random() < 0.5) {
                    initialX = (leftSpawnRegionWidth > 0) ? Math.random() * leftSpawnRegionWidth : 
                               (rightSpawnRegionWidth > 0) ? rightSpawnRegionStart + (Math.random() * rightSpawnRegionWidth) :
                               Math.random() * (viewportWidth - actualSquareSize);
                } else {
                    initialX = (rightSpawnRegionWidth > 0) ? rightSpawnRegionStart + (Math.random() * rightSpawnRegionWidth) :
                               (leftSpawnRegionWidth > 0) ? Math.random() * leftSpawnRegionWidth :
                               Math.random() * (viewportWidth - actualSquareSize);
                }
                initialY = Math.random() * (viewportHeight - actualSquareSize);
                initialX = Math.max(0, Math.min(initialX, viewportWidth - actualSquareSize));
                initialY = Math.max(0, Math.min(initialY, viewportHeight - actualSquareSize));
                const sT = initialY, sB = initialY + actualSquareSize, sL = initialX, sR = initialX + actualSquareSize;
                if (header && headerRect.height > 0 && !(sR < headerRect.left || sL > headerRect.right || sB < headerRect.top || sT > headerRect.bottom)) {
                    attempts++;
                } else {
                    positionIsValid = true;
                }
            }
            if (!positionIsValid) {
                 initialX = Math.random() * (viewportWidth - actualSquareSize);
                 initialY = Math.random() * (viewportHeight - actualSquareSize);
            }
            gsap.set(svg, { x: initialX, y: initialY, rotation: Math.random() * 360 - 180, scale: 0.3 + Math.random() * 0.5, opacity: 1, transformOrigin: "50% 50%" });
        }

        if (assemblyTargetElement) {
            const assemblyTl = gsap.timeline({
                scrollTrigger: {
                    trigger: assemblyTargetElement,
                    start: "top bottom-=150px",
                    end: "center center",
                    scrub: 1.8,
                }
            });
            shapes.forEach((shape, index) => {
                const targetCol = index % numCols;
                const targetRow = Math.floor(index / numCols);
                const finalX = finalAssemblyPosition.x + gridCenteringX + (targetCol * actualSquareSize);
                const finalY = finalAssemblyPosition.y + gridCenteringY + (targetRow * actualSquareSize);
                assemblyTl.to(shape, { x: finalX, y: finalY, rotation: 0, scale: 1, ease: "power2.out", duration: 2.5 }, 0);
            });
        }
    }

    applyTheme(localStorage.getItem('theme'));
    About();
    SquaresForm();

    if (assemblyTargetElement && backgroundSquaresContainer) {
        ScrollTrigger.create({
            trigger: assemblyTargetElement,
            start: "center center", 
            endTrigger: "html",
            end: "bottom top", 
            onUpdate: self => {
                const targetRect = assemblyTargetElement.getBoundingClientRect();
                const deltaX = targetRect.left - finalAssemblyPosition.x;
                const deltaY = targetRect.top - finalAssemblyPosition.y;
                gsap.set(backgroundSquaresContainer, { x: deltaX, y: deltaY });
            },
            onLeave: () => { gsap.set(backgroundSquaresContainer, { x: 0, y: 0 }); },
            onEnterBack: self => {
                const targetRect = assemblyTargetElement.getBoundingClientRect();
                const deltaX = targetRect.left - finalAssemblyPosition.x;
                const deltaY = targetRect.top - finalAssemblyPosition.y;
                gsap.set(backgroundSquaresContainer, { x: deltaX, y: deltaY });
            },
        });
    }

    if (themeButton) themeButton.addEventListener('click', themeSwitch);
    if (navbarOpen) {
        navbarOpen.addEventListener('click', Menu);
        navbarOpen.addEventListener('mouseenter', hoverNavbarOpen);
        navbarOpen.addEventListener('mouseleave', nothoverNavbarOpen);
    }
});
