/**
 * Contact Management Module
 * Handles hidden contact information, reveal/hide functionality, and contact utilities
 */

// Contact information data
const contactData = {
    email: 'oooomar123450@gmail.com',
    phone: '+966-55-853-9717',
    linkedin: 'https://linkedin.com/in/omar-hamid-288385235',
    github: 'https://github.com/oooomar896'
};

// DOM elements
let contactRevealCard;
let hiddenContactInfo;
let revealButton;
let hideButton;
let copyAllButton;

/**
 * Initialize contact module
 */
function initializeContact() {
    // Get DOM elements
    contactRevealCard = document.querySelector('.contact-reveal-card');
    hiddenContactInfo = document.querySelector('.hidden-contact-info');
    revealButton = document.querySelector('.reveal-contact-btn');
    hideButton = document.querySelector('.hide-contact-btn');
    copyAllButton = document.querySelector('.copy-all-btn');

    // Setup event listeners
    if (revealButton) {
        revealButton.addEventListener('click', revealContactInfo);
    }
    
    if (hideButton) {
        hideButton.addEventListener('click', hideContactInfo);
    }
    
    if (copyAllButton) {
        copyAllButton.addEventListener('click', copyAllContactInfo);
    }

    // Initialize contact cards with real data
    initializeContactCards();
}

/**
 * Initialize contact cards with real contact information
 */
function initializeContactCards() {
    // Update email card
    const emailCard = document.querySelector('.contact-card[data-type="email"]');
    if (emailCard) {
        const emailLink = emailCard.querySelector('.contact-link');
        if (emailLink) {
            emailLink.href = `mailto:${contactData.email}`;
            emailLink.textContent = contactData.email;
        }
    }

    // Update phone card
    const phoneCard = document.querySelector('.contact-card[data-type="phone"]');
    if (phoneCard) {
        const phoneLink = phoneCard.querySelector('.contact-link');
        if (phoneLink) {
            phoneLink.href = `tel:${contactData.phone}`;
            phoneLink.textContent = contactData.phone;
        }
    }

    // Update LinkedIn card
    const linkedinCard = document.querySelector('.contact-card[data-type="linkedin"]');
    if (linkedinCard) {
        const linkedinLink = linkedinCard.querySelector('.contact-link');
        if (linkedinLink) {
            linkedinLink.href = contactData.linkedin;
            linkedinLink.textContent = 'LinkedIn Profile';
        }
    }

    // Update GitHub card
    const githubCard = document.querySelector('.contact-card[data-type="github"]');
    if (githubCard) {
        const githubLink = githubCard.querySelector('.contact-link');
        if (githubLink) {
            githubLink.href = contactData.github;
            githubLink.textContent = 'GitHub Profile';
        }
    }
}

/**
 * Reveal contact information
 */
function revealContactInfo() {
    if (!contactRevealCard || !hiddenContactInfo) return;

    // Add reveal animation
    contactRevealCard.classList.add('revealing');
    
    // Show hidden contact info with animation
    hiddenContactInfo.style.display = 'block';
    hiddenContactInfo.classList.add('fade-in');
    
    // Hide reveal button
    if (revealButton) {
        revealButton.style.display = 'none';
    }
    
    // Show hide and copy buttons
    if (hideButton) hideButton.style.display = 'inline-block';
    if (copyAllButton) copyAllButton.style.display = 'inline-block';
    
    // Track contact reveal
    trackContactReveal();
    
    // Show success toast
    if (typeof showEnhancedToast === 'function') {
        showEnhancedToast('Contact information revealed!', 'success');
    }
    
    // Remove reveal animation class after animation completes
    setTimeout(() => {
        contactRevealCard.classList.remove('revealing');
    }, 500);
}

/**
 * Hide contact information
 */
function hideContactInfo() {
    if (!contactRevealCard || !hiddenContactInfo) return;

    // Add hide animation
    hiddenContactInfo.classList.add('fade-out');
    
    // Hide contact info after animation
    setTimeout(() => {
        hiddenContactInfo.style.display = 'none';
        hiddenContactInfo.classList.remove('fade-out');
    }, 300);
    
    // Show reveal button
    if (revealButton) {
        revealButton.style.display = 'inline-block';
    }
    
    // Hide hide and copy buttons
    if (hideButton) hideButton.style.display = 'none';
    if (copyAllButton) copyAllButton.style.display = 'none';
    
    // Show info toast
    if (typeof showEnhancedToast === 'function') {
        showEnhancedToast('Contact information hidden', 'info');
    }
}

/**
 * Copy all contact information to clipboard
 */
function copyAllContactInfo() {
    const contactText = `Contact Information:
📧 Email: ${contactData.email}
📞 Phone: ${contactData.phone}
🔗 LinkedIn: ${contactData.linkedin}
🔗 GitHub: ${contactData.github}`;

    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(contactText).then(() => {
            showCopySuccess();
        }).catch(() => {
            // Fallback to older method
            fallbackCopyTextToClipboard(contactText);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(contactText);
    }
}

/**
 * Fallback copy method for older browsers
 */
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess();
        } else {
            showCopyError();
        }
    } catch (err) {
        showCopyError();
    }
    
    document.body.removeChild(textArea);
}

/**
 * Show copy success message
 */
function showCopySuccess() {
    if (typeof showEnhancedToast === 'function') {
        showEnhancedToast('All contact information copied to clipboard!', 'success');
    }
    
    // Visual feedback on copy button
    if (copyAllButton) {
        copyAllButton.classList.add('copied');
        setTimeout(() => {
            copyAllButton.classList.remove('copied');
        }, 2000);
    }
}

/**
 * Show copy error message
 */
function showCopyError() {
    if (typeof showEnhancedToast === 'function') {
        showEnhancedToast('Failed to copy contact information', 'error');
    }
}

/**
 * Track contact information reveal for analytics
 */
function trackContactReveal() {
    try {
        // Track in localStorage
        const revealCount = parseInt(localStorage.getItem('contactRevealCount') || '0');
        localStorage.setItem('contactRevealCount', (revealCount + 1).toString());
        
        // Track timestamp
        const lastReveal = new Date().toISOString();
        localStorage.setItem('lastContactReveal', lastReveal);
        
        // Track in session
        const sessionReveals = parseInt(sessionStorage.getItem('sessionContactReveals') || '0');
        sessionStorage.setItem('sessionContactReveals', (sessionReveals + 1).toString());
        
        // Console log for development
        console.log('Contact information revealed:', {
            totalReveals: revealCount + 1,
            lastReveal: lastReveal,
            sessionReveals: sessionReveals + 1
        });
        
    } catch (error) {
        console.warn('Failed to track contact reveal:', error);
    }
}

/**
 * Get contact statistics
 */
function getContactStats() {
    try {
        const revealCount = parseInt(localStorage.getItem('contactRevealCount') || '0');
        const lastReveal = localStorage.getItem('lastContactReveal');
        const sessionReveals = parseInt(sessionStorage.getItem('sessionContactReveals') || '0');
        
        return {
            totalReveals: revealCount,
            lastReveal: lastReveal,
            sessionReveals: sessionReveals,
            hasBeenRevealed: revealCount > 0
        };
    } catch (error) {
        console.warn('Failed to get contact stats:', error);
        return {
            totalReveals: 0,
            lastReveal: null,
            sessionReveals: 0,
            hasBeenRevealed: false
        };
    }
}

/**
 * Reset contact statistics (for testing)
 */
function resetContactStats() {
    try {
        localStorage.removeItem('contactRevealCount');
        localStorage.removeItem('lastContactReveal');
        sessionStorage.removeItem('sessionContactReveals');
        console.log('Contact statistics reset');
    } catch (error) {
        console.warn('Failed to reset contact stats:', error);
    }
}

/**
 * Export contact data (for external use)
 */
function exportContactData() {
    return {
        ...contactData,
        stats: getContactStats(),
        exportDate: new Date().toISOString()
    };
}

// Export functions for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeContact,
        revealContactInfo,
        hideContactInfo,
        copyAllContactInfo,
        getContactStats,
        resetContactStats,
        exportContactData
    };
}
