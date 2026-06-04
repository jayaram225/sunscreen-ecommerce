//product.js
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

console.log("ID:", id);

fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;

    const username = localStorage.getItem("username") || "User";
    document.getElementById("username").innerText = "Hi, " + username;

    //  ADD THIS
      const role = localStorage.getItem("role");
      if (role === "ADMIN") {
        document.getElementById("adminBtn").style.display = "inline-block";
      }
  });

if (!id) {
  document.getElementById("product-details").innerHTML = "Product ID missing!";
} else {
  fetch(`/products/${id}`)
    .then(res => res.json())
    .then(product => {

      console.log("Product:", product);

      const container = document.getElementById("product-details");

      container.innerHTML = `
      <div class="product-detail-container">

        <div class="product-image">
          <img src="${product.imageUrl}" />
        </div>

        <div class="product-info">

          <h2>${product.name}</h2>

          <p class="price">₹${product.price}</p>

          <p class="desc">
            High-quality sunscreen designed for daily protection against UV rays. Lightweight, non-sticky and suitable for all skin types.
          </p>

          <div class="qty-box">
            <button onclick="decreaseQty()">−</button>
            <span id="qty">1</span>
            <button onclick="increaseQty()">+</button>
          </div>

          <button class="add-btn" onclick="addToCart(${product.id})">
            🛒 Add to Cart
          </button>

        </div>

      </div>
      `;
    })
    .catch(err => {
      console.error("Error fetching product:", err);
    });
}

let qty = 1;

// INCREASE
function increaseQty() {
  qty++;
  document.getElementById("qty").innerText = qty;
}

// DECREASE
function decreaseQty() {
  if (qty > 1) {
    qty--;
    document.getElementById("qty").innerText = qty;
  }
}

// ADD TO CART
function addToCart(productId) {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  fetch("/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      productId: productId,
      quantity: qty
    })
  })
  .then(res => res.text())
  .then(data => {
    alert(data);
  })
  .catch(err => {
    console.error(err);
    alert("Add to cart failed");
  });
}