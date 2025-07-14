// DOM Elements
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// Hamburger menu functionality
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Close mobile menu on window resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Scroll effect for navbar
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Add scrolled class when user scrolls down
    if (scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active navigation link based on current section
    updateActiveNavLink();
});

// Function to update active navigation link
function updateActiveNavLink() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to current section link
            if (navLinks[index]) {
                navLinks[index].classList.add('active');
            }
        }
    });
}

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navHeight = navbar.offsetHeight;
            const offsetTop = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
    
    // Add hover sound effect simulation (only for desktop)
    link.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
            link.style.transform = 'translateY(-2px) scale(1.05)';
        }
    });
    
    link.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) {
            link.style.transform = 'translateY(0) scale(1)';
        }
    });
});

// Intersection Observer for section animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 0.8s ease';
    sectionObserver.observe(section);
});

// Add ripple effect to navigation links
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .nav-link {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-link.active::after {
        width: 80%;
        background: linear-gradient(90deg, #ff6b6b, #ffa726);
    }
    
    .nav-link.active {
        color: #fff !important;
        background: rgba(255, 255, 255, 0.15) !important;
    }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set first section as active initially
    if (navLinks.length > 0) {
        navLinks[0].classList.add('active');
    }
    
    // Show first section immediately
    if (sections.length > 0) {
        sections[0].style.opacity = '1';
        sections[0].style.transform = 'translateY(0)';
    }
});

// Add parallax effect to sections
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * 0.5;
    
    sections.forEach((section, index) => {
        if (index % 2 === 0) {
            section.style.transform = `translateY(${parallax * 0.1}px)`;
        }
    });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToNextSection();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToPrevSection();
    }
});

function scrollToNextSection() {
    const currentScroll = window.scrollY;
    const navHeight = navbar.offsetHeight;
    const nextSection = Array.from(sections).find(section => 
        section.offsetTop > currentScroll + 100
    );
    
    if (nextSection) {
        window.scrollTo({
            top: nextSection.offsetTop - navHeight,
            behavior: 'smooth'
        });
    }
}

function scrollToPrevSection() {
    const currentScroll = window.scrollY;
    const navHeight = navbar.offsetHeight;
    const prevSection = Array.from(sections).reverse().find(section => 
        section.offsetTop < currentScroll - 100
    );
    
    if (prevSection) {
        window.scrollTo({
            top: prevSection.offsetTop - navHeight,
            behavior: 'smooth'
        });
    }
}