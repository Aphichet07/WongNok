
document.addEventListener('DOMContentLoaded', () => {
    console.log("HTML Document is ready. Starting to fetch shops...");

    renderAuthNav();
});


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
      <li><a href="#" id="open-signin">SignIn</a></li>
      <li>|</li>
      <li><a href="#" id="open-signup">SignUp</a></li>
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



