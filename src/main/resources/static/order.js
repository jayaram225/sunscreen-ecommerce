//order.js

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

    //  ADD THIS
      const role = localStorage.getItem("role");
      if (role === "ADMIN") {
        document.getElementById("adminBtn").style.display = "inline-block";
      }
  });

fetch("/orders", {
  headers: {
    "Authorization": "Bearer " + token   // ✅ JWT
  }
})
  .then(res => res.json())
  .then(data => {

    const container = document.getElementById("orders-container");

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = "<h3>No orders found</h3>";
      return;
    }

    data.reverse().forEach(order => {

      const div = document.createElement("div");
       div.className = "order-card";

      div.style.border = "1px solid #ccc";
      div.style.margin = "10px";
      div.style.padding = "10px";

      let itemsHtml = "";

      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          itemsHtml += `
            <p>
              ${item.productName}
              (₹${item.price}) × ${item.quantity}
            </p>
          `;
        });
      } else {
        itemsHtml = "<p>No items found</p>";
      }

      // ✅ STEP CALCULATION
      const isPlaced = true; // always true
      const isShipped = order.status === "SHIPPED" || order.status === "DELIVERED";
      const isDelivered = order.status === "DELIVERED";

      // ✅ HTML UI
      div.innerHTML = `
        <div class="order-header">
          <span>Order #${order.id}</span>
          <span class="order-date">${order.orderDate}</span>
        </div>

         <button class="view-btn" onclick="viewOrder(${order.id})">
         🔍 View Details
         </button>


        <div class="order-status">
         Status: <b>${order.status}</b>

        ${order.status === "CANCELLED" && order.paymentStatus === "REFUND_INITIATED" ? `
          <p style="color:orange;">⏳ Refund in progress...</p>
        ` : ''}

        ${order.status === "CANCELLED" && order.paymentStatus === "REFUNDED" ? `
          <p style="color:green;">💰 Refund Completed</p>
        ` : ''}

        </div>

        <div class="tracking-container">
          <div class="step ${isPlaced ? 'active' : ''}">
            ✔ Placed
          </div>

          <div class="line ${isShipped ? 'active-line' : ''}"></div>

          <div class="step ${isShipped ? 'active' : ''}">
            🚚 Shipped
          </div>

          <div class="line ${isDelivered ? 'active-line' : ''}"></div>

          <div class="step ${isDelivered ? 'active' : ''}">
            ✅ Delivered
          </div>
        </div>

        <div class="order-items">
          ${itemsHtml}
        </div>

        <div class="order-footer">
          <span>Total</span>

          <span class="order-total">₹${order.totalAmount}</span>
        </div>

${order.status === "PENDING" ? `
  <button class="cancel-btn" onclick="cancelOrder(${order.id})">
    Cancel Order
  </button>
` : ''}
`;


      container.appendChild(div);
      ``
    });

  })
  .catch(err => {
    console.error("Error loading orders:", err);
  });

  function cancelOrder(orderId) {

    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

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
    })
    .catch(err => {
      console.error(err);
      alert("Cancel failed");
    });
  }

  function viewOrder(id) {
    window.location.href = `order-detail.html?id=${id}`;
  }

