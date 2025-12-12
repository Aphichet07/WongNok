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

  const renderTags = (tags, colorClass) => {
    if (!tags || !Array.isArray(tags) || tags.length === 0) return "";
    return tags
      .map((tag) => `<span class="tag-badge ${colorClass}">${tag}</span>`)
      .join("");
  };

  const mapLink =
    shop.latitude && shop.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${shop.latitude},${shop.longitude}`
      : "#";

  overlay.innerHTML = `
    <div class="popCard">
      <button class="popup-close" type="button">✕</button>
      
      <div class="left"> 
        
        <div class="pic">
          <img src="${
            shop.cover_image_url || "/frontend/resources/noimage.jpg"
          }" alt="${shop.name}">
        </div>

        <div class="info-content">
            <h2 class="shop-name">${shop.name}</h2>
            <div class="meta-row">
                <div class="score">⭐ <span id="popup-score">${
                  shop.average_rating ?? "New"
                }</span> (${shop.total_reviews || 0} รีวิว)</div>
                <div class="price-badge">${shop.price_range || "-"}</div>
            </div>

            <p class="desc">${shop.description || "ไม่มีคำอธิบายร้าน"}</p>

            <hr class="divider">

            <h4 class="section-title">Coffee Profile</h4>
            <div class="spec-grid">
                <div class="spec-item">
                    <span class="label">ระดับการคั่ว</span>
                    <span class="value">${shop.roast_level || "-"}</span>
                </div>
                <div class="spec-item">
                    <span class="label">ประเภทเมล็ด</span>
                    <span class="value">${shop.bean_type || "-"}</span>
                </div>
                <div class="spec-item">
                    <span class="label">Process</span>
                    <span class="value">${shop.process || "-"}</span>
                </div>
                <div class="spec-item">
                    <span class="label">แหล่งปลูก</span>
                    <span class="value">${
                      (shop.origin && shop.origin[0]) || "Mixed"
                    }</span>
                </div>
            </div>

            ${
              shop.flavor_notes
                ? `
                <div class="tags-group">
                    <span class="label-icon">Taste:</span>
                    <div class="tags-wrapper">${renderTags(
                      shop.flavor_notes,
                      "tag-flavor"
                    )}</div>
                </div>
            `
                : ""
            }
            
            ${
              shop.ambience
                ? `
                <div class="tags-group">
                    <span class="label-icon"> Vibe:</span>
                    <div class="tags-wrapper">${renderTags(
                      shop.ambience,
                      "tag-vibe"
                    )}</div>
                </div>
            `
                : ""
            }

            <hr class="divider">

            <div class="contact-info">
                <p><strong>เวลาเปิด:</strong> ${shop.open_hours || "-"}</p>
                <p><strong>ที่อยู่:</strong> ${shop.address || "-"}</p>
            </div>

            <a href="${mapLink}" target="_blank" class="btn-map">
                ดูแผนที่ร้าน (Google Maps) ↗
            </a>
        </div>
      </div>

      <div class="right"> 
        <div class="review-header-box">
            <h3>รีวิวจากสมาชิก</h3>
        </div>
        <div id="review-list-container">
            <p style="color:#888; text-align:center; margin-top:20px;">กำลังโหลดรีวิว...</p>
        </div>
        <div class="comment-form">
          <h4 style="margin:0 0 10px; font-size:0.9rem; color:#555;">เขียนรีวิวของคุณ</h4>
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
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
                <p class="current-user-line" style="margin:0; font-size:0.8rem;">
                    ในนาม: <strong>${
                      currentUser ? currentName : "Guest"
                    }</strong>
                </p>
                <button type="submit" class="send-comment">ส่งรีวิว</button>
            </div>
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
      statusEl.textContent = "กรุณาเข้าสู่ระบบ";
      statusEl.style.color = "red";
      return;
    }
    const fd = new FormData(form);
    const comment = fd.get("comment").toString().trim();
    const rating = Number(fd.get("rating"));

    if (!rating || !comment) {
      statusEl.hidden = false;
      statusEl.textContent = "กรุณาให้ดาวและข้อความ";
      statusEl.style.color = "red";
      return;
    }
    statusEl.hidden = false;
    statusEl.textContent = "กำลังส่ง...";
    statusEl.style.color = "#666";

    try {
      await shopService.createReview({
        shop_id: shop.id,
        comment,
        rating,
        user_id: currentUser.id,
      });
      statusEl.textContent = "สำเร็จ!";
      statusEl.style.color = "green";
      form.reset();
      loadShopReviews(shop.id);
    } catch (err) {
      console.error(err);
      statusEl.textContent = "ส่งไม่สำเร็จ";
      statusEl.style.color = "red";
    }
  });

  loadShopReviews(shop.id);

  async function loadShopReviews(shopId) {
    const container = document.getElementById("review-list-container");
    const currentUser = authService.getUser();

    try {
      const reviews = await reviewService.getByShopId(shopId);
      container.innerHTML = "";

      if (!reviews || reviews.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 20px; color:#ccc;"><p>ยังไม่มีรีวิว</p></div>`;
        return;
      }

      reviews.forEach((review) => {
        const date = new Date(review.created_at).toLocaleDateString("th-TH");
        console.log("review.user_id : ",review)
        const isOwner =
          currentUser && String(currentUser.id) === String(review.user_id);

        const card = document.createElement("div");
        card.className = "review-item";
        card.dataset.id = review.id;

        card.innerHTML = `
                <div class="review-avatar">
                   <img src="/frontend/resources/avatar-placeholder.png" alt="user" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
                </div>
                <div class="review-content">
                    <div class="review-head">
                        <div style="display:flex; gap:8px; align-items:center;">
                            <span class="r-user" style="font-weight:600;">${
                              review.username
                            }</span>
                            <span class="r-star" style="color:#f59e0b;">⭐ <span class="r-rating-val">${
                              review.rating
                            }</span></span>
                        </div>
                        
                        ${
                          isOwner
                            ? `
                        <div class="menu-container">
                            <button class="dots-btn">⋮</button>
                            <div class="menu-dropdown">
                                <button class="action-edit">แก้ไข</button>
                                <button class="action-delete">ลบ</button>
                            </div>
                        </div>
                        `
                            : ""
                        }
                    </div>
                    
                    <p class="r-text" style="margin:4px 0; color:#555;">${
                      review.comment
                    }</p>
                    <span class="r-date" style="font-size:0.75rem; color:#aaa;">${date}</span>
                    
                    <div class="edit-box" style="display:none; margin-top:8px;">
                        <textarea class="edit-input" rows="2" style="width:100%; margin-bottom:5px;">${
                          review.comment
                        }</textarea>
                        <div style="text-align:right; gap:5px;">
                            <button class="btn-cancel-edit" style="font-size:0.8rem;">ยกเลิก</button>
                            <button class="btn-save-edit" style="font-size:0.8rem; background:#c08a53; color:white; border:none; padding:2px 8px; border-radius:4px;">บันทึก</button>
                        </div>
                    </div>
                </div>
            `;

        container.appendChild(card);

        if (isOwner) {
          const dotsBtn = card.querySelector(".dots-btn");
          const dropdown = card.querySelector(".menu-dropdown");
          const editBtn = card.querySelector(".action-edit");
          const deleteBtn = card.querySelector(".action-delete");

          const textDisplay = card.querySelector(".r-text");
          const editBox = card.querySelector(".edit-box");
          const editInput = card.querySelector(".edit-input");
          const saveBtn = card.querySelector(".btn-save-edit");
          const cancelBtn = card.querySelector(".btn-cancel-edit");

          dotsBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            document.querySelectorAll(".menu-dropdown.show").forEach((d) => {
              if (d !== dropdown) d.classList.remove("show");
            });
            dropdown.classList.toggle("show");
          });

          //ปุ่ม ลบ
          deleteBtn.addEventListener("click", async () => {
            if (confirm("ต้องการลบรีวิวนี้ใช่ไหม?")) {
              try {
                await reviewService.delete(review.id);
                card.remove(); // ลบออกจากหน้าจอ
              } catch (err) {
                alert("ลบไม่สำเร็จ");
              }
            }
          });

          //ปุ่ม แก้ไข 
          editBtn.addEventListener("click", () => {
            textDisplay.style.display = "none"; // ซ่อนข้อความเดิม
            editBox.style.display = "block"; // โชว์ช่องกรอก
            dropdown.classList.remove("show"); // ปิดเมนู
          });

          // ปุ่มยกเลิกแก้ไข
          cancelBtn.addEventListener("click", () => {
            textDisplay.style.display = "block";
            editBox.style.display = "none";
            editInput.value = review.comment; // คืนค่าเดิม
          });

          // ปุ่มบันทึก
          saveBtn.addEventListener("click", async () => {
            const newText = editInput.value.trim();
            if (!newText) return;

            saveBtn.textContent = "กำลังบันทึก...";
            try {
              await reviewService.update(review.id, {
                comment: newText,
                rating: review.rating, // ส่งดาวเดิมกลับไป 
              });

              // อัปเดตหน้าจอ
              review.comment = newText; // อัปเดตตัวแปร local
              textDisplay.textContent = newText;
              textDisplay.style.display = "block";
              editBox.style.display = "none";
              saveBtn.textContent = "บันทึก";
            } catch (err) {
              console.error(err);
              alert("แก้ไขไม่สำเร็จ");
              saveBtn.textContent = "บันทึก";
            }
          });
        }
      });

      // คลิกที่อื่นเพื่อปิดเมนู
      document.addEventListener("click", () => {
        document
          .querySelectorAll(".menu-dropdown.show")
          .forEach((d) => d.classList.remove("show"));
      });
    } catch (err) {
      container.innerHTML = `<p style="color:red; text-align:center;">โหลดไม่สำเร็จ</p>`;
    }
  }
}
