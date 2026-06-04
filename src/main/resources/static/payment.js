const amount = parseInt(localStorage.getItem("finalAmount"));

if (!amount || amount == 0) {
  alert("Invalid access to payment page ❌");
  window.location.href = "cart.html";
} else {
  const amountEl = document.getElementById("amount");

  if (amountEl) {
    amountEl.innerText = amount;
  }
}



function payNow() {


  const amount = parseInt(localStorage.getItem("finalAmount"));



  if (!amount || amount <= 0) {
    alert("Invalid amount ❌");
    return;
  }

  fetch(`/payment/create-order?amount=${amount}`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(res => res.json())
  .then(order => {
 console.log("Order ID:", order.id);
 console.log("Full Order:", order);

   if (!order || !order.id) {
         alert("Order creation failed ❌");
         return;
       }

 // ✅ FETCH CONFIG
  return fetch("/config")
    .then(res => res.json())
    .then(config => {


    const options = {
      key: config.key,
      amount: order.amount,
      currency: "INR",
      name: "Sunscreen Store",
      description: "Order Payment",
      order_id: order.id,

     handler: function (response) {

       console.log("Payment Response:", response);


       // ✅ ONLY proceed if all values exist
       if (!response.razorpay_payment_id ||
           !response.razorpay_order_id ||
           !response.razorpay_signature) {

         alert("Payment not completed properly ❌");
         return;
       }

       verifyPayment(response);
     },

      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999"
      },

      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new Razorpay(options);

    rzp.on('payment.failed', function (response) {
     showFailureModal(); //  show retry UI
      console.error(response.error);
    });

    //  IMPORTANT
    console.log("Opening Razorpay...");
    rzp.open();

  }); //  properly closed
})

.catch(err => {
    console.error("Payment init failed:", err);
    alert("Something went wrong ❌");
  });

} // ✅ IMPORTANT: closing payNow function




function cancelPayment() {
  alert("Payment Cancelled ❌");

  localStorage.removeItem("orderId");
  localStorage.removeItem("finalAmount");

  window.location.href = "cart.html";
}

function verifyPayment(paymentData) {

  const token = localStorage.getItem("token");
  const addressId = localStorage.getItem("addressId");

  showLoader(); // ✅ START LOADER

  fetch("/payment/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      razorpayPaymentId: paymentData.razorpay_payment_id,
      razorpayOrderId: paymentData.razorpay_order_id,
      razorpaySignature: paymentData.razorpay_signature,
      addressId: addressId
    })
  })
  .then(res => res.json()) // ✅ KEEP JSON
  .then(data => {


    if (data.success === true) {
      localStorage.setItem("latestOrderId", data.orderId);

  // ✅ KEEP SPINNER VISIBLE FOR USER (UX DELAY)
      setTimeout(() => {
        hideLoader();



      localStorage.removeItem("finalAmount");
      localStorage.removeItem("addressId");


      window.location.href = "order-success.html";
      }, 3000); // ⏱ 2 seconds (you can make it 3000)
    } else {
     hideLoader();
     showFailureModal(); // ✅ SHOW RETRY OPTIONS

      console.error(data);
    }
  })
  .catch(err => {
    hideLoader(); // ✅ STOP LOADER ON ERROR
    console.error(err);
     showFailureModal(); // ✅ NETWORK / SERVER ERROR

  });
}

function showLoader() {
  document.getElementById("payment-loader").style.display = "flex";
}

function hideLoader() {
  document.getElementById("payment-loader").style.display = "none";
}

function showFailureModal() {
  document.getElementById("payment-failure-modal").style.display = "flex";
}

function hideFailureModal() {
  document.getElementById("payment-failure-modal").style.display = "none";
}

function retryPayment() {
  hideFailureModal();
  payNow(); // ✅ reopen Razorpay checkout
}

function cancelAfterFailure() {
  hideFailureModal();

  // Clean up payment state
  localStorage.removeItem("addressId");
  localStorage.removeItem("finalAmount");

  window.location.href = "cart.html";
}
