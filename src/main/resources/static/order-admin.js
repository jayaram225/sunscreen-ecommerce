// order-admin.js

let allOrders = [];
let currentFilter = "ALL"

document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("role") !== "ADMIN") {
    alert("Access Denied");
    window.location.href = "index.html";
    return;
  }

  fetch("header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;

      const username = localStorage.getItem("username") || "Admin";
      document.getElementById("username").innerText = "Hi, " + username;

      const adminBtn = document.getElementById("adminBtn");
      if (adminBtn) {
        adminBtn.style.display = "inline-block";
      }
    });

  loadOrders();
});

function loadOrders() {
  fetch("/admin/orders", {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
    .then(res => res.json())
    .then(data => {
      allOrders = Array.isArray(data) ? data : [];

      const table = document.getElementById("orderTable");
      table.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";

      if (allOrders.length === 0) {
        table.innerHTML = `
          <tr>
            <td colspan="6">No orders found</td>
          </tr>
        `;
        return;
      }

      renderOrders(allOrders);
    })
    .catch(() => {
      const table = document.getElementById("orderTable");
      table.innerHTML = `
        <tr>
          <td colspan="6">Failed to load orders</td>
        </tr>
      `;
    });
}

function renderOrders(data) {
  const table = document.getElementById("orderTable");
  table.innerHTML = "";

  data.forEach(o => {
    const row = document.createElement("tr");

    if (o.status === "CANCELLED") {
      row.classList.add("cancelled-row");
    }

    row.innerHTML = `
      <td>${o.id}</td>
      <td>${o.user?.id ?? "-"}</td>
      <td>₹${o.totalAmount}</td>

      <td>
        ${getStatusBadge(o.status)}
      </td>

      <td>
        ${getStatusControl(o)}
      </td>

      <td>
        <button class="view-btn" onclick="viewDetails(${o.id})">
          View
        </button>
      </td>
    `;

    table.appendChild(row);
  });
}

function filterOrders() {

  const searchValue = document
    .getElementById("orderSearch")
    .value
    .toLowerCase()
    .trim();

  const filtered = allOrders.filter(o => {

    const orderId = o.id.toString();
    const userId = o.user?.id ? o.user.id.toString() : "";

    // 🔎 SEARCH MATCH
    const matchesSearch =
      orderId.includes(searchValue) ||
      userId.includes(searchValue);

    // 🎯 FILTER MATCH
    const matchesFilter =
      currentFilter === "ALL" || o.status === currentFilter;

    return matchesSearch && matchesFilter;
  });

  renderOrders(filtered);
}

function applyFilter(status) {

  currentFilter = status;

  // ✅ Remove active class from all buttons
  const buttons = document.querySelectorAll(".filter-box button");
  buttons.forEach(btn => btn.classList.remove("active-filter"));

  // ✅ Add active class to clicked button
  event.target.classList.add("active-filter");

  // ✅ Apply filter
  filterOrders();
}

function showToast(message) {

  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function getStatusBadge(status) {
  if (status === "PENDING") {
    return `<span class="badge pending">PENDING</span>`;
  }

  if (status === "SHIPPED") {
    return `<span class="badge shipped">SHIPPED</span>`;
  }

  if (status === "DELIVERED") {
    return `<span class="badge delivered">DELIVERED</span>`;
  }

  if (status === "CANCELLED") {
    return `<span class="badge cancelled">CANCELLED</span>`;
  }

  return `<span class="badge unknown">UNKNOWN</span>`;
}

function getStatusControl(order) {
  if (order.status === "CANCELLED") {
    return `<span class="status-locked">Final</span>`;
  }

  return `
    <select class="status-select" onchange="updateStatus(${order.id}, this.value)">
      <option value="PENDING" ${order.status === "PENDING" ? "selected" : ""}>PENDING</option>
      <option value="SHIPPED" ${order.status === "SHIPPED" ? "selected" : ""}>SHIPPED</option>
      <option value="DELIVERED" ${order.status === "DELIVERED" ? "selected" : ""}>DELIVERED</option>
    </select>
  `;
}

function updateStatus(orderId, status) {

  const confirmAction = confirm("Are you sure you want to change status?");

  if (!confirmAction) return;

  fetch(`/admin/orders/${orderId}/status?status=${status}`, {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
    .then(res => res.text())
    .then(msg => {
      showToast(msg);
      loadOrders();
    });
}

function viewDetails(orderId) {
  const order = allOrders.find(o => o.id === orderId);

  let html = `
    <html>
      <head>
        <title>Order Details</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f8f9fa;
          }
          h3 {
            margin-bottom: 15px;
          }
          .item {
            background: white;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          .meta {
            color: #555;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
  `;

  if (!order) {
    html += `<h3>Order Details</h3><p>Order not found.</p>`;
  } else if (!order.items || order.items.length === 0) {
    html += `
      <h3>Order #${order.id}</h3>
      <p class="meta">No items found for this order.</p>
    `;
  } else {
    html += `
      <h3>Order #${order.id}</h3>
      <p class="meta">Status: ${order.status}</p>
      <p class="meta">Total: ₹${order.totalAmount}</p>
    `;

    order.items.forEach(i => {
      html += `
        <div class="item">
          <strong>${i.productName}</strong><br>
          Qty: ${i.quantity}<br>
          Price: ₹${i.price}
        </div>
      `;
    });
  }

  html += `
      </body>
    </html>
  `;

  const popup = window.open("", "Order Details", "width=500,height=500");
  popup.document.write(html);
  popup.document.close();
}