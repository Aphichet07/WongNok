import { shopService } from "../api/shopService.js";
import { createHomeCard } from "../components/homeCard.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Home Page Loaded");

  try {
    const shops = await shopService.getRecommended();
    const container = document.getElementById("shop-suggestion");
    if (container) {
      container.innerHTML = "";
      shops.forEach((shop) => container.appendChild(createHomeCard(shop)));
    }
  } catch (err) {
    console.error(err);
  }

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
});
