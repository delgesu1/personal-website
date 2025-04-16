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
            return;
        }
        
        // 1. Handle images that don't have loading attribute already
        const images = document.querySelectorAll('img:not([loading])');
        
        // Identify the hero image and autoplay section - these should not be lazy loaded
        const heroSection = document.querySelector('.hero');
        const featuredVideoSection = document.querySelector('#featured-video-wrapper');
        
        // Create an observer for images
        const imageObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Check if image has a data-src attribute
                        const dataSrc = img.getAttribute('data-src');
                        if (dataSrc) {
                            img.src = dataSrc;
                        }
                        
                        // Add loading="lazy" for native optimization
                        img.setAttribute('loading', 'lazy');
                        
                        // Fade in the image
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.3s ease-in';
                        setTimeout(() => {
                            img.style.opacity = '1';
                        }, 50);
                        
                        // Stop observing this image
                        observer.unobserve(img);
                    }
                });
            },
            { rootMargin: '200px' } // Start loading when image is 200px from viewport
        );
        
        // Apply lazy loading to all images except in hero and featured video sections
        images.forEach(img => {
            // Skip hero section images - load them immediately
            if (heroSection && heroSection.contains(img)) {
                return;
            }
            
            // Skip featured video section images - load them immediately
            if (featuredVideoSection && featuredVideoSection.contains(img)) {
                return;
            }
            
            // Add a placeholder effect
            img.style.opacity = '0';
            
            // For images using background-image CSS, we'd handle differently
            // but we're focusing on <img> tags here
            
            // Start observing
            imageObserver.observe(img);
        });
        
        // 2. Handle iframes (like YouTube embeds)
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
        
        // 3. Handle background images
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
    }

    // Initialize lazy loading when DOM is ready
    initAdvancedLazyLoading();
});