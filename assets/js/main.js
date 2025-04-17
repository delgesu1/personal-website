// Main JavaScript for Daniel Kurganov Website

document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('.header');
    const heroSection = document.querySelector('.hero');
    let heroHeight;
    let lastScrollY = 0;
    let ticking = false;
    
    function updateHeroHeight() {
        heroHeight = heroSection.offsetHeight;
    }
    
    updateHeroHeight();
    window.addEventListener('resize', updateHeroHeight);
    
    // Enhanced scroll effect with smooth transitions
    function handleScroll() {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (lastScrollY > 20) {
                    // Start transition once we scroll past 20px
                    header.classList.add('scrolled');
                } else {
                    // Remove the scrolled class when at the top
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            
            ticking = true;
        }
    }
    
    // Initial check for page load position
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Mobile Menu Functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    
    // Toggle mobile menu on hamburger icon click
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close mobile menu when close button is clicked
    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }
    
    // Close mobile menu when overlay is clicked
    if (mobileMenuOverlay && mobileMenu) {
        mobileMenuOverlay.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }
    
    // Close mobile menu when a mobile nav link is clicked
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // IMPROVED YOUTUBE LOADING - Load YouTube videos after page is fully loaded
    function loadDeferredVideos() {
        const deferredVideos = document.querySelectorAll('iframe[data-src]');
        
        deferredVideos.forEach(video => {
            // Only set the src if it hasn't been set yet
            if (video.getAttribute('data-src') && !video.src) {
                // Check if this is the featured video which should load immediately
                const isFeatureVideo = video.closest('#featured-video-wrapper') !== null;
                
                if (isFeatureVideo) {
                    // Featured video loads immediately
                    video.src = video.getAttribute('data-src');
                    video._loadTime = Date.now();
                    console.log('Loading featured video immediately:', video.getAttribute('data-src'));
                } else {
                    // Use lazy loading for other videos
                    const observer = new IntersectionObserver(entries => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                setTimeout(() => {
                                    entry.target.src = entry.target.getAttribute('data-src');
                                    entry.target._loadTime = Date.now();
                                    console.log('Lazy loading video:', entry.target.getAttribute('data-src'));
                                    observer.unobserve(entry.target);
                                }, 500); // Small delay for better performance
                            }
                        });
                    }, { rootMargin: '200px' }); // Load videos when they're within 200px of viewport
                    
                    observer.observe(video);
                }
            }
        });
    }
    
    // Wait until the page is fully loaded before initializing video loading
    window.addEventListener('load', loadDeferredVideos);

    // Enhanced Lazy Loading Implementation
    function initAdvancedLazyLoading() {
        // Skip if IntersectionObserver is not supported (fallback to native lazy loading)
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported, falling back to native lazy loading');
            
            // Fallback for browsers without IntersectionObserver - load all data-src images immediately
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.getAttribute('data-src');
            });
            
            return;
        }
        
        // Identify the hero image and autoplay section - these should not be lazy loaded
        const heroSection = document.querySelector('.hero');
        const featuredVideoSection = document.querySelector('#featured-video-wrapper');
        
        // 1. First pass: Process all data-src images
        const lazyImages = document.querySelectorAll('img[data-src]');
        console.log('Found', lazyImages.length, 'images with data-src');
        
        if (lazyImages.length > 0) {
            // Create an observer for images
            const imageObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            
                            // Get the data-src value
                            const dataSrc = img.getAttribute('data-src');
                            if (dataSrc) {
                                console.log('Loading image:', dataSrc);
                                img.src = dataSrc;
                                img.removeAttribute('data-src'); // Clean up
                            }
                            
                            // Ensure image is visible
                            if (img.style.opacity === '0') {
                                img.style.transition = 'opacity 0.3s ease-in';
                                setTimeout(() => {
                                    img.style.opacity = '1';
                                }, 50);
                            }
                            
                            // Stop observing this image
                            observer.unobserve(img);
                        }
                    });
                },
                { rootMargin: '200px' } // Start loading when image is 200px from viewport
            );
            
            // Apply lazy loading to all images with data-src
            lazyImages.forEach(img => {
                // Skip hero section images - load them immediately
                if (heroSection && heroSection.contains(img)) {
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    return;
                }
                
                // Skip featured video section images - load them immediately
                if (featuredVideoSection && featuredVideoSection.contains(img)) {
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    return;
                }
                
                // Set initial opacity for fade-in effect
                if (!img.style.opacity) {
                    img.style.opacity = '0';
                }
                
                // Start observing
                imageObserver.observe(img);
            });
        }
        
        // 2. Second pass: Handle any other images that don't already have loading="lazy"
        const nonLazyImages = document.querySelectorAll('img:not([loading]):not([data-src])');
        
        nonLazyImages.forEach(img => {
            // Skip hero and featured sections
            if ((heroSection && heroSection.contains(img)) || 
                (featuredVideoSection && featuredVideoSection.contains(img))) {
                return;
            }
            
            // Add native lazy loading
            img.setAttribute('loading', 'lazy');
        });
        
        // 3. Handle iframes (like YouTube embeds)
        const iframes = document.querySelectorAll('iframe:not([data-src])');
        iframes.forEach(iframe => {
            // Skip iframes already handled by our custom video loader
            if (iframe.hasAttribute('data-src')) {
                return;
            }
            
            // Skip iframes in featured video section
            if (featuredVideoSection && featuredVideoSection.contains(iframe)) {
                return;
            }
            
            // Store the src
            const src = iframe.src;
            iframe.removeAttribute('src');
            iframe.setAttribute('data-src', src);
            
            // Observe the iframe
            const iframeObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const iframe = entry.target;
                            iframe.src = iframe.getAttribute('data-src');
                            observer.unobserve(iframe);
                        }
                    });
                },
                { rootMargin: '200px' }
            );
            
            iframeObserver.observe(iframe);
        });
        
        // 4. Handle background images
        const elementsWithBackgroundImages = document.querySelectorAll('[data-bg]');
        elementsWithBackgroundImages.forEach(el => {
            const bgObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const element = entry.target;
                            element.style.backgroundImage = `url(${element.getAttribute('data-bg')})`;
                            observer.unobserve(element);
                        }
                    });
                },
                { rootMargin: '200px' }
            );
            
            bgObserver.observe(el);
        });
        
        console.log('Lazy loading initialized');
    }

    // Initialize lazy loading when DOM is ready
    initAdvancedLazyLoading();

    // --- Mobile Album Carousel Logic ---
    const carouselContainer = document.querySelector('#violinist .block-even');
    const carouselCards = carouselContainer ? carouselContainer.querySelectorAll('.album-card') : [];
    const dotsContainer = document.querySelector('.carousel-dots');
    let dots = [];

    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    function updateCarouselState() {
        if (!carouselContainer || carouselCards.length === 0 || window.innerWidth > 768) {
             // Reset styles if not on mobile or carousel doesn't exist
            carouselCards.forEach(card => card.classList.remove('is-inactive'));
            if (dots.length > 0) {
                 dots.forEach(dot => dot.classList.remove('active'));
                 if(dots[0]) dots[0].classList.add('active'); // Default to first dot
            }
            return; // Exit if not on mobile or no carousel
        }

        const containerRect = carouselContainer.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        let activeIndex = -1;
        let minDistance = Infinity;

        carouselCards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(containerCenter - cardCenter);

            if (distance < minDistance) {
                minDistance = distance;
                activeIndex = index;
            }
        });

        carouselCards.forEach((card, index) => {
            if (index === activeIndex) {
                card.classList.remove('is-inactive');
            } else {
                card.classList.add('is-inactive');
            }
        });

        // Update dots
        if (dots.length > 0) {
            dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }

    function setupCarouselDots() {
        if (!carouselContainer || !dotsContainer || carouselCards.length === 0) return;

        // Clear existing dots
        dotsContainer.innerHTML = '';
        dots = [];

        carouselCards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to album ${index + 1}`);
            dot.addEventListener('click', () => {
                carouselCards[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            });
            dotsContainer.appendChild(dot);
            dots.push(dot);
        });
         // Initial state update after creating dots
        updateCarouselState();
    }

    function setupCarouselDrag() {
         if (!carouselContainer || window.innerWidth > 768) return;

         let isDown = false;
         let startX;
         let scrollLeft;

         carouselContainer.addEventListener('mousedown', (e) => {
             isDown = true;
             carouselContainer.classList.add('is-dragging');
             startX = e.pageX - carouselContainer.offsetLeft;
             scrollLeft = carouselContainer.scrollLeft;
         });

         carouselContainer.addEventListener('mouseleave', () => {
             if (!isDown) return;
             isDown = false;
             carouselContainer.classList.remove('is-dragging');
         });

         carouselContainer.addEventListener('mouseup', () => {
             if (!isDown) return;
             isDown = false;
             carouselContainer.classList.remove('is-dragging');
             // Delay update slightly after mouseup to allow scroll snap to finish
             setTimeout(updateCarouselState, 150);
         });

         carouselContainer.addEventListener('mousemove', (e) => {
             if (!isDown) return;
             e.preventDefault();
             const x = e.pageX - carouselContainer.offsetLeft;
             const walk = (x - startX) * 2; // Adjust scroll speed factor if needed
             carouselContainer.scrollLeft = scrollLeft - walk;
         });

         // Touch events for mobile dragging
         carouselContainer.addEventListener('touchstart', (e) => {
             isDown = true;
             carouselContainer.classList.add('is-dragging');
             startX = e.touches[0].pageX - carouselContainer.offsetLeft;
             scrollLeft = carouselContainer.scrollLeft;
         }, { passive: false }); // Allow preventDefault

         carouselContainer.addEventListener('touchmove', (e) => {
             if (!isDown) return;
             // Prevent page scroll while dragging carousel
             e.preventDefault();
             const x = e.touches[0].pageX - carouselContainer.offsetLeft;
             const walk = (x - startX) * 2;
             carouselContainer.scrollLeft = scrollLeft - walk;
         }, { passive: false }); // Allow preventDefault

         const touchEndHandler = () => {
             if (!isDown) return;
             isDown = false;
             carouselContainer.classList.remove('is-dragging');
             // Use IntersectionObserver or scrollend for more robust active state update
             // For now, a timeout after touchend
             setTimeout(updateCarouselState, 150);
         };

         carouselContainer.addEventListener('touchend', touchEndHandler);
         carouselContainer.addEventListener('touchcancel', touchEndHandler); // Handle interruption
    }


    if (carouselContainer) {
        // Debounced update on scroll
        carouselContainer.addEventListener('scroll', debounce(updateCarouselState, 50));

        // Setup dots and initial state check on load and resize
        setupCarouselDots();
        setupCarouselDrag(); // Setup drag listeners
        
        // Add click listener to cards for focus scroll
        carouselCards.forEach(card => {
            card.addEventListener('click', (event) => {
                // Only intercept click if on mobile and the card is inactive
                if (window.innerWidth <= 768 && card.classList.contains('is-inactive')) {
                    event.preventDefault(); // Prevent link navigation
                    card.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }
                // If the card is active (not .is-inactive), the click proceeds normally
            });
        });

        window.addEventListener('resize', debounce(() => {
             setupCarouselDots(); // Re-setup dots if needed (e.g., window resize crosses 768px)
             setupCarouselDrag(); // Re-setup drag listeners based on new size
             updateCarouselState(); // Update state based on new size
             // Re-add click listeners if cards were re-evaluated (though unlikely here)
        }, 250));

        // Initial check in case carousel is already scrolled
        updateCarouselState();
    }

});