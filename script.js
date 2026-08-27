document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     1. MENU DATA & APPLICATION STATE
     ========================================================================== */

  const menuData = [
    {
      id: "m1",
      name: "Butter Chicken",
      category: "Main Course",
      price: 340,
      icon: "🍲",
      isVeg: false,
      isSpicy: true,
      isPopular: true,
    },
    {
      id: "m2",
      name: "Paneer Tikka Masala",
      category: "Main Course",
      price: 290,
      icon: "🥘",
      isVeg: true,
      isSpicy: false,
      isPopular: true,
    },
    {
      id: "m3",
      name: "Garlic Naan",
      category: "Breads",
      price: 50,
      icon: "🫓",
      isVeg: true,
      isSpicy: false,
      isPopular: true,
    },
    {
      id: "m4",
      name: "Jeera Rice",
      category: "Main Course",
      price: 140,
      icon: "🍚",
      isVeg: true,
      isSpicy: false,
      isPopular: false,
    },
    {
      id: "m5",
      name: "Veg Spring Rolls",
      category: "Starters",
      price: 180,
      icon: "🥢",
      isVeg: true,
      isSpicy: false,
      isPopular: false,
    },
    {
      id: "m6",
      name: "Chicken 65",
      category: "Starters",
      price: 240,
      icon: "🍗",
      isVeg: false,
      isSpicy: true,
      isPopular: true,
    },
    {
      id: "m7",
      name: "Gulab Jamun (2 pcs)",
      category: "Desserts",
      price: 90,
      icon: "🍨",
      isVeg: true,
      isSpicy: false,
      isPopular: true,
    },
    {
      id: "m8",
      name: "Mango Lassi",
      category: "Beverages",
      price: 110,
      icon: "🥤",
      isVeg: true,
      isSpicy: false,
      isPopular: false,
    },
    {
      id: "m9",
      name: "Masala Chai",
      category: "Beverages",
      price: 40,
      icon: "☕",
      isVeg: true,
      isSpicy: true,
      isPopular: false,
    },
  ];

  const insightsData = {
    popularDishes: [
      { name: "Butter Chicken", count: 142, max: 150 },
      { name: "Garlic Naan", count: 130, max: 150 },
      { name: "Paneer Tikka", count: 98, max: 150 },
      { name: "Gulab Jamun", count: 75, max: 150 },
    ],

    frequentCombos: [
      {
        pair: "Butter Chicken + Garlic Naan",
        percentage: "84% of orders",
      },
      {
        pair: "Paneer Tikka + Jeera Rice",
        percentage: "62% of orders",
      },
      {
        pair: "Chicken 65 + Cold Beverages",
        percentage: "45% of orders",
      },
    ],

    peakHours: [
      {
        time: "1:00 PM - 3:00 PM (Lunch)",
        volume: 85,
        max: 100,
      },
      {
        time: "8:00 PM - 10:30 PM (Dinner)",
        volume: 98,
        max: 100,
      },
    ],

    lowPerforming: [
      {
        name: "Veg Spring Rolls",
        text: "Low order rate on weekdays",
      },
      {
        name: "Masala Chai",
        text: "Mostly ordered during evening hours",
      },
    ],

    promotions: [
      "Bundle Butter Chicken + 2 Garlic Naans for a 10% combo discount.",
      "Offer a complimentary Mango Lassi on orders above ₹800 during lunch hours.",
      "Create a dessert upgrade offer for customers ordering a complete meal.",
    ],
  };

  let cart = [];
  let currentCategory = "All";
  let searchQuery = "";
  let isListening = false;

  /* ==========================================================================
     2. DOM ELEMENTS
     ========================================================================== */

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  const searchInput = document.getElementById("searchInput");
  const categoryFilters = document.getElementById("categoryFilters");
  const menuGrid = document.getElementById("menuGrid");

  const recommendGrid = document.getElementById("recommendGrid");

  const cartItemsContainer = document.getElementById("cartItems");
  const emptyCartMsg = document.getElementById("emptyCartMsg");

  const customerNameInput = document.getElementById("customerName");
  const tableNumberSelect = document.getElementById("tableNumber");
  const discountInput = document.getElementById("discountInput");
  const aiDiscountBtn = document.getElementById("aiDiscountBtn");

  const subtotalVal = document.getElementById("subtotalVal");
  const taxVal = document.getElementById("taxVal");
  const discountVal = document.getElementById("discountVal");
  const grandTotalVal = document.getElementById("grandTotalVal");

  const confirmOrderBtn = document.getElementById("confirmOrderBtn");
  const clearCartBtn = document.getElementById("clearCartBtn");

  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const chatSendBtn = document.getElementById("chatSendBtn");
  const voiceInputBtn = document.getElementById("voiceInputBtn");

  const popularChart = document.getElementById("popularChart");
  const comboList = document.getElementById("comboList");
  const peakChart = document.getElementById("peakChart");
  const lowList = document.getElementById("lowList");
  const promoList = document.getElementById("promoList");

  const billModalOverlay = document.getElementById("billModalOverlay");
  const closeBillModal = document.getElementById("closeBillModal");
  const billContent = document.getElementById("billContent");
  const newOrderBtn = document.getElementById("newOrderBtn");

  const toast = document.getElementById("toast");

  /* ==========================================================================
     3. UTILITY FUNCTIONS
     ========================================================================== */

  function formatCurrency(amount) {
    return `₹${Number(amount).toFixed(2)}`;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  /* ==========================================================================
     4. MENU FILTERS & RENDERING
     ========================================================================== */

  function initCategories() {
    const categories = [
      "All",
      ...new Set(menuData.map((item) => item.category)),
    ];

    categoryFilters.innerHTML = "";

    categories.forEach((category) => {
      const button = document.createElement("button");

      button.className = `filter-chip ${
        category === currentCategory ? "active" : ""
      }`;

      button.textContent = category;

      button.addEventListener("click", () => {
        currentCategory = category;

        document.querySelectorAll(".filter-chip").forEach((chip) => {
          chip.classList.remove("active");
        });

        button.classList.add("active");
        renderMenu();
      });

      categoryFilters.appendChild(button);
    });
  }

  function renderMenu() {
    menuGrid.innerHTML = "";

    const filteredItems = menuData.filter((item) => {
      const matchesCategory =
        currentCategory === "All" || item.category === currentCategory;

      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (filteredItems.length === 0) {
      menuGrid.innerHTML = `
        <div class="empty-state">
          <div style="font-size: 2.5rem;">🔍</div>
          <h3>No dishes found</h3>
          <p>Try searching for something else.</p>
        </div>
      `;
      return;
    }

    filteredItems.forEach((item) => {
      const card = document.createElement("div");

      card.className = "menu-card";

      card.innerHTML = `
        <div class="tags">
          <span class="tag ${item.isVeg ? "veg" : "nonveg"}">
            ${item.isVeg ? "VEG" : "NON-VEG"}
          </span>

          ${item.isSpicy ? '<span class="tag spicy">SPICY</span>' : ""}
          ${item.isPopular ? '<span class="tag popular">POPULAR</span>' : ""}
        </div>

        <div class="icon">${item.icon}</div>

        <h4>${item.name}</h4>

        <div class="category-label">
          ${item.category}
        </div>

        <div class="price">
          ${formatCurrency(item.price)}
        </div>

        <button class="add-btn">
          Add to Order +
        </button>
      `;

      card.querySelector(".add-btn").addEventListener("click", () => {
        addToCart(item.id);
      });

      menuGrid.appendChild(card);
    });
  }

  /* ==========================================================================
     5. CART OPERATIONS
     ========================================================================== */

  function addToCart(itemId) {
    const existingItem = cart.find((item) => item.id === itemId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const menuItem = menuData.find((item) => item.id === itemId);

      if (menuItem) {
        cart.push({
          ...menuItem,
          quantity: 1,
        });
      }
    }

    updateCartUI();
    showToast("Item added to your order ✓");
  }

  function updateQuantity(itemId, change) {
    const cartItem = cart.find((item) => item.id === itemId);

    if (!cartItem) return;

    cartItem.quantity += change;

    if (cartItem.quantity <= 0) {
      cart = cart.filter((item) => item.id !== itemId);
    }

    updateCartUI();
  }

  function removeFromCart(itemId) {
    cart = cart.filter((item) => item.id !== itemId);
    updateCartUI();
    showToast("Item removed from cart");
  }

  function updateCartUI() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      emptyCartMsg.style.display = "block";
      cartItemsContainer.appendChild(emptyCartMsg);
    } else {
      cart.forEach((item) => {
        const row = document.createElement("div");

        row.className = "cart-item";

        row.innerHTML = `
          <div class="icon">${item.icon}</div>

          <div class="info">
            <h4>${item.name}</h4>
            <span>${formatCurrency(item.price)} per item</span>
          </div>

          <div class="qty-controls">
            <button class="qty-minus" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button class="qty-plus" aria-label="Increase quantity">+</button>
          </div>

          <div class="line-total">
            ${formatCurrency(item.price * item.quantity)}
          </div>

          <button class="remove-btn" title="Remove item">
            ✕
          </button>
        `;

        row.querySelector(".qty-minus").addEventListener("click", () => {
          updateQuantity(item.id, -1);
        });

        row.querySelector(".qty-plus").addEventListener("click", () => {
          updateQuantity(item.id, 1);
        });

        row.querySelector(".remove-btn").addEventListener("click", () => {
          removeFromCart(item.id);
        });

        cartItemsContainer.appendChild(row);
      });
    }

    calculateTotals();
    renderRecommendations();
  }

  function calculateTotals() {
    const subtotal = cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const tax = subtotal * 0.05;

    const discountPercent = Math.min(
      100,
      Math.max(0, Number(discountInput.value) || 0)
    );

    const discount = (subtotal * discountPercent) / 100;

    const grandTotal = Math.max(0, subtotal + tax - discount);

    subtotalVal.textContent = formatCurrency(subtotal);
    taxVal.textContent = formatCurrency(tax);
    discountVal.textContent = `- ${formatCurrency(discount)}`;
    grandTotalVal.textContent = formatCurrency(grandTotal);

    return {
      subtotal,
      tax,
      discount,
      grandTotal,
      discountPercent,
    };
  }

  /* ==========================================================================
     6. PROFESSIONAL SMART RECOMMENDATION ENGINE
     ========================================================================== */

  function renderRecommendations() {
    recommendGrid.innerHTML = "";

    const cartIds = cart.map((item) => item.id);
    const recommendations = [];

    const hasMainCourse = cart.some(
      (item) => item.category === "Main Course"
    );

    const hasStarter = cart.some(
      (item) => item.category === "Starters"
    );

    const hasBread = cart.some(
      (item) => item.category === "Breads"
    );

    const hasBeverage = cart.some(
      (item) => item.category === "Beverages"
    );

    const hasDessert = cart.some(
      (item) => item.category === "Desserts"
    );

    const cartIsVegetarian =
      cart.length > 0 && cart.every((item) => item.isVeg);

    // PERFECT PAIR
    if (hasMainCourse && !hasBread && !cartIds.includes("m3")) {
      const item = menuData.find((dish) => dish.id === "m3");

      if (item) {
        recommendations.push({
          item,
          type: "Perfect Pair",
          score: 98,
          reason:
            "Our ordering pattern shows that this bread is frequently paired with your selected main course.",
        });
      }
    }

    // COMPLETE THE MEAL
    if (cart.length > 0 && !hasBeverage && !cartIds.includes("m8")) {
      const item = menuData.find((dish) => dish.id === "m8");

      if (item) {
        recommendations.push({
          item,
          type: "Complete Your Meal",
          score: 92,
          reason:
            "A refreshing beverage can create a more balanced dining experience.",
        });
      }
    }

    // DESSERT UPSELL
    if (
      cart.length >= 2 &&
      !hasDessert &&
      !cartIds.includes("m7")
    ) {
      const item = menuData.find((dish) => dish.id === "m7");

      if (item) {
        recommendations.push({
          item,
          type: "Finish on a Sweet Note",
          score: 88,
          reason:
            "Customers with similar meal combinations frequently add a dessert.",
        });
      }
    }

    // STARTER SUGGESTION
    if (
      hasMainCourse &&
      !hasStarter &&
      !cartIds.includes("m5")
    ) {
      const item = menuData.find((dish) => dish.id === "m5");

      if (item) {
        recommendations.push({
          item,
          type: "Starter Suggestion",
          score: 82,
          reason:
            "Add a light starter to make your meal more complete.",
        });
      }
    }

    // CUSTOMER FAVORITE FALLBACK
    if (recommendations.length < 3) {
      const popularItems = menuData
        .filter(
          (item) =>
            item.isPopular &&
            !cartIds.includes(item.id) &&
            !recommendations.some(
              (recommendation) =>
                recommendation.item.id === item.id
            )
        )
        .filter((item) => {
          if (cartIsVegetarian) return item.isVeg;
          return true;
        });

      popularItems.forEach((item) => {
        if (recommendations.length < 4) {
          recommendations.push({
            item,
            type: "Customer Favourite",
            score: 80,
            reason:
              "One of our most frequently ordered and highly preferred dishes.",
          });
        }
      });
    }

    // EMPTY CART STATE
    if (cart.length === 0) {
      const popularItems = menuData
        .filter((item) => item.isPopular)
        .slice(0, 4);

      popularItems.forEach((item, index) => {
        recommendations.push({
          item,
          type: index === 0 ? "Top AI Pick" : "Popular Choice",
          score: 95 - index * 4,
          reason:
            "Recommended based on overall customer ordering trends and popularity.",
        });
      });
    }

    recommendations.slice(0, 4).forEach((recommendation) => {
      const { item, type, score, reason } = recommendation;

      const card = document.createElement("div");
      card.className = "recommend-card";

      card.innerHTML = `
        <div class="rec-title">
          <span>${item.icon}</span>

          <div>
            <strong>${item.name}</strong>
            <small>${type}</small>
          </div>

          <span class="ai-tag">
            ${score}% Match
          </span>
        </div>

        <div class="rec-price">
          ${formatCurrency(item.price)}
        </div>

        <div class="rec-reason">
          ${reason}
        </div>

        <button class="add-btn btn-rec-add">
          Add Recommendation +
        </button>
      `;

      card
        .querySelector(".btn-rec-add")
        .addEventListener("click", () => {
          addToCart(item.id);
        });

      recommendGrid.appendChild(card);
    });
  }

  /* ==========================================================================
     7. AI SMART DISCOUNT
     ========================================================================== */

  aiDiscountBtn.addEventListener("click", () => {
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    let discount = 0;

    if (subtotal >= 1500) {
      discount = 18;
    } else if (subtotal >= 1000) {
      discount = 15;
    } else if (subtotal >= 700) {
      discount = 12;
    } else if (subtotal >= 500) {
      discount = 10;
    } else if (subtotal > 0) {
      discount = 5;
    } else {
      showToast("Add items to your cart first");
      return;
    }

    discountInput.value = discount;
    calculateTotals();

    showToast(`AI recommended a ${discount}% discount for this order`);
  });

  /* ==========================================================================
     8. BILL GENERATION
     ========================================================================== */

  confirmOrderBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Your cart is empty. Please add items first.");
      return;
    }

    const customerName =
      customerNameInput.value.trim() || "Guest Customer";

    const orderType = tableNumberSelect.value;
    const totals = calculateTotals();

    const billNumber = `SR-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    const orderDate = new Date().toLocaleString();

    const itemsHtml = cart
      .map(
        (item) => `
          <tr>
            <td>${item.name} × ${item.quantity}</td>
            <td>${formatCurrency(item.price * item.quantity)}</td>
          </tr>
        `
      )
      .join("");

    billContent.innerHTML = `
      <div class="bill-header">
        <h2>🍽️ Spice Route</h2>
        <p>AI-Powered Billing & Dining Experience</p>
      </div>

      <div class="bill-meta">
        <div>
          <strong>Bill No:</strong> ${billNumber}<br>
          <strong>Customer:</strong> ${customerName}
        </div>

        <div style="text-align: right;">
          <strong>Date:</strong> ${orderDate}<br>
          <strong>Order:</strong> ${orderType}
        </div>
      </div>

      <table class="bill-table">
        <thead>
          <tr>
            <th>Item & Quantity</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="bill-totals">
        <div>
          <span>Subtotal</span>
          <span>${formatCurrency(totals.subtotal)}</span>
        </div>

        <div>
          <span>Tax (5%)</span>
          <span>${formatCurrency(totals.tax)}</span>
        </div>

        <div>
          <span>AI Discount (${totals.discountPercent}%)</span>
          <span>- ${formatCurrency(totals.discount)}</span>
        </div>

        <div class="grand">
          <span>Grand Total</span>
          <span>${formatCurrency(totals.grandTotal)}</span>
        </div>
      </div>

      <div class="bill-footer">
        <p>Thank you for dining with Spice Route!</p>
        <p>Powered by our AI-Enabled Restaurant Billing System 🤖</p>
      </div>
    `;

    billModalOverlay.classList.add("active");
  });

  closeBillModal.addEventListener("click", () => {
    billModalOverlay.classList.remove("active");
  });

  billModalOverlay.addEventListener("click", (event) => {
    if (event.target === billModalOverlay) {
      billModalOverlay.classList.remove("active");
    }
  });

  newOrderBtn.addEventListener("click", () => {
    cart = [];
    customerNameInput.value = "";
    discountInput.value = 0;

    updateCartUI();

    billModalOverlay.classList.remove("active");
    showToast("New order started successfully");
  });

  clearCartBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Your cart is already empty");
      return;
    }

    cart = [];
    updateCartUI();

    showToast("Cart cleared successfully");
  });

  /* ==========================================================================
     9. AI RESTAURANT ASSISTANT
     ========================================================================== */

  function appendChatMessage(message, sender) {
    const messageElement = document.createElement("div");

    messageElement.className = `chat-msg ${sender}`;
    messageElement.textContent = message;

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function processAIQuery(query) {
    const q = query.toLowerCase();
    let reply = "";

    if (q.includes("veg") || q.includes("vegetarian")) {
      const items = menuData
        .filter((item) => item.isVeg)
        .map((item) => `• ${item.name} (${formatCurrency(item.price)})`)
        .join("\n");

      reply = `Here are our vegetarian options:\n${items}`;
    } else if (
      q.includes("popular") ||
      q.includes("best") ||
      q.includes("bestseller")
    ) {
      const items = menuData
        .filter((item) => item.isPopular)
        .map((item) => `• ${item.name} (${formatCurrency(item.price)})`)
        .join("\n");

      reply = `Our customer favourites are:\n${items}`;
    } else if (
      q.includes("500") ||
      q.includes("budget") ||
      q.includes("under")
    ) {
      reply =
        "For a meal under ₹500, I recommend:\n\n" +
        "• Paneer Tikka Masala – ₹290\n" +
        "• Garlic Naan – ₹50\n" +
        "• Masala Chai – ₹40\n\n" +
        "Total: ₹380";
    } else if (q.includes("spicy")) {
      const items = menuData
        .filter((item) => item.isSpicy)
        .map((item) => `• ${item.name} (${formatCurrency(item.price)})`)
        .join("\n");

      reply = `If you enjoy spicy food, try:\n${items}`;
    } else if (
      q.includes("dessert") ||
      q.includes("sweet")
    ) {
      const items = menuData
        .filter((item) => item.category === "Desserts")
        .map((item) => `• ${item.name} (${formatCurrency(item.price)})`)
        .join("\n");

      reply = `Here are our desserts:\n${items}`;
    } else if (
      q.includes("recommend") ||
      q.includes("suggest")
    ) {
      reply =
        "My recommendation is to choose a Main Course, pair it with Garlic Naan or Jeera Rice, add a refreshing beverage, and finish with Gulab Jamun for a complete dining experience!";
    } else {
      reply =
        "I'm here to help! You can ask me about vegetarian dishes, popular items, spicy food, desserts, prices, or recommendations based on your budget.";
    }

    setTimeout(() => {
      appendChatMessage(reply, "bot");
    }, 500);
  }

  function handleSendChat() {
    const message = chatInput.value.trim();

    if (!message) return;

    appendChatMessage(message, "user");

    chatInput.value = "";

    processAIQuery(message);
  }

  chatSendBtn.addEventListener("click", handleSendChat);

  chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      handleSendChat();
    }
  });

  document.querySelectorAll(".quick-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const query = chip.dataset.q;

      appendChatMessage(query, "user");
      processAIQuery(query);
    });
  });

  /* ==========================================================================
     10. VOICE INPUT
     ========================================================================== */

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      isListening = true;
      voiceInputBtn.classList.add("listening");
      showToast("Listening... Please speak now");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      chatInput.value = transcript;
      handleSendChat();
    };

    recognition.onerror = () => {
      showToast("Unable to recognize your voice. Please try again.");
    };

    recognition.onend = () => {
      isListening = false;
      voiceInputBtn.classList.remove("listening");
    };

    voiceInputBtn.addEventListener("click", () => {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });
  } else {
    voiceInputBtn.addEventListener("click", () => {
      showToast(
        "Voice input is not supported by this browser."
      );
    });
  }

  /* ==========================================================================
     11. RESTAURANT INSIGHTS
     ========================================================================== */

  function renderInsights() {
    popularChart.innerHTML = insightsData.popularDishes
      .map((item) => {
        const percentage = (item.count / item.max) * 100;

        return `
          <div class="bar-row">
            <span class="bar-label">${item.name}</span>

            <div class="bar-track">
              <div
                class="bar-fill"
                style="width: ${percentage}%"
              >
                ${item.count}
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    comboList.innerHTML = insightsData.frequentCombos
      .map(
        (combo) => `
          <li>
            <span>${combo.pair}</span>
            <strong>${combo.percentage}</strong>
          </li>
        `
      )
      .join("");

    peakChart.innerHTML = insightsData.peakHours
      .map((item) => {
        const percentage = (item.volume / item.max) * 100;

        return `
          <div class="bar-row">
            <span class="bar-label">${item.time}</span>

            <div class="bar-track">
              <div
                class="bar-fill"
                style="width: ${percentage}%"
              >
                ${item.volume}%
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    lowList.innerHTML = insightsData.lowPerforming
      .map(
        (item) => `
          <li>
            <span>${item.name}</span>
            <span style="color: var(--text-light);">
              ${item.text}
            </span>
          </li>
        `
      )
      .join("");

    promoList.innerHTML = insightsData.promotions
      .map((promotion) => `<li>${promotion}</li>`)
      .join("");
  }

  /* ==========================================================================
     12. NAVIGATION & EVENT LISTENERS
     ========================================================================== */

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });

  searchInput.addEventListener("input", (event) => {
    searchQuery = event.target.value;
    renderMenu();
  });

  discountInput.addEventListener("input", calculateTotals);

  /* ==========================================================================
     13. INITIALIZE APPLICATION
     ========================================================================== */

  initCategories();
  renderMenu();
  updateCartUI();
  renderInsights();
});