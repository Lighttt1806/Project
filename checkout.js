
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

addCartToHTML();
function addCartToHTML(){
  // clear data default
  let listCartHTML = document.querySelector('.list');
  listCartHTML.innerHTML = '';
  let totalHTML = document.querySelector('.totalQuantity');
  let totalPriceHTML = document.querySelector('.totalPriceAll');
  let totalQuantity=0;
  let totalPrice = 0;
  // if has product in cart
  if(listCart){
    listCart.forEach(product =>{
      if(product){
        let newCart = document.createElement('div');
        newCart.classList.add('item');
        newCart.innerHTML = 
        `           
            
            <div class="content d-flex justify-content-between">
                    <div class="name w-50">${product.name}</div>
                    <div class="quantity">
                    
                      <span class="value w-25">${product.quantity}</span>
                    
                    </div>
                    <p class="totalPrice w-25 text-end">$${product.quantity * product.price}</p>
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