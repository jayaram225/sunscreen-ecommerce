// product-admin.js

let allProducts = [];
let editingId = null;
let currentFilter = "ALL";

// 🔐 PROTECT PAGE
document.addEventListener("DOMContentLoaded", function () {
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
      if (adminBtn) {
        adminBtn.style.display = "inline-block";
      }
    });

  loadProducts();
});


// ✅ ADD / UPDATE ENTRY POINT
function addProduct() {
  const fileInput = document.getElementById("imageFile");
  const file = fileInput.files[0];

  let product = {
    name: document.getElementById("name").value.trim(),
    price: document.getElementById("price").value,
    stock: document.getElementById("stock").value
  };

  if (!product.name || !product.price || !product.stock) {
    alert("Please fill product name, price, and stock");
    return;
  }

  // CASE 1: Image selected -> upload first
  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    fetch("/admin/upload", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: formData
    })
      .then(res => res.text())
      .then(imageUrl => {
        if (!imageUrl.startsWith("http")) {
          alert("Upload failed");
          return;
        }

        product.imageUrl = imageUrl;
        saveProduct(product);
      })
      .catch(err => {
        console.error("Upload failed:", err);
        alert("Upload failed");
      });

  } else {
    // CASE 2: Use existing image URL for edit mode
    const existingImage = document.getElementById("imageUrl").value;

    if (!existingImage) {
      alert("Please select an image");
      return;
    }

    product.imageUrl = existingImage;
    saveProduct(product);
  }
}


// ✅ SAVE PRODUCT
function saveProduct(product) {
  if (editingId !== null) {
    fetch(`/admin/products/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(product)
    })
      .then(res => res.json())
      .then(() => {
        alert("Product updated successfully");
        resetForm();
        loadProducts();
      })
      .catch(err => {
        console.error("Update failed:", err);
        alert("Failed to update product");
      });

  } else {
    fetch("/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(product)
    })
      .then(res => res.json())
      .then(() => {
        alert("Product added successfully");
        resetForm();
        loadProducts();
      })
      .catch(err => {
        console.error("Add failed:", err);
        alert("Failed to add product");
      });
  }
}


// ✅ LOAD PRODUCTS
function loadProducts() {
  fetch("/admin/products", {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
    .then(res => res.json())
    .then(data => {
      allProducts = Array.isArray(data) ? data : [];

      const table = document.getElementById("productTable");
      table.innerHTML = "";

      if (allProducts.length === 0) {
        table.innerHTML = `
          <tr>
            <td colspan="6">No products found</td>
          </tr>
        `;
        return;
      }
      filterProducts(); //
    })
    .catch(err => {
      console.error("Failed to load products:", err);

      const table = document.getElementById("productTable");
      table.innerHTML = `
        <tr>
          <td colspan="6">Failed to load products</td>
        </tr>
      `;
    });
}

function renderProducts(data) {

  const table = document.getElementById("productTable");
  table.innerHTML = "";

  data.forEach(p => {

    const row = document.createElement("tr");

    // ✅ Low stock highlight
    if (p.stock < 5 && p.stock > 0) {
      row.classList.add("low-stock");
    }

    // ✅ INACTIVE PRODUCT STYLE
    if (!p.active) {
      row.style.opacity = "0.5";
    }

    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>₹${p.price}</td>
      <td>${p.stock}</td>

      <td>
        <img class="table-image" src="${p.imageUrl}" alt="${p.name}">
      </td>

      <!-- ✅ STATUS COLUMN -->
      <td>
        ${
          p.active
            ? '<span style="color:green;font-weight:bold;">ACTIVE</span>'
            : '<span style="color:red;font-weight:bold;">INACTIVE</span>'
        }
      </td>

      <!-- ✅ ACTION BUTTONS -->
      <td>
        ${
          p.active
            ? `
              <button class="edit-btn" onclick="editProduct(${p.id})">Edit</button>
              <button class="delete-btn" onclick="deleteProduct(${p.id})">Deactivate</button>
            `
            : `
              <button class="restore-btn" onclick="restoreProduct(${p.id})">Restore</button>
            `
        }
      </td>
    `;

    table.appendChild(row);
  });
}

function filterProducts() {

  const searchValue = document
    .getElementById("productSearch")
    .value
    .toLowerCase()
    .trim();

  const filtered = allProducts.filter(p => {

    const name = p.name.toLowerCase();
    const id = p.id.toString();

    //  SEARCH
    const matchesSearch =
      name.includes(searchValue) ||
      id.includes(searchValue);

    //  FILTER
    let matchesFilter = true;

//  NEW CONDITIONS
    if (currentFilter === "ACTIVE") {
      matchesFilter = p.active === true;
    }

    if (currentFilter === "INACTIVE") {
      matchesFilter = p.active === false;
    }



    if (currentFilter === "LOW") {
      matchesFilter = p.stock < 5 && p.stock > 0;
    }

    if (currentFilter === "OUT") {
      matchesFilter = p.stock === 0;
    }

    return matchesSearch && matchesFilter;
  });

  renderProducts(filtered);
}

function applyProductFilter(status, element) {

  currentFilter = status;

  const buttons = document.querySelectorAll(".filter-box button");
  buttons.forEach(btn => btn.classList.remove("active-filter"));

  element.classList.add("active-filter");

  filterProducts();
}


// ✅ DELETE PRODUCT
function deleteProduct(id) {


 // ✅ ASK FIRST (IMPORTANT)
  const confirmDelete = confirm("Are you sure you want to delete this product?");

  if (!confirmDelete) {
    return; // ✅ stop if user clicks NO
  }

  fetch(`/admin/products/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
    .then(res => res.text())
    .then(() => {
      alert("Product removed successfully");
      loadProducts();
    })
    .catch(err => {
      console.error("Delete failed:", err);
      alert("Failed to delete product");
    });
}


// ✅ EDIT PRODUCT
function editProduct(id) {
  const product = allProducts.find(p => p.id === id);

  if (!product) {
    alert("Product not found");
    return;
  }

  document.getElementById("name").value = product.name;
  document.getElementById("price").value = product.price;
  document.getElementById("stock").value = product.stock;
  document.getElementById("imageUrl").value = product.imageUrl;
  document.getElementById("imageFile").value = "";

  editingId = product.id;

  const formTitle = document.getElementById("formTitle");
  if (formTitle) {
    formTitle.innerText = "Edit Product";
  }

 // ✅ SCROLL TO TOP
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

// ✅ Highlight form
  const formCard = document.querySelector(".form-card");
  formCard.classList.add("active-form");

  setTimeout(() => {
    formCard.classList.remove("active-form");
  }, 2000);



}


function restoreProduct(id) {

  fetch(`/admin/products/${id}/restore`, {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(res => res.text())
  .then(msg => {
    alert(msg);
    loadProducts();
  });
}


// ✅ RESET FORM
function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("imageUrl").value = "";
  document.getElementById("imageFile").value = "";

  editingId = null;

  const formTitle = document.getElementById("formTitle");
  if (formTitle) {
    formTitle.innerText = "Add Product";
  }
};