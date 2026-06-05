//script.js

const token = localStorage.getItem("token");

if (!token) {
    console.log("Guest user browsing");
}

//  LOAD HEADER
fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;

    const username = localStorage.getItem("username");

if (username) {
  document.getElementById("username").innerText = "Hi, " + username;
} else {
  document.getElementById("username").innerText = "Welcome Guest";
}


    // ADD THIS
      const role = localStorage.getItem("role");
      if (role === "ADMIN") {
        document.getElementById("adminBtn").style.display = "inline-block";
      }
  });


//  PRODUCTS API
fetch("/products")
  .then(response => response.json())
  .then(data => {

    const container = document.getElementById("product-container");

    data.forEach(product => {

      const div = document.createElement("div");
      div.className = "product";

      div.innerHTML = `
        <h3 onclick="viewProduct(${product.id})" style="cursor:pointer;">
          ${product.name}
        </h3>
        <p>Price: ₹${product.price}</p>
        <img src="${product.imageUrl}" width="150"/>
        <br/>
       <div class="qty-box">
           <button onclick="decreaseQty(${product.id})">−</button>
           <span id="qty-${product.id}" class="qty-value">1</span>
          <button
            onclick="increaseQty(${product.id}, ${product.stock})"
            ${product.stock <= 1 ? 'disabled' : ''}
          >
            +
          </button>
       </div>

       ${product.stock <= 5 && product.stock > 0
         ? `<p style="color:red;">Only ${product.stock} left</p>`
         : ''}

        <button
          onclick="addToCart(${product.id})"
          ${product.stock === 0 ? 'disabled' : ''}
        >
          ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      `;

      container.appendChild(div);
    });
  });

function addToCart(id) {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  // GET QUANTITY (SAFE CHECK)
  const qtyElement = document.getElementById(`qty-${id}`);

  let quantity = 1; // default fallback

  if (qtyElement) {
    quantity = parseInt(qtyElement.innerText || "1");
  }

  // VALIDATION (extra safety)
  if (isNaN(quantity) || quantity <= 0) {
    quantity = 1;
  }

  fetch("/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      productId: id,
      quantity: quantity
    })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error("Failed: " + res.status);
    }
    return res.text();
  })
  .then(data => {
    alert(data);
  })
  .catch(err => {
    console.error("Add to cart failed:", err);
    alert("Failed to add to cart (check login/token)");
  });
}

function viewProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

function increaseQty(id, stock) {
  const el = document.getElementById(`qty-${id}`);
  let current = parseInt(el.innerText);

  if (current >= stock) {
    alert("Only " + stock + " items available");
    return;
  }

  el.innerText = current + 1;
}

function decreaseQty(id) {
  const el = document.getElementById(`qty-${id}`);
  let val = parseInt(el.innerText);
  if (val > 1) {
    el.innerText = val - 1;
  }
}
