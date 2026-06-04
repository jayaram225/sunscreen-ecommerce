//checkout.js

const token = localStorage.getItem("token");

let selectedAddressId = null;

//  LOAD ADDRESSES
fetch("/address", {
  headers: {
    "Authorization": "Bearer " + token
  }
})
.then(res => res.json())
.then(data => {

  const container = document.getElementById("address-container");

  container.innerHTML = "";

  //  ADD BUTTON ALWAYS (IMPORTANT)
    const addBtn = document.createElement("button");
    addBtn.innerText = "+ Add New Address";
    addBtn.onclick = () => goToAddAddress();
    container.appendChild(addBtn);


   //  NO ADDRESS CASE
     if (!data || data.length === 0) {
       const msg = document.createElement("p");
       msg.innerText = "No saved addresses. Please add one.";
       msg.style.color = "red";
       container.appendChild(msg);
       return;
     }

// ADDRESSES EXIST CASE
  data.forEach(addr => {

    const div = document.createElement("div");
    div.className = "address-card";

    div.innerHTML = `
      <label class="address-label">
        <input type="radio" name="address">


        <div class="address-info">
          <b>${addr.fullName}</b>
          <p>${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}</p>
          <small>Phone: ${addr.phone}</small>
        </div>
      </label>
    `;
    div.onclick = function () {
      selectAddress(addr.id, div);

      // also check the radio button
      div.querySelector("input").checked = true;
    };


    container.appendChild(div);
  });
});

// SELECT ADDRESS
function selectAddress(id, element) {
  selectedAddressId = id;

  document.querySelectorAll(".address-card")
    .forEach(card => card.classList.remove("selected"));

  element.classList.add("selected");

  const text = element.innerText;

  document.getElementById("selected-address-box").innerHTML =
    `<div style="padding:10px; background:#e9f5ff; margin-top:10px; border-radius:8px;">
      <b>Selected Address:</b><br/>
      ${text}
    </div>`;
}

// PLACE ORDER
function placeOrder() {

  if (!selectedAddressId) {
    alert("Please select address");
    return;
  }
  console.log("PLACE ORDER CLICKED");
    console.log("Calling checkout API");

  fetch("/cart/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      addressId: selectedAddressId
    })
  })
  .then(response => response.text())
  .then(data => {
    console.log("RESPONSE:", data);

    if (data.includes("Invalid") || data.includes("error")) {
      alert(data);
      return;
    }

    // ✅ SAVE ADDRESS
    localStorage.setItem("addressId", selectedAddressId);

    // ✅ JUST REDIRECT
    window.location.href = "payment.html";
  });
}

function goToAddAddress() {
  localStorage.setItem("fromCheckout", "true");
  window.location.href = "address.html";
}