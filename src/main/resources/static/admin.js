//admin.js

// 🔐 PROTECT ADMIN PAGE
const role = localStorage.getItem("role");

if (role !== "ADMIN") {
  alert("Access Denied");
  window.location.href = "index.html";
}

// 🔹 LOAD HEADER
fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;

    const username = localStorage.getItem("username") || "Admin";
    document.getElementById("username").innerText = "Hi, " + username;

    // show admin button
    document.getElementById("adminBtn").style.display = "inline-block";
  });

  //  LOAD DASHBOARD DATA
  fetch("/admin/dashboard", {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(res => res.json())
  .then(data => {

    document.getElementById("totalUsers").innerText = data.totalUsers;
    document.getElementById("totalOrders").innerText = data.totalOrders;
    document.getElementById("totalRevenue").innerText = "₹" + data.totalRevenue;

  });



// 🔹 NAVIGATION FUNCTIONS
function goToAdminProducts() {
  window.location.href = "admin-products.html";
}


function goToHelp() {
  window.location.href = "help.html";
}
