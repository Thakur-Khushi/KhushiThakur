// ===== INDICATOR FUNCTIONALITY =====
const navItems = document.querySelectorAll('.bottom-navigation .list');
const indicator = document.querySelector('.bottom-navigation .indicator');
const indicatorIcon = indicator.querySelector('ion-icon');

function updateIndicator(activeItem) {
  navItems.forEach(item => {
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

// Initial State on Load
updateIndicator(document.querySelector('.bottom-navigation .list.active'));

// Navigation Item Click Events
navItems.forEach(item => {
  item.addEventListener('click', () => updateIndicator(item));
});

// ===== THEME TOGGLE FUNCTIONALITY =====
const themeToggles = document.querySelectorAll('.theme-toggle');
let isDarkTheme = true;

themeToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    isDarkTheme = !isDarkTheme;

    // Change icon text 🌙 or ☀️
    themeToggles.forEach(btn => {
      btn.textContent = isDarkTheme ? '🌙' : '☀️';
    });
  });
});

// ===== HERO SECTION FADE-IN ANIMATION =====
document.addEventListener("DOMContentLoaded", () => {
  const heroContent = document.querySelector('.hero-content');
  heroContent.style.opacity = 0;

  setTimeout(() => {
    heroContent.style.transition = 'opacity 2s ease';
    heroContent.style.opacity = 1;
  }, 500);
});
