// 🔑 Store-specific key (change for each store)
const storeKey = 'cart-index'; // Example: 'cart_perfumes'

// Retrieve cart from localStorage or start fresh
let cart = JSON.parse(localStorage.getItem(storeKey)) || [];

// ✅ Add to cart (with image)
function addToCart(productName, price, imageSrc) {
    let existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // now we save image too
        cart.push({ name: productName, price: price, quantity: 1, image: imageSrc });
    }

    localStorage.setItem(storeKey, JSON.stringify(cart));
    updateCartCount();

    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            showToast(`Thank you for buying from us!`);
        }, i * 667);
    }
}

// Decrease quantity by 1 or remove item if quantity = 0
function unclickItem(productName) {
    let item = cart.find(i => i.name === productName);
    if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== productName);
        }
        localStorage.setItem(storeKey, JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
    }
}

// Remove item completely from cart
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem(storeKey, JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
}

// Update cart count in navbar
function updateCartCount() {
    let cartCountDisplay = document.getElementById("cart-count");
    if (cartCountDisplay) {
        let count = 0;
        cart.forEach(item => count += item.quantity);
        cartCountDisplay.textContent = count;
    }
}

// ✅ Update cart display (now shows image beside name)
function updateCartDisplay() {
    let cartItemsList = document.getElementById("cart-items");
    let cartTotalDisplay = document.getElementById("cart-total");

    if (!cartItemsList || !cartTotalDisplay) return;

    cartItemsList.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        let li = document.createElement("li");
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.justifyContent = "space-between";
        li.style.gap = "10px";
        li.style.marginBottom = "15px";
        li.style.borderBottom = "1px solid #ddd";
        li.style.paddingBottom = "10px";

        li.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${item.image || 'images/default.png'}" alt="${item.name}" 
                style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            <div>
              <strong>${item.name}</strong><br>
              <small>₦${item.price.toLocaleString()} × ${item.quantity}</small><br>
              <b>Total: ₦${itemTotal.toLocaleString()}</b>
            </div>
          </div>
          <div>
            <button onclick="unclickItem('${item.name}')">Unclick</button>
            <button onclick="removeFromCart('${item.name}')">Remove All</button>
          </div>
        `;
        cartItemsList.appendChild(li);
    });

    cartTotalDisplay.textContent = total.toLocaleString();
}

// Toast (unchanged)
function showToast(message) {
    let toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "#333";
    toast.style.color = "#fff";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "5px";
    toast.style.fontFamily = "sans-serif";
    toast.style.zIndex = "9999";
    toast.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease-in-out";

    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.style.opacity = "1");

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 1000);
}

// ✅ WhatsApp Checkout Function
function checkoutViaWhatsApp() {
    const cart = JSON.parse(localStorage.getItem(storeKey)) || [];

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    let message = "🛒 *Order Summary* from Gleent Store:%0A";
    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}%0A`;
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `%0A💰 *Total*: ₦${total.toLocaleString()}`;

    const phoneNumber = "2347068579589"; 
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}

// Page load setup (unchanged)
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartDisplay();

    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const clearBtn = document.getElementById("clearBtn");
    const products = document.querySelectorAll(".product-card");
    const productList = document.getElementById("productList");

    const noResultMsg = document.createElement("div");
    noResultMsg.id = "noResultMsg";
    noResultMsg.textContent = "❌ Product not available";
    document.body.appendChild(noResultMsg);

    Object.assign(noResultMsg.style, {
        position: "fixed",
        top: "-60px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#ff4d4d",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "6px",
        fontWeight: "bold",
        fontFamily: "sans-serif",
        boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
        transition: "top 0.6s ease, opacity 0.6s ease",
        opacity: "0",
        zIndex: "9999"
    });

    function showNotification() {
        noResultMsg.style.top = "20px";
        noResultMsg.style.opacity = "1";
        setTimeout(() => {
            noResultMsg.style.top = "-60px";
            noResultMsg.style.opacity = "0";
        }, 3000);
    }

    function resetProducts() {
        searchInput.value = "";
        products.forEach(product => (product.style.display = "block"));
        if (productList) {
            productList.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function searchProducts() {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            resetProducts();
            return;
        }

        let found = false;
        products.forEach(product => {
            const name = product.querySelector("h3").textContent.toLowerCase();
            const desc = product.querySelector(".description").textContent.toLowerCase();

            if (name.includes(query) || desc.includes(query)) {
                product.style.display = "block";
                found = true;
            } else {
                product.style.display = "none";
            }
        });

        if (!found) showNotification();
    }

    searchBtn.addEventListener("click", searchProducts);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") searchProducts();
    });

    if (clearBtn) clearBtn.addEventListener("click", resetProducts);

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart") || e.target.closest(".add-to-cart")) {
            resetProducts();
        }
    });
});

const track = document.querySelector('.carousel-track');
  const cards = document.querySelectorAll('.carousel-card');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const dots = document.querySelectorAll('.dot');

  // Clone first 3 cards for seamless infinite effect
  const totalCards = cards.length;
  for(let i = 0; i < 3; i++){
    const clone = cards[i].cloneNode(true);
    track.appendChild(clone);
  }

  let index = 0;
  const visibleCards = 3;

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 20;
    track.style.transition = 'transform 0.8s ease-in-out';
    track.style.transform = `translateX(-${index * cardWidth}px)`;

    // Fade/scale active cards
    const allCards = document.querySelectorAll('.carousel-card');
    allCards.forEach(card => card.classList.remove('active'));
    for(let i = index; i < index + visibleCards; i++){
      allCards[i % allCards.length].classList.add('active');
    }

    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index % totalCards].classList.add('active');
  }

  let carouselInterval = setInterval(() => {
    index++;
    if(index > totalCards) { // reset seamlessly
      track.style.transition = 'none';
      index = 0;
      track.style.transform = `translateX(-${index * (cards[0].offsetWidth + 20)}px)`;
      setTimeout(updateCarousel, 20);
    } else {
      updateCarousel();
    }
  }, 3000);

  // Arrows
  nextBtn.addEventListener('click', () => {
    clearInterval(carouselInterval);
    index++;
    if(index > totalCards) index = 0;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    clearInterval(carouselInterval);
    index--;
    if(index < 0) index = totalCards;
    updateCarousel();
  });

  // Dots
  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => {
      clearInterval(carouselInterval);
      index = dotIndex;
      updateCarousel();
    });
  });

  // Initialize
  updateCarousel();
