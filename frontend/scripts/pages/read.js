import { API_BASE_URL } from "../config.js";
import { authService } from "../api/authService.js";
import { articleService } from "../api/articleService.js"; 

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        alert("ไม่พบรหัสบทความ");
        window.location.href = "article.html";
        return;
    }

    await loadArticle(id);
    
    await loadComments(id);

    setupCommentForm(id);
});

async function loadArticle(id) {
    try {
        const article = await articleService.readArticle(id);
        renderArticle(article);
        articleService.updateViewer(id); 
    } catch (err) {
        console.error(err);
        document.querySelector(".content-wrapper").innerHTML = 
            `<div style="text-align:center; padding:50px;"><h2>ไม่พบบทความนี้</h2><a href="article.html">กลับหน้าหลัก</a></div>`;
    }
}

function renderArticle(data) {
    document.title = data.title + " | Coffee Website";
    const cover = document.getElementById("article-cover");
    const title = document.getElementById("article-title");
    const content = document.getElementById("article-content");
    const date = document.getElementById("article-date");
    const author = document.getElementById("article-author");
    const views = document.getElementById("article-views");
    const tag = document.getElementById("article-tag");

    if (title) title.textContent = data.title;
    if (content) content.innerHTML = data.content.replace(/\n/g, '<br>');
    if (cover) { cover.src = data.cover_image || '/frontend/resources/noimage.jpg'; cover.style.display = 'block'; }
    if (date && data.created_at) {
        const d = new Date(data.created_at);
        date.textContent = d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    if (author) author.textContent = data.author_name || 'Admin';
    if (views) views.textContent = `${data.views || 0} views`;
    if (tag && data.tags && data.tags.length > 0) {
        tag.textContent = data.tags[0];
        const tagName = data.tags[0].toLowerCase();
        if(tagName.includes('beginner')) tag.style.background = '#10b981';
        else if(tagName.includes('deep')) tag.style.background = '#3b82f6';
        else if(tagName.includes('local')) tag.style.background = '#f59e0b';
    }
}

async function loadComments(articleId) {
    const list = document.getElementById("comment-list");
    const countSpan = document.getElementById("comment-count");
    const currentUser = authService.getUser();

    try {
        const comments = await articleService.getComments(articleId);

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

            const ownerId = c.user_id || c.userId;
            const isOwner = currentUser && ownerId && (String(currentUser.id) === String(ownerId));
            
            const item = document.createElement("div");
            item.className = "comment-item";
            item.innerHTML = `
                <div class="c-avatar">${c.username.charAt(0).toUpperCase()}</div>
                <div class="c-content" style="flex:1;">
                    <div class="c-header" style="display:flex; justify-content:space-between;">
                        <div>
                            <span class="c-user">${c.username}</span>
                            <span class="c-date">${date}</span>
                        </div>
                        
                        ${isOwner ? `
                        <div class="menu-container" style="position:relative;">
                            <button class="dots-btn" style="background:none; border:none; cursor:pointer;">⋮</button>
                            <div class="menu-dropdown" style="display:none; position:absolute; right:0; top:100%; background:#fff; border:1px solid #eee; box-shadow:0 2px 5px rgba(0,0,0,0.1); z-index:10;">
                                <button class="action-edit" style="display:block; width:100%; text-align:left; padding:5px 10px; background:none; border:none; cursor:pointer;">แก้ไข</button>
                                <button class="action-delete" style="display:block; width:100%; text-align:left; padding:5px 10px; background:none; border:none; cursor:pointer; color:red;">ลบ</button>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    
                    <p class="c-text">${c.content}</p>
                    
                    <div class="edit-box" style="display:none; margin-top:10px;">
                        <textarea class="edit-input" rows="2" style="width:95%; border:1px solid #ddd; padding:5px;">${c.content}</textarea>
                        <div style="text-align:right; margin-top:5px;">
                            <button class="btn-cancel-edit" style="font-size:0.8rem; cursor:pointer;">ยกเลิก</button>
                            <button class="btn-save-edit" style="font-size:0.8rem; background:#c08a53; color:white; border:none; padding:2px 8px; border-radius:4px; cursor:pointer;">บันทึก</button>
                        </div>
                    </div>
                </div>
            `;
            list.appendChild(item);

            if (isOwner) {
                const dotsBtn = item.querySelector(".dots-btn");
                const dropdown = item.querySelector(".menu-dropdown");
                const editBtn = item.querySelector(".action-edit");
                const deleteBtn = item.querySelector(".action-delete");
                
                const textDisplay = item.querySelector(".c-text");
                const editBox = item.querySelector(".edit-box");
                const editInput = item.querySelector(".edit-input");
                const saveBtn = item.querySelector(".btn-save-edit");
                const cancelBtn = item.querySelector(".btn-cancel-edit");

                // Toggle Menu
                dotsBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.menu-dropdown').forEach(d => {
                        if(d !== dropdown) d.style.display = 'none';
                    });
                    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
                });

                // Delete
                deleteBtn.addEventListener("click", async () => {
                    if(confirm("ลบคอมเมนต์นี้?")) {
                        try {
                            await articleService.deleteComment(c.id);
                            item.remove();
                            // อัปเดตตัวเลข
                            const currentCount = parseInt(countSpan.textContent) || 0;
                            countSpan.textContent = Math.max(0, currentCount - 1);
                        } catch(err) { alert("ลบไม่สำเร็จ"); }
                    }
                });

                // Edit Mode
                editBtn.addEventListener("click", () => {
                    textDisplay.style.display = 'none';
                    editBox.style.display = 'block';
                    dropdown.style.display = 'none';
                });

                cancelBtn.addEventListener("click", () => {
                    textDisplay.style.display = 'block';
                    editBox.style.display = 'none';
                    editInput.value = c.content;
                });

                saveBtn.addEventListener("click", async () => {
                    const newText = editInput.value.trim();
                    if(!newText) return;
                    
                    saveBtn.textContent = "...";
                    try {
                        await articleService.updateComment(c.id, newText);
                        c.content = newText; // update local data
                        textDisplay.textContent = newText;
                        textDisplay.style.display = 'block';
                        editBox.style.display = 'none';
                    } catch(err) { alert("แก้ไขไม่สำเร็จ"); }
                    finally { saveBtn.textContent = "บันทึก"; }
                });
            }
        });

        document.addEventListener('click', () => {
            document.querySelectorAll('.menu-dropdown').forEach(d => d.style.display = 'none');
        });

    } catch (err) {
        console.error("Load comments error", err);
        list.innerHTML = `<p style="color:red">โหลดความคิดเห็นไม่สำเร็จ</p>`;
    }
}

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
        userLabel.innerHTML = `<a href="#" id="login-link" style="color:#c08a53;">เข้าสู่ระบบ</a> เพื่อแสดงความคิดเห็น`;
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";
        textarea.disabled = true;
        textarea.placeholder = "กรุณาเข้าสู่ระบบก่อน...";
        
        document.getElementById('login-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('open-signin')?.click();
        });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const content = textarea.value.trim();
        if (!content) return;

        submitBtn.textContent = "กำลังส่ง...";
        submitBtn.disabled = true;

        try {
            await articleService.createComment(articleId, user?.id, content);
            textarea.value = "";
            await loadComments(articleId); 
        } catch (err) {
            alert("ส่งคอมเมนต์ไม่สำเร็จ");
            console.error(err);
        } finally {
            submitBtn.textContent = "ส่งคอมเมนต์";
            submitBtn.disabled = false;
        }
    });
}