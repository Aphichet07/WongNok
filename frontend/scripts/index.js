// Recommand part => index.html
document.addEventListener('DOMContentLoaded', () => {
    console.log("HTML Document is ready. Starting to fetch shops...");

    loadAndDisplayShop();
});

async function loadAndDisplayShop() {
    try {
        const response = await fetch("http://127.0.0.1:3000/shops/recommand");

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const shops = await response.json();
        console.log("Data received:", shops);

        createShopCards(shops);

    } catch (err) {
        console.error("Failed to load shop data:", err.message);
    }
}

function createShopCards(shops) {
    const shop_card_container = document.getElementById("shop-suggestion");

    if (!shop_card_container) {
        console.error("Error: Element with id 'shop-card' not found!");
        return;
    }

    shops.forEach(shop => {
        const singleCard = buildSingleShopCard(shop);
        shop_card_container.appendChild(singleCard);
    });
}

function buildSingleShopCard(shopData) {
    const cardElement = document.createElement('div');
    cardElement.className = 'product-card';

    cardElement.innerHTML = `
    <a href="/shop/${shopData.id}">
        <div class="pic">
            <img src="${shopData.coverImage}"> 
        </div>
        <div class="info">
            <p>${shopData.name}</p>
            <div class="score">
               
            </div>
            <p>เปิด-ปิด: ${shopData.hours}</p>
            <div class="specific">
               
            </div>
        </div>
    </a>
  `;


    return cardElement;
}

// manipulated article slider 
const slider = document.querySelector('.article-suggestion');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');

if (slider && prevBtn && nextBtn) {
    const scrollAmount = () => slider.clientWidth * 0.8; 

    nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });
}





// fillter bar part  => find.html
const filter_form = document.getElementById("filter-form")
const filter_btn = document.getElementById("gogobtn")

async function filter() {
    console.log("d")
}

filter_btn.addEventListener("click", async (e) => {
    e.preventDefault()
    const form = new FormData(filter_form)
    console.log(Object.fromEntries(form))

    try {
        const response = await fetch("http://127.0.0.1:3000/shops/recommand")
        if (!response.ok) {
            throw new Error("`Response status: ${response.status}`")
        }
        const text = await response.json();
        text.forEach(element => {
            console.log(element)
        });
    } catch (err) {
        console.error(error.message);
    }
})
