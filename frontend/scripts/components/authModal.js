import { authService } from "../api/authService.js";
import { renderAuthNav } from "../main.js";

const modalTemplate = `
<div id="auth-modal" class="auth-modal">
  <div class="auth-modal__overlay"></div>
  <div class="auth-modal__content">
    <button class="auth-modal__close" aria-label="ปิดหน้าต่าง">&times;</button>
    
    <h2 id="auth-title" style="text-align:center; margin-bottom: 24px; color:#333;">เข้าสู่ระบบ</h2>

    <form class="auth-form active" id="signin-form">
      <label>ชื่อผู้ใช้
        <input type="text" name="username" placeholder="Bank007" required />
      </label>
      <label>รหัสผ่าน
        <input type="password" name="password" placeholder="••••••••" required />
      </label>
      <button type="submit" class="auth-submit">เข้าสู่ระบบ</button>
      
      <p style="margin-top:16px; text-align:center; font-size:0.9rem; color:#666;">
        ยังไม่มีบัญชี? <a href="#" id="btn-goto-signup" style="color:#c08a53; text-decoration:underline;">สมัครสมาชิก</a>
      </p>
    </form>

    <form class="auth-form" id="signup-form">
      <label>ชื่อผู้ใช้
        <input type="text" name="username" placeholder="ชื่อที่จะแสดงในระบบ" required />
      </label>
      <label>อีเมล
        <input type="email" name="email" placeholder="you@example.com" required />
      </label>
      <label>รหัสผ่าน
        <input type="password" name="password" placeholder="อย่างน้อย 8 ตัวอักษร" required />
      </label>
      <button type="submit" class="auth-submit">สมัครสมาชิก</button>

      <p style="margin-top:16px; text-align:center; font-size:0.9rem; color:#666;">
        มีบัญชีอยู่แล้ว? <a href="#" id="btn-goto-signin" style="color:#c08a53; text-decoration:underline;">เข้าสู่ระบบ</a>
      </p>
    </form>
  </div>
</div>
`;

export function initAuthModal() {
  if (!document.getElementById("auth-modal")) {
    document.body.insertAdjacentHTML("beforeend", modalTemplate);
  }

  const modal = document.getElementById("auth-modal");
  const authTitle = document.getElementById("auth-title");
  const openBtns = document.querySelectorAll("#open-signin, #open-signup");
  const closeBtn = modal.querySelector(".auth-modal__close");
  const overlay = modal.querySelector(".auth-modal__overlay");
  const forms = modal.querySelectorAll(".auth-form");

  const open = (mode) => {
    modal.classList.add("show");

    if (mode === "signin") {
      authTitle.textContent = "เข้าสู่ระบบ";
    } else {
      authTitle.textContent = "สมัครสมาชิก";
    }

    forms.forEach((f) => {
      const isActive = f.id === `${mode}-form`;
      f.classList.toggle("active", isActive);
      f.style.display = isActive ? "flex" : "none";
    });
  };

  const close = () => modal.classList.remove("show");

  openBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      open(btn.id.replace("open-", ""));
    })
  );

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", close);

  document.getElementById("btn-goto-signup").addEventListener("click", (e) => {
    e.preventDefault();
    open("signup");
  });

  document.getElementById("btn-goto-signin").addEventListener("click", (e) => {
    e.preventDefault();
    open("signin");
  });

  document
    .getElementById("signin-form")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const fd = new FormData(e.target);
        await authService.login(fd.get("username"), fd.get("password"));
        alert("เข้าสู่ระบบสำเร็จ");
        close();
        renderAuthNav();
      } catch (err) {
        alert("Login failed: " + err.message);
      }
    });

  document
    .getElementById("signup-form")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const fd = new FormData(e.target);
        await authService.signup(Object.fromEntries(fd));
        alert("สมัครสมาชิกสำเร็จ");
        close();
        renderAuthNav();
      } catch (err) {
        alert("Signup failed: " + err.message);
      }
    });
}
