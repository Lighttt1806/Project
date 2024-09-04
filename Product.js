let iconCart = document.querySelector('.iconCart');
let icons = document.querySelector('.icons');
let cart = document.querySelector('.cart');
let btnClose = document.querySelector('.close');

iconCart.addEventListener('click', function(){
  if(cart.style.right == '-100%'){
    cart.style.right = '0';
    icons.style.transform = 'translate(0)';
  }else{
    cart.style.right = '-100%';
    icons.style.transform = 'translate(0)';
  }
});

btnClose.addEventListener('click', function(){
  cart.style.right = '-100%';
  icons.style.transform = 'translate(0)';
});




let listCart = [];
function checkCart(){
  let cookieValue = document.cookie
  .split(';')
  .find(row => row.startsWith('listCart='));
   if(cookieValue){
    listCart = JSON.parse(cookieValue.split('=')[1]);
   }else{
    listCart = [];
   }
}
checkCart();
function addCart($idProduct){
  let productsCopy = JSON.parse(JSON.stringify(products));
  if(!listCart[$idProduct]){
    listCart[$idProduct] = productsCopy.filter(pro=>pro.id === $idProduct)[0];
    listCart[$idProduct].quantity = 1;
  }else{
    listCart[$idProduct].quantity++;
  }
  document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
  addCartToHTML();
}
addCartToHTML();
function addCartToHTML(){
  // clear data default
  let listCartHTML = document.querySelector('.listCart');
  listCartHTML.innerHTML = '';
  let totalHTML = document.querySelector('.totalQuantity');
  let totalPriceHTML = document.querySelector('.totalPrice');
  let totalQuantity = 0;
  let totalPrice = 0;
  // if has product in cart
  if(listCart){
    listCart.forEach(product =>{
      if(product){
        let newCart = document.createElement('div');
        newCart.classList.add('item');
        newCart.innerHTML = 
        `
          <img src="${product.image}">
                <div class="content">
                    <div class="name">${product.name}</div>
                    <div class="price">$${product.price}</div>
                </div>
                <div class="quantity">
                    <button onclick="changeQuantity(${product.id}, '-')"><i class="fa-solid fa-minus"></i></button>
                    <span class="value">${product.quantity}</span>
                    <button onclick="changeQuantity(${product.id}, '+')"><i class="fa-solid fa-plus"></i></button>
                </div>
        `;
        listCartHTML.appendChild(newCart);
        totalQuantity = totalQuantity + product.quantity;
        totalPrice = totalPrice + (product.quantity * product.price);
      }
    })
  }
  totalHTML.innerText = totalQuantity;
  totalPriceHTML.innerText = totalPrice + '$';
}

$(document).ready(function() {
  const apiUrl = "http://localhost:3000/AllProducts/";

  // Handle the form submission for posting data
  $("#formPost").on("submit", function(e) {
    e.preventDefault();

    // Collect form data
    var id = $("#id").val();
    var type = $("#type").val();
    var name = $("#name").val();
    var pricediscount = $("#pricediscount").val(); // Use 'pricediscount' for discount
    var price = $("#price").val();
    var image = $("#image").val();

    // POST request to API
    $.ajax({
      url: apiUrl,
      dataType: "json",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ id, type, name, pricediscount, price, image }),
      success: function(response) {
        alert('Data posted successfully');
        
        // Clear form inputs
        $("#formPost")[0].reset();
        
        fetchAndDisplayProducts();  // Refresh product list
      },
      error: function(xhr) {
        console.error('Error posting data: ', xhr.responseText);
      }
    });
  });

  // Function to fetch and display products
  function fetchAndDisplayProducts() {
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        displayProducts(data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        alert('Error fetching data: ' + error.message);
      });
  }

  // Function to display products
  function displayProducts(products) {
    const row = $(".row");
    row.empty();  // Clear previous content

    products.forEach(product => {
      const productHtml = `
        <div class="col-md-3 mt-2">
          <div class="card p-3">
            <div class="product">
              <p>ID: ${product.id}</p>
              <img src="${product.image}" alt="Product Image" class="img-fluid">
              <p>Type: ${product.type}</p>
              <h2>${product.name}</h2>
              <p>Discount: ${product.pricediscount}</p> <!-- Display 'pricediscount' -->
              <p>Price: $${product.price}</p>
              <button class="btn btn-danger btnDelete" data-id="${product.id}">Delete</button>
              <button class="btn btn-danger btnEdit" data-bs-toggle="modal" data-bs-target="#editItemModal" data-id="${product.id}">Edit</button>
            </div>
          </div>
        </div>
      `;
      row.append(productHtml);
    });
  }

  // Initial load of products
  fetchAndDisplayProducts();

  // Function to switch between sections
  function showSection(targetId) {
    $(".container").hide();  // Hide all container sections
    $(targetId).show();      // Show the targeted section
  }

  // Handle navigation clicks
  $(".button-link").on("click", function(e) {
    e.preventDefault();
    var targetId = $(this).data("target");  // Get the target section ID from data attribute
    if (targetId) {
      showSection(targetId);  // Show the selected section
    }
  });

  // Initially show the home section
  showSection("#home");

  // Delete product
  $(document).on("click", ".btnDelete", function() {
    const id = $(this).data("id");

    $.ajax({
      url: `${apiUrl}${id}`,
      dataType: "json",
      type: 'DELETE',
      contentType: 'application/json',
      success: function(response) {
        alert("Deleted Successfully");
        fetchAndDisplayProducts();  // Refresh the product list
      },
      error: function(xhr) {
        console.error('Error deleting item: ', xhr.responseText);
        alert('Error deleting item: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
  });

  // Edit product - Fetch data and populate modal
  $(document).on('click', '.btnEdit', function() {
    const id = $(this).data("id");

    $.ajax({
      url: `${apiUrl}${id}`,
      dataType: "json",
      type: 'GET',
      success: function(response) {
        // Populate the form fields with the fetched data
        $("#editId").val(response.id);
        $("#editType").val(response.type);
        $("#editName").val(response.name);
        $("#editPricediscount").val(response.pricediscount); // Use 'pricediscount' for discount
        $("#editPrice").val(response.price);
        $("#editImage").val(response.image);
      },
      error: function(xhr) {
        console.error('Error fetching item details: ', xhr.responseText);
        alert('Error fetching item details: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
  });

  // Handle form submission for editing
  $("#formEdit").on("submit", function(e) {
    e.preventDefault();

    // Collect form data
    var id = $("#editId").val();
    var type = $("#editType").val();
    var name = $("#editName").val();
    var pricediscount = $("#editPricediscount").val(); // Use 'pricediscount' for discount
    var price = $("#editPrice").val();
    var image = $("#editImage").val();

    // PUT request to update product
    $.ajax({
      url: `${apiUrl}${id}`,
      dataType: "json",
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({ id, type, name, pricediscount, price, image }),
      success: function(response) {
        alert("Updated Successfully");
        $("#editItemModal").modal('hide');  // Hide the modal
        fetchAndDisplayProducts();  // Refresh the product list
      },
      error: function(xhr) {
        console.error('Error updating item: ', xhr.responseText);
        alert('Error updating item: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
  });
});
