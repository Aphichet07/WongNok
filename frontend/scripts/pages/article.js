import { articleService } from "../api/articleService.js"; 

document.addEventListener("DOMContentLoaded", () => {
  initArticlePage();
});

async function initArticlePage() {
  const container = document.getElementById("article-page-container");
  container.innerHTML = ""; 

  // กำหนดหมวดหมู่ที่จะโชว์
  const categories = [
    { id: "Beginner Guide", title: "Coffee 101 (สำหรับมือใหม่หัดดื่ม)" },
    { id: "Deep Dive", title: "Deep Dive (เจาะลึกเรื่องกาแฟ)" },
    {
      id: "Local Guides",
      title: "Local Guides & Lifestyle (แนะนำร้านและไลฟ์สไตล์)",
    },
    {
      id: "Behind the Cup",
      title: "Behind the Cup (เรื่องราวเบื้องหลังแก้วกาแฟ)",
    },
  ];

  // วนลูปโหลดข้อมูลทีละหมวดหมู่
  for (const cat of categories) {
    try {
      const articles = await articleService.searchByTag(cat.id);

      if (articles && articles.length > 0) {
        // สร้าง Section HTML
        const section = createCategorySection(cat.title, articles);
        container.appendChild(section);
      }
    } catch (err) {
      console.error(`Error loading category ${cat.id}:`, err);
    }
  }
}

function createCategorySection(title, articles) {
  const section = document.createElement("div");
  section.className = "category-section";

  // Header
  section.innerHTML = `
        <h2 class="category-title">${title}</h2>
        <div class="slider-wrapper">
            <button class="nav-btn prev-btn">‹</button>
            <div class="cards-container">
                </div>
            <button class="nav-btn next-btn">›</button>
        </div>
    `;

  const cardsContainer = section.querySelector(".cards-container");

  articles.forEach((article) => {
    const date = new Date(article.created_at).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });

    const cardLink = document.createElement("a");
    cardLink.href = `/frontend/pages/read.html?id=${article.id}`;
    cardLink.style.textDecoration = "none";

    cardLink.innerHTML = `
            <div class="card">
                <img src="${
                  article.cover_image || "../resources/article/default.jpg"
                }" alt="${article.title}">
                <p class="article-name">${article.title}</p>
                <div class="information">
                    <p class="author">อ่าน ${article.view_count || 0} ครั้ง</p>
                    <p class="date">${date}</p>
                </div>
            </div>
        `;
    cardsContainer.appendChild(cardLink);
  });

  const prevBtn = section.querySelector(".prev-btn");
  const nextBtn = section.querySelector(".next-btn");

  const scrollAmount = 300;

  prevBtn.addEventListener("click", () => {
    cardsContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    cardsContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  return section;
}
