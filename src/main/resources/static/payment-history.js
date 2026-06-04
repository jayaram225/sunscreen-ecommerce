function loadPayments() {

  fetch("/payment/history", {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(res => res.json())
  .then(data => {

    console.log("Payments:", data);

    const list = data.data || data; // 🔥 FIX

    const container = document.getElementById("paymentTable");
    container.innerHTML = "";

    list.forEach(p => {
      const div = document.createElement("div");

      div.innerHTML = `
        <p><b>Order:</b> ${p.razorpayOrderId}</p>
        <p><b>Amount:</b> ₹${p.amount / 100}</p>
        <p><b>Status:</b> ${p.status}</p>
        <hr/>
      `;

      container.appendChild(div);
    });

  });
}

loadPayments();

function loadAllPayments() {

  fetch("/payment/admin/all", {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(res => res.json())
  .then(data => {

  console.log("ADMIN DATA:", data);

    const list = data.data || data; // 🔥 FIX



    const container = document.getElementById("adminTable");
    container.innerHTML = "";

    data.forEach(p => {
      const div = document.createElement("div");

      div.innerHTML = `
        <p>User ID: ${p.user.id}</p>
        <p>Order: ${p.razorpayOrderId}</p>
        <p>Status: ${p.status}</p>
        <hr/>
      `;

      container.appendChild(div);
    });
  });
}