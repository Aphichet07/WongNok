import { openShopPopup } from "./popup.js"; 

export function createHomeCard(shop) {
  const el = document.createElement("div");
  el.className = "shop-card"; 

  const coverImg = shop.cover_image_url || '/frontend/resources/noimage.jpg';

  let tagsHtml = '';
  if (Array.isArray(shop.tags) && shop.tags.length > 0) {

      tagsHtml = shop.tags.slice(0, 2).map(tag => `
        <div class="tag">
            <div class="pic">
                <img src="/frontend/resources/icon/coffee-cup.png" alt="icon">
            </div>
            <div class="text">${tag}</div>
        </div>
      `).join("");
  } else {
      tagsHtml = `
        <div class="tag">
            <div class="pic"><img src="/frontend/resources/icon/coffee-cup.png"></div>
            <div class="text">Coffee</div>
        </div>
      `;
  }

  el.innerHTML = `
    <a href="#" class="shop-card-link">
      <div class="pic">
        <img src="${coverImg}" alt="${shop.name}" loading="lazy">
      </div>
      
      <div class="info">
        <p style="margin:0 0 4px; font-weight:600; font-size:1rem; color:#38220f;">
            ${shop.name}
        </p>

        <div class="score">
          <span class="star">★★★★★</span>
          <span class="rating">${Number(shop.average_rating || 0).toFixed(1)}</span>
        </div>

        <div class="specific">
          ${tagsHtml}
        </div>
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