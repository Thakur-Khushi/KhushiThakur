// ===== GLOBAL SELECTIONS =====
const navItems = document.querySelectorAll('.bottom-navigation .list');
const indicator = document.querySelector('.bottom-navigation .indicator');
const indicatorIcon = indicator.querySelector('ion-icon');
const sections = document.querySelectorAll('section');
const themeToggles = document.querySelectorAll('.theme-toggle');
const typedTextSpan = document.getElementById('typed-text');

// ===== GLOBAL VARIABLES =====
let isDarkTheme = true;
let professionIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout;

// ===== INDICATOR FUNCTIONALITY =====
function updateIndicator(activeItem) {
  navItems.forEach((item) => {
    item.classList.remove('active');
    const icon = item.querySelector('.icon');
    if (icon) {
      icon.style.opacity = '1';
    }
  });

  activeItem.classList.add('active');
  const icon = activeItem.querySelector('.icon');
  if (icon) {
    icon.style.opacity = '0';
  }

  const offset = activeItem.offsetLeft;
  indicator.style.left = `${offset}px`;

  const activeIconName = icon.querySelector('ion-icon').getAttribute('name');
  indicatorIcon.setAttribute('name', activeIconName);
}

// ===== SCROLL-BASED INDICATOR =====
function updateActiveSection() {
  let current = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach((item) => {
    const link = item.querySelector('a');
    if (link && link.getAttribute('href').slice(1) === current) {
      updateIndicator(item);
    }
  });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

// ===== THEME TOGGLE FUNCTIONALITY =====
function toggleTheme() {
  document.body.classList.toggle('light-theme');
  isDarkTheme = !isDarkTheme;

  // Change icon text 🌙 or ☀️
  themeToggles.forEach((btn) => {
    btn.textContent = isDarkTheme ? '🌙' : '☀️';
  });

  // Save theme preference to localStorage
  localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

function loadThemePreference() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    isDarkTheme = false;
    themeToggles.forEach((btn) => {
      btn.textContent = '☀️';
    });
  }
}

// ===== TYPING ANIMATION =====
const professions = [
  'Web Developer',
  'Frontend Developer',
  'UI/UX Designer',
  'Problem Solver',
];

function typeWriter() {
  const currentProfession = professions[professionIndex];

  if (isDeleting) {
    typedTextSpan.textContent = currentProfession.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedTextSpan.textContent = currentProfession.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentProfession.length) {
    isDeleting = true;
    typingTimeout = setTimeout(typeWriter, 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    professionIndex = (professionIndex + 1) % professions.length;
    typingTimeout = setTimeout(typeWriter, 500);
  } else {
    const typingSpeed = isDeleting ? 80 : 120;
    typingTimeout = setTimeout(typeWriter, typingSpeed);
  }
}

function resetTypingAnimation() {
  clearTimeout(typingTimeout);
  professionIndex = 0;
  charIndex = 0;
  isDeleting = false;
  typedTextSpan.textContent = '';
  setTimeout(typeWriter, 500);
}

// ===== MOBILE TOUCH SUPPORT FOR SIDE ICONS =====
function setupMobileSideIcons() {
  const sideIcons = document.querySelectorAll('.side-icon');

  sideIcons.forEach((icon) => {
    let touchTimer;

    // Add touch start event
    icon.addEventListener('touchstart', function (e) {
      e.preventDefault();
      clearTimeout(touchTimer);

      // Apply hover effects
      this.style.transform = this.closest('.left-side')
        ? 'scale(1.15) translateX(-8px)'
        : 'scale(1.15) translateX(8px)';
      this.style.background = 'linear-gradient(135deg, #00e6b8, #6e8efb)';
      this.style.boxShadow =
        '0 8px 20px rgba(0, 230, 184, 0.3), 0 0 0 6px rgba(0, 230, 184, 0.1)';

      const iconElement = this.querySelector('ion-icon');
      if (iconElement) {
        iconElement.style.color = 'white';
        iconElement.style.transform = 'scale(1.2)';
      }

      // Show tooltip on mobile temporarily (only on larger mobile screens)
      const tooltip = this.querySelector('.tooltip');
      if (tooltip && window.innerWidth > 768) {
        tooltip.style.display = 'block';
        tooltip.style.opacity = '1';
        tooltip.style.transform = this.closest('.left-side')
          ? 'translateX(0) scale(1)'
          : 'translateX(0) scale(1)';

        // Hide tooltip after 2 seconds
        touchTimer = setTimeout(() => {
          tooltip.style.opacity = '0';
          setTimeout(() => {
            tooltip.style.display = 'none';
          }, 300);
        }, 2000);
      }
    });

    // Add touch end event
    icon.addEventListener('touchend', function () {
      clearTimeout(touchTimer);
      resetIconStyles(this);
    });

    // Add touch cancel event
    icon.addEventListener('touchcancel', function () {
      clearTimeout(touchTimer);
      resetIconStyles(this);
    });

    // Add mouse leave event for desktop
    icon.addEventListener('mouseleave', function () {
      resetIconStyles(this);
    });
  });
}

function resetIconStyles(icon) {
  icon.style.transform = 'scale(1) translateX(0)';
  icon.style.background = '';
  icon.style.boxShadow = '';

  const iconElement = icon.querySelector('ion-icon');
  if (iconElement) {
    iconElement.style.color = '';
    iconElement.style.transform = '';
  }

  // Hide tooltip
  const tooltip = icon.querySelector('.tooltip');
  if (tooltip) {
    tooltip.style.opacity = '0';
    tooltip.style.transform = icon.closest('.left-side')
      ? 'translateX(-20px) scale(0.8)'
      : 'translateX(20px) scale(0.8)';

    setTimeout(() => {
      if (tooltip.style.opacity === '0') {
        tooltip.style.display = 'none';
      }
    }, 300);
  }
}

// ===== FORM HANDLING =====
function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const name = formData.get('name') || 'User';

      // Show success message
      showNotification(
        `Thank you ${name}! Your message has been sent successfully.`
      );

      // Reset form
      this.reset();
    });
  }
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'form-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, #00e6b8, #6e8efb);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    font-weight: 600;
  `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  // Add scroll event for header shadow
  window.addEventListener('scroll', () => {
    const topNavbar = document.querySelector('.top-navbar');
    const mobileTopbar = document.querySelector('.mobile-topbar');
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      topNavbar?.style.setProperty(
        'box-shadow',
        '0 2px 20px rgba(0, 0, 0, 0.3)'
      );
      mobileTopbar?.style.setProperty(
        'box-shadow',
        '0 2px 20px rgba(0, 0, 0, 0.3)'
      );
    } else {
      topNavbar?.style.setProperty('box-shadow', 'none');
      mobileTopbar?.style.setProperty('box-shadow', 'none');
    }
  });
}

// ===== LAZY LOADING FOR IMAGES =====
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ===== INITIALIZATION =====
function init() {
  // Initial indicator state
  const activeNavItem = document.querySelector(
    '.bottom-navigation .list.active'
  );
  if (activeNavItem) {
    updateIndicator(activeNavItem);
  }

  // Load saved theme preference
  loadThemePreference();

  // Start typing animation
  if (typedTextSpan) {
    typeWriter();
  }

  // Setup event listeners
  setupEventListeners();

  // Initialize components
  initSmoothScrolling();
  initContactForm();
  initScrollAnimations();
  initLazyLoading();

  // Hero content animation
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    setTimeout(() => {
      heroContent.style.transition = 'opacity 1.5s ease';
      heroContent.style.opacity = '1';
    }, 300);
  }
}

function setupEventListeners() {
  // Navigation click events
  navItems.forEach((item) => {
    item.addEventListener('click', () => updateIndicator(item));
  });

  // Theme toggle events
  themeToggles.forEach((toggle) => {
    toggle.addEventListener('click', toggleTheme);
  });

  // Scroll events with throttling
  window.addEventListener('scroll', throttle(updateActiveSection, 100));

  // Window resize event
  window.addEventListener(
    'resize',
    throttle(() => {
      // Update indicator position on resize
      const activeNavItem = document.querySelector(
        '.bottom-navigation .list.active'
      );
      if (activeNavItem) {
        updateIndicator(activeNavItem);
      }
    }, 250)
  );

  // Setup mobile side icons
  setupMobileSideIcons();
}

// ===== ERROR HANDLING =====
function handleGlobalErrors() {
  window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
  });
}

// ===== EXPORT FUNCTIONS FOR DEBUGGING =====
if (typeof window !== 'undefined') {
  window.portfolioApp = {
    resetTypingAnimation,
    toggleTheme,
    updateActiveSection,
  };
}

// ===== DOCUMENT READY =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize error handling
  handleGlobalErrors();

  // Initialize the app
  init();

  // Initialize AOS (if available)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }
});

// ===== CLEANUP ON PAGE UNLOAD =====
window.addEventListener('beforeunload', () => {
  // Clear any ongoing timeouts
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
});

document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = {
    name: this.name.value,
    email: this.email.value,
    message: this.message.value,
  };

  fetch(
    'https://script.google.com/macros/s/AKfycbzi-bsCuXBoNM8FLlPO7VX3grLcAZ4lVnrO1KSoCahaPj2g6Q2iUY7uWJ7zNC6ciYle/exec',
    {
      method: 'POST',
      body: JSON.stringify(formData),
    }
  )
    .then((res) => res.json())
    .then(() => {
      document.getElementById('statusMessage').innerHTML =
        'Message Sent Successfully!';
      this.reset();
    })
    .catch((err) => {
      document.getElementById('statusMessage').innerHTML =
        'Failed to send message!';
    });
});
