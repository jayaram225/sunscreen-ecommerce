//cart.js

const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first");
  window.location.href = "login.html";
}
//  LOAD HEADER
fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;

    const username = localStorage.getItem("username") || "User";
    document.getElementById("username").innerText = "Hi, " + username;

    // ADD role
      const role = localStorage.getItem("role");
      if (role === "ADMIN") {
        document.getElementById("adminBtn").style.display = "inline-block";
      }
  });

// 🟢 GET CART
fetch(`/cart`, {
  headers: {
    "Authorization": "Bearer " + token
  }
})

.then(res => res.json())
.then(data => {

  const container = document.getElementById("cart-container");
  const totalElement = document.getElementById("total-price");

  container.innerHTML = "";

  //  FIXED POSITION
    if (!data || data.length === 0) {
      container.innerHTML = "<h3>Your cart is empty 🛒</h3>";

      // ✅ CLEAR OLD PAYMENT DATA
      localStorage.removeItem("finalAmount");

      return;
    }

  let total = 0;

  data.forEach(item => {

    total += item.price * item.quantity;

    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${item.name}</h3>
      <p>Price: ₹${item.price}</p>
      <div>
        <button onclick="decrease(${item.cartId})">-</button>
        <span>${item.quantity}</span>
       <button
         onclick="increase(${item.cartId}, ${item.stock}, ${item.quantity})"
         ${item.quantity >= item.stock ? 'disabled' : ''}
       >
         +
       </button>
      </div>

       ${item.stock <= 5 ? `<p style="color:red;">Only ${item.stock} left</p>` : ''}


      <img src="${item.imageUrl}" width="150"/>
      <br/>
      <button onclick="removeFromCart(${item.cartId})">
        Remove
      </button>
    `;

    container.appendChild(div);
  });

document.getElementById("subtotal").innerText = "₹" + total;
document.getElementById("final-total").innerText = "₹" + total;
document.getElementById("total-price").innerText = "Total: ₹" + total;
localStorage.setItem("finalAmount", total);

});


// 🟢 REMOVE ITEM
function removeFromCart(id) {
  fetch(`/cart/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(res => res.text())
  .then(() => location.reload());
}


// 🟢 INCREASE
function increase(id, stock, currentQty) {
  if (currentQty >= stock) {
    alert("Stock limit reached");
    return;
  }

  fetch(`/cart/increase/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(() => location.reload());
}


// 🟢 DECREASE
function decrease(id) {
  fetch(`/cart/decrease/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(() => location.reload());
}


// 🟢 CLEAR CART
function clearCart() {
  fetch(`/cart/clear`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(() => location.reload());
}


// 🟢 CHECKOUT
function checkout() {
  fetch(`/cart/checkout`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(res => res.text())
  .then(data => {
    alert(data);
    location.reload();
  });

}
function goToCheckout() {
    window.location.href = "checkout.html";
  }