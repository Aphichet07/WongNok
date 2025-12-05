document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("Fetching recommend articles...");

    const response = await fetch("/article/recommend");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const articles = await response.json();

    console.log("Data received:", articles);

    TopRecommend(articles);
  } catch (err) {
    console.error("Error fetching recommend articles:", err);
    document.getElementById("top-recommend").innerHTML =
      "<p>ไม่สามารถโหลดข้อมูลได้</p>";
  }
  const lenis = new Lenis({
    duration: 1.2, // ความหนืด (ยิ่งเยอะยิ่งลื่น)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
});

let counter = 1;
let slideInterval;

function TopRecommend(articles) {
  const recommend = document.getElementById("top-recommend");

  if (!articles || articles.length === 0) {
    recommend.innerHTML = "";
    return;
  }

  // Radio Inputs
  const radioHtml = articles
    .map((_, index) => {
      return `<input type="radio" name="radio-btn" id="radio${index + 1}">`;
    })
    .join("");

  // Slide Images
  const slidesHtml = articles
    .map((article, index) => {
      const firstClass = index === 0 ? "first" : "";

      return `
            <div 
                class="slide ${firstClass}" 
                onclick="window.location.href='../pages/read.html?id=${article.id}'" 
                style="cursor: pointer;" 
            >
                <img src="${article.cover_image}" alt="${article.title}">
                
                <div class="slide-caption">
                    ${article.title}
                </div>
            </div>
        `;
    })
    .join("");

  const navAutoHtml = articles
    .map((_, index) => {
      return `<div class="auto-btn${index + 1}"></div>`;
    })
    .join("");

  const navManualHtml = articles
    .map((_, index) => {
      return `<label for="radio${index + 1}" class="manual-btn"></label>`;
    })
    .join("");

  recommend.innerHTML = `
        <div class="slides">
            ${radioHtml}
            ${slidesHtml}
            
            <div class="navigation-auto">
                ${navAutoHtml}
            </div>
        </div>

        <div class="navigation-manual">
            ${navManualHtml}
        </div>
    `;

  startSlider(articles.length);
}

function startSlider(totalSlides) {
  if (slideInterval) clearInterval(slideInterval);

  counter = 1;
  document.getElementById("radio" + counter).checked = true;

  slideInterval = setInterval(function () {
    counter++;
    if (counter > totalSlides) {
      counter = 1;
    }

    const radioBtn = document.getElementById("radio" + counter);
    if (radioBtn) {
      radioBtn.checked = true;
    }
  }, 3000);
}
