// Updated full script1.js with working mobile menu, submenus, modal thumbnails, quantity control, cart page, and checkout logic

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

      // Відновлюємо головне фото з коректними розмірами
      const mainImage = document.getElementById("main-image");
      mainImage.src = imgSrc;
      mainImage.style.maxWidth = "100%";
      mainImage.style.height = "300px"; // Повертаємо коректну висоту

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
      const productPrice = document
        .getElementById("product-price")
        .textContent.trim();
      const productColor = document.getElementById("product-color").value;
      const productSize = document.getElementById("product-size").value;
      const mainImageSrc = document.getElementById("main-image").src;

      if (!productName || !productPrice) {
        console.error("Invalid product data:", { productName, productPrice });
        return;
      }

      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = cart.find(
        (item) => item.name === productName && item.price === productPrice
      );
      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        cart.push({
          name: productName,
          price: productPrice,
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
      setTimeout(() => notification.remove(), 2000);

      document.getElementById("product-modal").classList.remove("active");
    });

  // Partial update for cart checkout logic with link
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

  // Логіка для сторінки оформлення замовлення
  if (document.getElementById("order-items")) {
    updateOrderSummary();

    document.getElementById("confirm-order")?.addEventListener("click", () => {
      alert("Перехід до сторінки підтвердження замовлення!");
      // Тут можна додати редирект на сторінку підтвердження, наприклад: window.location.href = "confirmation.html";
    });
  }
});
