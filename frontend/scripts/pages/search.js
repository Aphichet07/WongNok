import { shopService } from "../api/shopService.js";
import { createShopCard } from "../components/shopCard.js";

const PAGE_SIZE = 6;
let ALL_SHOPS = [];
let CURRENT_PAGE = 1;

document.addEventListener("DOMContentLoaded", () => {
  initSearchPage();
});

function initSearchPage() {
  const params = new URLSearchParams(window.location.search);

  const searchParam = params.get("search");

  const hasFilters = Array.from(params.keys()).some((key) =>
    [
      "roast",
      "bean_type",
      "process",
      "flavor",
      "menu",
      "price",
      "type",
    ].includes(key)
  );

  if (searchParam) {
    const searchInput = document.getElementById("hero-search-input");
    if (searchInput) searchInput.value = searchParam;
    performSearch(() => shopService.searchByName(searchParam));
  } else if (hasFilters) {
    console.log("Found filters from URL:", params.toString());

    syncFiltersWithUI(params);

    performSearch(() => shopService.filterShops(params.toString()));
  } else {
    loadAllShops();
  }

  const searchForm = document.getElementById("hero-search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const keyword = fd.get("search").toString().trim();
      await performSearch(() => shopService.searchByName(keyword));
      document
        .getElementById("filters")
        ?.scrollIntoView({ behavior: "smooth" });
    });
  }

  const filterForm = document.getElementById("filter-form");
  if (filterForm) {
    filterForm.addEventListener("change", async () => {
      const fd = new FormData(filterForm);
      const params = new URLSearchParams();
      for (const [key, value] of fd.entries()) {
        if (value) params.append(key, value);
      }
      await performSearch(() => shopService.filterShops(params.toString()));
    });
  }

  document.querySelectorAll(".hero__tags .tag").forEach((tag) => {
    tag.addEventListener("click", async () => {
      const filterType = tag.dataset.filter;
      const searchInput = document.getElementById("hero-search-input");
      const val = filterType || tag.textContent.replace("#", "");
      if (searchInput) searchInput.value = val;

      await performSearch(() => shopService.searchByName(val));
      document
        .getElementById("filters")
        ?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function syncFiltersWithUI(params) {
  for (const [key, value] of params.entries()) {
    const decodedValue = decodeURIComponent(value);

    const input = document.querySelector(
      `input[name="${key}"][value="${decodedValue}"]`
    );
    if (input) {
      input.checked = true;
    }
  }
}

async function performSearch(apiCallFn) {
  const container = document.getElementById("shop-result");
  const pagination = document.getElementById("pagination");

  container.innerHTML = `
        <div style="text-align:center; padding: 40px; color:#888;">
            <p>กำลังค้นหาร้านกาแฟที่ใช่... ☕</p>
        </div>
    `;
  pagination.innerHTML = "";

  try {
    ALL_SHOPS = await apiCallFn();

    CURRENT_PAGE = 1;
    renderPage(CURRENT_PAGE);
  } catch (err) {
    console.error("Search Error:", err);
    container.innerHTML = `
            <div style="text-align:center; padding: 40px; color:#b91c1c;">
                <p>เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่</p>
            </div>
        `;
  }
}

async function loadAllShops() {
  await performSearch(() => shopService.searchByName(""));
}

function renderPage(page) {
  const container = document.getElementById("shop-result");
  container.innerHTML = "";

  if (!ALL_SHOPS || ALL_SHOPS.length === 0) {
    container.innerHTML = `
            <div style="text-align:center; padding: 40px; color:#6b7280;">
                <p>ไม่พบร้านที่ตรงกับการค้นหา ลองปรับตัวกรองดูนะครับ</p>
            </div>
        `;
    document.getElementById("pagination").innerHTML = "";
    return;
  }
  const totalPages = Math.ceil(ALL_SHOPS.length / PAGE_SIZE);

  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;
  CURRENT_PAGE = page;

  const start = (CURRENT_PAGE - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const itemsToShow = ALL_SHOPS.slice(start, end);

  const grid = document.createElement("div");
  grid.className = "shop-grid";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "1fr";
  grid.style.gap = "24px";

  itemsToShow.forEach((shop) => {
    const card = createShopCard(shop);
    grid.appendChild(card);
  });

  container.appendChild(grid);

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const container = document.getElementById("pagination");
  container.innerHTML = "";

  if (totalPages <= 1) return;

  const createBtn = (
    text,
    targetPage,
    isActive = false,
    isDisabled = false
  ) => {
    const btn = document.createElement("button");
    btn.className = `page-btn ${isActive ? "active" : ""}`;
    btn.textContent = text;
    btn.disabled = isDisabled;

    if (!isDisabled) {
      btn.addEventListener("click", () => {
        renderPage(targetPage);
        document
          .getElementById("shop-result")
          .scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    return btn;
  };

  container.appendChild(
    createBtn("‹", CURRENT_PAGE - 1, false, CURRENT_PAGE === 1)
  );

  for (let i = 1; i <= totalPages; i++) {
    container.appendChild(createBtn(i, i, i === CURRENT_PAGE));
  }

  container.appendChild(
    createBtn("›", CURRENT_PAGE + 1, false, CURRENT_PAGE === totalPages)
  );
}
