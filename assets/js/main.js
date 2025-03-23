// Main JavaScript for Daniel Kurganov Website

document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('.header');
    const heroSection = document.querySelector('.hero');
    let heroHeight;
    
    function updateHeroHeight() {
        heroHeight = heroSection.offsetHeight;
    }
    
    updateHeroHeight();
    window.addEventListener('resize', updateHeroHeight);
    
    // Ensure autoplay works for the featured video
    const featuredVideo = document.querySelector('#featured-video');
    
    // Simple check to ensure video is playing
    function checkVideoPlaying() {
        // If iframe exists but video isn't playing, reload it
        if (featuredVideo && featuredVideo.src) {
            const currentSrc = featuredVideo.src;
            // Force a refresh of the iframe to trigger autoplay again
            featuredVideo.src = currentSrc;
            console.log('Ensuring video autoplay is active');
        }
    }
    
    // Check after a short delay to ensure the page has fully loaded
    setTimeout(checkVideoPlaying, 1500);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    mobileMenuClose.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const targetPosition = targetSection.offsetTop - header.offsetHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll animations
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkFade);
    checkFade(); // Check on initial load
    
    // Video autoplay on scroll
    const videoCards = document.querySelectorAll('.video-container');
    
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            const thumbnail = this.querySelector('.video-thumbnail');
            const playButton = this.querySelector('.video-play-button');
            const videoId = this.dataset.videoId;
            
            if (thumbnail && playButton && videoId) {
                this.innerHTML = `<iframe class="video-iframe" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            }
        });
    });
    
    // Form validation
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
            let isValid = true;
            
            // Simple validation
            if (!nameInput.value.trim()) {
                nameInput.classList.add('error');
                isValid = false;
            } else {
                nameInput.classList.remove('error');
            }
            
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                emailInput.classList.add('error');
                isValid = false;
            } else {
                emailInput.classList.remove('error');
            }
            
            if (!subjectInput.value.trim()) {
                subjectInput.classList.add('error');
                isValid = false;
            } else {
                subjectInput.classList.remove('error');
            }
            
            if (!messageInput.value.trim()) {
                messageInput.classList.add('error');
                isValid = false;
            } else {
                messageInput.classList.remove('error');
            }
            
            if (isValid) {
                // In a real implementation, you would send the form data to a server
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            }
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // NEW ANIMATION FUNCTIONS
    
    // 1. Parallax scrolling for sections
    function initParallaxScrolling() {
        const sections = document.querySelectorAll('.section');
        
        window.addEventListener('scroll', () => {
            sections.forEach(section => {
                const scrollPosition = window.scrollY;
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                // Only apply effect when section is in view
                if (scrollPosition > sectionTop - window.innerHeight && 
                    scrollPosition < sectionTop + sectionHeight) {
                    
                    // Calculate how far into the section we've scrolled
                    const scrollPercentage = (scrollPosition - (sectionTop - window.innerHeight)) / 
                                          (sectionHeight + window.innerHeight);
                    
                    // Apply subtle movement to section title
                    const title = section.querySelector('.section-title');
                    if (title) {
                        title.style.transform = `translateY(${scrollPercentage * -30}px)`;
                        title.style.opacity = 1 - (scrollPercentage * 0.3);
                    }
                }
            });
        });
    }
    
    // 2. Parallax effect for hero section
    function heroParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition < window.innerHeight) {
                const parallaxAmount = scrollPosition * 0.4;
                hero.style.setProperty('--parallax-offset', `${parallaxAmount}px`);
                
                if (hero.querySelector('.hero-image')) {
                    hero.querySelector('.hero-image').style.transform = 
                        `scale(${1 + scrollPosition * 0.0005}) translateY(${scrollPosition * 0.05}px)`;
                }
                
                // Move the pseudo-element for a subtle depth effect
                hero.style.setProperty('--gradient-offset', `${scrollPosition * -0.2}px`);
            }
        });
    }
    
    // 3. Smooth reveal animations on scroll
    function initScrollReveal() {
        // Options for the Intersection Observer
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        
        // Create an observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Stop observing once revealed
                }
            });
        }, options);
        
        // Select elements to observe
        const elements = document.querySelectorAll('.card, .album-card, .social-card, .section-title');
        
        // Add base class and observe each element
        elements.forEach((element, index) => {
            // Add staggered delay based on element index within its container
            element.style.transitionDelay = `${index * 0.05}s`;
            element.classList.add('reveal-element');
            observer.observe(element);
        });
    }
    
    // 4. Magnetic button effect for CTAs
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.cta-button');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const moveX = (x - centerX) / 10;
                const moveY = (y - centerY) / 10;
                
                button.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    // Initialize all new animation functions
    initParallaxScrolling();
    heroParallax();
    initScrollReveal();
    initMagneticButtons();
});
