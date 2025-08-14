/* ===== Main JavaScript Functions ===== */

// Global variables
let currentTheme = localStorage.getItem('theme') || 'dark';
let searchQuery = '';
let currentFilter = 'all';
let isSearching = false;

// DOM Elements
const darkModeToggle = document.getElementById('darkModeToggle');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const skillCategories = document.querySelectorAll('.skill-category');
const contactCards = document.querySelectorAll('.contact-card');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupIntersectionObserver();
    animateCounters();
    setupKeyboardNavigation();
    initializeStickyBehavior();
});

// Initialize application
function initializeApp() {
    // Set initial theme
    setTheme(currentTheme);
    

    
    // Initialize contact management
    if (typeof initializeContact === 'function') {
        initializeContact();
    }
    
    // Show welcome message
    setTimeout(() => {
        showEnhancedToast('مرحباً بك في متجر عمر التقني! 🚀', 'info');
    }, 1000);
}

// Setup event listeners
function setupEventListeners() {
    // Dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        searchInput.addEventListener('keypress', handleSearchKeypress);
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
    
    // Product card interactions
    productCards.forEach(card => {
        card.addEventListener('click', handleProductCardClick);
        card.addEventListener('mouseenter', handleProductCardHover);
        card.addEventListener('mouseleave', handleProductCardLeave);
    });
    
    // Skill category interactions
    skillCategories.forEach(category => {
        category.addEventListener('click', handleSkillCategoryClick);
    });
    
    // Contact card interactions
    contactCards.forEach(card => {
        card.addEventListener('click', handleContactCardClick);
    });
    
    // Scroll events
    window.addEventListener('scroll', throttle(handleScroll, 16));
    
    // Resize events
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Keyboard events
    document.addEventListener('keydown', handleGlobalKeydown);
}

// ===== Theme Management =====

function toggleDarkMode() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Show loading state
    darkModeToggle.classList.add('loading');
    darkModeToggle.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // Simulate theme change delay
    setTimeout(() => {
        darkModeToggle.classList.remove('loading');
        updateThemeToggleIcon(newTheme);
        showEnhancedToast(`تم التبديل إلى ${newTheme === 'dark' ? 'الوضع المظلم' : 'الوضع المضيء'}`, 'success');
    }, 500);
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeToggleIcon(theme);
}

function updateThemeToggleIcon(theme) {
    if (darkModeToggle) {
        if (theme === 'dark') {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
}

// ===== Search Functionality =====

function handleSearch(event) {
    searchQuery = event.target.value.trim().toLowerCase();
    
    if (searchQuery.length > 0) {
        searchBtn.classList.add('searching');
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    } else {
        searchBtn.classList.remove('searching');
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        resetSearch();
    }
}

function handleSearchKeypress(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
}

function performSearch() {
    if (searchQuery.length === 0) return;
    
    isSearching = true;
    showLoadingSpinner();
    
    // Simulate search delay
    setTimeout(() => {
        const results = performSearchLogic(searchQuery);
        displaySearchResults(results);
        hideLoadingSpinner();
        isSearching = false;
        
        // Reset search button
        searchBtn.classList.remove('searching');
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        
        showEnhancedToast(`تم العثور على ${results.length} نتيجة`, 'success');
    }, 800);
}

function performSearchLogic(query) {
    const allElements = [...productCards, ...skillCategories, ...contactCards];
    const results = [];
    
    allElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes(query)) {
            results.push(element);
        }
    });
    
    return results;
}

function displaySearchResults(results) {
    // Hide all elements first
    const allElements = [...productCards, ...skillCategories, ...contactCards];
    allElements.forEach(element => {
        element.style.display = 'none';
    });
    
    // Show search results
    results.forEach(element => {
        element.style.display = 'block';
    });
    
    // Update filter buttons
    filterBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-filter="all"]').classList.add('active');
}

function resetSearch() {
    isSearching = false;
    
    // Show all elements
    const allElements = [...productCards, ...skillCategories, ...contactCards];
    allElements.forEach(element => {
        element.style.display = 'block';
    });
    
    // Reset search input
    if (searchInput) {
        searchInput.value = '';
    }
}

// ===== Filter Functionality =====

function handleFilterClick(event) {
    const filter = event.target.dataset.filter;
    
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Apply filter
    applyFilter(filter);
    
    // Show filter message
    const filterNames = {
        'all': 'الكل',
        'mobile': 'تطبيقات الموبايل',
        'web': 'المواقع الإلكترونية',
        'odoo': 'موديولات Odoo',
        'open-source': 'المشاريع المفتوحة'
    };
    
    showEnhancedToast(`تم عرض ${filterNames[filter]}`, 'info');
}

function applyFilter(filter) {
    currentFilter = filter;
    
    if (filter === 'all') {
        showAllElements();
    } else {
        filterElementsByCategory(filter);
    }
}

function showAllElements() {
    const allElements = [...productCards, ...skillCategories, ...contactCards];
    allElements.forEach(element => {
        element.style.display = 'block';
    });
}

function filterElementsByCategory(category) {
    const allElements = [...productCards, ...skillCategories, ...contactCards];
    
    allElements.forEach(element => {
        if (element.dataset.category === category) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
}

// ===== Product Card Interactions =====

function handleProductCardClick(event) {
    const card = event.currentTarget;
    const category = card.dataset.category;
    

    
    // Handle different actions based on button clicked
    const target = event.target;
    if (target.classList.contains('download-btn')) {
        handleDownload(card);
    } else if (target.classList.contains('view-btn')) {
        handleView(card);
    } else if (target.classList.contains('github-btn')) {
        handleGitHub(card);
    } else if (target.classList.contains('details-btn')) {
        handleDetails(card);
    }
}

function handleProductCardHover(event) {
    const card = event.currentTarget;
    card.classList.add('hover-lift');
}

function handleProductCardLeave(event) {
    const card = event.currentTarget;
    card.classList.remove('hover-lift');
}

function handleDownload(card) {
    showLoadingSpinner();
    
    setTimeout(() => {
        hideLoadingSpinner();
        showEnhancedToast('جاري تحميل المنتج...', 'info');
        
        // Simulate download
        setTimeout(() => {
            showEnhancedToast('تم التحميل بنجاح! 🎉', 'success');
        }, 2000);
    }, 1000);
}

function handleView(card) {
    const title = card.querySelector('h4').textContent;
    showEnhancedToast(`جاري فتح ${title}...`, 'info');
    
    // Simulate opening link
    setTimeout(() => {
        showEnhancedToast('تم فتح الرابط في نافذة جديدة', 'success');
    }, 1500);
}

function handleGitHub(card) {
    const title = card.querySelector('h4').textContent;
    showEnhancedToast(`جاري الانتقال إلى GitHub - ${title}`, 'info');
    
    // Simulate GitHub redirect
    setTimeout(() => {
        showEnhancedToast('تم الانتقال إلى GitHub', 'success');
    }, 1500);
}

function handleDetails(card) {
    const title = card.querySelector('h4').textContent;
    const description = card.querySelector('p').textContent;
    const rating = card.querySelector('.rating-value').textContent;
    
    const details = `
        <strong>${title}</strong><br>
        ${description}<br>
        <strong>التقييم:</strong> ${rating}/5
    `;
    
    showEnhancedToast(details, 'info', 5000);
}

// ===== Skill Category Interactions =====

function handleSkillCategoryClick(event) {
    const category = event.currentTarget;
    const title = category.querySelector('h3').textContent;
    
    // Add click animation
    category.classList.add('enhanced-bounce');
    setTimeout(() => {
        category.classList.remove('enhanced-bounce');
    }, 600);
    
    showEnhancedToast(`تم تحديد ${title}`, 'info');
}

// ===== Contact Card Interactions =====

function handleContactCardClick(event) {
    const card = event.currentTarget;
    
    // Add click animation
    card.classList.add('enhanced-bounce');
    setTimeout(() => {
        card.classList.remove('enhanced-bounce');
    }, 600);
    
    showEnhancedToast('تم تحديد معلومات التواصل', 'info');
}

// ===== Scroll Effects =====

function handleScroll() {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Parallax effect for header
    const header = document.querySelector('.header');
    if (header) {
        const scrolled = scrollTop / windowHeight;
        header.style.transform = `translateY(${scrolled * 50}px)`;
    }
    
    // Show/hide FAB
    const fab = document.querySelector('.fab');
    if (fab) {
        if (scrollTop > 300) {
            fab.style.opacity = '1';
            fab.style.transform = 'scale(1)';
        } else {
            fab.style.opacity = '0';
            fab.style.transform = 'scale(0)';
        }
    }
    
    // Animate elements on scroll
    animateElementsOnScroll();
}

function animateElementsOnScroll() {
    const elements = document.querySelectorAll('.product-card, .skill-category, .contact-card, .stat-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in');
        }
    });
}

// ===== Resize Handler =====

function handleResize() {
    // Recalculate layouts
    const container = document.querySelector('.container');
    if (container) {
        container.style.minHeight = `${window.innerHeight}px`;
    }
    
    // Update mobile optimizations
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-optimized');
    } else {
        document.body.classList.remove('mobile-optimized');
    }
}

// ===== Intersection Observer =====

function setupIntersectionObserver() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Animate counters if it's a stats section
                if (entry.target.classList.contains('stat-item')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, options);
    
    // Observe elements
    const elements = document.querySelectorAll('.product-card, .skill-category, .contact-card, .stat-item, .identity-card');
    elements.forEach(element => observer.observe(element));
}

// ===== Counter Animation =====

function animateCounters() {
    const counters = document.querySelectorAll('.counter-animation');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (counter.id === 'totalRating') {
                counter.textContent = current.toFixed(1);
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    });
}

function animateCounter(element) {
    const counter = element.querySelector('.counter-animation');
    if (!counter || counter.dataset.animated === 'true') return;
    
    counter.dataset.animated = 'true';
    const target = parseInt(counter.dataset.target);
    const duration = 1500;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (counter.id === 'totalRating') {
            counter.textContent = current.toFixed(1);
        } else {
            counter.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// ===== Keyboard Navigation =====

function setupKeyboardNavigation() {
    // Add keyboard navigation hints
    document.addEventListener('keydown', (event) => {
        // Ctrl/Cmd + S for search
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            searchInput.focus();
        }
        
        // Ctrl/Cmd + H for header
        if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
            event.preventDefault();
            document.querySelector('.header').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Escape to clear search
        if (event.key === 'Escape') {
            resetSearch();
            searchInput.blur();
        }
    });
}

function handleGlobalKeydown(event) {
    // Number keys for quick filter access
    if (event.key >= '1' && event.key <= '5') {
        const filterIndex = parseInt(event.key) - 1;
        const filterBtn = filterBtns[filterIndex];
        if (filterBtn) {
            filterBtn.click();
        }
    }
}

// ===== Utility Functions =====

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

function showLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'flex';
    }
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== Enhanced Toast Notifications =====

function showEnhancedToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    const iconColor = getToastIconColor(type);
    
    toast.innerHTML = `
        <div class="toast-icon" style="color: ${iconColor}">
            <i class="${icon}"></i>
        </div>
        <div class="toast-message">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, duration);
}

function getToastIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getToastIconColor(type) {
    const colors = {
        success: 'var(--success-color)',
        error: 'var(--error-color)',
        warning: 'var(--warning-color)',
        info: 'var(--info-color)'
    };
    return colors[type] || colors.info;
}

// ===== Performance Monitoring =====

function setupPerformanceMonitoring() {
    // Monitor scroll performance
    let scrollCount = 0;
    let lastScrollTime = performance.now();
    
    const scrollObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.name === 'scroll') {
                scrollCount++;
                const currentTime = performance.now();
                const timeDiff = currentTime - lastScrollTime;
                
                if (timeDiff > 1000) { // Every second
                    const scrollRate = scrollCount / (timeDiff / 1000);
                    console.log(`Scroll rate: ${scrollRate.toFixed(2)} scrolls/second`);
                    
                    if (scrollRate > 60) {
                        console.warn('High scroll rate detected, consider optimization');
                    }
                    
                    scrollCount = 0;
                    lastScrollTime = currentTime;
                }
            }
        }
    });
    
    try {
        scrollObserver.observe({ entryTypes: ['measure'] });
    } catch (e) {
        console.log('Performance monitoring not supported');
    }
}

// ===== Enhanced Sticky Behavior =====
function initializeStickyBehavior() {
    const personalInfoSection = document.querySelector('.personal-info-section');
    const header = document.querySelector('.header');
    
    if (!personalInfoSection || !header) return;
    
    let lastScrollTop = 0;
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class to personal info section
        if (scrollTop > 50) {
            personalInfoSection.classList.add('scrolled');
        } else {
            personalInfoSection.classList.remove('scrolled');
        }
        
        // Add scrolled class to header
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }
    
    // Throttle scroll events for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initial check
    handleScroll();
}

// ===== Initialize Sticky Behavior =====
document.addEventListener('DOMContentLoaded', function() {
    initializeStickyBehavior();
});

// ===== Export Functions for Global Use =====

window.scrollToTop = scrollToTop;
window.revealContactInfo = function() {
    // This will be implemented in contact.js
    console.log('Contact reveal function called');
};
