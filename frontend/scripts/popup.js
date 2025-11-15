const popup = document.getElementById("pop-up")


function buildPopup(shop) {
    const pop = document.createElement('div')
    pop.className = 'popCard'
    pop.innerHTML = `
        <div class="left"> 
            <div class="pic">
                <img src="${shop.cover_image_url || '/frontend/resources/noimage.jpg'}" alt="${shop.name}">
            </div>
            <div class="info">
                <p class="shop-name">${shop.name}</p>
                <div class="score">⭐ ${shop.average_rating ?? "-"}</div>
                <p class="desc">${shop.description ?? ""}</p>
            </div>
        </div>
        <div class="right" > 
            <div class="comment">
                <div class="profile-image">
                    <img src="${shop.cover_image_url || '/frontend/resources/noimage.jpg'}" alt="${shop.name}">
                </div>
                <div class="about-text">
                    <p class="username">${shop.username}</p>
                    <p class="text-comment"> ${shop.comment}</p>
                </div>
            </div?
        </div>
    `
    return pop
}