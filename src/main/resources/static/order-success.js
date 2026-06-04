//order-success.js

const token = localStorage.getItem("token");

// load header
fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
  });

// GET LATEST ORDER
fetch("/orders", {
  headers: {
    "Authorization": "Bearer " + token
  }
})
.then(res => res.json())
.then(data => {

  const container = document.getElementById("order-details");

  if (!data || data.length === 0) {
    container.innerHTML = "No order found";
    return;
  }

   const savedId = localStorage.getItem("latestOrderId");
   const latest = data.find(o => o.id == savedId) || data[data.length - 1];

  let html = `
    <h3>Order ID: ${latest.id}</h3>
    <p>Total: ₹${latest.totalAmount}</p>
    <p>Date: ${latest.orderDate}</p>

    <h4>Items:</h4>
  `;

  latest.items.forEach(item => {
    html += `
      <div class="item">
        <p>${item.productName}</p>
        <p>Qty: ${item.quantity}</p>
        <p>Price: ₹${item.price}</p>
      </div>
      <hr/>
    `;
  });

  container.innerHTML = html;
});

// NAVIGATION
function goToOrders() {
  window.location.href = "order.html";
}

function goToHome() {
  window.location.href = "index.html";
}