// common.js

function goToHome() {
  window.location.href = "index.html";
}

function goToCart() {
  window.location.href = "cart.html";
}

function goToAddress() {
  window.location.href = "address.html";
}

// USER ORDERS
function goToUserOrders() {
  window.location.href = "order.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

function isAdmin() {
  return localStorage.getItem("role") === "ADMIN";
}

function goToAdmin() {
  window.location.href = "admin.html";
}

// ADMIN PRODUCTS
function goToAdminProducts() {
  window.location.href = "admin-products.html";
}

// ADMIN ORDERS
function goToAdminOrders() {
  window.location.href = "admin-orders.html";
}

// ADMIN USERS
function goToUsers() {
  window.location.href = "users.html";
}