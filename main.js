/* main.js */
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if(mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('is-active');
            navMenu.classList.toggle('active');
        });
    }

    // Scroll Animation for elements
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0,
        rootMargin: "0px 0px -100px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(
        entries,
        observer
    ) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
    
    // Add fade-in classes to sections automatically
    const sections = document.querySelectorAll('.section .container > *');
    sections.forEach(section => {
        section.classList.add('fade-in');
        appearOnScroll.observe(section);
    });
});
