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

    // Trust Bar Counter Animation
    const counters = document.querySelectorAll('.counter');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (counters.length > 0) {
        const runCounter = (counter) => {
            if (prefersReducedMotion) {
                counter.innerText = counter.getAttribute('data-target');
                return;
            }
            
            const target = +counter.getAttribute('data-target');
            const duration = 1200; // 1.2s
            let start = null;
            
            const animate = (time) => {
                if (!start) start = time;
                const elapsed = time - start;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutQuart for smooth deceleration
                const easeOut = 1 - Math.pow(1 - progress, 4);
                
                counter.innerText = Math.floor(target * easeOut);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    counter.innerText = target;
                }
            };
            requestAnimationFrame(animate);
        };

        if ('IntersectionObserver' in window) {
            const counterObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        runCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
            
            counters.forEach(counter => {
                counterObserver.observe(counter);
            });
        } else {
            counters.forEach(counter => runCounter(counter));
        }
    }

    // Initialize Premium Results Counters
    if (typeof initResultsCounters === 'function') {
        initResultsCounters();
    }
});

/* ==========================================================================
   Premium Results Section Counters
   ========================================================================== */
function initResultsCounters() {
    const counters = document.querySelectorAll('.results-counter');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (counters.length === 0) return;

    // Easing function: easeOutQuart
    const easeOutQuart = x => 1 - Math.pow(1 - x, 4);

    const animateCounter = (el) => {
        const start = parseFloat(el.getAttribute('data-start')) || 0;
        const target = parseFloat(el.getAttribute('data-target')) || 0;
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-decimals')) || 0;
        const duration = 2000; // 2 seconds

        if (prefersReducedMotion) {
            el.innerHTML = `${prefix}${target.toFixed(decimals)}${suffix}`;
            return;
        }

        let startTime = null;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percent = Math.min(progress / duration, 1);
            
            // Apply easing
            const easedProgress = easeOutQuart(percent);
            
            const current = (start + (target - start) * easedProgress).toFixed(decimals);
            
            el.innerHTML = `${prefix}${current}${suffix}`;

            if (progress < duration) {
                requestAnimationFrame(step);
            } else {
                el.innerHTML = `${prefix}${target.toFixed(decimals)}${suffix}`;
                // Trigger shine effect
                el.classList.add('number-shine');
            }
        };

        requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% visible

        counters.forEach(counter => observer.observe(counter));
    } else {
        counters.forEach(counter => animateCounter(counter));
    }
}


/* ==========================================================================
   Contact Modal Logic
   ========================================================================== */
window.openContactModal = function(service = 'General Enquiry') {
    const overlay = document.getElementById('contactModalOverlay');
    const select = document.getElementById('contactService');
    const form = document.getElementById('beeContactForm');
    const formState = document.getElementById('contactFormState');
    const successState = document.getElementById('contactSuccessState');

    if (!overlay) return;

    // Reset states
    if (form) {
        form.reset();
        form.classList.remove('was-validated');
        const invalidFeedbacks = form.querySelectorAll('.bee-invalid-feedback');
        invalidFeedbacks.forEach(el => el.style.display = 'none');
        form.querySelectorAll('.bee-form-control').forEach(el => el.classList.remove('is-invalid'));
    }
    
    if (formState && successState) {
        formState.style.display = 'block';
        successState.style.display = 'none';
        
        // Reset checkmark animation
        const checkmark = successState.querySelector('.checkmark');
        if (checkmark) checkmark.style.animation = 'none';
    }

    // Set service if passed
    if (select) {
        const optionExists = Array.from(select.options).some(opt => opt.value === service);
        if (optionExists) {
            select.value = service;
        } else {
            select.value = 'General Enquiry';
        }
    }

    // Open modal
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
};

window.closeContactModal = function() {
    const overlay = document.getElementById('contactModalOverlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 350); // Wait for CSS transition
    }
};

window.initContactModal = function() {
    const overlay = document.getElementById('contactModalOverlay');
    const closeBtn = document.getElementById('contactModalClose');
    const closeSuccessBtn = document.getElementById('contactModalCloseSuccess');
    const form = document.getElementById('beeContactForm');

    if (!overlay) return;

    // Close listeners
    if (closeBtn) closeBtn.addEventListener('click', closeContactModal);
    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeContactModal);
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeContactModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('show')) {
            closeContactModal();
        }
    });

    // Global listener for dynamic trigger elements
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.contact-trigger');
        if (trigger) {
            e.preventDefault();
            const service = trigger.getAttribute('data-service') || 'General Enquiry';
            openContactModal(service);
        }
    });

    // Form Validation and Submit
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            let isValid = true;
            const name = document.getElementById('contactName');
            const email = document.getElementById('contactEmail');
            const phone = document.getElementById('contactPhone');
            const company = document.getElementById('contactCompany');
            const service = document.getElementById('contactService');
            const message = document.getElementById('contactGoals');
            const honeypot = document.getElementById('contactHoneypot');
            const errorAlert = document.getElementById('contactErrorAlert');
            
            if (errorAlert) errorAlert.style.display = 'none';

            // Basic reset
            form.querySelectorAll('.bee-invalid-feedback').forEach(el => el.style.display = 'none');
            form.querySelectorAll('.bee-form-control').forEach(el => el.classList.remove('is-invalid'));

            if (!name.value.trim()) {
                isValid = false;
                name.classList.add('is-invalid');
                name.nextElementSibling.style.display = 'block';
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
                isValid = false;
                email.classList.add('is-invalid');
                email.nextElementSibling.style.display = 'block';
            }
            
            // Basic phone validation (allowing digits, +, spaces, hyphens, min length 6)
            const phoneRegex = /^[0-9+\-\s()]{6,20}$/;
            if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
                isValid = false;
                phone.classList.add('is-invalid');
                if (phone.nextElementSibling && phone.nextElementSibling.classList.contains('bee-invalid-feedback')) {
                    phone.nextElementSibling.style.display = 'block';
                }
            }
            
            if (!company.value.trim()) {
                isValid = false;
                company.classList.add('is-invalid');
                if (company.nextElementSibling && company.nextElementSibling.classList.contains('bee-invalid-feedback')) {
                    company.nextElementSibling.style.display = 'block';
                }
            }

            if (isValid) {
                // Check honeypot
                if (honeypot && honeypot.value) {
                    console.warn('Bot detected');
                    return; // silently fail
                }

                const btn = form.querySelector('.btn-bee-submit');
                const originalText = btn.innerHTML;
                
                btn.innerHTML = 'Sending Inquiry...';
                btn.disabled = true;

                try {
                    const response = await fetch('/api/contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: name.value.trim(),
                            email: email.value.trim(),
                            phone: phone.value.trim(),
                            company: company.value.trim(),
                            service: service.value,
                            message: message.value.trim()
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    // Success
                    const formState = document.getElementById('contactFormState');
                    const successState = document.getElementById('contactSuccessState');
                    
                    if (formState && successState) {
                        formState.style.display = 'none';
                        successState.style.display = 'block';
                        
                        // Trigger checkmark animation
                        const checkmark = successState.querySelector('.checkmark');
                        if (checkmark) {
                            void checkmark.offsetWidth; // Force reflow
                            checkmark.style.animation = 'drawCheck 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards 0.2s';
                        }
                    }
                } catch (error) {
                    console.error('Error sending inquiry:', error);
                    if (errorAlert) errorAlert.style.display = 'block';
                } finally {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            }
        });
        
        // Remove error state on input
        form.querySelectorAll('.bee-form-control, .bee-form-select').forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('is-invalid');
                if (this.nextElementSibling && this.nextElementSibling.classList.contains('bee-invalid-feedback')) {
                    this.nextElementSibling.style.display = 'none';
                }
            });
        });
    }
};

// Portfolio Logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Portfolio Lightbox Modal
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const portfolioModalImage = document.getElementById('portfolioModalImage');
    
    if (portfolioCards.length > 0 && portfolioModalImage) {
        portfolioCards.forEach(card => {
            card.addEventListener('click', function() {
                const img = this.querySelector('.portfolio-img');
                if (img) {
                    portfolioModalImage.src = img.src;
                    portfolioModalImage.alt = img.alt;
                    
                    const modalEl = document.getElementById('portfolioModal');
                    if (modalEl && window.bootstrap) {
                        const modal = new bootstrap.Modal(modalEl);
                        modal.show();
                    }
                }
            });
        });
    }

    // 2. Portfolio Filtering
    const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const emptyState = document.getElementById('portfolio-empty');

    if (filterBtns.length > 0 && portfolioItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active state on buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');
                let visibleCount = 0;

                portfolioItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    // Simple animation reset
                    item.style.transition = 'none';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.classList.remove('d-none');
                        visibleCount++;
                        
                        // Force reflow then animate in
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.classList.add('d-none');
                    }
                });

                if (emptyState) {
                    if (visibleCount === 0) {
                        emptyState.classList.remove('d-none');
                    } else {
                        emptyState.classList.add('d-none');
                    }
                }
            });
        });
    }
});
