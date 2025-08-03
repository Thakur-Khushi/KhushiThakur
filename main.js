// Indicator functionality
const list = document.querySelectorAll('.bottom-navigation .list');
const indicator = document.querySelector('.bottom-navigation .indicator');
const indicatorIcon = indicator.querySelector('ion-icon');

function updateIndicator(activeItem) {
  list.forEach(item => {
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

// Initial state
updateIndicator(document.querySelector('.bottom-navigation .list.active'));

// Click events for nav icons
list.forEach(item => {
  item.addEventListener('click', () => updateIndicator(item));
});

// Theme toggle (mobile + desktop)
const themeToggles = document.querySelectorAll('.theme-toggle');
let isDark = true;

themeToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    isDark = !isDark;

    themeToggles.forEach(btn => {
      btn.textContent = isDark ? '🌙' : '☀️';
    });
  });
});
