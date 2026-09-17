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
 * Initializes mobile menu behavior, specifically closing the menu when a link is clicked.
 */
function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (!navbarToggler || !navbarCollapse) return;

    // Optional: Close menu on nav link click
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .btn-bee');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                // If bootstrap is loaded, try to use its collapse instance
                if (typeof bootstrap !== 'undefined') {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                } else {
                    // Fallback to manual closing if bootstrap JS fails/isn't there yet
                    navbarCollapse.classList.remove('show');
                    navbarToggler.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
}
