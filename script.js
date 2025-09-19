// CivicCare JavaScript Functions
// This file contains all JavaScript functionality for the CivicCare application

/**
 * Password encryption function (demo purposes only)
 * In a real application, password hashing should be done on the server side
 * @param {string} password - The password to encrypt
 * @returns {string} - Base64 encoded password
 */
function encryptPassword(password) {
    // Simple placeholder encryption (demo only)
    // In production, use proper password hashing like bcrypt on the server
    return btoa(password);
}

/**
 * Email validation function
 * @param {string} email - The email to validate
 * @returns {boolean} - True if email is valid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Password validation function
 * @param {string} password - The password to validate
 * @returns {boolean} - True if password meets criteria
 */
function validatePassword(password) {
    // Minimum 6 characters for demo purposes
    // In production, enforce stronger password requirements
    return password && password.length >= 6;
}

/**
 * Aadhaar number validation function
 * @param {string} aadhaar - The Aadhaar number to validate
 * @returns {boolean} - True if Aadhaar number is valid
 */
function validateAadhaar(aadhaar) {
    // Remove any spaces or hyphens
    const cleanAadhaar = aadhaar.replace(/[\s-]/g, '');
    
    // Check if it's exactly 12 digits
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(cleanAadhaar);
}

/**
 * Phone number validation function
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - True if phone number is valid
 */
function validatePhone(phone) {
    // Remove any spaces, hyphens, or plus signs
    const cleanPhone = phone.replace(/[\s\-\+]/g, '');
    
    // Check if it's exactly 10 digits (Indian mobile number format)
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(cleanPhone);
}

/**
 * Format date for display
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-IN', options);
}

/**
 * Generate unique ID for issues/reports
 * @returns {string} - Unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Show success message
 * @param {string} message - The message to display
 */
function showSuccessMessage(message) {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 5000);
}

/**
 * Show error message
 * @param {string} message - The error message to display
 */
function showErrorMessage(message) {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show position-fixed';
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 5000);
}

/**
 * Local storage helper functions
 */
const Storage = {
    /**
     * Save data to local storage
     * @param {string} key - Storage key
     * @param {any} data - Data to store
     */
    save: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },
    
    /**
     * Load data from local storage
     * @param {string} key - Storage key
     * @returns {any} - Retrieved data or null
     */
    load: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    },
    
    /**
     * Remove data from local storage
     * @param {string} key - Storage key
     */
    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }
};

/**
 * Initialize common functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Add smooth scrolling to anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading states to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
                submitButton.disabled = true;
                
                // Re-enable button after 2 seconds (for demo purposes)
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 2000);
            }
        });
    });
});

/**
 * Handle file upload preview (for image/video uploads)
 * @param {HTMLInputElement} input - File input element
 * @param {HTMLElement} previewContainer - Container to show preview
 */
function handleFilePreview(input, previewContainer) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const fileType = file.type;
        
        // Clear previous preview
        previewContainer.innerHTML = '';
        
        if (fileType.startsWith('image/')) {
            // Image preview
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.className = 'img-fluid rounded';
            img.style.maxHeight = '200px';
            previewContainer.appendChild(img);
        } else if (fileType.startsWith('video/')) {
            // Video preview
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.className = 'img-fluid rounded';
            video.style.maxHeight = '200px';
            video.controls = true;
            previewContainer.appendChild(video);
        } else {
            // File info for other types
            const fileInfo = document.createElement('div');
            fileInfo.className = 'alert alert-info';
            fileInfo.innerHTML = `
                <i class="fas fa-file me-2"></i>
                <strong>${file.name}</strong><br>
                <small>Size: ${(file.size / 1024 / 1024).toFixed(2)} MB</small>
            `;
            previewContainer.appendChild(fileInfo);
        }
    }
}

/**
 * Demo data and functions for statistics
 */
const DemoData = {
    // Sample user data for leaderboard
    users: [
        { name: 'Amit Kumar', reports: 15, activities: 8, points: 250, badge: 'Champion', badgeClass: 'bg-warning' },
        { name: 'Priya Sharma', reports: 12, activities: 6, points: 200, badge: 'Contributor', badgeClass: 'bg-primary' },
        { name: 'Rahul Singh', reports: 8, activities: 4, points: 150, badge: 'Contributor', badgeClass: 'bg-primary' }
    ],
    
    // Sample reports data
    reports: [
        {
            id: '1',
            category: 'pothole',
            description: 'Large pothole on Main Street causing traffic issues',
            location: 'Main Street, Sector 15',
            status: 'Verified',
            submitDate: '2024-01-15'
        }
    ]
};

// Export functions for use in other scripts (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        encryptPassword,
        validateEmail,
        validatePassword,
        validateAadhaar,
        validatePhone,
        formatDate,
        generateId,
        showSuccessMessage,
        showErrorMessage,
        Storage,
        handleFilePreview,
        DemoData
    };
}