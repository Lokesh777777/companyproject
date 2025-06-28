// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#FFFFFF';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Initialize EmailJS
    emailjs.init("YOUR_PUBLIC_KEY"); // You'll need to replace this with actual EmailJS public key

    // Contact form handling with email integration
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!data.name || !data.phone || !data.service) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Phone number validation (Indian format)
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(data.phone.replace(/\s+/g, ''))) {
                showNotification('Please enter a valid 10-digit phone number.', 'error');
                return;
            }

            // Email validation (if provided)
            if (data.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    showNotification('Please enter a valid email address.', 'error');
                    return;
                }
            }

            // Prepare email template parameters
            const templateParams = {
                customer_name: data.name,
                customer_phone: data.phone,
                customer_email: data.email || 'Not provided',
                service_type: data.service,
                project_details: data.message || 'No additional details provided',
                submission_date: new Date().toLocaleDateString('en-IN'),
                submission_time: new Date().toLocaleTimeString('en-IN')
            };

            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Send email using EmailJS
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
                .then(function(response) {
                    console.log('Email sent successfully:', response);
                    showNotification('Thank you! Your quote request has been sent to our team. We will contact you within 24 hours.', 'success');
                    quoteForm.reset();
                })
                .catch(function(error) {
                    console.error('Email sending failed:', error);
                    // Fallback: Create mailto link
                    sendViaMailto(templateParams);
                    showNotification('Quote request prepared. Please send the email that just opened, or call us directly.', 'info');
                })
                .finally(function() {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });
        });
    }

    // Fallback function to create mailto link
    function sendViaMailto(data) {
        const subject = encodeURIComponent(`Quote Request from ${data.customer_name} - J.N. Wood Industries`);
        const body = encodeURIComponent(`
Dear J.N. Wood Industries Team,

I would like to request a quote for your services.

Customer Details:
- Name: ${data.customer_name}
- Phone: ${data.customer_phone}
- Email: ${data.customer_email}
- Service Required: ${data.service_type}

Project Details:
${data.project_details}

Submitted on: ${data.submission_date} at ${data.submission_time}

Please contact me at your earliest convenience.

Thank you!
        `);
        
        const mailtoLink = `mailto:gayatri_nirmala@yahoo.co.in?subject=${subject}&body=${body}`;
        window.open(mailtoLink);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .location-card, .feature');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Click to call functionality
    const phoneNumbers = document.querySelectorAll('p:contains("Phone:")');
    phoneNumbers.forEach(p => {
        const phoneText = p.textContent;
        if (phoneText.includes('Phone:')) {
            p.style.cursor = 'pointer';
            p.addEventListener('click', function() {
                const phone = phoneText.match(/\d{8,}/)[0];
                window.location.href = `tel:+91${phone}`;
            });
        }
    });
});

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;

    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#10B981';
            break;
        case 'error':
            notification.style.backgroundColor = '#EF4444';
            break;
        case 'info':
            notification.style.backgroundColor = '#3B82F6';
            break;
        default:
            notification.style.backgroundColor = '#3B82F6';
    }

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color) !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

console.log('J.N. Wood Industries website loaded successfully!');