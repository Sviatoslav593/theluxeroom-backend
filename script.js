function toggleMenu() {
  const menu = document.getElementById("mobile-menu");
  const burgerIcon = document.getElementById("burger-icon");
  const closeIcon = document.getElementById("close-icon");
  const body = document.body;
  const menToggle = document.getElementById("mobile-men-toggle");
  const womenToggle = document.getElementById("mobile-women-toggle");
  const menClothingToggle = document.getElementById(
    "mobile-men-clothing-toggle"
  );
  const womenClothingToggle = document.getElementById(
    "mobile-women-clothing-toggle"
  );

  // Toggle menu visibility
  menu.classList.toggle("translate-x-full");
  // Toggle icons
  burgerIcon.classList.toggle("hidden");
  closeIcon.classList.toggle("hidden");
  // Toggle body scroll lock
  body.classList.toggle("menu-open");

  // Reset all sub-menus when closing main menu
  const submenus = [
    {
      submenu: document.getElementById("mobile-men-submenu"),
      toggle: menToggle,
    },
    {
      submenu: document.getElementById("mobile-women-submenu"),
      toggle: womenToggle,
    },
    {
      submenu: document.getElementById("mobile-men-clothing-submenu"),
      toggle: menClothingToggle,
    },
    {
      submenu: document.getElementById("mobile-women-clothing-submenu"),
      toggle: womenClothingToggle,
    },
  ];

  submenus.forEach(({ submenu, toggle }) => {
    if (submenu) {
      submenu.classList.remove("show");
      submenu.style.height = "0px";
    }
    if (toggle) {
      toggle.classList.remove("active");
    }
  });
}

function toggleSubmenu(event, submenuId, toggleId) {
  event.preventDefault();
  event.stopPropagation(); // Prevent parent menu toggle
  const submenu = document.getElementById(submenuId);
  const toggle = document.getElementById(toggleId);

  const isShowing = submenu.classList.contains("show");

  if (!isShowing) {
    // Close other sub-menus at the same level
    const parentSubmenu = submenu.closest(".submenu-wrapper");
    const siblingSubmenus = parentSubmenu
      ? parentSubmenu.querySelectorAll(".mobile-submenu, .mobile-sub-submenu")
      : document.querySelectorAll(".mobile-submenu, .mobile-sub-submenu");
    const siblingToggles = parentSubmenu
      ? parentSubmenu.querySelectorAll(".mobile-menu-link")
      : document.querySelectorAll(".mobile-menu-link");

    siblingSubmenus.forEach((otherSubmenu) => {
      if (otherSubmenu !== submenu && otherSubmenu.classList.contains("show")) {
        otherSubmenu.classList.remove("show");
        otherSubmenu.style.height = "0px";
      }
    });

    siblingToggles.forEach((otherToggle) => {
      if (otherToggle !== toggle && otherToggle.classList.contains("active")) {
        otherToggle.classList.remove("active");
      }
    });

    // Temporarily show submenu to calculate height
    submenu.style.display = "block";
    submenu.style.height = "auto";
    const height = submenu.scrollHeight + "px";
    submenu.style.height = "0px";
    submenu.style.display = "";

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

  toggle.classList.toggle("active");
}

// Initialize event listeners
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("burger-open-btn");
  const closeBtn = document.getElementById("burger-close-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menToggle = document.getElementById("mobile-men-toggle");
  const womenToggle = document.getElementById("mobile-women-toggle");
  const menClothingToggle = document.getElementById(
    "mobile-men-clothing-toggle"
  );
  const womenClothingToggle = document.getElementById(
    "mobile-women-clothing-toggle"
  );
  const mobileMenuLinks = document.querySelectorAll(
    ".mobile-menu-link:not(#mobile-men-toggle, #mobile-women-toggle, #mobile-men-clothing-toggle, #mobile-women-clothing-toggle)"
  );

  // Open/close main menu
  openBtn.addEventListener("click", toggleMenu);
  closeBtn.addEventListener("click", toggleMenu);

  // Toggle sub-menus
  if (menToggle)
    menToggle.addEventListener("click", (e) =>
      toggleSubmenu(e, "mobile-men-submenu", "mobile-men-toggle")
    );
  if (womenToggle)
    womenToggle.addEventListener("click", (e) =>
      toggleSubmenu(e, "mobile-women-submenu", "mobile-women-toggle")
    );
  if (menClothingToggle)
    menClothingToggle.addEventListener("click", (e) =>
      toggleSubmenu(
        e,
        "mobile-men-clothing-submenu",
        "mobile-men-clothing-toggle"
      )
    );
  if (womenClothingToggle)
    womenClothingToggle.addEventListener("click", (e) =>
      toggleSubmenu(
        e,
        "mobile-women-clothing-submenu",
        "mobile-women-clothing-toggle"
      )
    );

  // Close menu when clicking non-toggle links
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toggleMenu();
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
