document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-enabled');
    
    // Stick header logic
    const header = document.querySelector('.navbar');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('navbar-scrolled');
            } else {
                header.classList.remove('navbar-scrolled');
            }
        });
    }

    // Scroll Reveal Animation using IntersectionObserver for better reliability
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Optional: Stop observing once revealed
                    // observer.unobserve(entry.target); 
                }
            });
        }, {
            root: null,
            threshold: 0.1, // Trigger when 10% of element is visible
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
        
        // Fallback: immediately reveal elements that are already in viewport on load
        setTimeout(() => {
            revealElements.forEach(el => {
                if (el.getBoundingClientRect().top < window.innerHeight) {
                    el.classList.add('active');
                }
            });
        }, 100);

    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }
});
