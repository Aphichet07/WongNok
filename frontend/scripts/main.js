import { authService } from "./api/authService.js";
import { initAuthModal } from "./components/authModal.js";
import "./components/nav.js"; // Import เพื่อให้ Nav Logic ทำงาน

document.addEventListener("DOMContentLoaded", () => {
    initAuthModal();
    renderAuthNav();
    
    // Init Lenis Scroll (ถ้าใช้ทุกหน้า)
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }
});

export function renderAuthNav() {
    const navRight = document.querySelector(".ul-navbar2");
    if (!navRight) return;

    const user = authService.getUser();

    if (!user) {
        navRight.innerHTML = `
            <li><a href="#" id="open-signin">signin</a></li>
            <li>|</li>
            <li><a href="#" id="open-signup">signup</a></li>
        `;
        // Re-attach listeners เพราะ innerHTML ถูกเขียนทับ
        initAuthModal(); 
    } else {
        const displayName = user.username || user.email;
        navRight.innerHTML = `
            <li class="nav-profile">
                <span class="avatar-circle">${displayName.charAt(0).toUpperCase()}</span>
                <span class="profile-name">${displayName}</span>
            </li>
            <li><button type="button" class="logout-btn">Logout</button></li>
        `;
        navRight.querySelector(".logout-btn").addEventListener("click", authService.logout);
    }
}