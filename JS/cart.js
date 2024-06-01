import EcommerceDB from "./database.js";

const cartItemsContainer = document.getElementById('cartItems');

EcommerceDB.open()
  .then(() => {
    // console.log("DB opened successfully");
    return EcommerceDB.getAll();
  })
  .then((data) => {
    // console.log("Data fetched successfully:", data);
    displayCartItems(data);
  })
  .catch((error) => {
    console.log("Error:", error);
  });

function displayCartItems(fbData) {
  fbData.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('card', 'cart-item');
    cartItem.innerHTML = `
        <div class="card-body">
          <h3 class="card-title">${item.product}</h3>
          <p class="card-text">Price: $${item.totalPrice === 0 ? item.price : item.totalPrice}</p>
          <div class="item-actions">
            <button class="btn btn-danger decreaseQty">-</button>
            <span>${item.quantity}</span>
            <button class="btn btn-success increaseQty">+</button>
            <button class="btn btn-outline-secondary deleteItem">Delete</button>
          </div>
        </div>
      `;

    cartItemsContainer.appendChild(cartItem);
    cartItemsContainer.appendChild(document.createElement('hr'));

    const increaseBtn = cartItem.querySelector('.increaseQty');
    const decreaseBtn = cartItem.querySelector('.decreaseQty');
    const deleteBtn = cartItem.querySelector('.deleteItem');

    increaseBtn.addEventListener('click', () => {
      updateCartItem(cartItem, item.id, ++item.quantity, item.price);
    });

    decreaseBtn.addEventListener('click', () => {
      if (item.quantity > 1) {
        updateCartItem(cartItem, item.id, --item.quantity, item.price);
      }
    });

    deleteBtn.addEventListener('click', () => {
      EcommerceDB.delete(item.id);
      cartItem.remove();
    });
  });
}


function updateCartItem(cartItem, cartId, cartQuantity, cartPrice) {
  const quantityElement = cartItem.querySelector('span');
  const priceElement = cartItem.querySelector('.card-text');

  if (quantityElement && priceElement) {
    quantityElement.textContent = cartQuantity;
    const updatedPrice = cartPrice * cartQuantity;
    EcommerceDB.update(cartId, cartQuantity, updatedPrice);
    priceElement.textContent = `Price: $${updatedPrice.toFixed(2)}`;
  } else {
    console.error("Quantity or price element not found.");
  }
}

