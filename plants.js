
function updatePriceValue(value){
document.getElementById('priceValue').textContent = value;
}

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

let products = null;
fetch('index.json')
.then(re => re.json())
.then(data => {products = 
  // data.AllProducts.filter(product => product.id >= 1 && product.id <= 8);
  data.AllProducts.filter(product => product.type === "Plants");
  AddProductsToHTML();
});
function AddProductsToHTML(){
  let listProduct = document.querySelector('.listProduct');
  listProduct.innerHTML = '';
  products.map(e=>{
    let newProduct = document.createElement('div');
    newProduct.classList.add('item');
    newProduct.innerHTML +=
    `
     <img src="${e.image}" alt="">
     <p>${e.type}</p>
     <h5>${e.name}</h5>
     <i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i>
     <div class="d-flex">
      <p><strike style="color: gray;">$${e.pricediscount}</strike></p>
      <p class="price mx-3">$${e.price}</p>
     </div>
     <button onclick="addCart(${e.id})"><i class="fa-solid fa-bag-shopping"></i></button>
    `;
    listProduct.appendChild(newProduct);
  });
}

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
function changeQuantity($id, $type){
  switch ($type) {
    case '+':{
      listCart[$id].quantity++;
    }break;
    case '-':{
      listCart[$id].quantity--;
      if(listCart[$id].quantity <=0){
        delete listCart[$id];
      }
    }break;
  }
  document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
  addCartToHTML();
}