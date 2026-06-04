const token = localStorage.getItem("token");

// ✅ Get orderId from URL
const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

// ✅ Load header
fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
  });

// ✅ Fetch orders
fetch("/orders", {
  headers: {
    "Authorization": "Bearer " + token
  }
})
.then(res => res.json())
.then(data => {

  const order = data.find(o => o.id == orderId);

  const container = document.getElementById("order-detail-container");

  if (!order) {
    container.innerHTML = "<h3>Order not found</h3>";
    return;
  }

  let itemsHtml = "";

  order.items.forEach(i => {
    itemsHtml += `
      <div class="order-item">
        <span>${i.productName}</span>
        <span>Qty: ${i.quantity}</span>
        <span>₹${i.price}</span>
      </div>
    `;
  });

  const isPlaced = true;
  const isShipped = order.status === "SHIPPED" || order.status === "DELIVERED";
  const isDelivered = order.status === "DELIVERED";

  container.innerHTML = `
    <div class="order-card">

      <h3>Order #${order.id}</h3>

      <p>Status: <b>${order.status}</b></p>

      ${order.status === "CANCELLED" && order.paymentStatus === "REFUND_INITIATED" ? `
        <p style="color:orange;">⏳ Refund in progress...</p>
      ` : ''}

      ${order.status === "CANCELLED" && order.paymentStatus === "REFUNDED" ? `
        <p style="color:green;">💰 Refund Completed</p>
      ` : ''}


      <!-- TRACKING -->
      <div class="tracking-container">

        <div class="step ${isPlaced ? "active" : ""}">
          ✔ Placed
        </div>

        <div class="line ${isShipped ? "active-line" : ""}"></div>

        <div class="step ${isShipped ? "active" : ""}">
          🚚 Shipped
        </div>

        <div class="line ${isDelivered ? "active-line" : ""}"></div>

        <div class="step ${isDelivered ? "active" : ""}">
          ✅ Delivered
        </div>

      </div>

      <h4>Items</h4>
      ${itemsHtml}

      <h4>Total: ₹${order.totalAmount}</h4>

      ${order.status === "PENDING" ? `
        <button class="cancel-btn" onclick="cancelOrder(${order.id})">
          Cancel Order
        </button>
      ` : ''}

    </div>
  `;
});

// ✅ Cancel function
function cancelOrder(orderId) {

  fetch(`/orders/${orderId}/cancel`, {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(res => res.text())
  .then(msg => {
    alert(msg);
    location.reload();
  });
}