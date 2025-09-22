// LemonPunch V2 - Flat Design JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation mobile toggle
    const navToggle = document.getElementById('nav-toggle-flat');
    const navMenu = document.getElementById('nav-menu-flat');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Navigation links
    document.querySelectorAll('.nav-link-flat').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.nav-link-flat').forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Close mobile menu
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (navToggle) {
                navToggle.classList.remove('active');
            }
            
            // Smooth scroll to section
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Track hover effects
    document.querySelectorAll('.track-flat').forEach(track => {
        track.addEventListener('click', () => {
            // Remove active class from all tracks
            document.querySelectorAll('.track-flat').forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked track
            track.classList.add('active');
            
            // Simulate play action
            const trackTitle = track.querySelector('.track-title-flat').textContent;
            console.log(`Playing: ${trackTitle}`);
            
            // Visual feedback
            track.style.background = 'var(--yellow)';
            setTimeout(() => {
                track.style.background = '';
            }, 200);
        });
    });

    // Album play button
    const playBtn = document.querySelector('.play-btn-flat');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            const isPlaying = playBtn.classList.contains('playing');
            
            if (isPlaying) {
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                playBtn.classList.remove('playing');
            } else {
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playBtn.classList.add('playing');
            }
        });
    }

    // Add to cart buttons
    document.querySelectorAll('.btn-cart-flat').forEach(btn => {
        btn.addEventListener('click', () => {
            const originalText = btn.textContent;
            
            // Visual feedback
            btn.textContent = 'AJOUTÉ !';
            btn.style.background = 'var(--green)';
            btn.style.color = 'var(--white)';
            btn.style.borderColor = 'var(--green)';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.borderColor = '';
            }, 1500);
        });
    });

    // Form submission
    const contactForm = document.querySelector('.form-flat');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-send-flat');
            const originalText = submitBtn.innerHTML;
            
            // Loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVOI...';
            submitBtn.disabled = true;
            
            // Simulate sending
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> ENVOYÉ !';
                submitBtn.style.background = 'var(--green)';
                submitBtn.style.borderColor = 'var(--green)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 2000);
            }, 1000);
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.album-flat, .product-flat, .concert-flat, .stat-flat').forEach(el => {
        observer.observe(el);
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar-flat');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'var(--white)';
            navbar.style.backdropFilter = 'none';
        }
        
        // Update active nav link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link-flat');
        
        let currentSection = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
        
        lastScrollY = currentScrollY;
    });

    // Streaming platform clicks
    document.querySelectorAll('.stream-btn-flat').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Visual feedback
            const platform = btn.classList.contains('spotify-flat') ? 'Spotify' :
                           btn.classList.contains('apple-flat') ? 'Apple Music' :
                           btn.classList.contains('youtube-flat') ? 'YouTube' : 'Streaming';
            
            console.log(`Opening ${platform}...`);
            
            // Animation feedback
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
    });

    // Concert ticket buttons
    document.querySelectorAll('.btn-ticket-flat').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const venue = btn.closest('.concert-flat').querySelector('.venue-flat').textContent;
            console.log(`Booking tickets for ${venue}...`);
            
            // Visual feedback
            const originalText = btn.textContent;
            btn.textContent = 'REDIRECTION...';
            
            setTimeout(() => {
                btn.textContent = originalText;
            }, 1000);
        });
    });

    // Social media buttons
    document.querySelectorAll('.social-btn-flat').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const platform = btn.classList.contains('instagram-flat') ? 'Instagram' :
                           btn.classList.contains('facebook-flat') ? 'Facebook' :
                           btn.classList.contains('twitter-flat') ? 'Twitter' :
                           btn.classList.contains('youtube-flat') ? 'YouTube' : 'Social';
            
            console.log(`Opening ${platform}...`);
            
            // Animation feedback
            btn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        });
    });

    // Product image lazy loading effect
    const productImages = document.querySelectorAll('.product-img-flat');
    productImages.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (navToggle) {
                navToggle.classList.remove('active');
            }
        }
    });

    // Performance optimization
    let ticking = false;
    
    function updateOnScroll() {
        // Throttle scroll events
        if (!ticking) {
            requestAnimationFrame(() => {
                // Add any scroll-based animations here
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateOnScroll, { passive: true });
    
    // Initialize
    console.log('LemonPunch V2 Flat Design loaded successfully!');
});
