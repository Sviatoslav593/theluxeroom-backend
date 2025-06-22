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
  const burgerBtn = document.getElementById("burger-open-btn");
  const closeBtn = document.getElementById("close-btn");
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

  console.log("ToggleMenu called:", { menu, burgerBtn, closeBtn });

  if (!menu || !burgerBtn || !closeBtn) {
    console.error("Mobile menu elements not found:", {
      menu,
      burgerBtn,
      closeBtn,
    });
    return;
  }

  const isOpen = menu.classList.contains("active");
  menu.classList.toggle("active", !isOpen);
  if (isOpen) {
    burgerBtn.style.display = "block"; // Показуємо кнопку при закритті
    closeBtn.style.display = "none";
  } else {
    burgerBtn.style.display = "none"; // Приховуємо кнопку при відкритті
    closeBtn.style.display = "block";
  }
  body.classList.toggle("menu-open", !isOpen);

  console.log("Menu toggled:", {
    isOpen: !isOpen,
    menuClass: menu.classList,
    bodyClass: body.classList,
    burgerDisplay: burgerBtn.style.display,
    closeDisplay: closeBtn.style.display,
  });

  toggles.forEach(({ submenu, toggle }) => {
    if (submenu) submenu.classList.remove("show");
    if (toggle) toggle.classList.remove("active");
  });
}

function toggleSubmenu(event, submenuId, toggleId) {
  event.preventDefault();
  event.stopPropagation();
  const submenu = document.getElementById(submenuId);
  const toggle = document.getElementById(toggleId);

  console.log("ToggleSubmenu called:", {
    submenuId,
    toggleId,
    submenu,
    toggle,
  });

  if (!submenu || !toggle) {
    console.error(`Submenu or toggle not found: ${submenuId}, ${toggleId}`);
    return;
  }

  const isShowing = submenu.classList.contains("show");
  const isTopLevel = !!submenu.closest(".mobile-menu-list");

  requestAnimationFrame(() => {
    try {
      if (!isShowing) {
        if (!isTopLevel) {
          const parentSubmenu = submenu.closest(".submenu");
          if (parentSubmenu) {
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
        }
        submenu.classList.add("show");
        toggle.classList.add("active");
      } else {
        submenu.classList.remove("show");
        toggle.classList.remove("active");
      }
      console.log(`Submenu ${submenuId} toggled, show: ${!isShowing}`);
    } catch (e) {
      console.error("Error in toggleSubmenu:", e);
    }
  });
}

function toggleFilterModal() {
  const modal = document.getElementById("filter-modal");
  const body = document.body;

  console.log("ToggleFilterModal called:", { modal });

  if (!modal) {
    console.error("Filter modal not found");
    return;
  }

  const isOpen = modal.classList.contains("active");
  modal.classList.toggle("active", !isOpen);
  body.classList.toggle("filter-open", !isOpen); // Додано клас для блокування прокручування
  body.style.overflow = isOpen ? "auto" : "hidden"; // Блокуємо прокручування сторінки

  // Додаємо плавну анімацію
  if (isOpen) {
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.style.display = "none";
    }, 300); // Час анімації 0.3s
  } else {
    modal.style.display = "block";
    setTimeout(() => {
      modal.style.opacity = "1";
    }, 10); // Негайно показуємо, потім анімуємо
  }

  console.log("Filter modal toggled:", {
    isOpen: !isOpen,
    modalClass: modal.classList,
    bodyClass: body.classList,
  });
}

// Функція для сортування товарів
function sortProducts(sortBy) {
  const productCards = Array.from(document.querySelectorAll(".product-card"));
  const container = document.querySelector("#product-grid");

  productCards.sort((a, b) => {
    const priceA = parseFloat(
      a.querySelector("p").textContent.replace("$", "")
    );
    const priceB = parseFloat(
      b.querySelector("p").textContent.replace("$", "")
    );

    switch (sortBy) {
      case "price-asc":
        return priceA - priceB;
      case "price-desc":
        return priceB - priceA;
      case "newest":
      default:
        return 0; // Для "newest" зберігаємо поточний порядок
    }
  });

  // Оновлюємо DOM
  productCards.forEach((card) => container.appendChild(card));
}

// Функція для фільтрації товарів
function filterProducts() {
  const colorFilters = Array.from(
    document.querySelectorAll(
      "#filter-modal input[type='checkbox'][value^='color-']"
    )
  )
    .filter((cb) => cb.checked)
    .map((cb) => cb.value.replace("color-", ""));
  const sizeFilters = Array.from(
    document.querySelectorAll(
      "#filter-modal input[type='checkbox'][value^='size-']"
    )
  )
    .filter((cb) => cb.checked)
    .map((cb) => cb.value.replace("size-", ""));
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const productColor = card.getAttribute("data-color") || "";
    const productSize = card.getAttribute("data-size") || "";

    const colorMatch =
      colorFilters.length === 0 || colorFilters.includes(productColor);
    const sizeMatch =
      sizeFilters.length === 0 || sizeFilters.includes(productSize);

    card.style.display = colorMatch && sizeMatch ? "block" : "none";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing scripts");

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
  const filterBtn = document.getElementById("filter-btn");
  const filterCloseBtn = document.getElementById("filter-close-btn");
  const filterApplyBtn = document.getElementById("filter-apply-btn");
  const sortSelect = document.querySelector("#filter-modal select");
  const colorCheckboxes = document.querySelectorAll(
    "#filter-modal input[type='checkbox'][value^='color-']"
  );
  const sizeCheckboxes = document.querySelectorAll(
    "#filter-modal input[type='checkbox'][value^='size-']"
  );

  if (openBtn && closeBtn && mobileMenu) {
    console.log("Adding mobile menu event listeners:", {
      openBtn,
      closeBtn,
      mobileMenu,
    });
    openBtn.addEventListener("click", toggleMenu);
    closeBtn.addEventListener("click", toggleMenu); // Перевірка події
    mobileMenu.addEventListener("click", (e) => {
      if (e.target === mobileMenu) {
        console.log("Mobile menu background clicked");
        toggleMenu();
      }
    });
  } else {
    console.error("Mobile menu elements not found:", {
      openBtn,
      closeBtn,
      mobileMenu,
    });
  }

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
      console.log("Mobile menu link clicked:", link.textContent);
      toggleMenu();
    });
  });

  if (filterBtn && filterCloseBtn && filterApplyBtn) {
    console.log("Adding filter modal event listeners:", {
      filterBtn,
      filterCloseBtn,
      filterApplyBtn,
    });
    filterBtn.addEventListener("click", toggleFilterModal);
    filterCloseBtn.addEventListener("click", toggleFilterModal);
    filterApplyBtn.addEventListener("click", () => {
      toggleFilterModal();
      filterProducts(); // Застосовуємо фільтри при натисканні Apply
    });
  } else {
    console.error("Filter elements not found:", {
      filterBtn,
      filterCloseBtn,
      filterApplyBtn,
    });
  }

  // Додаємо обробник для сортування
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      console.log("Sort changed to:", e.target.value);
      sortProducts(e.target.value);
    });
  } else {
    console.error("Sort select not found");
  }

  // Додаємо обробник для фільтрів
  colorCheckboxes.forEach((cb) =>
    cb.addEventListener("change", filterProducts)
  );
  sizeCheckboxes.forEach((cb) => cb.addEventListener("change", filterProducts));

  let currentSlide = 0;
  const slides = [
    "https://source.unsplash.com/random/1920x1080?dark-fashion",
    "https://source.unsplash.com/random/1920x1080?fashion-white",
  ];
  function changeSlide() {
    const hero = document.querySelector(".hero-bg");
    if (hero) {
      hero.style.backgroundImage = `url('${slides[currentSlide]}')`;
      currentSlide = (currentSlide + 1) % slides.length;
      console.log("Hero slide changed:", currentSlide);
    }
  }
  setTimeout(changeSlide, 5000);
});
