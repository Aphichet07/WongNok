import { shopService } from "../api/shopService.js";
import { articleService } from "../api/articleService.js";
import { createHomeCard } from "../components/homeCard.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Home Page Loaded");

  loadRecommendedShops();

  loadRecommendedArticles();

  setupSearchForm();

  setupFilterButtons();
});

async function loadRecommendedShops() {
  try {
    const shops = await shopService.getRecommended();
    const container = document.getElementById("shop-suggestion");

    if (container) {
      container.innerHTML = "";

      if (shops.length === 0) {
        container.innerHTML = "<p>ไม่พบร้านแนะนำ</p>";
        return;
      }

      const limitShops = shops.slice(0, 5);

      limitShops.forEach((shop) => {
        // สร้างการ์ด
        const card = createHomeCard(shop);
        container.appendChild(card);
      });

      setupShopSliderButtons();
    }
  } catch (err) {
    console.error("Error loading shops:", err);
  }
}

async function loadRecommendedArticles() {
  const container = document.getElementById("recommended-articles-container");
  if (!container) return;

  try {
    const articles = await articleService.recommandArticle();

    container.innerHTML = "";

    if (articles.length === 0) {
      container.innerHTML = "<p>ไม่มีบทความแนะนำ</p>";
      return;
    }

    articles.forEach((article) => {
      const date = new Date(article.created_at).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const cardHtml = `
        <div class="article-card">
          <a href="/frontend/pages/read.html?id=${article.id}">
            <div class="pic">
              <img src="${
                article.cover_image || "/frontend/resources/noimage.jpg"
              }" alt="${article.title}" />
            </div>
            <div class="info">
              <p class="title">${article.title}</p>
              <div class="specific">
                <p class="author"> ${article.view_count || 0} วิว</p>
                <p class="date">${date}</p>
              </div>
            </div>
          </a>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", cardHtml);
    });

    setupSliderButtons();
  } catch (err) {
    console.error("Error loading articles:", err);
    container.innerHTML = "<p>โหลดข้อมูลไม่สำเร็จ</p>";
  }
}

function setupShopSliderButtons() {
  const container = document.getElementById("shop-suggestion");
  const prevBtn = document.getElementById("btn-prev-shop");
  const nextBtn = document.getElementById("btn-next-shop");

  if (!container || !prevBtn || !nextBtn) return;

  const scrollAmount = 300;

  prevBtn.addEventListener("click", () => {
    container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
}

function setupSliderButtons() {
  const container = document.getElementById("recommended-articles-container");
  const prevBtn = document.getElementById("btn-prev-article");
  const nextBtn = document.getElementById("btn-next-article");

  if (!container || !prevBtn || !nextBtn) return;

  const scrollAmount = 300;

  prevBtn.addEventListener("click", () => {
    container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
}

function setupSearchForm() {
  const searchForm = document.getElementById("hero-search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const keyword = formData.get("search");

      if (keyword && keyword.trim() !== "") {
        const query = encodeURIComponent(keyword.trim());
        window.location.href = `/frontend/pages/find.html?search=${query}`;
      }
    });
  }
}

function setupFilterButtons() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const key = btn.dataset.key;
      const value = btn.dataset.value;
      const queryString = `${key}=${encodeURIComponent(value)}`;
      window.location.href = `/frontend/pages/find.html?${queryString}`;
    });
  });
}
