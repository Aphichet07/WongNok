import { authService } from "../api/authService.js";
import { shopService } from "../api/shopService.js";
import { reviewService } from "../api/reviewService.js";

export function openShopPopup(shop) {
  const existing = document.querySelector(".popup-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  const currentUser = authService.getUser();
  const currentName = currentUser
    ? currentUser.username || currentUser.email
    : "Guest";

  overlay.innerHTML = `
    <div class="popCard">
      <button class="popup-close" type="button">✕</button>
      <div class="left"> 
        <div class="pic">
          <img src="${
            shop.cover_image_url || "/frontend/resources/noimage.jpg"
          }" alt="${shop.name}">
        </div>
        <div class="info">
          <p class="shop-name">${shop.name}</p>
          <div class="score">⭐ <span id="popup-score">${
            shop.average_rating ?? "-"
          }</span></div>
          <p class="desc">${shop.description ?? ""}</p>
        </div>
      </div>
      <div class="right"> 
        
        <h3 style="margin: 0 0 16px; color:#333;">รีวิวจากสมาชิก</h3>

        <div id="review-list-container" style="max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; padding-right: 8px;">
            <p style="color:#888; font-size:0.9rem;">กำลังโหลดรีวิว...</p>
        </div>

        <div id="my-review-section"></div>
      </div>

        <div class="comment-form">
          <h3>เขียนรีวิวร้านนี้</h3>
          <form id="review-form">
            <div class="rating-input">
              <span class="rating-label">ให้คะแนน:</span>
              <div class="rating-stars">
                ${[5, 4, 3, 2, 1]
                  .map(
                    (n) => `
                  <input type="radio" id="rate-${n}" name="rating" value="${n}">
                  <label for="rate-${n}">★</label>
                `
                  )
                  .join("")}
              </div>
            </div>
            <textarea name="comment" placeholder="เขียนคอมเมนต์..." rows="3"></textarea>
            <p class="current-user-line">เขียนในนาม: <strong>${
              currentUser ? currentName : "กรุณาเข้าสู่ระบบ"
            }</strong></p>
            <button type="submit" class="send-comment">ส่งรีวิว</button>
            <p class="comment-status" hidden></p>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => {
    overlay.remove();
    window.removeEventListener("keydown", escHandler);
  };
  const escHandler = (e) => {
    if (e.key === "Escape") close();
  };

  overlay.querySelector(".popup-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  window.addEventListener("keydown", escHandler);

  const form = overlay.querySelector("#review-form");
  const statusEl = overlay.querySelector(".comment-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) {
      statusEl.hidden = false;
      statusEl.textContent = "ต้องเข้าสู่ระบบก่อน";
      statusEl.style.color = "red";
      return;
    }

    const fd = new FormData(form);
    const comment = fd.get("comment").toString().trim();
    const rating = Number(fd.get("rating"));

    if (!rating || !comment) {
      statusEl.hidden = false;
      statusEl.textContent = "กรุณาใส่คะแนนและคอมเมนต์";
      statusEl.style.color = "red";
      return;
    }

    statusEl.textContent = "กำลังส่ง...";
    statusEl.hidden = false;
    statusEl.style.color = "#666";

    try {
      await shopService.createReview({
        shop_id: shop.id,
        comment,
        rating,
        user_id: currentUser.id,
      });

      statusEl.textContent = "ส่งรีวิวสำเร็จ!";
      statusEl.style.color = "green";
      form.reset();

      loadShopReviews(shop.id);
    } catch (err) {
      console.log("Error : ", err);
      statusEl.textContent = "ส่งไม่สำเร็จ";
      statusEl.style.color = "red";
    }
  });
  loadShopReviews(shop.id);

  async function loadShopReviews(shopId) {
    console.log("Shop ID : ", shopId)
    const container = document.getElementById("review-list-container");
    const reviews = await reviewService.getByShopId(shopId);

    container.innerHTML = "";

    if (reviews.length === 0) {
      container.innerHTML = `<p style="color:#999; text-align:center;">ยังไม่มีรีวิว เป็นคนแรกที่รีวิวเลย!</p>`;
      return;
    }

    reviews.forEach((review) => {
      const card = document.createElement("div");
      card.className = "comment";
      card.style.cssText =
        "background: #f9fafb; padding: 12px; border-radius: 12px; display: flex; gap: 12px; align-items: start;";

      const date = new Date(review.created_at).toLocaleDateString("th-TH");

      card.innerHTML = `
            <div class="profile-image" style="width:40px; height:40px;">
               <img src="/frontend/resources/avatar-placeholder.png" alt="user">
            </div>
            <div class="about-text" style="flex:1;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                  <p class="username" style="margin:0; font-size:0.9rem; font-weight:600;">${review.username}</p>
                  <span style="font-size:0.8rem; color:#f59e0b;">⭐ ${review.rating}</span>
              </div>
              <p class="text-comment" style="margin:4px 0 0; color:#555; font-size:0.9rem;">${review.comment}</p>
              <p style="margin:8px 0 0; font-size:0.75rem; color:#aaa;">${date}</p>
            </div>
          `;
      container.appendChild(card);
    });
  }
}
