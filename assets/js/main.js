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
    
    // IMPROVED YOUTUBE LOADING - Load YouTube videos after page is fully loaded
    function loadDeferredVideos() {
        const deferredVideos = document.querySelectorAll('iframe[data-src]');
        
        deferredVideos.forEach(video => {
            // Only set the src if it hasn't been set yet
            if (video.getAttribute('data-src') && !video.src) {
                // Set a small timeout to stagger the loading of videos
                setTimeout(() => {
                    video.src = video.getAttribute('data-src');
                    // Track when the video was loaded for autoplay checking
                    video._loadTime = Date.now();
                    console.log('Loading deferred video:', video.getAttribute('data-src'));
                }, 1000); // Delay loading the videos by 1 second after page load
            }
        });
    }
    
    // Wait until the page is fully loaded before loading videos
    window.addEventListener('load', loadDeferredVideos);
    
    // Ensure autoplay works for the featured video - with improved handling
    function checkVideoPlaying() {
        const videoFrames = document.querySelectorAll('.autoplay-video');
        
        videoFrames.forEach(video => {
            // If the video is loaded but not playing, try to restart it
            if (video.src && video.src.includes('autoplay=1')) {
                // Only refresh if the video has been loaded for some time (avoid reload loops)
                if (video._loadTime && (Date.now() - video._loadTime > 5000)) {
                    console.log('Refreshing video to ensure autoplay:', video.src);
                    const currentSrc = video.src;
                    video.src = currentSrc;
                }
            }
        });
    }
    
    // Check videos after they've had time to load
    setTimeout(checkVideoPlaying, 3000);
    
    // More efficient scroll handler using requestAnimationFrame for smoother performance
    let ticking = false;
    
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                // Run other scroll-based animations only if they're in view
                handleParallaxEffects();
                checkFade();
                
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll);
    
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
    
    // Call once on initial load
    checkFade();
    
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

    // NEW ANIMATION FUNCTIONS - OPTIMIZED
    
    // Cache DOM elements and viewport dimensions for performance
    const sections = document.querySelectorAll('.section');
    const hero = document.querySelector('.hero');
    const viewportHeight = window.innerHeight;
    
    // Handle all parallax effects in a single function to reduce calculations
    function handleParallaxEffects() {
        const scrollPosition = window.scrollY;
        
        // Only apply hero parallax if in view
        if (hero && scrollPosition < viewportHeight) {
            const parallaxAmount = scrollPosition * 0.4;
            
            // Use transform instead of custom properties for better performance
            if (hero.querySelector('.hero-image')) {
                hero.querySelector('.hero-image').style.transform = 
                    `scale(${1 + scrollPosition * 0.0003}) translateY(${scrollPosition * 0.03}px)`;
            }
        }
        
        // Apply section title animations only to visible sections
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            
            // Only process if section is visible
            if (rect.top < viewportHeight && rect.bottom > 0) {
                const title = section.querySelector('.section-title');
                if (title) {
                    // Calculate how far into the section we've scrolled (0-1)
                    const progress = Math.max(0, Math.min(1, 
                        1 - (rect.top / viewportHeight)
                    ));
                    
                    // Apply subtle movement (reduced from previous values)
                    title.style.transform = `translateY(${progress * -15}px)`;
                    title.style.opacity = 1 - (progress * 0.2);
                }
            }
        });
    }
    
    // Initialize scroll reveal with Intersection Observer for better performance
    function initScrollReveal() {
        // Options for the Intersection Observer
        const options = {
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };
        
        // Create an observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Use a shorter delay before revealing
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, parseInt(entry.target.dataset.delay || 0));
                    
                    // Stop observing once revealed
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        // Select elements to observe
        const elements = document.querySelectorAll('.card, .album-card, .social-card, .section-title');
        
        // Add base class and observe each element with reduced staggering
        elements.forEach((element, index) => {
            // Reduce delay for faster reveal
            element.dataset.delay = (index % 5) * 50; // Group elements to load faster
            element.classList.add('reveal-element');
            observer.observe(element);
        });
    }
    
    // Initialize magnetic buttons with throttled event listener
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.cta-button');
        let isThrottled = false;
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                if (!isThrottled) {
                    isThrottled = true;
                    
                    requestAnimationFrame(() => {
                        const rect = button.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        
                        // Reduced movement amount for subtlety
                        const moveX = (x - centerX) / 15;
                        const moveY = (y - centerY) / 15;
                        
                        button.style.transform = `translate(${moveX}px, ${moveY}px)`;
                        isThrottled = false;
                    });
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    // Initialize all new animation functions with a slight delay to prioritize content loading
    setTimeout(function() {
        initScrollReveal();
        initMagneticButtons();
        // Initial call to set up animations
        handleParallaxEffects();
    }, 500);

    // Optimize image loading
    function optimizeImages() {
        // Get all images that aren't in the viewport
        const images = document.querySelectorAll('img:not([loading])');
        
        // Add loading="lazy" to images that don't already have it
        images.forEach(img => {
            // Skip small images or images that are already visible (like the hero image)
            const rect = img.getBoundingClientRect();
            if (rect.top > window.innerHeight) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }
    
    // Run image optimization right away
    optimizeImages();

    // Make cards with data-url attribute clickable
    function makeCardsClickable() {
        // Select all cards with data-url attribute
        const clickableCards = document.querySelectorAll('.card[data-url], .album-card[data-url], .social-card[data-url]');
        
        clickableCards.forEach(card => {
            // Add cursor pointer style to indicate clickable
            card.style.cursor = 'pointer';
            
            // Add click event listener
            card.addEventListener('click', function(e) {
                // Check if the click was on a link or button inside the card
                if (!e.target.closest('a, button, .social-follow-btn')) {
                    // If not, open the card's URL in a new tab
                    const url = this.getAttribute('data-url');
                    if (url) {
                        window.open(url, '_blank');
                    }
                }
            });
        });
    }

    // Initialize clickable cards
    makeCardsClickable();
});
