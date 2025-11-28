// ===== GLOBAL SELECTIONS =====
const navItems = document.querySelectorAll('.bottom-navigation .list');
const indicator = document.querySelector('.bottom-navigation .indicator');
const indicatorIcon = indicator.querySelector('ion-icon');
const sections = document.querySelectorAll('section');

// ===== INDICATOR FUNCTIONALITY =====
function updateIndicator(activeItem) {
  navItems.forEach((item) => {
    item.classList.remove('active');
    item.querySelector('.icon').style.opacity = '1';
  });

  activeItem.classList.add('active');
  const icon = activeItem.querySelector('.icon');
  icon.style.opacity = '0';

  const offset = activeItem.offsetLeft;
  indicator.style.left = `${offset}px`;

  const activeIconName = icon.querySelector('ion-icon').getAttribute('name');
  indicatorIcon.setAttribute('name', activeIconName);
}

// ===== SCROLL-BASED INDICATOR =====
window.addEventListener('scroll', () => {
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
});

// ===== CLICK EVENTS FOR NAVIGATION =====
navItems.forEach((item) => {
  item.addEventListener('click', () => updateIndicator(item));
});

// ===== THEME TOGGLE FUNCTIONALITY =====
const themeToggles = document.querySelectorAll('.theme-toggle');
let isDarkTheme = true;

themeToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    isDarkTheme = !isDarkTheme;

    // Change icon text 🌙 or ☀️
    themeToggles.forEach((btn) => {
      btn.textContent = isDarkTheme ? '🌙' : '☀️';
    });
  });
});

// ===== TYPING ANIMATION =====
const typedTextSpan = document.getElementById('typed-text');
const professions = [
  'Web Developer',
  'Frontend Developer',
  'UI/UX Designer',
  'Problem Solver',
];
let professionIndex = 0;
let charIndex = 0;
let isDeleting = false;

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
    setTimeout(typeWriter, 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    professionIndex = (professionIndex + 1) % professions.length;
    setTimeout(typeWriter, 500);
  } else {
    setTimeout(typeWriter, isDeleting ? 100 : 150);
  }
}

// ===== HERO SECTION FADE-IN ANIMATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initial indicator state
  updateIndicator(document.querySelector('.bottom-navigation .list.active'));

  // Start typing animation
  typeWriter();

  // Hero content animation
  const heroContent = document.querySelector('.hero-content');
  heroContent.style.opacity = 0;

  setTimeout(() => {
    heroContent.style.transition = 'opacity 2s ease';
    heroContent.style.opacity = 1;
  }, 500);
});
