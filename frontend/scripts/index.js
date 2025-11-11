
document.addEventListener('DOMContentLoaded', () => {
  console.log("HTML Document is ready. Starting to fetch shops...");

  loadAndDisplayShop();
  renderAuthNav();
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
            <img src="${shopData.cover_image_url}"> 
        </div>
        <div class="info">
            <p>${shopData.name}</p>
            <div class="score">
               เรตติ้ง $${shopData.average_rating}
            </div>
            <p>${shopData.description}</p>
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


// login / sign up form
const authModal = document.getElementById('auth-modal');
const openSignin = document.getElementById('open-signin');
const openSignup = document.getElementById('open-signup');
const closeBtn = authModal.querySelector('.auth-modal__close');
const overlay = authModal.querySelector('.auth-modal__overlay');
const tabButtons = authModal.querySelectorAll('.tab-btn');
const forms = authModal.querySelectorAll('.auth-form');

function openModal(mode) {
  authModal.classList.add('show');

  tabButtons.forEach(btn => {
    const isThis = btn.dataset.tab === mode;
    btn.classList.toggle('active', isThis);
    btn.style.display = isThis ? 'block' : 'none';
  });

  forms.forEach(form => {
    const isThisForm = form.id === mode + '-form';
    form.classList.toggle('active', isThisForm);
    form.style.display = isThisForm ? 'flex' : 'none';
  });
}

function closeModal() {
  authModal.classList.remove('show');
}

openSignin.addEventListener('click', (e) => {
  e.preventDefault();
  openModal('signin');
});

openSignup.addEventListener('click', (e) => {
  e.preventDefault();
  openModal('signup');
});

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

tabButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
  });
});


const signin_form = document.getElementById("signin-form")
const signup_form = document.getElementById("signup-form")

signin_form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
 
  const payload = {
    username: formData.get("username"),
    password: formData.get("password"),
  };
  try {
    const response = await fetch("http://127.0.0.1:3000/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Signin failed", errorData || response.statusText);
      alert("เข้าสู่ระบบไม่สำเร็จ");
      return;
    }

    const data = await response.json();
    console.log("Signin success:", data.message);
    console.log("Token from data : ", data)
    const token = data.token;
    console.log("Hello from sign in function")
    console.log(token)
    if (token) {
      localStorage.setItem("authToken", token);

      if (data.user) {
        localStorage.setItem("authUser", JSON.stringify(data.user));
      }
    }
    renderAuthNav();

    alert("เข้าสู่ระบบสำเร็จแล้ว!");

    document.getElementById("auth-modal").classList.remove("show");
    window.location.href = "/frontend/index.html";

  } catch (err) {
    console.error("Network error:", err);
    alert("มีปัญหาในการเชื่อมต่อเซิร์ฟเวอร์");
  }
});


signup_form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  const payload = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await fetch("http://127.0.0.1:3000/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Signup failed:", errorData || response.statusText);
      alert("สมัครสมาชิกไม่สำเร็จ");
      return;
    }

    const data = await response.json();
    console.log("Signup success:", data);

    const token = data.token;
    if (token) {
      localStorage.setItem("authToken", token);
      if (data.user) {
        localStorage.setItem("authUser", JSON.stringify(data.user));
      }
    }
    renderAuthNav();

    alert("สมัครสมาชิกสำเร็จ!");

    document.getElementById("auth-modal").classList.remove("show");
    window.location.href = "/frontend/index.html";

  } catch (err) {
    console.error("Network error:", err);
    alert("มีปัญหาในการเชื่อมต่อเซิร์ฟเวอร์");
  }
  
});

function renderAuthNav() {
  const navRight = document.querySelector(".ul-navbar2");
  if (!navRight) return;

  const token = localStorage.getItem("authToken");
  const userJson = localStorage.getItem("authUser");
  let username = "";

  if (userJson) {
    try {
      const user = JSON.parse(userJson);
      username = user.username || user.email || "";
    } catch (e) {
      console.error("parse authUser error:", e);
    }
  }


  if (!token) {
    navRight.innerHTML = `
      <li><a href="#" id="open-signin">signin</a></li>
      <li>|</li>
      <li><a href="#" id="open-signup">signup</a></li>
    `;

    const openSignin = document.getElementById("open-signin");
    const openSignup = document.getElementById("open-signup");
    if (openSignin) {
      openSignin.addEventListener("click", (e) => {
        e.preventDefault();
        openModal("signin"); 
      });
    }
    if (openSignup) {
      openSignup.addEventListener("click", (e) => {
        e.preventDefault();
        openModal("signup");
      });
    }

    return;
  }

  const displayName = username || "Profile";

  navRight.innerHTML = `
    <li class="nav-profile">
      <a href="/frontend/pages/profile.html">
        <span class="avatar-circle">${displayName.charAt(0).toUpperCase()}</span>
        <span class="profile-name">${displayName}</span>
      </a>
    </li>
    <li><button type="button" class="logout-btn">Logout</button></li>
  `;

  const logoutBtn = navRight.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      renderAuthNav();
      window.location.href = "/frontend/index.html";
    });
  }
}



// fillter bar part  => find.html
// const filter_form = document.getElementById("filter-form")
// const filter_btn = document.getElementById("gogobtn")

// async function filter() {
//   console.log("d")
// }

// filter_btn.addEventListener("click", async (e) => {
//   e.preventDefault()
//   const form = new FormData(filter_form)
//   console.log(Object.fromEntries(form))

//   try {
//     const response = await fetch("http://127.0.0.1:3000/shops/recommand")
//     if (!response.ok) {
//       throw new Error("`Response status: ${response.status}`")
//     }
//     const text = await response.json();
//     text.forEach(element => {
//       console.log(element)
//     });
//   } catch (err) {
//     console.error(error.message);
//   }
// })
