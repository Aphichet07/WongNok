const BASE_URL = "http://127.0.0.1:3000";
const PAGE_SIZE = 5;
let ALL_SHOPS = [];
let CURRENT_PAGE = 1;

const searchform = document.getElementById("hero-search-form");

if (searchform) {
  searchform.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const form = new FormData(e.target);
      const keyword = form.get("search");

      console.log("hero search:", keyword);

      const value = { name: keyword || "" };

      const response = await fetch(`${BASE_URL}/shops/name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      ALL_SHOPS = await response.json();
      renderPage(1);
    } catch (err) {
      console.error("Hero search error:", err);
    }
  });
}

// ========= SIDE BAR FILTER =========
document.addEventListener("DOMContentLoaded", () => {
  console.log("Heleo");
  const currentUser = getCurrentUserFromToken();

  const filter_form = document.getElementById("filter-form");
  if (filter_form) filter_form.addEventListener("submit", handleFilter);

  const lenis = new Lenis({
    duration: 1.2, 
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
});

async function handleFilter(e) {
  e.preventDefault();

  const form = new FormData(e.target);
  const params = {};

  for (const [k, v] of form.entries()) {
    if (params[k]) {
      params[k] = Array.isArray(params[k]) ? [...params[k], v] : [params[k], v];
    } else {
      params[k] = v;
    }
  }

  const query = new URLSearchParams(params);
  const url = `${BASE_URL}/shops/filter?${query.toString()}`;
  console.log("filter url:", url);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    ALL_SHOPS = await res.json();
    renderPage(1);
  } catch (err) {
    console.error("Filter error:", err);
  }
}

// ========= RENDERING =========
function renderPage(page) {
  const container = document.getElementById("shop-result");
  if (!container) return;

  container.innerHTML = "";

  if (!ALL_SHOPS || ALL_SHOPS.length === 0) {
    container.innerHTML = `<p style="color:#888;text-align:center">ไม่พบร้านที่ตรงกับการค้นหา</p>`;
    return;
  }

  const totalPages = Math.ceil(ALL_SHOPS.length / PAGE_SIZE);
  CURRENT_PAGE = Math.min(Math.max(+page || 1, 1), totalPages);

  const start = (CURRENT_PAGE - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const items = ALL_SHOPS.slice(start, end);

  items.forEach((shop) => container.appendChild(buildShopCard(shop)));

  const pager = document.createElement("div");
  pager.className = "pagination-inline";

  const mkBtn = (label, page, opts = {}) => {
    const b = document.createElement("button");
    b.textContent = label;
    b.className = `page-btn${opts.active ? " active" : ""}`;
    if (opts.disabled) b.disabled = true;
    b.addEventListener("click", () => renderPage(page));
    return b;
  };

  pager.appendChild(
    mkBtn("‹ Prev", CURRENT_PAGE - 1, { disabled: CURRENT_PAGE === 1 })
  );

  for (let p = 1; p <= totalPages; p++) {
    pager.appendChild(mkBtn(String(p), p, { active: p === CURRENT_PAGE }));
  }

  pager.appendChild(
    mkBtn("Next ›", CURRENT_PAGE + 1, { disabled: CURRENT_PAGE === totalPages })
  );

  container.appendChild(pager);
}

// ========= CARD + POPUP =========
function buildShopCard(shop) {
  const el = document.createElement("div");
  el.key = shop.id;
  el.className = "shop-card";

  el.innerHTML = `
    <a href="#" class="shop-card-link">
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
    </a>
  `;

  const link = el.querySelector(".shop-card-link");
  link.addEventListener("click", (e) => {
    e.preventDefault();
    openShopPopup(shop);
  });

  return el;
}
function buildPopup(shop) {
  const exist = document.querySelector(".popup-overlay");
  if (exist) exist.remove();

  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  const pop = document.createElement("div");
  pop.className = "popCard";

  const currentUser = getCurrentUserFromToken();
  console.log("Hello : ", currentUser);
  const currentName = currentUser.username || "unknown";

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
        <div class="score">
          ⭐ ${shop.average_rating ?? "-"}
        </div>
        <p class="desc">${shop.description ?? ""}</p>
      </div>
    </div>

    <div class="right"> 
      <!-- รีวิวล่าสุด -->
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

      <!-- ฟอร์มคอมเมนต์ + ดาว -->
      <div class="comment-form">
        <h3>เขียนรีวิวร้านนี้</h3>
        <form id="comment-form">
          <div class="rating-input">
            <span class="rating-label">ให้คะแนนร้านนี้:</span>
            <div class="rating-stars">
              <input type="radio" id="rate-5" name="rating" value="5">
              <label for="rate-5">★</label>
              <input type="radio" id="rate-4" name="rating" value="4">
              <label for="rate-4">★</label>
              <input type="radio" id="rate-3" name="rating" value="3">
              <label for="rate-3">★</label>
              <input type="radio" id="rate-2" name="rating" value="2">
              <label for="rate-2">★</label>
              <input type="radio" id="rate-1" name="rating" value="1">
              <label for="rate-1">★</label>
            </div>
          </div>

          <textarea 
            name="comment"
            placeholder="เขียนคอมเมนต์..."
            rows="3"></textarea>

          <!-- แสดงชื่อ user จาก token (อ่านอย่างเดียว) -->
          <p class="current-user-line">
            เขียนในนาม: <strong>${
              currentUser ? currentName : "กรุณาเข้าสู่ระบบก่อน"
            }</strong>
          </p>

          <button type="submit" class="send-comment">ส่งรีวิว</button>
          <p class="comment-status" hidden></p>
        </form>
      </div>
    </div>
  `;

  overlay.appendChild(pop);
  document.body.appendChild(overlay);

  const closeBtn = pop.querySelector(".popup-close");
  const form = pop.querySelector("#comment-form");
  const statusEl = pop.querySelector(".comment-status");
  const displayUser = pop.querySelector(".username");
  const displayText = pop.querySelector(".text-comment");
  const displayScore = pop.querySelector(".score");

  const escHandler = (e) => {
    if (e.key === "Escape") close();
  };

  function close() {
    overlay.remove();
    window.removeEventListener("keydown", escHandler);
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  if (closeBtn) closeBtn.addEventListener("click", close);
  window.addEventListener("keydown", escHandler);

  // ===== ส่งคอมเมนต์ + ดาว โดยใช้ token ระบุ user =====
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = getAuthToken();
    if (!token) {
      statusEl.hidden = false;
      statusEl.textContent = "ต้องเข้าสู่ระบบก่อนจึงจะคอมเมนต์ได้";
      statusEl.style.color = "#b91c1c";
      return;
    }

    const fd = new FormData(form);
    const comment = (fd.get("comment") || "").toString().trim();
    const ratingRaw = fd.get("rating");
    const rating = ratingRaw ? Number(ratingRaw) : 0;

    if (!rating) {
      statusEl.hidden = false;
      statusEl.textContent = "เลือกดาวก่อนนะครับ ✨";
      statusEl.style.color = "#b91c1c";
      return;
    }

    if (!comment) {
      statusEl.hidden = false;
      statusEl.textContent = "กรุณาพิมพ์คอมเมนต์ด้วยครับ ☕";
      statusEl.style.color = "#b91c1c";
      return;
    }

    statusEl.hidden = false;
    statusEl.textContent = "กำลังส่งรีวิว...";
    statusEl.style.color = "#4b5563";

    const payload = {
      shop_id: shop.id,
      comment,
      rating,
      user_id: currentUser.id,
    };

    try {
      const res = await fetch(`http://127.0.0.1:3000/review/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // <<<< สำคัญ
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // ถ้า backend ส่งข้อมูลคอมเมนต์ใหม่กลับมา คุณจะใช้ข้อมูลนั้น update popup ได้ด้วย
      // const saved = await res.json();

      // อัปเดตรีวิวล่าสุดใน popup ให้เป็นของ user นี้
      if (displayUser) displayUser.textContent = currentName || "คุณ";
      if (displayText) displayText.textContent = comment;
      if (displayScore) displayScore.textContent = `⭐ ${rating.toFixed(1)}`;

      statusEl.textContent = "ส่งรีวิวเรียบร้อยแล้ว ขอบคุณครับ ☕";
      statusEl.style.color = "#166534";
      form.reset();
    } catch (err) {
      console.error("ส่งรีวิวไม่สำเร็จ:", err);
      statusEl.textContent = "ส่งรีวิวไม่สำเร็จ ลองใหม่อีกครั้ง";
      statusEl.style.color = "#b91c1c";
    }
  });
}

function openShopPopup(shop) {
  buildPopup(shop);
}

function getAuthToken() {
  return localStorage.getItem("authToken"); // เปลี่ยนชื่อ key ตามที่คุณใช้จริง
}

function getCurrentUserFromToken() {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const json = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json);

    // payload.userId = user.id (จาก backend)
    return {
      id: payload.userId,
      email: payload.email,
      username: payload.username,
    };
  } catch (err) {
    console.error("Decode token error:", err);
    return null;
  }
}
