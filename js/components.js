/**
 * Bee Digital - Global Components Loader
 * Handles dynamic fetching of header and footer, active navigation states, and header scroll effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Components
    loadComponent('site-header', 'components/header.html', () => {
        initNavigation();
        initScrollBehavior();
        initMobileMenu();
    });

    loadComponent('site-footer', 'components/footer.html');

    // 2. Load Contact Modal globally
    let modalContainer = document.getElementById('site-modal');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'site-modal';
        document.body.appendChild(modalContainer);
    }
    loadComponent('site-modal', 'components/contact-modal.html', () => {
        // Initialize modal logic after it's loaded into the DOM
        if (typeof window.initContactModal === 'function') {
            window.initContactModal();
        }
    });

    // 3. Initialize Playful Floating Brand Mascot Bee globally
    initFloatingBeeMascot();
});

/**
 * Fetches an HTML component and injects it into a container element.
 * @param {string} containerId - The ID of the div to inject the component into.
 * @param {string} componentPath - The path to the HTML component file.
 * @param {Function} [callback] - Optional callback function to execute after loading.
 */
async function loadComponent(containerId, componentPath, callback) {
    const container = document.getElementById(containerId);
    
    if (!container) return; // Silent return if placeholder doesn't exist on this page

    try {
        const response = await fetch(componentPath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        container.innerHTML = html;
        
        if (callback && typeof callback === 'function') {
            callback();
        }
    } catch (error) {
        console.error(`Bee Component Error: Failed to load ${componentPath}.`, error);
        container.innerHTML = `<div style="padding: 20px; text-align: center; color: red;">Failed to load component. Please ensure you are running this site on a local server.</div>`;
    }
}

/**
 * Initializes the active state of navigation links based on current URL path.
 */
function initNavigation() {
    // Get current filename from URL (e.g., 'services.html' from '/services.html')
    let currentPath = window.location.pathname.split('/').pop();
    
    // Default to index if at root or empty path
    if (currentPath === '' || currentPath === '/') {
        currentPath = 'index.html';
    }

    // Identify which nav item corresponds to this path
    let activeNavKey = '';
    if (currentPath.includes('index')) activeNavKey = 'index';
    else if (currentPath.includes('services')) activeNavKey = 'services';
    else if (currentPath.includes('portfolio')) activeNavKey = 'portfolio';
    else if (currentPath.includes('about')) activeNavKey = 'about';

    // Find and highlight the correct navigation link
    if (activeNavKey) {
        const navLinks = document.querySelectorAll('.site-header .nav-link[data-nav]');
        navLinks.forEach(link => {
            if (link.getAttribute('data-nav') === activeNavKey) {
                link.classList.add('nav-active');
            } else {
                link.classList.remove('nav-active');
                link.classList.remove('active'); // Remove any hardcoded bootstrap active classes
            }
        });
    }
}

/**
 * Initializes the sticky header scroll effect.
 */
function initScrollBehavior() {
    const header = document.querySelector('.site-header');
    
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    // Run once on load to catch initial scroll position
    handleScroll();

    // Attach event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Initializes mobile menu behavior, with full custom JS control for a premium feel.
 */
function initMobileMenu() {
    const navbarToggler = document.getElementById('mobile-menu-toggle');
    const navbarCollapse = document.getElementById('navbarNav');
    
    if (!navbarToggler || !navbarCollapse) return;

    // Toggle menu state
    const toggleMenu = () => {
        const isCurrentlyOpen = navbarCollapse.classList.contains('is-open');
        
        if (isCurrentlyOpen) {
            // Close it
            navbarCollapse.classList.remove('is-open');
            navbarToggler.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        } else {
            // Open it
            navbarCollapse.classList.add('is-open');
            navbarToggler.setAttribute('aria-expanded', 'true');
            document.body.classList.add('menu-open');
        }
    };

    navbarToggler.addEventListener('click', toggleMenu);

    // Close menu on nav link click
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .btn-bee');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('is-open')) {
                toggleMenu();
            }
        });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navbarCollapse.classList.contains('is-open')) {
            toggleMenu();
        }
    });

    // Prevent closing when clicking inside the menu, but close if clicking outside (like the body)
    // Not strictly needed since it covers the full screen or screen width, but good practice.
}

/**
 * Initializes the playful, lifelike floating brand mascot bee interaction across the entire website.
 * Features smooth organic flight across the viewport, harmonic deceleration at edges, 
 * smooth turning/mirroring, natural vertical bobbing, and contact CTA integration.
 */
function initFloatingBeeMascot() {
    let beeBtn = document.getElementById('floating-bee-mascot');
    if (!beeBtn) {
        beeBtn = document.createElement('button');
        beeBtn.id = 'floating-bee-mascot';
        beeBtn.className = 'floating-bee-mascot contact-trigger';
        beeBtn.setAttribute('type', 'button');
        beeBtn.setAttribute('data-service', 'General Enquiry');
        beeBtn.setAttribute('aria-label', 'Contact Bee Digital');
        beeBtn.setAttribute('title', "Let's talk");

        const beeImg = document.createElement('img');
        beeImg.src = 'images/bee.png';
        beeImg.alt = '';
        beeImg.className = 'floating-bee-img';
        beeImg.loading = 'eager';

        beeBtn.appendChild(beeImg);
        document.body.appendChild(beeBtn);
    }

    // Accessible keyboard handling (Enter / Space) to open existing global contact modal
    beeBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (typeof window.openContactModal === 'function') {
                window.openContactModal('General Enquiry');
            } else {
                beeBtn.click();
            }
        }
    });

    // Click handler to open the existing global contact modal with "General Enquiry"
    beeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof window.openContactModal === 'function') {
            window.openContactModal('General Enquiry');
        }
    });

    // Check for user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        beeBtn.style.transform = 'translate3d(24px, 0, 0) scaleX(1) rotate(90deg)';
        return;
    }

    // --------------------------------------------------------------------------
    // Organic Flight Simulation Engine (GPU-accelerated via translate3d)
    // --------------------------------------------------------------------------
    let isHovered = false;
    let hoverLift = 0;
    let hoverScale = 1.0;
    let progress = 0.0; // 0.0 to 1.0: Left -> Right; 1.0 to 2.0: Right -> Left
    let lastTimestamp = performance.now();

    beeBtn.addEventListener('mouseenter', () => { isHovered = true; });
    beeBtn.addEventListener('mouseleave', () => { isHovered = false; });
    beeBtn.addEventListener('focus', () => { isHovered = true; });
    beeBtn.addEventListener('blur', () => { isHovered = false; });

    function animateBeeFlight(now) {
        const dt = Math.min(now - lastTimestamp, 100); // Guard against frame jumps when tab is inactive
        lastTimestamp = now;

        // Check if menu or modal is currently active
        const isMenuOrModalOpen = document.body.classList.contains('menu-open') || 
                                  document.body.classList.contains('modal-open') || 
                                  document.querySelector('.contact-modal-overlay.show') !== null;

        // Viewport and device-aware bounds
        const winWidth = window.innerWidth || 1200;
        const isMobile = winWidth < 576;
        const isTablet = winWidth >= 576 && winWidth <= 991;

        const beeWidth = isMobile ? 36 : (isTablet ? 42 : 50);
        const minX = isMobile ? 12 : (isTablet ? 18 : 24);
        const maxX = Math.max(minX + 80, winWidth - beeWidth - (isMobile ? 16 : 28));

        // One-way travel duration: ~10s desktop, ~8.5s mobile
        const journeyDurationMs = isMobile ? 8500 : 10000;

        // Advance progress only when not hovered and not obstructed by modal/menu
        if (!isHovered && !isMenuOrModalOpen) {
            progress = (progress + (dt / journeyDurationMs)) % 2.0;
        }

        // Smooth harmonic easing for horizontal flight: accelerates at start, decelerates at ends
        let currentX = 0;
        if (progress <= 1.0) {
            // Traveling Left -> Right
            const t = progress;
            const easeP = (1 - Math.cos(t * Math.PI)) / 2;
            currentX = minX + easeP * (maxX - minX);
        } else {
            // Traveling Right -> Left
            const t = progress - 1.0;
            const easeP = (1 - Math.cos(t * Math.PI)) / 2;
            currentX = maxX - easeP * (maxX - minX);
        }

        // Smooth 3D-like turnaround at edges (cosine transition of scaleX)
        let facingScaleX = 1.0;
        if (progress >= 0.05 && progress <= 0.95) {
            // Moving right
            facingScaleX = 1.0;
        } else if (progress > 0.95 && progress < 1.05) {
            // Turnaround at right edge
            const turnNorm = (progress - 0.95) / 0.10;
            facingScaleX = Math.cos(turnNorm * Math.PI);
        } else if (progress >= 1.05 && progress <= 1.95) {
            // Moving left
            facingScaleX = -1.0;
        } else {
            // Turnaround at left edge
            const pNorm = progress >= 1.95 ? progress - 1.95 : progress + 0.05;
            const turnNorm = pNorm / 0.10;
            facingScaleX = -Math.cos(turnNorm * Math.PI);
        }

        // Organic compound vertical wave (gentle slow swell + light fluttering bob)
        const wave1 = Math.sin(now * 0.0024) * 8.5;
        const wave2 = Math.sin(now * 0.0055) * 3.5;
        const verticalBob = wave1 + wave2;

        // Base 90deg orientation points the upright bee horizontally to the right, with ±2deg flutter
        const flutter = Math.sin(now * 0.0045) * 2.0;
        const flightAngle = 90 + flutter;

        // Smooth hover transition (lifts up ~6px, scales ~1.06x)
        const targetLift = isHovered ? -6 : 0;
        const targetScale = isHovered ? 1.06 : 1.0;
        hoverLift += (targetLift - hoverLift) * 0.14;
        hoverScale += (targetScale - hoverScale) * 0.14;

        const currentY = verticalBob + hoverLift;

        // Apply hardware-accelerated transform: 100% horizontal flight facing right/left
        beeBtn.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) scaleX(${facingScaleX.toFixed(3)}) scale(${hoverScale.toFixed(3)}) rotate(${flightAngle.toFixed(2)}deg)`;

        requestAnimationFrame(animateBeeFlight);
    }

    requestAnimationFrame(animateBeeFlight);
}
