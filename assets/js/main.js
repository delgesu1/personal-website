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
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    mobileMenuClose.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    mobileMenuOverlay.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .nav-submenu-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            // Special handling for #contact if it's just a placeholder/no section
            if (targetId === '#contact' && !document.querySelector(targetId)) {
                console.log("Contact section not found, attempting smooth scroll to element.");
                const contactElem = document.getElementById('contact'); // Assuming #contact is the section ID
                if (contactElem) {
                     const targetPosition = contactElem.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 10;
                     window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                     });
                } else {
                    console.warn("#contact element not found.");
                }
                return; 
            }
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Use getBoundingClientRect for more accurate position relative to viewport
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 10; // Added slight offset
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            } else {
                console.warn(`Target section ${targetId} not found for smooth scroll.`);
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
    
    // --- NEW Web3Forms Validation & Submission Logic --- 
    (function () {
        'use strict';
        
        // Fetch all the forms we want to apply custom validation styles to
        const forms = document.querySelectorAll('.needs-validation');
        const resultElement = document.getElementById('form-result'); // Use the ID added to the HTML
        
        // Loop over them and prevent submission
        Array.prototype.slice.call(forms).forEach(function (form) {
            form.addEventListener('submit', function (event) {
                // Original preventDefault moved inside the 'else' for fetch submission
                
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                    form.querySelectorAll(':invalid')[0].focus();
                } else {
                    // Prevent default submission ONLY if validation passes
                    event.preventDefault();
                    event.stopPropagation();
                    
                    const formData = new FormData(form);
                    const object = Object.fromEntries(formData);
                    const json = JSON.stringify(object);
                    
                    if(resultElement) { // Check if result element exists
                         resultElement.innerHTML = "Please wait...";
                         resultElement.style.display = 'block'; // Make sure it's visible
                         resultElement.className = 'form-status status-loading'; // Reset classes
                    } else {
                        console.error("#form-result element not found");
                        // Optionally provide feedback elsewhere or just proceed
                    }

                    fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: json
                    })
                    .then(async (response) => {
                        let jsonResponse = await response.json();
                        if (resultElement) {
                            if (response.status == 200) {
                                resultElement.innerHTML = jsonResponse.message || "Form submitted successfully!";
                                resultElement.className = 'form-status status-success';
                            } else {
                                console.error("Web3Forms Error:", jsonResponse);
                                resultElement.innerHTML = jsonResponse.message || "An error occurred.";
                                resultElement.className = 'form-status status-error';
                            }
                        }
                    })
                    .catch(error => {
                        console.error("Fetch Error:", error);
                        if (resultElement) {
                            resultElement.innerHTML = "Something went wrong! Please try again.";
                            resultElement.className = 'form-status status-error';
                        }
                    })
                    .then(function () {
                        form.reset();
                        form.classList.remove('was-validated');
                        if (resultElement) {
                            setTimeout(() => {
                                resultElement.style.display = 'none';
                            }, 6000); // Keep message visible longer
                        }
                    });
                }
                form.classList.add('was-validated');
            }, false);
        });
    })();
    // --- END Web3Forms Logic --- 

    function isValidEmail(email) {
        // Keep this function if needed elsewhere, otherwise it can be removed
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
