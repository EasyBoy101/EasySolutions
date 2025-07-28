// Enhanced JavaScript functionality for the website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavbar();
    initializeForms();
    initializeAnimations();
    initializeProfilePage();
    initializeContactForm();
    initializePasswordToggle();
    initializeTooltips();
});

// Navbar functionality
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form validation and handling
function initializeForms() {
    // Generic form validation
    const forms = document.querySelectorAll('form[novalidate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            if (form.checkValidity()) {
                handleFormSubmission(form);
            }
            
            form.classList.add('was-validated');
        });
    });

    // Real-time validation
    document.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });

        field.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

// Field validation
function validateField(field) {
    const isValid = field.checkValidity();
    
    field.classList.remove('is-valid', 'is-invalid');
    
    if (field.value.trim() !== '') {
        field.classList.add(isValid ? 'is-valid' : 'is-invalid');
    }

    // Custom validation rules
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(field.value);
        field.classList.toggle('is-valid', isValidEmail);
        field.classList.toggle('is-invalid', !isValidEmail);
    }

    if (field.type === 'password' && field.value) {
        const isStrongPassword = field.value.length >= 8 && 
                                /[A-Z]/.test(field.value) && 
                                /[a-z]/.test(field.value) && 
                                /\d/.test(field.value);
        field.classList.toggle('is-valid', isStrongPassword);
        field.classList.toggle('is-invalid', !isStrongPassword);
    }

    // Password confirmation
    if (field.id === 'confirmPassword' || field.id === 'confirmNewPassword') {
        const passwordField = document.getElementById(field.id.replace('confirm', '').replace('New', ''));
        const passwordsMatch = passwordField && field.value === passwordField.value;
        field.classList.toggle('is-valid', passwordsMatch && field.value !== '');
        field.classList.toggle('is-invalid', !passwordsMatch && field.value !== '');
    }
}

// Handle form submissions
function handleFormSubmission(form) {
    const formData = new FormData(form);
    const formType = form.id;
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="loading"></span> Processing...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showNotification('Success! Your form has been submitted.', 'success');
        
        // Handle specific form types
        switch (formType) {
            case 'loginForm':
                handleLogin(formData);
                break;
            case 'signupForm':
                handleSignup(formData);
                break;
            case 'contactForm':
                handleContact(formData);
                break;
            case 'profileForm':
                handleProfileUpdate(formData);
                break;
            case 'passwordForm':
                handlePasswordChange(formData);
                break;
        }
    }, 2000);
}

// Specific form handlers
function handleLogin(formData) {
    const email = formData.get('loginEmail') || formData.get('email');
    console.log('Login attempt for:', email);
    
    // Simulate successful login
    setTimeout(() => {
        window.location.href = 'profile_page.html';
    }, 1000);
}

function handleSignup(formData) {
    const email = formData.get('signupEmail') || formData.get('email');
    console.log('Signup attempt for:', email);
    
    // Simulate successful signup
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

function handleContact(formData) {
    const email = formData.get('email');
    const message = formData.get('message');
    console.log('Contact form submitted:', { email, message });
    
    // Reset form after successful submission
    setTimeout(() => {
        document.getElementById('contactForm').reset();
        document.getElementById('contactForm').classList.remove('was-validated');
    }, 1000);
}

function handleProfileUpdate(formData) {
    console.log('Profile updated:', Object.fromEntries(formData));
    showNotification('Profile updated successfully!', 'success');
}

function handlePasswordChange(formData) {
    console.log('Password change requested');
    showNotification('Password changed successfully!', 'success');
    
    // Reset password form
    setTimeout(() => {
        document.getElementById('passwordForm').reset();
        document.getElementById('passwordForm').classList.remove('was-validated');
    }, 1000);
}

// Contact form specific functionality
function initializeContactForm() {
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            const messageField = document.getElementById('message');
            if (this.value && messageField.value === '') {
                const serviceMessages = {
                    'web-development': 'I\'m interested in your web development services. Please provide more information about your process and pricing.',
                    'mobile-development': 'I\'d like to discuss a mobile app project. Can we schedule a consultation?',
                    'cloud-solutions': 'I need help with cloud migration. What services do you offer?',
                    'digital-marketing': 'I\'m looking to improve my online presence. What marketing strategies do you recommend?',
                    'cybersecurity': 'I\'m concerned about my business security. Can you help with a security audit?',
                    'it-consulting': 'I need IT consulting services. What areas do you specialize in?'
                };
                
                messageField.value = serviceMessages[this.value] || '';
            }
        });
    }
}

// Password toggle functionality
function initializePasswordToggle() {
    document.querySelectorAll('[id^="toggle"]').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.id.replace('toggle', '').replace('Signup', '').toLowerCase();
            const passwordField = document.getElementById(targetId + 'Password') || 
                                 document.getElementById('signup' + targetId.charAt(0).toUpperCase() + targetId.slice(1) + 'Password') ||
                                 document.getElementById('loginPassword');
            
            if (passwordField) {
                const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordField.setAttribute('type', type);
                
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    });
}

// Profile page functionality
function initializeProfilePage() {
    // Tab switching with URL hash
    const tabLinks = document.querySelectorAll('[data-bs-toggle="pill"]');
    tabLinks.forEach(link => {
        link.addEventListener('click', function() {
            const target = this.getAttribute('href');
            history.pushState(null, null, target);
        });
    });

    // Load tab from URL hash
    if (window.location.hash) {
        const tabLink = document.querySelector(`[href="${window.location.hash}"]`);
        if (tabLink) {
            const tab = new bootstrap.Tab(tabLink);
            tab.show();
        }
    }

    // Profile image upload simulation
//     const profileImageButton = document.querySelector('.profile-avatar button');
//     if (profileImageButton) {
//         profileImageButton.addEventListener('click', function() {
//             // Create hidden file input
//             const fileInput = document.createElement('input');
//             fileInput.type = 'file';
//             fileInput.accept = 'image/*';
//             fileInput.style.display = 'none';
            
//             fileInput.addEventListener('change', function(e) {
//                 const file = e.target.files[0];
//                 if (file) {
//                     const reader = new FileReader();
//                     reader.onload = function(e) {
//                         const img = document.querySelector('.profile-avatar img');
//                         img.src = e.target.result;
//                         showNotification('Profile picture updated!', 'success');
//                     };
//                     reader.readAsDataURL(file);
//                 }
//             });
            
//             document.body.appendChild(fileInput);
//             fileInput.click();
//             document.body.removeChild(fileInput);
//         });
//     }
}

// Animation initialization
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.card, .team-card, .service-card').forEach(el => {
        observer.observe(el);
    });

    // Counter animation
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        observer.observe(counter);
        counter.addEventListener('animateIn', () => {
            animateCounter(counter);
        });
    });
}

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Tooltip initialization
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" aria-label="Close"></button>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Add close functionality
    const closeButton = notification.querySelector('.btn-close');
    closeButton.addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
}

// Get notification icon based on type
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        danger: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Local storage helpers
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
}

// Form data persistence
function saveFormData(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        saveToLocalStorage(`form_${formId}`, data);
    }
}

function loadFormData(formId) {
    const data = loadFromLocalStorage(`form_${formId}`);
    if (data) {
        const form = document.getElementById(formId);
        if (form) {
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = data[key];
                }
            });
        }
    }
}

// Error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    showNotification('An error occurred. Please try again.', 'danger');
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        showNotification,
        saveToLocalStorage,
        loadFromLocalStorage,
        debounce,
        throttle
    };
}