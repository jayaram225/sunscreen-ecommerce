function register() {

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("errorBox");

  errorBox.innerText = ""; // clear old errors

  if (!username || !password) {
    errorBox.innerText = "Please enter username and password";
    return;
  }

  if (username.length < 4) {
    errorBox.innerText = "Please enter more than 4 characters for username";
    return;
  }

  if (password.length < 6) {
    errorBox.innerText = "Please enter more than 6 characters for password";
    return;
  }

  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
  .then(async (res) => {

    const contentType = res.headers.get("content-type");

    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = { message: text };
    }

    if (!res.ok) {

      if (data && data.errors) {
        let msg = "";
        for (let key in data.errors) {
          msg += data.errors[key] + "\n";
        }
        errorBox.innerText = msg;
      } else {
        errorBox.innerText = data.message || "Registration failed";
      }

      return;
    }

    // ✅ SUCCESS
    alert(data.message || data);
    window.location.href = "login.html";

  })
  .catch(err => {
    console.error(err);
    errorBox.innerText = "Registration failed";
  });
}