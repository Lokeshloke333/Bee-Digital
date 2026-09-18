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
