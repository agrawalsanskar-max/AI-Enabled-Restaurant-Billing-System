document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     1. STATE & MOCK DATA
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
      { pair: "Butter Chicken + Garlic Naan", percentage: "84% orders" },
      { pair: "Paneer Tikka + Jeera Rice", percentage: "62% orders" },
      { pair: "Chicken 65 + Cold Beverages", percentage: "45% orders" },
    ],
    peakHours: [
      { time: "1:00 PM - 3:00 PM (Lunch)", volume: 85, max: 100 },
      { time: "8:00 PM - 10:30 PM (Dinner)", volume: 98, max: 100 },
    ],
    lowPerforming: [
      { name: "Veg Spring Rolls", text: "Low order rate on weekdays" },
      { name: "Masala Chai", text: "Ordered mostly in evening slots" },
    ],
    promotions: [
      "Bundle **Butter Chicken + 2 Garlic Naans** for a 10% combo discount.",
      "Offer free **Mango Lassi** on orders above ₹800 during lunch hours.",
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
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  function formatCurrency(num) {
    return `₹${num.toFixed(2)}`;
  }

  /* ==========================================================================
     4. RENDER MENU & FILTERS
     ========================================================================== */
  function initCategories() {
    const categories = ["All", ...new Set(menuData.map((item) => item.category))];
    categoryFilters.innerHTML = "";

    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = `filter-chip ${cat === currentCategory ? "active" : ""}`;
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        currentCategory = cat;
        document
          .querySelectorAll(".filter-chip")
          .forEach((c) => c.classList.remove("active"));
        btn.classList.add("active");
        renderMenu();
      });
      categoryFilters.appendChild(btn);
    });
  }

  function renderMenu() {
    menuGrid.innerHTML = "";

    const filtered = menuData.filter((item) => {
      const matchesCategory =
        currentCategory === "All" || item.category === currentCategory;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      menuGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 20px;">No dishes match your criteria.</p>`;
      return;
    }

    filtered.forEach((item) => {
      const card = document.createElement("div");
      card.className = "menu-card";
      card.innerHTML = `
        <div class="tags">
          <span class="tag ${item.isVeg ? "veg" : "nonveg"}">${item.isVeg ? "VEG" : "NON-VEG"}</span>
          ${item.isSpicy ? '<span class="tag spicy">SPICY</span>' : ""}
          ${item.isPopular ? '<span class="tag popular">POPULAR</span>' : ""}
        </div>
        <div class="icon">${item.icon}</div>
        <h4>${item.name}</h4>
        <div class="category-label">${item.category}</div>
        <div class="price">${formatCurrency(item.price)}</div>
        <button class="add-btn">Add to Cart +</button>
      `;

      card.querySelector(".add-btn").addEventListener("click", () => {
        addToCart(item.id);
      });

      menuGrid.appendChild(card);
    });
  }

  /* ==========================================================================
     5. CART OPERATIONS & COMPUTATION
     ========================================================================== */
  function addToCart(itemId) {
    const existing = cart.find((i) => i.id === itemId);
    if (existing) {
      existing.quantity += 1;
    } else {
      const item = menuData.find((m) => m.id === itemId);
      cart.push({ ...item, quantity: 1 });
    }
    updateCartUI();
    showToast("Added item to cart");
  }

  function updateQuantity(itemId, delta) {
    const index = cart.findIndex((i) => i.id === itemId);
    if (index > -1) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
    }
    updateCartUI();
  }

  function removeFromCart(itemId) {
    cart = cart.filter((i) => i.id !== itemId);
    updateCartUI();
  }

  function updateCartUI() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.appendChild(emptyCartMsg);
      emptyCartMsg.style.display = "block";
    } else {
      emptyCartMsg.style.display = "none";
      cart.forEach((item) => {
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
          <div class="icon">${item.icon}</div>
          <div class="info">
            <h4>${item.name}</h4>
            <span>${formatCurrency(item.price)} each</span>
          </div>
          <div class="qty-controls">
            <button class="btn-qty-minus">-</button>
            <span>${item.quantity}</span>
            <button class="btn-qty-plus">+</button>
          </div>
          <div class="line-total">${formatCurrency(item.price * item.quantity)}</div>
          <button class="remove-btn" title="Remove Item">✕</button>
        `;

        row
          .querySelector(".btn-qty-minus")
          .addEventListener("click", () => updateQuantity(item.id, -1));
        row
          .querySelector(".btn-qty-plus")
          .addEventListener("click", () => updateQuantity(item.id, 1));
        row
          .querySelector(".remove-btn")
          .addEventListener("click", () => removeFromCart(item.id));

        cartItemsContainer.appendChild(row);
      });
    }

    calculateTotals();
    renderRecommendations();
  }

  function calculateTotals() {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.05;
    const discountPercent = parseFloat(discountInput.value) || 0;
    const discount = (subtotal * discountPercent) / 100;
    const grandTotal = Math.max(0, subtotal + tax - discount);

    subtotalVal.textContent = formatCurrency(subtotal);
    taxVal.textContent = formatCurrency(tax);
    discountVal.textContent = `- ${formatCurrency(discount)}`;
    grandTotalVal.textContent = formatCurrency(grandTotal);

    return { subtotal, tax, discount, grandTotal, discountPercent };
  }

  /* ==========================================================================
     6. AI RECOMMENDATIONS & SMART DISCOUNT
     ========================================================================== */
  function renderRecommendations() {
    recommendGrid.innerHTML = "";

    // Determine recommendations based on cart state
    const cartIds = cart.map((c) => c.id);
    let recommendations = [];

    const hasMainCourse = cart.some((i) => i.category === "Main Course");
    const hasBread = cart.some((i) => i.category === "Breads");
    const hasBeverage = cart.some((i) => i.category === "Beverages");
    const hasDessert = cart.some((i) => i.category === "Desserts");

    if (hasMainCourse && !hasBread) {
      const naan = menuData.find((m) => m.id === "m3");
      if (naan) {
        recommendations.push({
          item: naan,
          reason: "Pairs perfectly with your Main Course!",
        });
      }
    }
    if (cart.length > 0 && !hasBeverage) {
      const lassi = menuData.find((m) => m.id === "m8");
      if (lassi) {
        recommendations.push({
          item: lassi,
          reason: "Refreshing drink to complete your meal.",
        });
      }
    }
    if (cart.length > 0 && !hasDessert) {
      const dessert = menuData.find((m) => m.id === "m7");
      if (dessert) {
        recommendations.push({
          item: dessert,
          reason: "Treat yourself with something sweet!",
        });
      }
    }

    // Default suggestions if cart is empty or no specific rules matched
    if (recommendations.length === 0) {
      const populars = menuData.filter(
        (m) => m.isPopular && !cartIds.includes(m.id)
      );
      populars.slice(0, 3).forEach((pop) => {
        recommendations.push({
          item: pop,
          reason: "Customer favorite! Frequently ordered.",
        });
      });
    }

    recommendations.forEach(({ item, reason }) => {
      const recCard = document.createElement("div");
      recCard.className = "recommend-card";
      recCard.innerHTML = `
        <div class="rec-title">
          <span>${item.icon}</span>
          <span>${item.name}</span>
          <span class="ai-tag">AI Pick</span>
        </div>
        <div class="rec-price">${formatCurrency(item.price)}</div>
        <div class="rec-reason">${reason}</div>
        <button class="add-btn btn-rec-add">Add to Order +</button>
      `;

      recCard.querySelector(".btn-rec-add").addEventListener("click", () => {
        addToCart(item.id);
      });

      recommendGrid.appendChild(recCard);
    });
  }

  aiDiscountBtn.addEventListener("click", () => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    let suggestedDiscount = 0;

    if (subtotal >= 1000) {
      suggestedDiscount = 15;
    } else if (subtotal >= 500) {
      suggestedDiscount = 10;
    } else if (subtotal > 0) {
      suggestedDiscount = 5;
    } else {
      showToast("Add items to cart to calculate AI discount");
      return;
    }

    discountInput.value = suggestedDiscount;
    calculateTotals();
    showToast(`AI Smart Discount applied: ${suggestedDiscount}%`);
  });

  /* ==========================================================================
     7. BILL GENERATION & MODAL
     ========================================================================== */
  confirmOrderBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Cart is empty. Please add items before placing order.");
      return;
    }

    const name = customerNameInput.value.trim() || "Guest Customer";
    const table = tableNumberSelect.value;
    const totals = calculateTotals();
    const dateStr = new Date().toLocaleString();
    const billNo = "SR-" + Math.floor(100000 + Math.random() * 900000);

    let itemsHtml = cart
      .map(
        (item) => `
      <tr>
        <td>${item.name} x ${item.quantity}</td>
        <td>${formatCurrency(item.price * item.quantity)}</td>
      </tr>
    `
      )
      .join("");

    billContent.innerHTML = `
      <div class="bill-header">
        <h2>Spice Route</h2>
        <p>AI Billing & Dining Experience</p>
      </div>
      <div class="bill-meta">
        <div>
          <strong>Bill No:</strong> ${billNo}<br>
          <strong>Customer:</strong> ${name}
        </div>
        <div style="text-align: right;">
          <strong>Date:</strong> ${dateStr}<br>
          <strong>Type:</strong> ${table}
        </div>
      </div>
      <table class="bill-table">
        <thead>
          <tr>
            <th>Item & Qty</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <div class="bill-totals">
        <div><span>Subtotal</span><span>${formatCurrency(totals.subtotal)}</span></div>
        <div><span>Tax (5%)</span><span>${formatCurrency(totals.tax)}</span></div>
        <div><span>Discount (${totals.discountPercent}%)</span><span>- ${formatCurrency(totals.discount)}</span></div>
        <div class="grand"><span>Grand Total</span><span>${formatCurrency(totals.grandTotal)}</span></div>
      </div>
      <div class="bill-footer">
        <p>Thank you for dining with us!</p>
        <p>Powered by AI Billing System</p>
      </div>
    `;

    billModalOverlay.classList.add("active");
  });

  closeBillModal.addEventListener("click", () => {
    billModalOverlay.classList.remove("active");
  });

  newOrderBtn.addEventListener("click", () => {
    cart = [];
    customerNameInput.value = "";
    discountInput.value = 0;
    updateCartUI();
    billModalOverlay.classList.remove("active");
    showToast("New order session started");
  });

  clearCartBtn.addEventListener("click", () => {
    cart = [];
    updateCartUI();
    showToast("Cart cleared");
  });

  /* ==========================================================================
     8. AI ASSISTANT & VOICE RECOGNITION
     ========================================================================== */
  function appendChatMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${sender}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function processAIQuery(query) {
    const q = query.toLowerCase();
    let reply = "";

    if (q.includes("veg") || q.includes("vegetarian")) {
      const vegItems = menuData
        .filter((m) => m.isVeg)
        .map((m) => `${m.name} (${formatCurrency(m.price)})`)
        .join("\n• ");
      reply = `Here are our top Vegetarian options:\n• ${vegItems}`;
    } else if (q.includes("popular") || q.includes("bestseller") || q.includes("best")) {
      const populars = menuData
        .filter((m) => m.isPopular)
        .map((m) => `${m.name} (${formatCurrency(m.price)})`)
        .join("\n• ");
      reply = `Our most popular dishes are:\n• ${populars}`;
    } else if (q.includes("500") || q.includes("under")) {
      reply = `For under ₹500, I recommend:\n• Paneer Tikka Masala (${formatCurrency(290)})\n• Garlic Naan (${formatCurrency(50)})\n• Masala Chai (${formatCurrency(40)})\nTotal: ₹380!`;
    } else if (q.includes("spicy")) {
      const spicy = menuData
        .filter((m) => m.isSpicy)
        .map((m) => `${m.name} (${formatCurrency(m.price)})`)
        .join("\n• ");
      reply = `If you like spicy food, try these:\n• ${spicy}`;
    } else if (q.includes("dessert") || q.includes("sweet")) {
      const desserts = menuData
        .filter((m) => m.category === "Desserts")
        .map((m) => `${m.name} (${formatCurrency(m.price)})`)
        .join("\n• ");
      reply = `Here are our sweet treats:\n• ${desserts}`;
    } else {
      reply = `I'm here to help! You can ask me for vegetarian options, popular items, spicy dishes, or meal recommendations under budget.`;
    }

    setTimeout(() => {
      appendChatMessage(reply, "bot");
    }, 400);
  }

  function handleSendChat() {
    const text = chatInput.value.trim();
    if (!text) return;
    appendChatMessage(text, "user");
    chatInput.value = "";
    processAIQuery(text);
  }

  chatSendBtn.addEventListener("click", handleSendChat);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSendChat();
  });

  document.querySelectorAll(".quick-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const q = chip.getAttribute("data-q");
      appendChatMessage(q, "user");
      processAIQuery(q);
    });
  });

  // Web Speech API Integration
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      isListening = true;
      voiceInputBtn.classList.add("listening");
      showToast("Listening... Speak now");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      chatInput.value = transcript;
      handleSendChat();
    };

    recognition.onerror = () => {
      showToast("Voice recognition error or canceled");
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
      showToast("Voice input is not supported in this browser.");
    });
  }

  /* ==========================================================================
     9. INSIGHTS SECTION RENDERING
     ========================================================================== */
  function renderInsights() {
    // Popular dishes chart
    popularChart.innerHTML = insightsData.popularDishes
      .map((item) => {
        const pct = (item.count / item.max) * 100;
        return `
        <div class="bar-row">
          <span class="bar-label">${item.name}</span>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%;">${item.count}</div>
          </div>
        </div>
      `;
      })
      .join("");

    // Frequently ordered together
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

    // Peak hours chart
    peakChart.innerHTML = insightsData.peakHours
      .map((item) => {
        const pct = (item.volume / item.max) * 100;
        return `
        <div class="bar-row">
          <span class="bar-label">${item.time}</span>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%;">${item.volume}%</div>
          </div>
        </div>
      `;
      })
      .join("");

    // Low performing items
    lowList.innerHTML = insightsData.lowPerforming
      .map(
        (item) => `
      <li>
        <span>${item.name}</span>
        <span style="color: var(--text-light);">${item.text}</span>
      </li>
    `
      )
      .join("");

    // Suggested promotions
    promoList.innerHTML = insightsData.promotions
      .map((promo) => `<li>${promo}</li>`)
      .join("");
  }

  /* ==========================================================================
     10. INITIALIZATION & LISTENERS
     ========================================================================== */
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderMenu();
  });

  discountInput.addEventListener("input", calculateTotals);

  // Initial Run
  initCategories();
  renderMenu();
  updateCartUI();
  renderInsights();
});