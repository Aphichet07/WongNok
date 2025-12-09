import { openShopPopup } from "./popup.js";

export function createShopCard(shop) {
  const el = document.createElement("div");
  el.className = "shop-card product-card";

  const mainImg = shop.cover_image_url || "/frontend/resources/noimage.jpg";
  const shopName = shop.name || "ชื่อร้าน";
  const rating = shop.average_rating
    ? parseFloat(shop.average_rating).toFixed(1)
    : "-";
  const desc = shop.description || "";

  let location = shop.address || "";
  if (shop.area && shop.area !== "0") {
    location = shop.area;
  }

  el.innerHTML = `
    <a href="#" class="shop-card-link">
      <div class="pic-box">
         <img src="${mainImg}" loading="lazy" alt="${shopName}">
      </div>
      
      <div class="info">
        <div class="info-header">
            <div class="header-left">
                <h3 class="shop-name">${shopName}</h3>
                
                ${
                  location
                    ? `
                <div class="meta-line">
                    <span class="area">📍 ${location}</span>
                </div>`
                    : ""
                }
            </div>
            
            ${
              shop.average_rating
                ? `
            <div class="rating-box">
                <div class="score-badge">${rating}</div>
            </div>`
                : ""
            }
        </div>

        <hr class="divider">

        <p class="desc">${desc}</p>
        
        <div class="info-footer">
            <span class="read-more">ดูรายละเอียดร้าน ></span>
        </div>
      </div>
    </a>
  `;

  el.querySelector(".shop-card-link").addEventListener("click", (e) => {
    e.preventDefault();
    openShopPopup(shop);
  });

  return el;
}
