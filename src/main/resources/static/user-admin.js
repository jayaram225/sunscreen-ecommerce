// user-admin.js

let allUsers = [];
let currentFilter = "ALL";

document.addEventListener("DOMContentLoaded", function () {

  // 🔐 PROTECT PAGE
  if (localStorage.getItem("role") !== "ADMIN") {
    alert("Access Denied");
    window.location.href = "index.html";
    return;
  }

  // 🔹 LOAD HEADER
  fetch("header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;

      const username = localStorage.getItem("username") || "Admin";
      document.getElementById("username").innerText = "Hi, " + username;

      const adminBtn = document.getElementById("adminBtn");
      if (adminBtn) adminBtn.style.display = "inline-block";
    });

  loadUsers();
});


// ✅ LOAD USERS
function loadUsers() {

  fetch("/admin/users", {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(res => res.json())
  .then(data => {

    allUsers = data;
    renderUsers(allUsers);

  }) // ✅ close .then
  .catch(() => {   // ✅ OPTIONAL but important
    const table = document.getElementById("userTable");
    table.innerHTML = `
      <tr>
        <td colspan="5">Failed to load users</td>
      </tr>
    `;
  }); // ✅ close fetch properly
}


function renderUsers(data) {

  const table = document.getElementById("userTable");
  table.innerHTML = "";

  const currentUserId = localStorage.getItem("userId");

  data.forEach(u => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${u.id}</td>
      <td>${u.username}</td>

      <td>${getRoleBadge(u.role)}</td>

      <td>
        ${
          u.active
            ? '<span class="badge active">ACTIVE</span>'
            : '<span class="badge blocked">BLOCKED</span>'
        }
      </td>

      <td>
        ${
          u.role === "ADMIN"
            ? `<span style="color:gray;">Protected</span>`
            : u.id == currentUserId
              ? `<span style="color:gray;">You</span>`
              : u.active
                ? `<button class="block-btn" onclick="toggleUser(${u.id}, false)">Block</button>`
                : `<button class="activate-btn" onclick="toggleUser(${u.id}, true)">Activate</button>`
        }
      </td>
    `;

    table.appendChild(row);
  });
}

function filterUsers() {

  const searchValue = document
    .getElementById("userSearch")
    .value
    .toLowerCase()
    .trim();

  const filtered = allUsers.filter(u => {

    const name = u.username.toLowerCase();
    const id = u.id.toString();

    // ✅ SEARCH
    const matchesSearch =
      name.includes(searchValue) ||
      id.includes(searchValue);

    // ✅ FILTER
    let matchesFilter = true;

    if (currentFilter === "ACTIVE") {
      matchesFilter = u.active === true;
    }

    if (currentFilter === "BLOCKED") {
      matchesFilter = u.active === false;
    }

    return matchesSearch && matchesFilter;
  });

  renderUsers(filtered);
}

function applyUserFilter(status) {

  currentFilter = status;

  const buttons = document.querySelectorAll(".filter-box button");
  buttons.forEach(btn => btn.classList.remove("active-filter"));

  event.target.classList.add("active-filter");

  filterUsers();
}


// ✅ ROLE BADGE
function getRoleBadge(role) {

  if (role === "ADMIN") {
    return `<span class="badge admin-role">ADMIN</span>`;
  }

  return `<span class="badge user-role">USER</span>`;
}


// ✅ ACTIVATE / BLOCK USER
function toggleUser(userId, active) {

  fetch(`/admin/users/${userId}/toggle`, {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json"
    }
  })
  .then(res => res.text())
  .then(msg => {
    alert(msg);
    loadUsers();
  })
  .catch(() => {
    alert("Failed to update user");
  });
}