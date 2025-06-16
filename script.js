function toggleMenu() {
  const menu = document.getElementById("mobile-menu");
  const burgerIcon = document.getElementById("burger-icon");
  const closeIcon = document.getElementById("close-icon");
  const body = document.body;
  const clothingToggle = document.getElementById("mobile-clothing-toggle");

  // Toggle menu visibility
  menu.classList.toggle("translate-x-full");
  // Toggle icons
  burgerIcon.classList.toggle("hidden");
  closeIcon.classList.toggle("hidden");
  // Toggle body scroll lock
  body.classList.toggle("menu-open");

  // Reset sub-menu when closing main menu
  const submenu = document.getElementById("mobile-clothing-submenu");
  submenu.classList.remove("show");
  clothingToggle.classList.remove("active");
}

// Toggle Clothing sub-menu in mobile menu
function toggleClothingSubmenu(event) {
  event.preventDefault();
  const submenu = document.getElementById("mobile-clothing-submenu");
  const clothingToggle = document.getElementById("mobile-clothing-toggle");

  const isShowing = submenu.classList.contains("show");

  if (!isShowing) {
    // Temporarily show submenu to calculate height
    submenu.style.height = "auto";
    const height = submenu.scrollHeight + "px";
    submenu.style.height = "0px";

    // Force reflow to ensure transition starts
    submenu.offsetHeight;

    // Show submenu
    submenu.classList.add("show");
    submenu.style.height = height;
  } else {
    // Hide submenu
    submenu.style.height = "0px";
    submenu.addEventListener(
      "transitionend",
      function handler() {
        submenu.classList.remove("show");
        submenu.removeEventListener("transitionend", handler);
      },
      { once: true }
    );
  }

  clothingToggle.classList.toggle("active");
}

// Initialize event listeners
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("burger-open-btn");
  const closeBtn = document.getElementById("burger-close-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");
  const clothingToggle = document.getElementById("mobile-clothing-toggle");
  const subMenuLinks = document.querySelectorAll(".sub-item a");

  // Open/close main menu
  openBtn.addEventListener("click", toggleMenu);
  closeBtn.addEventListener("click", toggleMenu);

  // Toggle Clothing sub-menu
  clothingToggle.addEventListener("click", toggleClothingSubmenu);

  // Close menu and sub-menu when clicking top-level links (except Clothing toggle)
  mobileMenuLinks.forEach((link) => {
    if (link.id !== "mobile-clothing-toggle") {
      link.addEventListener("click", () => {
        toggleMenu();
        const submenu = document.getElementById("mobile-clothing-submenu");
        submenu.classList.remove("show");
        submenu.style.height = "0px";
        clothingToggle.classList.remove("active");
      });
    }
  });

  // Close menu and sub-menu when clicking sub-menu links
  subMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toggleMenu();
      const submenu = document.getElementById("mobile-clothing-submenu");
      submenu.classList.remove("show");
      submenu.style.height = "0px";
      clothingToggle.classList.remove("active");
    });
  });

  // Close menu when clicking outside
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
