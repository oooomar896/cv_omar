/* ===== Mobile Device Optimizations ===== */

// Device detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroid = /Android/.test(navigator.userAgent);
const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(navigator.userAgent);

// Mobile-specific variables
let touchStartY = 0;
let touchStartX = 0;
let longPressTimer = null;
let isLongPressing = false;

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', function() {
    if (isMobile) {
        setupMobileOptimizations();
        setupTouchEvents();
        setupMobileGestures();
        optimizeMobilePerformance();
        setupMobileContextMenu();
    }
});

// ===== Mobile Device Detection & Setup =====

function setupMobileOptimizations() {
    // Add mobile-specific classes
    document.body.classList.add('mobile-device');
    
    if (isIOS) {
        document.body.classList.add('ios-device');
        setupIOSOptimizations();
    } else if (isAndroid) {
        document.body.classList.add('android-device');
        setupAndroidOptimizations();
    }
    
    if (isTablet) {
        document.body.classList.add('tablet-device');
    }
    
    // Set viewport meta tag
    setupViewport();
    
    // Handle orientation changes
    setupOrientationHandling();
    
    // Add mobile-specific CSS variables
    addMobileCSSVariables();
}

function setupViewport() {
    let viewport = document.querySelector('meta[name=viewport]');
    if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        document.head.appendChild(viewport);
    }
    
    if (isIOS) {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    } else {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }
}

function setupOrientationHandling() {
    window.addEventListener('orientationchange', function() {
        // Add orientation change class
        document.body.classList.add('orientation-changing');
        
        setTimeout(() => {
            // Recalculate layouts after orientation change
            window.dispatchEvent(new Event('resize'));
            
            // Remove orientation change class
            document.body.classList.remove('orientation-changing');
            
            // Show orientation change message
            showEnhancedToast('تم تغيير اتجاه الشاشة', 'info');
        }, 100);
    });
}

function addMobileCSSVariables() {
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --mobile-touch-target: 44px;
            --mobile-spacing: 16px;
            --mobile-border-radius: 12px;
            --mobile-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .mobile-device .action-btn,
        .mobile-device .filter-btn,
        .mobile-device .search-btn {
            min-height: var(--mobile-touch-target);
            min-width: var(--mobile-touch-target);
        }
        
        .mobile-device .product-card,
        .mobile-device .skill-category,
        .mobile-device .contact-card {
            border-radius: var(--mobile-border-radius);
            box-shadow: var(--mobile-shadow);
        }
    `;
    document.head.appendChild(style);
}

// ===== iOS Specific Optimizations =====

function setupIOSOptimizations() {
    // Prevent zoom on input focus
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.fontSize = '16px';
        });
        
        input.addEventListener('blur', function() {
            this.style.fontSize = '';
        });
    });
    
    // Add iOS momentum scrolling
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Handle iOS safe areas
    if (CSS.supports('padding', 'max(0px)')) {
        const safeAreaStyle = document.createElement('style');
        safeAreaStyle.textContent = `
            .container {
                padding-left: max(var(--spacing-lg), env(safe-area-inset-left));
                padding-right: max(var(--spacing-lg), env(safe-area-inset-right));
            }
            
            .fab {
                bottom: max(30px, env(safe-area-inset-bottom));
                right: max(30px, env(safe-area-inset-right));
            }
            
            .header {
                padding-left: max(0px, env(safe-area-inset-left));
                padding-right: max(0px, env(safe-area-inset-right));
            }
            
            .toast-container {
                top: max(20px, env(safe-area-inset-top));
                right: max(20px, env(safe-area-inset-right));
            }
        `;
        document.head.appendChild(safeAreaStyle);
    }
    
    // Add iOS-specific styles
    const iosStyle = document.createElement('style');
    iosStyle.textContent = `
        .ios-device input,
        .ios-device textarea,
        .ios-device select {
            -webkit-appearance: none;
            border-radius: var(--radius-lg);
        }
        
        .ios-device button {
            -webkit-appearance: none;
            -webkit-tap-highlight-color: transparent;
        }
        
        .ios-device .fab {
            -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
        }
    `;
    document.head.appendChild(iosStyle);
}

// ===== Android Specific Optimizations =====

function setupAndroidOptimizations() {
    // Add Android ripple effect
    const buttons = document.querySelectorAll('.action-btn, .filter-btn, .search-btn, .cta-btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', createRippleEffect);
    });
    
    // Add Android-specific styles
    const androidStyle = document.createElement('style');
    androidStyle.textContent = `
        .android-device .action-btn:active,
        .android-device .filter-btn:active,
        .android-device .search-btn:active {
            transform: scale(0.95);
            transition: transform 0.1s ease;
        }
        
        .android-device .fab {
            -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
        }
        
        .android-ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: androidRipple 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        }
        
        @keyframes androidRipple {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(androidStyle);
}

function createRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('div');
    ripple.className = 'android-ripple';
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.touches[0].clientX - rect.left - size / 2;
    const y = event.touches[0].clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 1000;
    `;
    
    button.style.position = 'relative';
    button.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

// ===== Touch Event Handling =====

function setupTouchEvents() {
    // Handle touch start
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        
        // Start long press timer
        startLongPressTimer(e);
    }, { passive: true });
    
    // Handle touch move for scroll optimization
    document.addEventListener('touchmove', function(e) {
        // Prevent default only for horizontal swipes
        const touchY = e.touches[0].clientY;
        const touchX = e.touches[0].clientX;
        const deltaY = Math.abs(touchY - touchStartY);
        const deltaX = Math.abs(touchX - touchStartX);
        
        if (deltaX > deltaY && deltaX > 50) {
            e.preventDefault();
        }
        
        // Clear long press timer on move
        clearLongPressTimer();
    }, { passive: false });
    
    // Handle touch end
    document.addEventListener('touchend', function(e) {
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        const deltaY = touchStartY - touchEndY;
        const deltaX = touchStartX - touchEndX;
        
        // Clear long press timer
        clearLongPressTimer();
        
        // Detect swipe gestures
        if (Math.abs(deltaY) > 100 || Math.abs(deltaX) > 100) {
            handleSwipeGesture(deltaX, deltaY);
        }
    }, { passive: true });
    
    // Handle touch cancel
    document.addEventListener('touchcancel', function() {
        clearLongPressTimer();
    });
}

function startLongPressTimer(event) {
    longPressTimer = setTimeout(() => {
        isLongPressing = true;
        handleLongPress(event);
    }, 500);
}

function clearLongPressTimer() {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
    isLongPressing = false;
}

function handleLongPress(event) {
    const target = event.target.closest('.product-card, .contact-card, .skill-category');
    if (target) {
        showMobileContextMenu(target, event);
        showEnhancedToast('تم فتح القائمة', 'info');
    }
}

function handleSwipeGesture(deltaX, deltaY) {
    // Swipe up gesture
    if (deltaY > 100 && Math.abs(deltaX) < 50) {
        handleSwipeUp();
    }
    
    // Swipe down gesture
    if (deltaY < -100 && Math.abs(deltaX) < 50) {
        handleSwipeDown();
    }
    
    // Swipe left gesture
    if (deltaX > 100 && Math.abs(deltaY) < 50) {
        handleSwipeLeft();
    }
    
    // Swipe right gesture
    if (deltaX < -100 && Math.abs(deltaY) < 50) {
        handleSwipeRight();
    }
}

function handleSwipeUp() {
    // Scroll to top
    smoothScrollTo('.header');
    showEnhancedToast('تم العودة إلى الأعلى', 'info');
}

function handleSwipeDown() {
    // Scroll to bottom
    smoothScrollTo('.footer');
    showEnhancedToast('تم الانتقال إلى الأسفل', 'info');
}

function handleSwipeLeft() {
    // Next filter
    const activeFilter = document.querySelector('.filter-btn.active');
    const nextFilter = activeFilter.nextElementSibling || document.querySelector('.filter-btn');
    if (nextFilter) {
        nextFilter.click();
        showEnhancedToast('تم الانتقال للفئة التالية', 'info');
    }
}

function handleSwipeRight() {
    // Previous filter
    const activeFilter = document.querySelector('.filter-btn.active');
    const prevFilter = activeFilter.previousElementSibling || document.querySelector('.filter-btn:last-child');
    if (prevFilter) {
        prevFilter.click();
        showEnhancedToast('تم الانتقال للفئة السابقة', 'info');
    }
}

// ===== Mobile Gestures =====

function setupMobileGestures() {
    // Double tap detection
    let lastTap = 0;
    let tapCount = 0;
    
    document.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 500 && tapLength > 0) {
            tapCount++;
            if (tapCount === 2) {
                handleDoubleTap(e);
                tapCount = 0;
            }
        } else {
            tapCount = 1;
        }
        
        lastTap = currentTime;
    });
    
    // Pinch to zoom prevention
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('gesturechange', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('gestureend', function(e) {
        e.preventDefault();
    });
}

function handleDoubleTap(e) {
    const target = e.target.closest('.product-card, .contact-card, .skill-category');
    if (target) {
        // Add double tap highlight
        target.classList.add('double-tap-highlight');
        setTimeout(() => {
            target.classList.remove('double-tap-highlight');
        }, 300);
        
        showEnhancedToast('تم تحديد العنصر', 'info');
    }
}

// ===== Mobile Context Menu =====

function setupMobileContextMenu() {
    // Add context menu styles
    const contextMenuStyle = document.createElement('style');
    contextMenuStyle.textContent = `
        .mobile-context-menu {
            position: fixed;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            z-index: 10000;
            min-width: 150px;
            padding: var(--spacing-sm);
            animation: contextMenuSlideIn 0.2s ease-out;
        }
        
        .context-menu-item {
            padding: var(--spacing-md);
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: all var(--transition-fast);
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            color: var(--text-primary);
        }
        
        .context-menu-item:hover {
            background: var(--bg-secondary);
        }
        
        .context-menu-item:active {
            background: var(--primary-color);
            color: white;
        }
        
        @keyframes contextMenuSlideIn {
            from {
                opacity: 0;
                transform: scale(0.8) translateY(-10px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .double-tap-highlight {
            animation: doubleTapPulse 0.3s ease-out;
        }
        
        @keyframes doubleTapPulse {
            0% {
                transform: scale(1);
                box-shadow: var(--shadow-md);
            }
            50% {
                transform: scale(1.05);
                box-shadow: var(--shadow-xl);
            }
            100% {
                transform: scale(1);
                box-shadow: var(--shadow-md);
            }
        }
    `;
    document.head.appendChild(contextMenuStyle);
}

function showMobileContextMenu(target, event) {
    // Remove existing context menu
    const existingMenu = document.querySelector('.mobile-context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    const contextMenu = document.createElement('div');
    contextMenu.className = 'mobile-context-menu';
    
    const category = target.dataset.category || 'project';
    const title = target.querySelector('h3, h4')?.textContent || 'العنصر';
    
    contextMenu.innerHTML = `
        <div class="context-menu-item" onclick="shareItem('${category}', '${title}')">
            <i class="fas fa-share"></i>
            مشاركة
        </div>
        <div class="context-menu-item" onclick="addToFavorites('${category}', '${title}')">
            <i class="fas fa-heart"></i>
            إضافة للمفضلة
        </div>
        <div class="context-menu-item" onclick="copyLink('${category}', '${title}')">
            <i class="fas fa-link"></i>
            نسخ الرابط
        </div>
        <div class="context-menu-item" onclick="closeContextMenu()">
            <i class="fas fa-times"></i>
            إغلاق
        </div>
    `;
    
    // Position context menu
    const rect = target.getBoundingClientRect();
    const touch = event.touches[0];
    
    let left = touch.clientX;
    let top = touch.clientY;
    
    // Ensure menu stays within viewport
    const menuWidth = 150;
    const menuHeight = 200;
    
    if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - 10;
    }
    
    if (top + menuHeight > window.innerHeight) {
        top = top - menuHeight - 10;
    }
    
    contextMenu.style.left = `${left}px`;
    contextMenu.style.top = `${top}px`;
    
    document.body.appendChild(contextMenu);
    
    // Auto-hide context menu
    setTimeout(() => {
        if (contextMenu.parentNode) {
            contextMenu.remove();
        }
    }, 5000);
    
    // Hide on touch outside
    document.addEventListener('touchstart', function hideMenu() {
        if (contextMenu.parentNode) {
            contextMenu.remove();
        }
        document.removeEventListener('touchstart', hideMenu);
    });
}

function closeContextMenu() {
    const contextMenu = document.querySelector('.mobile-context-menu');
    if (contextMenu) {
        contextMenu.remove();
    }
}

// ===== Mobile Utility Functions =====

function shareItem(type, title) {
    if (navigator.share) {
        navigator.share({
            title: 'متجر عمر التقني',
            text: `تحقق من ${title} في متجر عمر التقني!`,
            url: window.location.href
        }).then(() => {
            showEnhancedToast('تم المشاركة بنجاح', 'success');
        }).catch(() => {
            showEnhancedToast('فشل في المشاركة', 'error');
        });
    } else {
        // Fallback for devices without Web Share API
        copyToClipboard(window.location.href);
        showEnhancedToast('تم نسخ الرابط', 'success');
    }
    
    closeContextMenu();
}

function addToFavorites(type, title) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const item = { type, title, date: new Date().toISOString() };
    
    if (!favorites.find(fav => fav.type === type && fav.title === title)) {
        favorites.push(item);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showEnhancedToast('تمت الإضافة للمفضلة', 'success');
    } else {
        showEnhancedToast('موجود بالفعل في المفضلة', 'info');
    }
    
    closeContextMenu();
}

function copyLink(type, title) {
    copyToClipboard(window.location.href);
    showEnhancedToast('تم نسخ الرابط', 'success');
    closeContextMenu();
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        
        document.body.removeChild(textArea);
    }
}

// ===== Mobile Performance Optimization =====

function optimizeMobilePerformance() {
    // Reduce animations on mobile
    if (window.innerWidth <= 768) {
        document.body.style.setProperty('--animation-duration', '0.3s');
        document.body.style.setProperty('--transition-duration', '0.2s');
    }
    
    // Optimize scroll performance
    let ticking = false;
    
    function updateScroll() {
        // Update scroll-based animations
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Optimize touch events
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });
    document.addEventListener('touchend', function() {}, { passive: true });
    
    // Reduce motion for mobile
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.style.setProperty('--animation-duration', '0.1s');
        document.body.style.setProperty('--transition-duration', '0.1s');
    }
}

// ===== Mobile Accessibility =====

function setupMobileAccessibility() {
    // Increase touch targets
    const touchTargets = document.querySelectorAll('.action-btn, .filter-btn, .search-btn, .fab');
    touchTargets.forEach(target => {
        target.style.minHeight = '44px';
        target.style.minWidth = '44px';
    });
    
    // Add mobile-specific ARIA labels
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.setAttribute('aria-label', `منتج ${index + 1}`);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
    });
    
    // Add mobile navigation hints
    const mobileNavHint = document.createElement('div');
    mobileNavHint.className = 'mobile-nav-hint';
    mobileNavHint.innerHTML = `
        <p>💡 نصائح للأجهزة المحمولة:</p>
        <ul>
            <li>اسحب لأعلى/أسفل للتنقل</li>
            <li>اضغط مطولاً لفتح القائمة</li>
            <li>اضغط مرتين لتحديد العنصر</li>
        </ul>
    `;
    
    // Add mobile nav hint styles
    const mobileNavStyle = document.createElement('style');
    mobileNavStyle.textContent = `
        .mobile-nav-hint {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            padding: var(--spacing-md);
            margin: var(--spacing-md) 0;
            font-size: var(--font-size-sm);
            color: var(--text-secondary);
        }
        
        .mobile-nav-hint ul {
            margin: var(--spacing-sm) 0 0 0;
            padding-left: var(--spacing-lg);
        }
        
        .mobile-nav-hint li {
            margin-bottom: var(--spacing-xs);
        }
        
        @media (max-width: 768px) {
            .mobile-nav-hint {
                display: block;
            }
        }
        
        @media (min-width: 769px) {
            .mobile-nav-hint {
                display: none;
            }
        }
    `;
    document.head.appendChild(mobileNavStyle);
    
    // Insert hint after header
    const header = document.querySelector('.header');
    if (header && isMobile) {
        header.parentNode.insertBefore(mobileNavHint, header.nextSibling);
    }
}

// ===== Mobile Analytics =====

function trackMobileUsage() {
    if (isMobile) {
        // Track mobile device type
        const deviceInfo = {
            isMobile: isMobile,
            isIOS: isIOS,
            isAndroid: isAndroid,
            isTablet: isTablet,
            userAgent: navigator.userAgent,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight
        };
        
        // Store device info
        localStorage.setItem('mobileDeviceInfo', JSON.stringify(deviceInfo));
        
        // Track mobile interactions
        trackMobileInteractions();
    }
}

function trackMobileInteractions() {
    let touchCount = 0;
    let swipeCount = 0;
    let longPressCount = 0;
    
    // Track touch events
    document.addEventListener('touchstart', () => {
        touchCount++;
        updateMobileStats();
    });
    
    // Track swipe gestures
    const originalHandleSwipeGesture = handleSwipeGesture;
    handleSwipeGesture = function(deltaX, deltaY) {
        swipeCount++;
        updateMobileStats();
        originalHandleSwipeGesture(deltaX, deltaY);
    };
    
    // Track long press
    const originalHandleLongPress = handleLongPress;
    handleLongPress = function(event) {
        longPressCount++;
        updateMobileStats();
        originalHandleLongPress(event);
    };
    
    function updateMobileStats() {
        const stats = {
            touchCount,
            swipeCount,
            longPressCount,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('mobileInteractionStats', JSON.stringify(stats));
    }
}

// ===== Initialize Mobile Features =====

// Setup mobile accessibility
setupMobileAccessibility();

// Track mobile usage
trackMobileUsage();

// Export mobile functions for global use
window.showMobileContextMenu = showMobileContextMenu;
window.closeContextMenu = closeContextMenu;
window.shareItem = shareItem;
window.addToFavorites = addToFavorites;
window.copyLink = copyLink;
