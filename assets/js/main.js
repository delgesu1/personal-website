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
                updateHeaderStyle(); // Call the new header styling function
                
                // Run other scroll-based animations only if they're in view
                handleParallaxEffects();
                checkFade();
                
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', updateHeaderStyle); // Also update styles on resize
    
    // Function to handle header style changes based on scroll and width
    function updateHeaderStyle() {
        if (!header || !heroSection) return; // Ensure elements exist
        
        const scrollPosition = window.scrollY;
        const screenWidth = window.innerWidth;
        const headerHeight = header.offsetHeight;
        const maxBlur = 8; // Max blur in pixels
        let currentBlur = 0;
        
        // Small screen logic (<= 768px)
        if (screenWidth <= 768) {
            const blurStartPoint = heroHeight / 3; // Start blur earlier (changed from / 2)
            const blurEndPoint = heroHeight * 0.95; // End blur later for more gradual effect (changed from 0.85)

            // --- Header Transition Logic (Existing) ---
            if (scrollPosition < (heroHeight * 2 / 3)) {
                header.classList.add('header-hero-overlap');
                header.classList.remove('scrolled');
            } else {
                header.classList.remove('header-hero-overlap');
                header.classList.add('scrolled');
            }
            
            // --- Gradual Blur Logic (New) ---
            if (scrollPosition > blurStartPoint) {
                const scrollRange = blurEndPoint - blurStartPoint;
                if (scrollRange > 0) { // Avoid division by zero
                    const progress = Math.min(1, (scrollPosition - blurStartPoint) / scrollRange);
                    currentBlur = progress * maxBlur;
                } else {
                    currentBlur = (scrollPosition >= blurEndPoint) ? maxBlur : 0;
                } 
            } else {
                currentBlur = 0;
            }

        } 
        // Large screen logic (> 768px)
        else {
             // --- Header Transition Logic (Existing) ---
            header.classList.remove('header-hero-overlap'); // Ensure overlap class is removed
            if (scrollPosition > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            // Ensure blur is 0 on larger screens
            currentBlur = 0;
        }
        
        // Apply the calculated blur value via CSS variable
        // Using documentElement ensures the variable is globally available
        document.documentElement.style.setProperty('--hero-blur', `${currentBlur}px`);
    }

    // Initial call to set the correct header style on load
    updateHeaderStyle();
    
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
            const targetImage = window.innerWidth <= 768 ? 
                                hero.querySelector('.hero-image-mobile') : 
                                hero.querySelector('.hero-image-desktop');

            if (targetImage) {
                targetImage.style.transform = 
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

    // --- NEW: Album Carousel Logic for Mobile --- 
    let isDragging = false;
    let startX;
    let scrollLeftStart;
    let dragTicking = false; // Throttling flag for drag updates
    let scrollTicking = false; // Throttling flag for scroll updates
    let albumCarouselObserver = null; // For intersection observer

    const albumCarousel = document.querySelector('#violinist .block-even');
    const dotsContainer = document.querySelector('.carousel-dots'); // Get dots container
    let carouselDidDrag = false; // Flag to track drag vs click

    function initAlbumCarousel() {
        if (window.innerWidth > 768 || !albumCarousel) {
            destroyAlbumCarousel(); // Clean up if screen is too wide or container not found
            return;
        }

        // Prevent re-initialization
        if (albumCarouselObserver) return;

        const albumCards = albumCarousel.querySelectorAll('.album-card');
        if (albumCards.length === 0) return;

        // --- Create Dots ---
        if (dotsContainer) {
            dotsContainer.innerHTML = ''; // Clear previous dots
            albumCards.forEach((card, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('data-index', index);
                dot.setAttribute('aria-label', `Go to album ${index + 1}`);
                dot.addEventListener('click', () => {
                    const targetCard = albumCards[index];
                    if (targetCard) {
                        const cardLeft = targetCard.offsetLeft;
                        const cardWidth = targetCard.offsetWidth;
                        const containerWidth = albumCarousel.offsetWidth;
                        const targetScrollLeft = cardLeft + cardWidth / 2 - containerWidth / 2;
                        
                        albumCarousel.scrollTo({
                            left: targetScrollLeft,
                            behavior: 'smooth'
                        });
                        // Manually update state after click
                        setTimeout(() => evaluateCarouselState(), 50); 
                    }
                });
                dotsContainer.appendChild(dot);
            });
            dotsContainer.style.display = 'block'; // Show dots container
        }
        // --- End Create Dots ---

        const options = {
            root: albumCarousel,
            rootMargin: '0px',
            threshold: 0.4 // Trigger when 40% visible (changed from 0.6)
        };

        albumCarouselObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
                    // This card is considered 'active' (centered enough)
                    entry.target.classList.remove('is-inactive');
                } else {
                    // This card is considered 'inactive' (peeking or scrolled past)
                    entry.target.classList.add('is-inactive');
                }
            });
            
            // Ensure at least one card is active if container is scrolled (fallback)
            // Find the card closest to the center if none meet threshold strictly
            let hasActiveCard = false;
            albumCards.forEach(card => {
                if (!card.classList.contains('is-inactive')) {
                    hasActiveCard = true;
                }
            });

            if (!hasActiveCard && albumCards.length > 0) {
                // Fallback: Find card closest to center
                let closestCard = null;
                let minDistance = Infinity;
                const containerCenter = albumCarousel.offsetWidth / 2;

                albumCards.forEach(card => {
                    const cardRect = card.getBoundingClientRect();
                    const containerRect = albumCarousel.getBoundingClientRect();
                    const cardCenter = cardRect.left - containerRect.left + cardRect.width / 2;
                    const distance = Math.abs(cardCenter - containerCenter);
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestCard = card;
                    }
                });
                
                if (closestCard) {
                    // Deactivate all first, then activate the closest one
                     albumCards.forEach(card => card.classList.add('is-inactive'));
                     closestCard.classList.remove('is-inactive');
                }
            }

        }, options);

        albumCards.forEach(card => {
            albumCarouselObserver.observe(card);
             // Set initial state - all inactive except maybe the first?
             // Let observer handle initial state based on initial intersection
        });
        
        // --- Add Drag Scrolling Logic ---
        let isDown = false;
        let startX;
        let scrollLeftStart;
        let dragTicking = false; // Throttling flag for mousemove evaluation

        const mouseDownHandler = (e) => {
            isDown = true;
            albumCarousel.classList.add('is-dragging');
            startX = e.pageX - albumCarousel.offsetLeft;
            scrollLeftStart = albumCarousel.scrollLeft;
            carouselDidDrag = false; // Reset drag flag on mouse down
        };

        const mouseLeaveHandler = () => {
            if (!isDown) return;
            isDown = false;
            // Don't remove dragging class immediately
            // albumCarousel.classList.remove('is-dragging');
            
            // Calculate target and smoothly scroll
            smoothScrollToNearestSnapPoint();
            
            // Re-evaluate state after scroll animation likely finishes
            // REMOVED: setTimeout(evaluateCarouselState, 400); 
        };

        const mouseUpHandler = () => {
            if (!isDown) return;
            isDown = false;
            // Don't remove dragging class immediately
            // albumCarousel.classList.remove('is-dragging');
            
            // Calculate target and smoothly scroll
            smoothScrollToNearestSnapPoint();
            
            // Re-evaluate state after scroll animation likely finishes
            // REMOVED: setTimeout(evaluateCarouselState, 400); 
        };

        const mouseMoveHandler = (e) => {
            if (!isDown) return;
            const x = e.pageX - albumCarousel.offsetLeft;
            const walk = x - startX;
            // Check if movement exceeds a threshold to count as a drag
            if (Math.abs(walk) > 5) { 
                carouselDidDrag = true;
            }
            
            e.preventDefault(); // Prevent text selection/default drag behavior only if dragging
            albumCarousel.scrollLeft = scrollLeftStart - (walk * 1.5); // Use walk for calculation
            
            // Evaluate state during drag, throttled with requestAnimationFrame
            if (!dragTicking) {
                window.requestAnimationFrame(() => {
                    evaluateCarouselState(); // Evaluate based on new scrollLeft
                    dragTicking = false;
                });
                dragTicking = true;
            }
        };

        albumCarousel.addEventListener('mousedown', mouseDownHandler);
        albumCarousel.addEventListener('mouseleave', mouseLeaveHandler);
        albumCarousel.addEventListener('mouseup', mouseUpHandler);
        albumCarousel.addEventListener('mousemove', mouseMoveHandler);
        
        // Store handlers to remove them later
        albumCarousel._carouselMouseHandlers = {
            mousedown: mouseDownHandler,
            mouseleave: mouseLeaveHandler,
            mouseup: mouseUpHandler,
            mousemove: mouseMoveHandler
        };
        // --- End Drag Scrolling Logic ---

        // --- Helper function for smooth scroll to snap point ---
        function smoothScrollToNearestSnapPoint() {
             if (!albumCarousel) return;
             const albumCards = albumCarousel.querySelectorAll('.album-card');
             if (albumCards.length === 0) return;

             const containerScrollLeft = albumCarousel.scrollLeft;
             const containerWidth = albumCarousel.offsetWidth;
             const containerCenter = containerScrollLeft + containerWidth / 2;

             let closestCard = null;
             let minDistance = Infinity;
             let targetScrollLeft = containerScrollLeft; // Default to current

             albumCards.forEach(card => {
                 const cardLeft = card.offsetLeft;
                 const cardWidth = card.offsetWidth;
                 const cardCenter = cardLeft + cardWidth / 2;
                 const distance = Math.abs(cardCenter - containerCenter);

                 if (distance < minDistance) {
                     minDistance = distance;
                     closestCard = card;
                     // Calculate the scrollLeft needed to center this card
                     targetScrollLeft = cardLeft + cardWidth / 2 - containerWidth / 2;
                 }
             });

             albumCarousel.scrollTo({
                 left: targetScrollLeft,
                 behavior: 'smooth'
             });

             // After the smooth scroll, remove dragging class and re-evaluate state
             // We need to estimate scroll duration, or use scrollend event if supported
             // For simplicity, using a timeout. Adjust duration as needed.
             setTimeout(() => {
                 albumCarousel.classList.remove('is-dragging');
                 evaluateCarouselState(); // Update active/inactive based on final position
             }, 400); // Adjust timeout based on perceived scroll duration
        }
        // --- End Helper Function ---

        // Ensure initial state looks right - briefly make all inactive then let observer correct
        albumCards.forEach(card => card.classList.add('is-inactive'));

        // --- NEW: Set Initial Scroll to Second Card --- 
        if (albumCards.length > 1) {
            const secondCard = albumCards[1];
            const cardLeft = secondCard.offsetLeft;
            const cardWidth = secondCard.offsetWidth;
            const containerWidth = albumCarousel.offsetWidth;
            const targetScrollLeft = cardLeft + cardWidth / 2 - containerWidth / 2;
            albumCarousel.scrollLeft = targetScrollLeft; // Set initial scroll directly
        }
        // --- END: Set Initial Scroll --- 

        // Run observer logic shortly after to set the correct initial active card and dots
        setTimeout(() => {
            evaluateCarouselState(); // A helper function to run the core logic
        }, 50); 

        // Add scroll listener to update dots on manual scroll/swipe
        albumCarousel.addEventListener('scroll', scrollHandler, { passive: true });

        // // Initial evaluation -- MOVED INSIDE setTimeout above to ensure scroll is set first
        // evaluateCarouselState(); 
    }
    
    function evaluateCarouselState() { // Helper to run core logic
         if (!albumCarousel) return;
         const albumCards = albumCarousel.querySelectorAll('.album-card');
         if (albumCards.length === 0) return;

          // Re-implement finding the most centered card logic here
            let closestCard = null;
            let closestIndex = -1;
            let minDistance = Infinity;
            const containerScrollLeft = albumCarousel.scrollLeft;
            const containerCenter = containerScrollLeft + albumCarousel.offsetWidth / 2;

            albumCards.forEach((card, index) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const distance = Math.abs(cardCenter - containerCenter);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCard = card;
                    closestIndex = index; // Store the index of the closest card
                }
            });

            albumCards.forEach((card, index) => {
                if (card === closestCard) {
                    card.classList.remove('is-inactive');
                } else {
                    card.classList.add('is-inactive');
                }
            });

            // --- Update Active Dot ---
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.carousel-dot');
                dots.forEach((dot, index) => {
                    if (index === closestIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
            // --- End Update Active Dot ---
    }

    // Simplified calculation (might not be perfectly accurate)
    function calculateIntersectionRatio(element, container) {
        const elemRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const intersectionLeft = Math.max(elemRect.left, containerRect.left);
        const intersectionRight = Math.min(elemRect.right, containerRect.right);
        const intersectionWidth = Math.max(0, intersectionRight - intersectionLeft);
        
        return intersectionWidth / elemRect.width;
    }

    function destroyAlbumCarousel() {
        if (albumCarouselObserver) {
            albumCarouselObserver.disconnect();
            albumCarouselObserver = null;
        }
        // Reset styles by removing the class
        if (albumCarousel) {
             albumCarousel.querySelectorAll('.album-card').forEach(card => {
                 card.classList.remove('is-inactive');
             });
             // --- Remove Drag Scrolling Listeners ---
             if (albumCarousel._carouselMouseHandlers) {
                 albumCarousel.removeEventListener('mousedown', albumCarousel._carouselMouseHandlers.mousedown);
                 albumCarousel.removeEventListener('mouseleave', albumCarousel._carouselMouseHandlers.mouseleave);
                 albumCarousel.removeEventListener('mouseup', albumCarousel._carouselMouseHandlers.mouseup);
                 albumCarousel.removeEventListener('mousemove', albumCarousel._carouselMouseHandlers.mousemove);
                 delete albumCarousel._carouselMouseHandlers; // Clean up property
             }
             // --- End Remove Drag Scrolling Listeners ---

             // --- Hide and Clear Dots ---
             if (dotsContainer) {
                 dotsContainer.innerHTML = '';
                 dotsContainer.style.display = 'none';
             }
             // --- End Hide and Clear Dots ---
        }
    }

    // Debounce resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initAlbumCarousel(); // Will also call destroy if needed
        }, 250);
    });

    // Initial check on load
    initAlbumCarousel();

    // Make cards with data-url attribute clickable
    function makeCardsClickable() {
        // Select all cards with data-url attribute
        const clickableCards = document.querySelectorAll('.card[data-url], .album-card[data-url], .social-card[data-url]');
        
        clickableCards.forEach(card => {
            // Add cursor pointer style to indicate clickable
            card.style.cursor = 'pointer';
            
            // Add click event listener
            card.addEventListener('click', function(e) {
                // Check if a drag happened before this click
                if (carouselDidDrag) {
                    // If drag occurred, prevent click action
                    e.preventDefault();
                    e.stopPropagation();
                    carouselDidDrag = false; // Reset flag
                    return; 
                }

                // Check if the click was on a link or button inside the card
                if (!e.target.closest('a, button, .social-follow-btn')) {
                    
                    // --- NEW: Carousel Click Handling ---
                    const isMobile = window.innerWidth <= 768;
                    const isAlbumCard = this.classList.contains('album-card');
                    const isInactive = this.classList.contains('is-inactive');
                    const isInCarousel = this.closest('#violinist .block-even');
                    
                    if (isMobile && isAlbumCard && isInactive && isInCarousel) {
                        // Prevent opening the URL if the card is inactive in the mobile carousel
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Scroll the container to center the clicked card
                        const container = this.closest('.block-even');
                        if (container) {
                            const cardRect = this.getBoundingClientRect();
                            const containerRect = container.getBoundingClientRect();
                            
                            // Calculate scroll amount to center the card
                            const scrollLeftTarget = container.scrollLeft + 
                                                     (cardRect.left - containerRect.left) + 
                                                     (cardRect.width / 2) - 
                                                     (containerRect.width / 2);
                                                     
                            container.scrollTo({
                                left: scrollLeftTarget,
                                behavior: 'smooth'
                            });
                        }
                        return; // Stop further execution for this click
                    }
                    // --- END: Carousel Click Handling ---
                    
                    // Original logic: open the card's URL in a new tab
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

    // --- Scroll Handler for Dot Updates ---
    function scrollHandler() {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                evaluateCarouselState();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }
});
