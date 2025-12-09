document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis({
    duration: 1.2, // ความหนืด (ยิ่งเยอะยิ่งลื่น)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  console.log("HTML Document is ready. Starting to fetch shops...");
  loadAndDisplayShop();
});

const searchform = document.getElementById("hero-search-form");

if (searchform) {
  searchform.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const form = new FormData(e.target);
      const keyword = form.get("search");

      console.log("hero search:", keyword);

      const value = { name: keyword || "" };

      const response = await fetch(`http://127.0.0.1:3000/shops/name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });

    } catch (err) {
      console.error("Hero search error:", err);
    }
  });
}

async function loadAndDisplayShop() {
  try {
    const response = await fetch("http://127.0.0.1:3000/shops/recommand");

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const shops = await response.json();
    console.log("Data received:", shops);

    createShopCards(shops);
  } catch (err) {
    console.error("Failed to load shop data:", err.message);
  }
}

function createShopCards(shops) {
  const shop_card_container = document.getElementById("shop-suggestion");

  if (!shop_card_container) {
    console.error("Error: Element with id 'shop-card' not found!");
    return;
  }

  shops.forEach((shop) => {
    const singleCard = buildSingleShopCard(shop);
    shop_card_container.appendChild(singleCard);
  });
}

function buildSingleShopCard(shopData) {
  const cardElement = document.createElement("div");
  cardElement.className = "shop-card";

  cardElement.innerHTML = `
    <a href="#" class="shop-card-link">
        <div class="pic">
            <img src="${shopData.cover_image_url}"> 
        </div>
        <div class="info">
            <p>${shopData.name}</p>
            <div class="score">
               เรตติ้ง ${shopData.average_rating}
            </div>
            <p>${shopData.description}</p>
            <div class="specific">
               
            </div>
        </div>
    </a>
  `;
  const link = cardElement.querySelector(".shop-card-link");
  link.addEventListener("click", (e) => {
    e.preventDefault();
    openShopPopup(shopData);
  });

  return cardElement;

  return cardElement;
}

// manipulated article slider
const slider = document.querySelector(".article-suggestion");
const prevBtn = document.querySelector(".slider-btn.prev");
const nextBtn = document.querySelector(".slider-btn.next");

if (slider && prevBtn && nextBtn) {
  const scrollAmount = () => slider.clientWidth * 0.8;

  nextBtn.addEventListener("click", () => {
    slider.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });

  prevBtn.addEventListener("click", () => {
    slider.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });
}

function buildPopup(shop) {
  // ลบ popup เดิมถ้ายังค้างอยู่
  const old = document.querySelector(".popup-overlay");
  if (old) old.remove();

  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  const pop = document.createElement("div");
  pop.className = "popCard";

  pop.innerHTML = `
    <button class="popup-close" type="button">✕</button>
    <div class="left"> 
      <div class="pic">
        <img src="${
          shop.cover_image_url || "/frontend/resources/noimage.jpg"
        }" alt="${shop.name}">
      </div>
      <div class="info">
        <p class="shop-name">${shop.name}</p>
        <div class="score">⭐ ${shop.average_rating ?? "-"}</div>
        <p class="desc">${shop.description ?? ""}</p>
      </div>
    </div>
    <div class="right"> 
      <div class="comment">
        <div class="profile-image">
          <img src="${
            shop.cover_image_url || "/frontend/resources/noimage.jpg"
          }" alt="${shop.name}">
        </div>
        <div class="about-text">
          <p class="username">${shop.username ?? "Guest"}</p>
          <p class="text-comment">${shop.comment ?? "ยังไม่มีรีวิว"}</p>
        </div>
      </div>
    </div>
  `;

  overlay.appendChild(pop);
  document.body.appendChild(overlay);

  const closeBtn = pop.querySelector(".popup-close");

  const escHandler = (e) => {
    if (e.key === "Escape") {
      close();
    }
  };

  function close() {
    overlay.remove();
    window.removeEventListener("keydown", escHandler);
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", close);
  }

  window.addEventListener("keydown", escHandler);
}

function openShopPopup(shop) {
  buildPopup(shop);
}
