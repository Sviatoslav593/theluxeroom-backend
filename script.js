function toggleMenu() {
  const menu = document.getElementById("mobile-menu");
  const burgerIcon = document.getElementById("burger-icon");
  const closeIcon = document.getElementById("close-icon");
  const body = document.body;

  // Toggle menu visibility
  menu.classList.toggle("translate-x-full");
  // Toggle icons
  burgerIcon.classList.toggle("hidden");
  closeIcon.classList.toggle("hidden");
  // Toggle body scroll lock
  body.classList.toggle("menu-open");
}

// Initialize event listeners
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("burger-open-btn");
  const closeBtn = document.getElementById("burger-close-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuLinks = document.querySelectorAll(".mobile-menu-link");

  // Open/close menu on button clicks
  openBtn.addEventListener("click", toggleMenu);
  closeBtn.addEventListener("click", toggleMenu);

  // Close menu when clicking links
  menuLinks.forEach((link) => {
    link.addEventListener("click", toggleMenu);
  });

  // Close menu when clicking outside (on the menu background)
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      toggleMenu();
    }
  });
});

// Simple hero slider simulation
let currentSlide = 0;
const slides = [
  "https://source.unsplash.com/random/1920x1080?dark-fashion",
  "https://source.unsplash.com/random/1920x1080?fashion",
];
function changeSlide() {
  const hero = document.querySelector(".hero-bg");
  hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${slides[currentSlide]}')`;
  currentSlide = (currentSlide + 1) % slides.length;
}
setInterval(changeSlide, 5000);
