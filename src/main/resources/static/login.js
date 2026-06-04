//login.js

function login() {

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {

    if (!data.success) {
      alert(data.message);
      return;
    }

    // ✅ SUCCESS
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("id", data.id);
    localStorage.setItem("role", data.role);

    window.location.href = "index.html";

  })
  .catch(err => {
    console.error(err);
    alert("Login failed");
  });
}
