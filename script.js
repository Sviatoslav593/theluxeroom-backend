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

  if (!menu || !burgerBtn || !closeBtn) return;

  const isOpen = menu.classList.contains("active");

  if (!isOpen) {
    menu.classList.remove("hidden");
    setTimeout(() => {
      menu.classList.add("active");
      menu.style.transform = "translateX(0)";
    }, 10);
    body.classList.add("no-scroll");
  } else {
    menu.classList.remove("active");
    menu.style.transform = "translateX(100%)";
    body.classList.remove("no-scroll");
    setTimeout(() => menu.classList.add("hidden"), 300);
  }
}

function toggleSubmenu(event, submenuSelector, toggleSelector) {
  event.preventDefault();
  const submenuElement = document.querySelector(submenuSelector);
  const toggleElement = document.querySelector(toggleSelector);
  if (!submenuElement || !toggleElement) return;

  const isOpen = submenuElement.classList.contains("show");

  submenuElement.classList.toggle("show", !isOpen);
  toggleElement.classList.toggle("active", !isOpen);
}

function toggleFilterModal() {
  const modal = document.getElementById("filter-modal");
  const body = document.body;
  if (!modal) return;

  const isOpen = modal.classList.contains("active");
  if (!isOpen) {
    modal.classList.add("active");
    body.classList.add("no-scroll");
    modal.style.display = "flex";
    setTimeout(() => (modal.style.opacity = "1"), 10);
  } else {
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.classList.remove("active");
      body.classList.remove("no-scroll");
      modal.style.display = "none";
    }, 500);
  }
}

function sortProducts(sortBy) {
  const productCards = Array.from(document.querySelectorAll(".product-card"));
  const container = document.querySelector("#product-grid");
  if (!container || !productCards.length) return;

  productCards.sort((a, b) => {
    const priceA = parseFloat(
      a.querySelector("p").textContent.replace("$", "") || "0"
    );
    const priceB = parseFloat(
      b.querySelector("p").textContent.replace("$", "") || "0"
    );

    switch (sortBy) {
      case "price-asc":
        return priceA - priceB;
      case "price-desc":
        return priceB - priceA;
      default:
        return 0;
    }
  });

  productCards.forEach((card) => container.appendChild(card));
}

function filterProducts() {
  const colorFilters = Array.from(
    document.querySelectorAll(
      "#filter-modal input[type='checkbox'][value^='color-']:checked"
    )
  ).map((cb) => cb.value.replace("color-", "").toLowerCase());

  const sizeFilters = Array.from(
    document.querySelectorAll(
      "#filter-modal input[type='checkbox'][value^='size-']:checked"
    )
  ).map((cb) => cb.value.replace("size-", "").toLowerCase());

  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const color = (card.getAttribute("data-color") || "").toLowerCase();
    const size = (card.getAttribute("data-size") || "").toLowerCase();

    const matchColor =
      colorFilters.length === 0 || colorFilters.includes(color);
    const matchSize = sizeFilters.length === 0 || sizeFilters.includes(size);

    card.style.display = matchColor && matchSize ? "block" : "none";
  });
}

function updateCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  if (cartItems) {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const price = parseFloat(item.price.replace("$", ""));
      const itemTotal = price * item.quantity;
      total += itemTotal;

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <img src="${item.image || "images/placeholder.jpg"}" alt="${
        item.name
      }" class="cart-item-image">
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p>Color: ${item.color ? item.color.toUpperCase() : "N/A"}</p>
          <p>Size: ${item.size ? item.size.toUpperCase() : "N/A"}</p>
          <p>Price: ${item.price}</p>
          <div class="quantity-controls">
            <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
          </div>
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      `;
      cartItems.appendChild(cartItem);
    });

    if (cartTotal) cartTotal.textContent = total.toFixed(2);
    if (cartCount)
      cartCount.textContent = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
  }
}

function updateOrderSummary() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const orderItems = document.getElementById("order-items");
  const orderTotal = document.getElementById("order-total");

  if (orderItems) {
    orderItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const price = parseFloat(item.price.replace("$", ""));
      const itemTotal = price * item.quantity;
      total += itemTotal;

      const orderItem = document.createElement("div");
      orderItem.className = "order-item";
      orderItem.innerHTML = `
        <img src="${item.image || "images/placeholder.jpg"}" alt="${
        item.name
      }" class="order-item-image">
        <div class="order-item-details">
          <h3>${item.name}</h3>
          <p>Color: ${item.color ? item.color.toUpperCase() : "N/A"}</p>
          <p>Size: ${item.size ? item.size.toUpperCase() : "N/A"}</p>
          <p>Price: ${item.price} x ${item.quantity} = $${itemTotal.toFixed(
        2
      )}</p>
        </div>
      `;
      orderItems.appendChild(orderItem);
    });

    if (orderTotal) orderTotal.textContent = total.toFixed(2);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("burger-open-btn")
    ?.addEventListener("click", toggleMenu);
  document.getElementById("close-btn")?.addEventListener("click", toggleMenu);

  document
    .getElementById("filter-btn")
    ?.addEventListener("click", toggleFilterModal);
  document
    .getElementById("filter-close-btn")
    ?.addEventListener("click", toggleFilterModal);
  document.getElementById("filter-apply-btn")?.addEventListener("click", () => {
    filterProducts();
    toggleFilterModal();
  });

  document.getElementById("sort-select")?.addEventListener("change", (e) => {
    sortProducts(e.target.value);
  });

  document
    .getElementById("mobile-men-toggle")
    ?.addEventListener("click", (e) => {
      toggleSubmenu(e, "#mobile-men-toggle + .submenu", "#mobile-men-toggle");
    });

  document
    .getElementById("mobile-women-toggle")
    ?.addEventListener("click", (e) => {
      toggleSubmenu(
        e,
        "#mobile-women-toggle + .submenu",
        "#mobile-women-toggle"
      );
    });

  document
    .getElementById("mobile-men-clothing-toggle")
    ?.addEventListener("click", (e) => {
      toggleSubmenu(
        e,
        "#mobile-men-clothing-toggle + .submenu-sub",
        "#mobile-men-clothing-toggle"
      );
    });
  document
    .getElementById("mobile-women-clothing-toggle")
    ?.addEventListener("click", (e) => {
      toggleSubmenu(
        e,
        "#mobile-women-clothing-toggle + .submenu-sub",
        "#mobile-women-clothing-toggle"
      );
    });

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const card = this.closest(".product-card");
      const name = card.querySelector("h3").textContent;
      const price = card.querySelector("p").textContent;
      const imgSrc = card.querySelector(".product-img").src;

      const thumbnails = document.querySelectorAll("#product-modal .thumbnail");
      const cardThumbs = card.querySelectorAll(
        ".thumbnails-container .thumbnail"
      );

      const mainImage = document.getElementById("main-image");
      mainImage.src = imgSrc;
      mainImage.style.maxWidth = "100%";
      mainImage.style.height = "300px";

      cardThumbs.forEach((thumb, i) => {
        if (thumbnails[i])
          thumbnails[i].src = thumb.src || "images/placeholder.jpg";
      });

      thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle("active", i === 0);
      });

      document.getElementById("product-modal").classList.add("active");
      document.body.classList.add("no-scroll");

      // Оновлюємо дані в модалці
      document.getElementById("product-name").textContent = name;
      document.getElementById("product-price").textContent = price;
    });
  });

  document.querySelectorAll("#product-modal .thumbnail").forEach((thumb) => {
    thumb.addEventListener("click", function () {
      const mainImage = document.getElementById("main-image");
      const current = document.querySelector(
        "#product-modal .thumbnail.active"
      );
      if (current) current.classList.remove("active");
      this.classList.add("active");
      mainImage.src = this.src;
    });
  });

  document.getElementById("modal-close-btn")?.addEventListener("click", () => {
    document.getElementById("product-modal").classList.remove("active");
    document.body.classList.remove("no-scroll");
  });

  // Логіка для зміни кількості товару
  let quantity = 1;
  const quantityValue = document.querySelector(".quantity-value");
  const decreaseBtn = document.querySelector(
    ".quantity-controls .quantity-btn:first-child"
  );
  const increaseBtn = document.querySelector(
    ".quantity-controls .quantity-btn:last-child"
  );

  if (quantityValue && decreaseBtn && increaseBtn) {
    quantityValue.textContent = quantity;

    decreaseBtn.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        quantityValue.textContent = quantity;
      }
    });

    increaseBtn.addEventListener("click", () => {
      if (quantity < 5) {
        quantity++;
        quantityValue.textContent = quantity;
      }
    });
  }

  // Логіка додавання товару до кошика тільки при натисканні на кнопку
  document
    .getElementById("product-add-to-cart")
    ?.addEventListener("click", () => {
      const productName = document
        .getElementById("product-name")
        .textContent.trim();
      const productColor = document.getElementById("product-color").value;
      const productSize = document.getElementById("product-size").value;
      const mainImageSrc = document.getElementById("main-image").src;

      if (!productName) {
        console.error("Invalid product data:", { productName });
        return;
      }

      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = cart.find((item) => item.name === productName);
      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        cart.push({
          name: productName,
          color: productColor,
          size: productSize,
          quantity,
          image: mainImageSrc,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));

      const cartCount = document.getElementById("cart-count");
      if (cartCount)
        cartCount.textContent = cart.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

      const notification = document.createElement("div");
      notification.className = "notification";
      notification.textContent = "Product added to cart!";
      document.body.appendChild(notification);

      // Видаляємо клас no-scroll після завершення анімації
      setTimeout(() => {
        notification.remove();
        document.body.classList.remove("no-scroll");
      }, 2000);

      document.getElementById("product-modal").classList.remove("active");
    });

  // Partial update for cart checkout logic with link (price-independent)
  // Логіка для сторінки кошика
  if (document.getElementById("cart-items")) {
    updateCart();

    // Функція для оновлення стану посилання
    function updateCheckoutLink() {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const checkoutLink = document.querySelector(".checkout-link"); // Оновлено для роботи з <a>
      if (checkoutLink) {
        if (cart.length === 0) {
          checkoutLink.removeAttribute("href"); // Видаляємо href, якщо кошик порожній
          checkoutLink.classList.add("opacity-50", "cursor-not-allowed");
          checkoutLink.classList.remove("hover:text-gray-300");
        } else {
          checkoutLink.setAttribute("href", "checkout.html"); // Додаємо href, якщо кошик не порожній
          checkoutLink.classList.remove("opacity-50", "cursor-not-allowed");
          checkoutLink.classList.add("hover:text-gray-300");
        }
      }
    }

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("quantity-btn")) {
        const index = e.target.getAttribute("data-index");
        const action = e.target.getAttribute("data-action");
        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (cart[index]) {
          if (action === "decrease" && cart[index].quantity > 1)
            cart[index].quantity--;
          if (action === "increase" && cart[index].quantity < 5)
            cart[index].quantity++;
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCart();
          updateCheckoutLink(); // Оновлюємо стан посилання після зміни кількості
        }
      } else if (e.target.classList.contains("remove-btn")) {
        const index = e.target.getAttribute("data-index");
        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (cart[index]) {
          cart.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCart();
          updateCheckoutLink(); // Оновлюємо стан посилання після видалення
        }
      }
    });

    // Ініціалізація стану посилання при завантаженні
    updateCheckoutLink();
  }

  // Оновлена функція updateCart без залежності від ціни
  function updateCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    if (cartItems) {
      cartItems.innerHTML = "";
      let total = 0;

      cart.forEach((item, index) => {
        const itemTotal = item.quantity * 0;
        total += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
          <img src="${item.image || "images/placeholder.jpg"}" alt="${
          item.name
        }" class="cart-item-image">
          <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p>Color: ${item.color ? item.color.toUpperCase() : "N/A"}</p>
            <p>Size: ${item.size ? item.size.toUpperCase() : "N/A"}</p>
            <div class="quantity-controls">
              <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
              <span class="quantity-value">${item.quantity}</span>
              <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
            </div>
            <button class="remove-btn" data-index="${index}">Remove</button>
          </div>
        `;
        cartItems.appendChild(cartItem);
      });

      if (cartTotal) cartTotal.textContent = total.toFixed(2);
      if (cartCount)
        cartCount.textContent = cart.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
    }
  }

  // Логіка для сторінки оформлення замовлення
  if (document.getElementById("order-items")) {
    updateOrderSummary();

    document.getElementById("confirm-order")?.addEventListener("click", () => {
      // Тут можна додати редирект на сторінку підтвердження, наприклад: window.location.href = "confirmation.html";
      window.location.href = "confirmation.html"; // Прямий перехід без alert
    });
  }

  // Оновлена функція updateOrderSummary без залежності від ціни
  function updateOrderSummary() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const orderItems = document.getElementById("order-items");
    const orderTotal = document.getElementById("order-total");

    if (orderItems) {
      orderItems.innerHTML = "";
      let total = 0; // Тимчасово 0, оскільки ціни немає

      cart.forEach((item, index) => {
        const orderItem = document.createElement("div");
        orderItem.className = "order-item";
        orderItem.innerHTML = `
        <img src="${item.image || "images/placeholder.jpg"}" alt="${
          item.name
        }" class="order-item-image">
        <div class="order-item-details">
          <h3>${item.name}</h3>
          <p>Color: ${item.color ? item.color.toUpperCase() : "N/A"}</p>
          <p>Size: ${item.size ? item.size.toUpperCase() : "N/A"}</p>
          <p>Quantity: ${item.quantity}</p>
        </div>
      `;
        orderItems.appendChild(orderItem);
      });

      if (orderTotal) orderTotal.textContent = total.toFixed(2); // Загальна сума поки що 0
    }
  }
});

// Updated Translation Logic for Multiple Pages

// Об'єкт перекладів
const translations = {
  bg: {
    pageTitle: "TheLuxeRoom",
    homeLink: "Начало",
    forMenLink: "За Мъже",
    forWomenLink: "За Жени",
    footwearLink: "Обувки",
    bagsLink: "Чанти",
    accessoriesLink: "Аксесоари",
    clothingLink: "Дрехи",
    tshirtsLink: "Тениски",
    pantsLink: "Панталони",
    shortsLink: "Кратки",
    jacketsLink: "Яке",
    hoodiesLink: "Худи",
    cartLink: "Количка",
    heroTitle: "Повдигни Своя Стил",
    heroSubtitle: "Открийте премиум мода в TheLuxeRoom",
    shopNow: "Купи Сега",
    productsTitle: "Продукти",
    filterBtn: "Филтри",
    sortDefault: "Най-нови",
    sortPriceAsc: "Цена: Ниска към Висока",
    sortPriceDesc: "Цена: Висока към Ниска",
    filterModalTitle: "Филтри и Сортиране",
    filterColorTitle: "Цвят",
    filterSizeTitle: "Размер",
    sortByTitle: "Сортирай по",
    applyBtn: "Приложи",
    colorLabel: "Цвят:",
    sizeLabel: "Размер:",
    viewDetails: "Заявка за Артикул",
    addToCart: "Заявка за Артикул",
    cartTitle: "Количка",
    proceedToCheckout: "Напред към Касата",
    footerText: "© 2025 Black Boutique. Всички права запазени.",
    privacyPolicy: "Политика за поверителност",
    termsOfService: "Условия за ползване",
    contactUs: "Контакти",
    shippingTitle: "Информация за Доставка",
    firstNameLabel: "Име",
    lastNameLabel: "Фамилия",
    addressLabel: "Адрес за Доставка",
    cityLabel: "Град",
    phoneLabel: "Телефонен Номер",
    commentsLabel: "Коментари",
    orderSummaryTitle: "Обобщение на запитването",
    deliveryTime: "Време за Доставка > след потвърждение",
    shippingCost: "Стойност на Доставка: $5.00 (Стандартен) / $10.00 (Експрес)",
    confirmOrder: "Потвърди Поръчката",
  },
  en: {
    pageTitle: "TheLuxeRoom",
    homeLink: "Home",
    forMenLink: "For Men",
    forWomenLink: "For Women",
    footwearLink: "Footwear",
    bagsLink: "Bags",
    accessoriesLink: "Accessories",
    clothingLink: "Clothing",
    tshirtsLink: "T-shirts",
    pantsLink: "Pants",
    shortsLink: "Shorts",
    jacketsLink: "Jackets",
    hoodiesLink: "Hoodies",
    cartLink: "Cart",
    heroTitle: "Elevate Your Style",
    heroSubtitle: "Discover premium fashion at TheLuxeRoom",
    shopNow: "Shop Now",
    productsTitle: "Products",
    filterBtn: "Filters",
    sortDefault: "Newest First",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    filterModalTitle: "Filters & Sort",
    filterColorTitle: "Color",
    filterSizeTitle: "Size",
    sortByTitle: "Sort By",
    applyBtn: "Apply",
    colorLabel: "Color:",
    sizeLabel: "Size:",
    viewDetails: "Request Item",
    addToCart: "Request Item",
    cartTitle: "Cart",
    proceedToCheckout: "Proceed to Checkout",
    footerText: "© 2025 Black Boutique. All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    contactUs: "Contact Us",
    shippingTitle: "Shipping Information",
    firstNameLabel: "First Name",
    lastNameLabel: "Last Name",
    addressLabel: "Delivery Address",
    cityLabel: "City",
    phoneLabel: "Phone Number",
    commentsLabel: "Comments",
    orderSummaryTitle: "Request Summary",
    deliveryTime: "Delivery Time: Upon Confirmation",
    shippingCost: "Shipping Cost: $5.00 (Standard) / $10.00 (Express)",
    confirmOrder: "Confirm Order",
  },
  ru: {
    pageTitle: "TheLuxeRoom",
    homeLink: "Главная",
    forMenLink: "Для Мужчин",
    forWomenLink: "Для Женщин",
    footwearLink: "Обувь",
    bagsLink: "Сумки",
    accessoriesLink: "Аксессуары",
    clothingLink: "Одежда",
    tshirtsLink: "Футболки",
    pantsLink: "Брюки",
    shortsLink: "Шорты",
    jacketsLink: "Куртки",
    hoodiesLink: "Худи",
    cartLink: "Корзина",
    heroTitle: "Повышай Свой Стиль",
    heroSubtitle: "Откройте премиум моду в TheLuxeRoom",
    shopNow: "Купить Сейчас",
    productsTitle: "Продукты",
    filterBtn: "Фильтры",
    sortDefault: "Сначала новые",
    sortPriceAsc: "Цена: Низкая к Высокой",
    sortPriceDesc: "Цена: Высокая к Низкой",
    filterModalTitle: "Фильтры и Сортировка",
    filterColorTitle: "Цвет",
    filterSizeTitle: "Размер",
    sortByTitle: "Сортировать по",
    applyBtn: "Применить",
    colorLabel: "Цвет:",
    sizeLabel: "Размер:",
    viewDetails: "Запросить товар",
    addToCart: "Запросить товар",
    cartTitle: "Корзина",
    proceedToCheckout: "Перейти к Оплате",
    footerText: "© 2025 Black Boutique. Все права защищены.",
    privacyPolicy: "Политика конфиденциальности",
    termsOfService: "Условия использования",
    contactUs: "Контакты",
    shippingTitle: "Информация о Доставке",
    firstNameLabel: "Имя",
    lastNameLabel: "Фамилия",
    addressLabel: "Адрес Доставки",
    cityLabel: "Город",
    phoneLabel: "Номер Телефона",
    commentsLabel: "Комментарии",
    orderSummaryTitle: "Сводка Запроса",
    deliveryTime: "Время Доставки > После Подтверждения",
    shippingCost: "Стоимость Доставки: $5.00 (Стандарт) / $10.00 (Экспресс)",
    confirmOrder: "Подтвердить Заказ",
  },
  de: {
    pageTitle: "TheLuxeRoom",
    homeLink: "Startseite",
    forMenLink: "Für Herren",
    forWomenLink: "Für Damen",
    footwearLink: "Schuhe",
    bagsLink: "Taschen",
    accessoriesLink: "Accessoires",
    clothingLink: "Kleidung",
    tshirtsLink: "T-Shirts",
    pantsLink: "Hosen",
    shortsLink: "Shorts",
    jacketsLink: "Jacken",
    hoodiesLink: "Hoodies",
    cartLink: "Warenkorb",
    heroTitle: "Stil Erheben",
    heroSubtitle: "Entdecken Sie Premium-Mode bei TheLuxeRoom",
    shopNow: "Jetzt Shoppen",
    productsTitle: "Produkte",
    filterBtn: "Filter",
    sortDefault: "Neueste zuerst",
    sortPriceAsc: "Preis: Niedrig zu Hoch",
    sortPriceDesc: "Preis: Hoch zu Niedrig",
    filterModalTitle: "Filter & Sortieren",
    filterColorTitle: "Farbe",
    filterSizeTitle: "Größe",
    sortByTitle: "Sortieren nach",
    applyBtn: "Anwenden",
    colorLabel: "Farbe:",
    sizeLabel: "Größe:",
    viewDetails: "Anfrage für einen Artikel",
    addToCart: "Anfrage für einen Artikel",
    cartTitle: "Warenkorb",
    proceedToCheckout: "Zur Kasse gehen",
    footerText: "© 2025 Black Boutique. Alle Rechte vorbehalten.",
    privacyPolicy: "Datenschutzrichtlinie",
    termsOfService: "Nutzungsbedingungen",
    contactUs: "Kontakt",
    shippingTitle: "Versandinformationen",
    firstNameLabel: "Vorname",
    lastNameLabel: "Nachname",
    addressLabel: "Lieferadresse",
    cityLabel: "Stadt",
    phoneLabel: "Telefonnummer",
    commentsLabel: "Kommentare",
    orderSummaryTitle: "Zusammenfassung des Antrags",
    deliveryTime: "Lieferfrist > nach Bestätigung",
    shippingCost: "Versandkosten: $5.00 (Standard) / $10.00 (Express)",
    confirmOrder: "Bestellung bestätigen",
  },
};

// Функція перекладу
function translatePage() {
  const lang = localStorage.getItem("language") || "bg"; // За замовчуванням болгарська
  document.querySelectorAll("[data-translate]").forEach((element) => {
    const key = element.getAttribute("data-translate");
    element.textContent = translations[lang][key] || element.textContent;
  });
  document.title = translations[lang]["pageTitle"] || "Black Boutique";
}

// Оновлення мови при зміні селекта
document.getElementById("language-select")?.addEventListener("change", (e) => {
  const lang = e.target.value;
  localStorage.setItem("language", lang);
  translatePage();
});

// Ініціалізація мови при завантаженні
document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("language") || "bg";
  const select = document.getElementById("language-select");
  if (select) select.value = lang;
  translatePage();
});

// --- Brands dropdown interaction ---

document.querySelectorAll(".group.relative").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    const brand = item.querySelector(".brands-dropdown");
    if (brand) {
      brand.classList.add("visible");
    }
  });
  item.addEventListener("mouseleave", () => {
    const brand = item.querySelector(".brands-dropdown");
    if (brand) {
      brand.classList.remove("visible");
    }
  });
});

// Розгортання брендів у мобільному меню
document.querySelectorAll(".brand-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const submenu = btn.nextElementSibling;
    const isOpen = submenu.classList.contains("open");

    if (isOpen) {
      submenu.classList.remove("open");
      submenu.style.maxHeight = null;
      submenu.style.opacity = "0";
    } else {
      submenu.classList.add("open");
      submenu.style.maxHeight = submenu.scrollHeight + "px";
      submenu.style.opacity = "1";
    }
  });
});
