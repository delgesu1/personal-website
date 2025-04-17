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
});