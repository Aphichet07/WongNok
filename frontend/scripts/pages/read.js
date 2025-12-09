import { API_BASE_URL } from "../config.js";
import { authService } from "../api/authService.js";

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        alert("ไม่พบรหัสบทความ");
        window.location.href = "article.html";
        return;
    }

    // 1. โหลดข้อมูลบทความ
    await loadArticle(id);
    
    // 2. โหลดคอมเมนต์
    await loadComments(id);

    // 3. จัดการฟอร์มคอมเมนต์
    setupCommentForm(id);
});

// ฟังก์ชันโหลดบทความ
async function loadArticle(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/article/${id}`);
        if (!response.ok) throw new Error("Article not found");
        
        const article = await response.json();
        renderArticle(article);
        
        // นับวิว
        fetch(`${API_BASE_URL}/article/${id}/view`, { method: 'PUT' });

    } catch (err) {
        console.error(err);
        document.querySelector(".content-wrapper").innerHTML = 
            `<div style="text-align:center; padding:50px;"><h2>ไม่พบบทความนี้</h2><a href="article.html">กลับหน้าหลัก</a></div>`;
    }
}

// ฟังก์ชันแสดงผลบทความ
function renderArticle(data) {
    document.title = data.title + " | Coffee Website";

    const cover = document.getElementById("article-cover");
    const title = document.getElementById("article-title");
    const content = document.getElementById("article-content");
    const date = document.getElementById("article-date");
    const author = document.getElementById("article-author");
    const views = document.getElementById("article-views");
    const tag = document.getElementById("article-tag");

    // ใส่ข้อมูล
    if (title) title.textContent = data.title;
    if (content) content.innerHTML = data.content.replace(/\n/g, '<br>'); // แปลงขึ้นบรรทัดใหม่
    
    if (cover) {
        cover.src = data.cover_image || '/frontend/resources/noimage.jpg';
        cover.style.display = 'block';
    }

    if (date && data.created_at) {
        const d = new Date(data.created_at);
        date.textContent = d.toLocaleDateString('th-TH', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });
    }

    if (author) author.textContent = data.author_name || 'Admin';
    if (views) views.textContent = `${data.view_count || 0} views`;

    // จัดการ Tag (ถ้ามี)
    if (tag && data.tags && data.tags.length > 0) {
        tag.textContent = data.tags[0]; // เอา tag แรกมาโชว์
        // เปลี่ยนสีตามหมวดหมู่ (Optional)
        const tagName = data.tags[0].toLowerCase();
        if(tagName.includes('beginner')) tag.style.background = '#10b981';
        else if(tagName.includes('deep')) tag.style.background = '#3b82f6';
        else if(tagName.includes('local')) tag.style.background = '#f59e0b';
    }
}

// ฟังก์ชันโหลดคอมเมนต์
async function loadComments(articleId) {
    const list = document.getElementById("comment-list");
    const countSpan = document.getElementById("comment-count");
    
    try {
        const res = await fetch(`${API_BASE_URL}/article/${articleId}/comments`);
        const comments = await res.json();

        if (countSpan) countSpan.textContent = comments.length;
        list.innerHTML = "";

        if (comments.length === 0) {
            list.innerHTML = `<p class="no-comment">ยังไม่มีความคิดเห็น เป็นคนแรกที่เริ่มพูดคุยเลย!</p>`;
            return;
        }

        comments.forEach(c => {
            const date = new Date(c.created_at).toLocaleDateString('th-TH', { 
                day: 'numeric', month: 'short', year: '2-digit', hour:'2-digit', minute:'2-digit' 
            });
            
            const html = `
                <div class="comment-item">
                    <div class="c-avatar">${c.username.charAt(0).toUpperCase()}</div>
                    <div class="c-content">
                        <div class="c-header">
                            <span class="c-user">${c.username}</span>
                            <span class="c-date">${date}</span>
                        </div>
                        <p class="c-text">${c.content}</p>
                    </div>
                </div>
            `;
            list.innerHTML += html;
        });

    } catch (err) {
        console.error("Load comments error", err);
        list.innerHTML = `<p style="color:red">โหลดความคิดเห็นไม่สำเร็จ</p>`;
    }
}

// ฟังก์ชันตั้งค่าฟอร์มคอมเมนต์
function setupCommentForm(articleId) {
    const form = document.getElementById("comment-form");
    const userLabel = document.getElementById("current-user-name");
    const submitBtn = form.querySelector("button");
    const textarea = form.querySelector("textarea");

    const user = authService.getUser();

    if (user) {
        userLabel.innerHTML = `แสดงความคิดเห็นในนาม: <strong>${user.username}</strong>`;
        submitBtn.disabled = false;
        textarea.disabled = false;
    } else {
        userLabel.innerHTML = `<a href="#" onclick="document.getElementById('open-signin').click(); return false;" style="color:#c08a53;">เข้าสู่ระบบ</a> เพื่อแสดงความคิดเห็น`;
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";
        textarea.disabled = true;
        textarea.placeholder = "กรุณาเข้าสู่ระบบก่อน...";
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const content = textarea.value.trim();
        if (!content) return;

        submitBtn.textContent = "กำลังส่ง...";
        submitBtn.disabled = true;

        try {
            // ใช้ Token ในการส่ง (ตาม Route ที่เราเขียนใน Backend)
            const token = authService.getToken(); 
            
            const res = await fetch(`${API_BASE_URL}/article/${articleId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    userId: user.id, // ส่งไปเผื่อ แต่ Backend ควรแกะจาก Token
                    comment: content 
                })
            });

            if (!res.ok) throw new Error("Failed to post");

            textarea.value = "";
            await loadComments(articleId); // โหลดใหม่
            
        } catch (err) {
            alert("ส่งคอมเมนต์ไม่สำเร็จ");
            console.error(err);
        } finally {
            submitBtn.textContent = "ส่งคอมเมนต์";
            submitBtn.disabled = false;
        }
    });
}