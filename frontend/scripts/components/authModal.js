import { authService } from "../api/authService.js";
import { renderAuthNav } from "../main.js"; // เรียกฟังก์ชัน update Nav

export function initAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;

  const openBtns = document.querySelectorAll("#open-signin, #open-signup");
  const closeBtn = modal.querySelector(".auth-modal__close");
  const overlay = modal.querySelector(".auth-modal__overlay");
  const forms = modal.querySelectorAll(".auth-form");
  const tabs = modal.querySelectorAll(".tab-btn");

  const open = (mode) => {
    modal.classList.add("show");
    tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === mode));
    forms.forEach(f => {
        const isActive = f.id === `${mode}-form`;
        f.classList.toggle("active", isActive);
        f.style.display = isActive ? "flex" : "none";
    });
  };

  const close = () => modal.classList.remove("show");

  openBtns.forEach(btn => btn.addEventListener("click", (e) => {
    e.preventDefault();
    open(btn.id.replace("open-", ""));
  }));

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", close);

  // Handle Signin Submit
  document.getElementById("signin-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const fd = new FormData(e.target);
        await authService.login(fd.get("username"), fd.get("password"));
        alert("เข้าสู่ระบบสำเร็จ");
        close();
        renderAuthNav();
        window.location.reload(); // Reload เพื่อ update state อื่นๆ
    } catch (err) {
        alert("Login failed");
    }
  });

  // Handle Signup Submit (คล้ายกัน)
  document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const fd = new FormData(e.target);
        await authService.signup(Object.fromEntries(fd));
        alert("สมัครสมาชิกสำเร็จ");
        close();
        renderAuthNav();
        window.location.reload();
      } catch (err) {
          alert("Signup failed");
      }
  });
}