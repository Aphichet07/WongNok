const PAGE_SIZE = 5;
let ALL_SHOPS = [];
let CURRENT_PAGE = 1;

document.addEventListener("DOMContentLoaded", () => {
  const filter_form = document.getElementById("filter-form");
  if (filter_form) filter_form.addEventListener("submit", handleFilter);
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
  const url = `http://127.0.0.1:3000/shops/filter?${query.toString()}`;
  console.log(url)

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    ALL_SHOPS = await res.json();
    renderPage(1);
  } catch (err) {
    console.error(err);
  }
}

function renderPage(page) {
  const container = document.getElementById("shop-result");
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

  items.forEach(shop => container.appendChild(buildShopCard(shop)));

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

  pager.appendChild(mkBtn("‹ Prev", CURRENT_PAGE - 1, { disabled: CURRENT_PAGE === 1 }));

  for (let p = 1; p <= totalPages; p++) {
    pager.appendChild(mkBtn(String(p), p, { active: p === CURRENT_PAGE }));
  }

  pager.appendChild(mkBtn("Next ›", CURRENT_PAGE + 1, { disabled: CURRENT_PAGE === totalPages }));

  container.appendChild(pager);
}

function buildShopCard(shop) {
  const el = document.createElement("div");
  el.className = "shop-card";
  el.innerHTML = `
    <a href="/shop/${shop.id}">
      <div class="pic">
        <img src="${shop.cover_image_url || '/frontend/resources/noimage.jpg'}" alt="${shop.name}">
      </div>
      <div class="info">
        <p class="shop-name">${shop.name}</p>
        <div class="score">⭐ ${shop.average_rating ?? "-"}</div>
        <p class="desc">${shop.description ?? ""}</p>
      </div>
    </a>
  `;
  return el;
}
