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
  let listCartHTML = document.querySelector('.allpro');
  listCartHTML.innerHTML = '';
  let totalHTML = document.getElementById('totalQuantity');
  let totalPriceHTML = document.querySelector('.totalPriceAll');
  let totalQuantity=0;
  let totalPrice = 0;
  // if has product in cart
  if(listCart){
    listCart.forEach(product =>{
      if(product){
        let newCart = document.createElement('tr');
        newCart.classList.add('item');
        newCart.innerHTML = 
        `
           
              <tr>
                <td><img src="${product.image}" alt=""></td>
                <td class="name">${product.name}</td>
                <td class="price">$${product.price}</td>
                <td class="quantity">${product.quantity}</td>
                <td class="totalPrice">$${product.quantity * product.price}</td>
              </tr>
           
            
        `;
        listCartHTML.appendChild(newCart);
        totalQuantity = totalQuantity + product.quantity;
        totalPrice = totalPrice + (product.quantity * product.price);
        
      }
    })
  }
  totalHTML.innerText = totalQuantity;
  console.log(totalQuantity);
  totalPriceHTML.innerText = totalPrice + '$';
}