function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      try {
        func(...args);
      } catch (e) {
        console.error("Error in debounced function:", e);
      }
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function toggleMenu() {
  const menu = document.getElementById("mobile-menu");
  const burgerIcon = document.getElementById("burger-icon");
  const closeIcon = document.getElementById("close-icon");
  const body = document.body;
  const toggles = [
    {
      submenu: document.getElementById("mobile-men-submenu"),
      toggle: document.getElementById("mobile-men-toggle"),
    },
    {
      submenu: document.getElementById("mobile-women-submenu"),
      toggle: document.getElementById("mobile-women-toggle"),
    },
    {
      submenu: document.getElementById("mobile-men-clothing-submenu"),
      toggle: document.getElementById("mobile-men-clothing-toggle"),
    },
    {
      submenu: document.getElementById("mobile-women-clothing-submenu"),
      toggle: document.getElementById("mobile-women-clothing-toggle"),
    },
  ];

  menu.classList.toggle("translate-x-full");
  burgerIcon.classList.toggle("hidden");
  closeIcon.classList.toggle("hidden");
  body.classList.toggle("menu-open");

  toggles.forEach(({ submenu, toggle }) => {
    if (submenu) {
      submenu.classList.remove("show");
    }
    if (toggle) {
      toggle.classList.remove("active");
    }
  });
}

function toggleSubmenu(event, submenuId, toggleId) {
  event.preventDefault();
  event.stopPropagation();
  const submenu = document.getElementById(submenuId);
  const toggle = document.getElementById(toggleId);
  if (!submenu || !toggle) return;

  const isShowing = submenu.classList.contains("show");
  const isTopLevel = !!submenu.closest(".mobile-menu-list");

  requestAnimationFrame(() => {
    try {
      if (!isShowing) {
        // For sub-sub-menus (e.g., "Clothing" under "For Men"), close siblings
        if (!isTopLevel) {
          const parentSubmenu = submenu.closest(".submenu");
          const siblingSubmenus =
            parentSubmenu.querySelectorAll(".submenu-sub");
          const siblingToggles = parentSubmenu.querySelectorAll(
            ".sub-item > .mobile-menu-link"
          );
          siblingSubmenus.forEach((otherSubmenu) => {
            if (
              otherSubmenu !== submenu &&
              otherSubmenu.classList.contains("show")
            ) {
              otherSubmenu.classList.remove("show");
            }
          });
          siblingToggles.forEach((otherToggle) => {
            if (
              otherToggle !== toggle &&
              otherToggle.classList.contains("active")
            ) {
              otherToggle.classList.remove("active");
            }
          });
        }

        // Open submenu
        submenu.classList.add("show");
      } else {
        // Close submenu
        submenu.classList.remove("show");
      }

      toggle.classList.toggle("active");
    } catch (e) {
      console.error("Error in toggleSubmenu:", e);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("burger-open-btn");
  const closeBtn = document.getElementById("close-btn");
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

  openBtn.addEventListener("click", toggleMenu);
  closeBtn.addEventListener("click", toggleMenu);

  const debouncedToggleSubmenu = debounce(toggleSubmenu, 100);
  if (menToggle)
    menToggle.addEventListener("click", (e) =>
      debouncedToggleSubmenu(e, "mobile-men-submenu", "mobile-men-toggle")
    );
  if (womenToggle)
    womenToggle.addEventListener("click", (e) =>
      debouncedToggleSubmenu(e, "mobile-women-submenu", "mobile-women-toggle")
    );
  if (menClothingToggle)
    menClothingToggle.addEventListener("click", (e) =>
      debouncedToggleSubmenu(
        e,
        "mobile-men-clothing-submenu",
        "mobile-men-clothing-toggle"
      )
    );
  if (womenClothingToggle)
    womenClothingToggle.addEventListener("click", (e) =>
      debouncedToggleSubmenu(
        e,
        "mobile-women-clothing-submenu",
        "mobile-women-clothing-toggle"
      )
    );

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toggleMenu();
    });
  });

  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      toggleMenu();
    }
  });
});

let currentSlide = 0;
const slides = [
  "https://source.unsplash.com/random/1920x1080?dark-fashion",
  "https://source.unsplash.com/random/1920x1080?fashion",
];
function changeSlide() {
  const hero = document.querySelector(".hero-bg");
  hero.style.backgroundImage = `url('${slides[currentSlide]}')`;
  currentSlide = (currentSlide + 1) % slides.length;
}
setInterval(changeSlide, 5000);
