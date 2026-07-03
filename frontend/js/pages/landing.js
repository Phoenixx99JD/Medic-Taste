const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
const scrollElements = document.querySelectorAll('.animate-on-scroll');

function toggleMenu(open) {
  navLinks.classList.toggle('open', open);
  navOverlay.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

navToggle.addEventListener('click', () => toggleMenu(!navLinks.classList.contains('open')));
navOverlay.addEventListener('click', () => toggleMenu(false));

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

function isInView(el) {
  const rect = el.getBoundingClientRect();
  return rect.top <= window.innerHeight * 0.85;
}

function checkScroll() {
  scrollElements.forEach(el => {
    if (isInView(el)) {
      el.classList.add('is-visible');
    }
  });
}

checkScroll();

window.addEventListener('scroll', checkScroll);
window.addEventListener('resize', checkScroll);
