//address.js

const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first");
  window.location.href = "login.html";
}
//Load header.html
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

// 🔹 LOAD ADDRESSES
function loadAddresses() {

  fetch("/address", {
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(res => res.json())
  .then(data => {

    const container = document.getElementById("address-container");
    container.innerHTML = "";

    if (!data || data.length === 0) {
      container.innerHTML = "<p>No addresses found</p>";
      return;
    }

    data.forEach(addr => {

      const div = document.createElement("div");
       div.className = "address-card"; //  ADD THIS

      div.style.border = "1px solid #ccc";
      div.style.margin = "10px";
      div.style.padding = "10px";

      div.innerHTML = `
        <h4>${addr.fullName}</h4>
        <p>${addr.phone}</p>
        <p>${addr.street}, ${addr.city}</p>
        <p>${addr.state} - ${addr.pincode}</p>
      `;

      container.appendChild(div);
    });

  })
  .catch(err => console.error("Error loading addresses:", err));
}

// 🔹 ADD ADDRESS
function addAddress() {

  const data = {
    fullName: document.getElementById("fullName").value,
    phone: document.getElementById("phone").value,
    street: document.getElementById("street").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    pincode: document.getElementById("pincode").value
  };

  fetch("/address", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(data)
  })
  .then(response => response.text())   // ✅ use text()
    .then(msg => {

      alert(msg); // shows "Address added successfully"


    const fromCheckout = localStorage.getItem("fromCheckout");

    if (fromCheckout === "true") {
      localStorage.removeItem("fromCheckout");
      window.location.href = "checkout.html";
    } else {
      loadAddresses();
    }
  })
  .catch(err => console.error("Error adding address:", err));
}

// 🔹 LOAD ON PAGE START
loadAddresses();