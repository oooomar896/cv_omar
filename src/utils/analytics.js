/**
 * Google Analytics 4 Integration
 * Track page views and custom events
 */

class Analytics {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize Google Analytics
   * @param {string} trackingId - GA4 Measurement ID
   */
  init(trackingId) {
    if (typeof window !== 'undefined' && !this.initialized) {
      // Load gtag.js
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      const gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag = gtag;

      gtag('js', new Date());
      gtag('config', trackingId, {
        page_path: window.location.pathname + window.location.search,
      });

      this.initialized = true;
    }
  }

  /**
   * Track page view
   * @param {string} path - Page path
   */
  pageView(path) {
    if (this.initialized && window.gtag) {
      window.gtag('config', this.trackingId, {
        page_path: path,
      });
    }
  }

  /**
   * Track custom event
   * @param {string} eventName - Event name
   * @param {Object} params - Event parameters
   */
  trackEvent(eventName, params = {}) {
    if (this.initialized && window.gtag) {
      window.gtag('event', eventName, params);
    }
  }

  /**
   * Track button click
   * @param {string} buttonName - Button name
   * @param {string} location - Button location
   */
  trackButtonClick(buttonName, location) {
    this.trackEvent('button_click', {
      event_category: 'Engagement',
      event_label: buttonName,
      location: location,
    });
  }

  /**
   * Track external link click
   * @param {string} url - External URL
   */
  trackExternalLink(url) {
    this.trackEvent('external_link_click', {
      event_category: 'Outbound Links',
      event_label: url,
    });
  }

  /**
   * Track social media click
   * @param {string} platform - Social media platform
   */
  trackSocialClick(platform) {
    this.trackEvent('social_click', {
      event_category: 'Social',
      event_label: platform,
    });
  }

  /**
   * Track project view
   * @param {string} projectName - Project name
   */
  trackProjectView(projectName) {
    this.trackEvent('project_view', {
      event_category: 'Projects',
      event_label: projectName,
    });
  }

  /**
   * Track CV download
   */
  trackCVDownload() {
    this.trackEvent('cv_download', {
      event_category: 'Downloads',
      event_label: 'CV',
    });
  }

  /**
   * Track contact form submission
   */
  trackContactFormSubmit() {
    this.trackEvent('contact_form_submit', {
      event_category: 'Contact',
    });
  }

  /**
   * Track time on page
   * @param {number} seconds - Time in seconds
   */
  trackTimeOnPage(seconds) {
    this.trackEvent('time_on_page', {
      event_category: 'Engagement',
      value: seconds,
    });
  }
}

// Export singleton instance
export default new Analytics();

// Helper functions
export const trackPageView = (path) => {
  import('./analytics').then(({ default: analytics }) => {
    analytics.pageView(path);
  });
};

export const trackEvent = (eventName, params) => {
  import('./analytics').then(({ default: analytics }) => {
    analytics.trackEvent(eventName, params);
  });
};

export const trackButtonClick = (buttonName, location) => {
  import('./analytics').then(({ default: analytics }) => {
    analytics.trackButtonClick(buttonName, location);
  });
};

export const trackExternalLink = (url) => {
  import('./analytics').then(({ default: analytics }) => {
    analytics.trackExternalLink(url);
  });
};

export const trackSocialClick = (platform) => {
  import('./analytics').then(({ default: analytics }) => {
    analytics.trackSocialClick(platform);
  });
};

export const trackProjectView = (projectName) => {
  import('./analytics').then(({ default: analytics }) => {
    analytics.trackProjectView(projectName);
  });
};

export const trackCVDownload = () => {
  import('./analytics').then(({ default: analytics }) => {
    analytics.trackCVDownload();
  });
};

export const trackContactFormSubmit = () => {
  import('./analytics').then(({ default: analytics }) => {
    analytics.trackContactFormSubmit();
  });
};
