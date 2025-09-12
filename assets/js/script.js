// ================================
// Portfolio Website JavaScript
// ================================

class PortfolioWebsite {
    constructor() {
        this.currentSection = 'home';
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.handlePageLoad();
        this.setupIntersectionObserver();
        this.setupParallaxEffects();
        this.setupTypingEffect();
        this.setupScrollEffects();
    }

    // ================================
    // Page Load & Loading Screen
    // ================================

    handlePageLoad() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 1500);
        });

        // Fallback in case load event doesn't fire
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 3000);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    // ================================
    // Event Listeners
    // ================================

    setupEventListeners() {
        // Navigation clicks
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            const button = e.target.closest('[data-section]');
            
            if (navLink || button) {
                e.preventDefault();
                const sectionId = navLink?.dataset.section || button?.dataset.section;
                if (sectionId) {
                    this.navigateToSection(sectionId);
                }
            }
        });

        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            navMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }

        // Form submission
        const form = document.querySelector('.form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        }

        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (anchor) {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                if (targetId) {
                    this.navigateToSection(targetId);
                }
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    }

    // ================================
    // Section Navigation
    // ================================

    async navigateToSection(sectionId) {
        if (this.isTransitioning || this.currentSection === sectionId) return;

        this.isTransitioning = true;
        this.showPageTransition();

        // Update navigation
        this.updateNavigation(sectionId);

        // Wait for transition effect
        await this.sleep(300);

        // Switch sections
        this.switchSection(sectionId);

        // Hide transition effect
        await this.sleep(200);
        this.hidePageTransition();

        this.currentSection = sectionId;
        this.isTransitioning = false;

        // Trigger animations for the new section
        this.triggerSectionAnimations(sectionId);
    }

    updateNavigation(sectionId) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });
    }

    switchSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Smooth scroll to section with navbar offset
            const navbarHeight = 70;
            const elementPosition = targetSection.offsetTop;
            const offsetPosition = elementPosition - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    showPageTransition() {
        // Create transition overlay if it doesn't exist
        let overlay = document.querySelector('.page-transition');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'page-transition';
            overlay.innerHTML = `
                <div class="transition-content">
                    <div class="transition-loader"></div>
                    <div class="transition-text">Loading...</div>
                </div>
            `;
            document.body.appendChild(overlay);

            // Add CSS for transition overlay
            this.addTransitionStyles();
        }

        overlay.classList.add('active');
    }

    hidePageTransition() {
        const overlay = document.querySelector('.page-transition');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    addTransitionStyles() {
        if (document.querySelector('#transition-styles')) return;

        const style = document.createElement('style');
        style.id = 'transition-styles';
        style.textContent = `
            .page-transition {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .page-transition.active {
                opacity: 1;
                visibility: visible;
            }

            .transition-content {
                text-align: center;
                color: white;
            }

            .transition-loader {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top: 3px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }

            .transition-text {
                font-size: 1rem;
                font-weight: 500;
                animation: pulse 2s ease-in-out infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
            }
        `;
        document.head.appendChild(style);
    }

    // ================================
    // Animation Triggers
    // ================================

    triggerSectionAnimations(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // Remove existing animation classes
        section.querySelectorAll('[class*="animate"]').forEach(el => {
            el.classList.remove('animate-fade-in', 'animate-slide-up', 'animate-slide-left', 'animate-slide-right');
        });

        // Add animation classes with delays
        setTimeout(() => {
            this.animateElements(section);
        }, 100);
    }

    animateElements(container) {
        const elements = container.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-buttons, .section-title, .timeline-item, .project-card, .skill-item, .education-card');
        
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.animation = 'fadeInUp 0.6s ease forwards';
            }, index * 100);
        });
    }

    // ================================
    // Intersection Observer
    // ================================

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in-view');
                    this.animateCounter(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.stat-item, .skill-item, .project-card, .timeline-item').forEach(el => {
            observer.observe(el);
        });
    }

    // ================================
    // Counter Animation
    // ================================

    animateCounter(element) {
        const statNumbers = element.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            if (stat.dataset.animated) return;
            stat.dataset.animated = 'true';

            const target = parseInt(stat.textContent);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target + '+';
                }
            };

            updateCounter();
        });
    }

    // ================================
    // Typing Effect
    // ================================

    setupTypingEffect() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.typingSpeed) || 100;
            
            element.textContent = '';
            element.style.borderRight = '2px solid';
            element.style.animation = 'blink 1s infinite';

            this.typeText(element, text, speed);
        });
    }

    typeText(element, text, speed) {
        let index = 0;
        
        const typeInterval = setInterval(() => {
            element.textContent += text[index];
            index++;
            
            if (index >= text.length) {
                clearInterval(typeInterval);
                element.style.borderRight = 'none';
                element.style.animation = 'none';
            }
        }, speed);
    }

    // ================================
    // Parallax Effects
    // ================================

    setupParallaxEffects() {
        window.addEventListener('scroll', () => {
            this.handleParallax();
        });

        // Add parallax styles
        this.addParallaxStyles();
    }

    handleParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');

        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        // Floating elements animation
        const floatingElements = document.querySelectorAll('.floating-icon');
        floatingElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = Math.sin(scrolled * 0.01 + index) * 10;
            element.style.transform = `translateY(${yPos}px) rotate(${scrolled * speed}deg)`;
        });
    }

    addParallaxStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .parallax {
                will-change: transform;
            }

            @keyframes blink {
                0%, 50% { border-color: transparent; }
                51%, 100% { border-color: currentColor; }
            }

            .animate-in-view {
                animation: slideInUp 0.8s ease forwards;
            }

            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ================================
    // Scroll Effects
    // ================================

    setupScrollEffects() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScrollEffects() {
        const scrolled = window.pageYOffset;
        const navbar = document.querySelector('.navbar');

        // Navbar background on scroll
        if (scrolled > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        // Add navbar scroll styles
        this.addNavbarScrollStyles();
    }

    addNavbarScrollStyles() {
        if (document.querySelector('#navbar-scroll-styles')) return;

        const style = document.createElement('style');
        style.id = 'navbar-scroll-styles';
        style.textContent = `
            .navbar.scrolled {
                background: rgba(10, 10, 10, 0.98);
                box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
            }
        `;
        document.head.appendChild(style);
    }

    // ================================
    // Form Handling
    // ================================

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;

        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        button.disabled = true;

        try {
            // Simulate form submission (replace with actual submission logic)
            await this.sleep(2000);

            // Success state
            button.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            button.style.background = 'var(--gradient-success)';
            
            // Show success notification
            this.showNotification('Message sent successfully!', 'success');
            
            // Reset form
            form.reset();

            // Reset button after delay
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 3000);

        } catch (error) {
            // Error state
            button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
            button.style.background = 'var(--gradient-error)';
            
            this.showNotification('Failed to send message. Please try again.', 'error');

            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 3000);
        }
    }

    // ================================
    // Notifications
    // ================================

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add notification styles
        this.addNotificationStyles();

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto hide
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    addNotificationStyles() {
        if (document.querySelector('#notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--bg-card);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: var(--radius-lg);
                padding: 1rem 1.5rem;
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                transform: translateX(400px);
                opacity: 0;
                transition: all 0.3s ease;
                max-width: 300px;
            }

            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--text-primary);
            }

            .notification-success {
                border-left: 4px solid var(--success-color);
            }

            .notification-error {
                border-left: 4px solid var(--error-color);
            }

            .notification-warning {
                border-left: 4px solid var(--warning-color);
            }

            .notification-info {
                border-left: 4px solid var(--primary-color);
            }

            .notification i {
                font-size: 1.2rem;
            }

            .notification-success i { color: var(--success-color); }
            .notification-error i { color: var(--error-color); }
            .notification-warning i { color: var(--warning-color); }
            .notification-info i { color: var(--primary-color); }
        `;
        document.head.appendChild(style);
    }

    // ================================
    // Utility Functions
    // ================================

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ================================
    // Theme Toggle (Optional)
    // ================================

    toggleTheme() {
        document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }
    }

    // ================================
    // Performance Optimization
    // ================================

    optimizePerformance() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Debounce scroll events
        this.debounceScrollEvents();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    debounceScrollEvents() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScrollEffects();
                this.handleParallax();
            }, 10);
        }, { passive: true });
    }
}

// ================================
// Initialize Website
// ================================

document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new PortfolioWebsite();
});

// ================================
// Service Worker (for offline support)
// ================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ================================
// Additional Interactive Features
// ================================

// Smooth reveal on scroll
const revealElements = () => {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealElements);

// Particle background effect
const createParticles = () => {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    document.body.appendChild(particleContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: rgba(102, 126, 234, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        particleContainer.appendChild(particle);
    }
};

// Initialize particles
setTimeout(createParticles, 2000);

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s ease infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10000);
    }
});

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);
