// Mobile menu toggle
function toggleMenu() {
  const menu = document.getElementById("mobile-menu");
  const burgerIcon = document.getElementById("burger-icon");
  const closeIcon = document.getElementById("close-icon");
  const body = document.body;

  const isOpen = !menu.classList.contains("translate-x-full");
  if (isOpen) {
    menu.classList.add("translate-x-full");
    burgerIcon.classList.remove("hidden");
    closeIcon.classList.add("hidden");
    body.classList.remove("menu-open");
  } else {
    menu.classList.remove("translate-x-full");
    burgerIcon.classList.add("hidden");
    closeIcon.classList.remove("hidden");
    body.classList.add("menu-open");
  }
}

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
