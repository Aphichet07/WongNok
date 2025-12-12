import { authService } from "../api/authService.js";
import { initAuthModal } from "./authModal.js";

export function renderNavbar() {
  consoloe.log("Hello")
  const header = document.getElementById("main-nav-bar");
  if (!header) return;

  const user = authService.getUser();
  const displayName = user ? (user.username || user.email) : "";
  const initial = user ? displayName.charAt(0).toUpperCase() : "";

  const navHTML = `
    <div class="container">
      <div class="nav-header">
        <div class="nav-logo">
          <a href="/frontend/index.html">
            <img src="/frontend/resources/logo/logo2.png" alt="logo" class="logo-image" />
          </a>
        </div>
        
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>
      </div>

      <div class="sub-nav-bar" id="nav-menu">
        <div class="nav-bar1">
          <ul class="ul-navbar1">
            <li><a href="/frontend/index.html" class="nav-link" data-path="/frontend/index.html">Home</a></li>
            <li><a href="/frontend/pages/find.html" class="nav-link" data-path="/frontend/pages/find.html">Search</a></li>
            <li><a href="/frontend/pages/article.html" class="nav-link" data-path="/frontend/pages/article.html">Article</a></li>
            <li><a href="/frontend/pages/aboutus.html" class="nav-link" data-path="/frontend/pages/aboutus.html">About us</a></li>
          </ul>
        </div>
        <div class="nav-bar2">
          <ul class="ul-navbar2">
            ${
              user
                ? `
                <li class="nav-profile">
                    <a href="#" style="pointer-events: none;">
                        <span class="avatar-circle">${initial}</span>
                        <span class="profile-name">${displayName}</span>
                    </a>
                </li>
                <li><button type="button" class="logout-btn" id="btn-logout">Logout</button></li>
                `
                : `
                <li><a href="#" id="open-signin">SignIn</a></li>
                <li>|</li>
                <li><a href="#" id="open-signup">SignUp</a></li>
                `
            }
          </ul>
        </div>
      </div>
    </div>
  `;

  header.innerHTML = navHTML;

  const currentPath = window.location.pathname;
  const links = header.querySelectorAll(".nav-link");
  links.forEach(link => {
      if (currentPath === link.dataset.path || (link.dataset.path !== '/frontend/index.html' && currentPath.includes(link.dataset.path))) {
          link.style.opacity = "1";
          link.style.borderBottom = "2px solid white"; 
      }
  });

  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
  }

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add("is-solid");
    } else {
      header.classList.remove("is-solid");
    }
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll(); 

  if (user) {
    document.getElementById("btn-logout")?.addEventListener("click", (e) => {
        e.preventDefault();
        authService.logout();
    });
  } else {
    initAuthModal(); 
  }
}