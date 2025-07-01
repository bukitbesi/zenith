/*
-----------------------------------------------
  Zenith SEO Theme JavaScript
  Version: 2.0 (Vanilla JS)
  Author: Mr Bukit Besi
-----------------------------------------------
*/

// Helper function to safely execute code when the DOM is ready
const onDocumentReady = (fn) => {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(fn, 1);
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

// Main Zenith SEO Theme Object
const zenith = {
  // Global theme configuration (from Blogger)
  config: window.znt || {},

  // Initialize all theme functions
  init: function() {
    this.initDarkMode();
    this.initMobileMenu();
    this.initMainMenu();
    this.initSearch();
    this.initStickyHeader();
    this.initLazyLoad();
    this.initBackToTop();
    this.initPostTOC();
    this.initShareButtons();
    this.initCookieNotice();
    // Add other initializations as needed
  },

  // Dark Mode Functionality
  initDarkMode: function() {
    if (!this.config.userDarkMode) return;
    const html = document.documentElement;
    const toggle = document.querySelector('.darkmode-toggle');
    const isDark = localStorage.getItem('znt-dark-mode') === 'true';

    if (isDark) {
      html.classList.add('znt-dark');
    }

    if (toggle) {
      toggle.addEventListener('click', () => {
        html.classList.toggle('znt-dark');
        toggle.classList.toggle('dark-on', html.classList.contains('znt-dark'));
        toggle.classList.toggle('dark-off', !html.classList.contains('znt-dark'));
        localStorage.setItem('znt-dark-mode', html.classList.contains('znt-dark'));
      });
    }
  },

  // Mobile Menu
  initMobileMenu: function() {
    const body = document.body;
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const hideMenu = document.querySelector('.hide-mobile-menu');
    const overlay = document.getElementById('zenith-overlay-main');

    const toggleMenu = (show) => {
      body.classList.toggle('menu-on', show);
    };

    if (menuToggle) {
      menuToggle.addEventListener('click', () => toggleMenu(true));
    }
    if (hideMenu) {
      hideMenu.addEventListener('click', () => toggleMenu(false));
    }
    if (overlay) {
      overlay.addEventListener('click', () => toggleMenu(false));
    }

    // Submenu toggle for mobile
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
      mobileMenu.addEventListener('click', (e) => {
        if (e.target.parentElement.classList.contains('has-sub')) {
          e.preventDefault();
          const parentLi = e.target.parentElement;
          parentLi.classList.toggle('expanded');
          const subMenu = parentLi.querySelector('.sub-menu');
          if (subMenu) {
            // Simple slide toggle using CSS transitions
            if (subMenu.style.maxHeight) {
              subMenu.style.maxHeight = null;
            } else {
              subMenu.style.maxHeight = subMenu.scrollHeight + "px";
            }
          }
        }
      });
    }
  },

  // Desktop Main Menu (Mega Menu)
  initMainMenu: function() {
    const megaMenuItems = document.querySelectorAll('.zenith-mega-menu a[data-shortcode]');
    megaMenuItems.forEach(item => {
      // Logic for fetching and displaying mega menu posts can be added here
      // For now, it ensures the hover effects work via CSS
    });
  },

  // Search Modal
  initSearch: function() {
    const body = document.body;
    const searchToggle = document.querySelector('.search-toggle');
    const searchModal = document.querySelector('.zenith-search-modal');
    const overlay = document.getElementById('zenith-overlay-main');

    const toggleSearch = (show) => {
      body.classList.toggle('search-active', show);
      if (show) {
        setTimeout(() => searchModal.querySelector('.search-input').focus(), 100);
      }
    };
    
    if (searchToggle) {
      searchToggle.addEventListener('click', () => toggleSearch(true));
    }
    if (overlay) {
      overlay.addEventListener('click', (e) => {
          if(body.classList.contains('search-active')) {
              e.preventDefault();
              toggleSearch(false);
          }
      });
    }
  },

  // Sticky Header
  initStickyHeader: function() {
    if (!this.config.stickyMenu) return;
    const headerInner = document.querySelector('.header-inner');
    if (!headerInner) return;
    
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 200) {
        headerInner.classList.add('is-fixed');
        if (scrollTop > lastScrollTop) {
          headerInner.classList.remove('show');
        } else {
          headerInner.classList.add('show');
        }
      } else {
        headerInner.classList.remove('is-fixed', 'show');
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
  },

  // Lazy Loading Images
  initLazyLoad: function() {
      const lazyImages = document.querySelectorAll('.thumbnail[data-src]');
      if ("IntersectionObserver" in window) {
          let lazyImageObserver = new IntersectionObserver((entries, observer) => {
              entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                      let lazyImage = entry.target;
                      lazyImage.style.backgroundImage = `url(${lazyImage.dataset.src})`;
                      lazyImage.classList.add('znt-lazy');
                      lazyImageObserver.unobserve(lazyImage);
                  }
              });
          });
          lazyImages.forEach((lazyImage) => {
              lazyImageObserver.observe(lazyImage);
          });
      } else {
          // Fallback for older browsers
          lazyImages.forEach(img => {
              img.style.backgroundImage = `url(${img.dataset.src})`;
              img.classList.add('znt-lazy');
          });
      }
  },
  
  // Back to Top Button
  initBackToTop: function() {
      const backToTopButton = document.querySelector('.to-top');
      if (!backToTopButton) return;
      window.addEventListener('scroll', () => {
          if (window.pageYOffset > 300) {
              backToTopButton.classList.add('show');
          } else {
              backToTopButton.classList.remove('show');
          }
      });
      backToTopButton.addEventListener('click', (e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  },

  // Post Table of Contents
  initPostTOC: function() {
    const tocContainer = document.querySelector('#znt-toc');
    const tocTitle = document.querySelector('.znt-toc-title');
    if (!tocContainer || !tocTitle) return;

    const postBody = document.querySelector('.post-body');
    const headings = postBody.querySelectorAll('h2, h3, h4');
    if (headings.length < 2) return;

    let tocList = '<ul>';
    headings.forEach((heading, i) => {
      const id = heading.id || `toc-heading-${i}`;
      heading.id = id;
      tocList += `<li><a href="#${id}">${heading.textContent}</a></li>`;
    });
    tocList += '</ul>';
    tocContainer.innerHTML = tocList;
    document.querySelector('.znt-toc-wrap').style.display = 'flex';

    tocTitle.addEventListener('click', function() {
      this.classList.toggle('is-expanded');
      const content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  },
  
  // Share Buttons
  initShareButtons: function() {
      const shareToggle = document.querySelector('.share-toggle');
      const shareModal = document.querySelector('.share-modal');
      const hideModal = document.querySelector('.hide-modal');
      const body = document.body;
      const overlay = document.getElementById('zenith-overlay-main');
      
      const toggleShare = (show) => {
          body.classList.toggle('share-active', show);
      };

      if(shareToggle) shareToggle.addEventListener('click', () => toggleShare(true));
      if(hideModal) hideModal.addEventListener('click', () => toggleShare(false));
      if(overlay) overlay.addEventListener('click', () => {
          if(body.classList.contains('share-active')) toggleShare(false);
      });
  },

  // Cookie Notice
  initCookieNotice: function() {
    if (!this.config.hasCookie) return;
    const cookieNotice = document.querySelector('.zenith-cookie-notice');
    if (!cookieNotice) return;

    if (localStorage.getItem('znt-cookie-accepted') !== 'true') {
        cookieNotice.classList.add('visible');
    }

    const acceptButton = cookieNotice.querySelector('.consent-button');
    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            cookieNotice.classList.remove('visible');
            localStorage.setItem('znt-cookie-accepted', 'true');
        });
    }
  }

};

// Run all initializations when the document is ready
onDocumentReady(zenith.init.bind(zenith));
