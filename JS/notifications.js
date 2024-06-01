import EcommerceDB from "./database.js";

const cartBtn = document.getElementById('cartBtn');
const addToCartBtn = document.querySelectorAll('.addToCart');

addToCartBtn.addEventListener('click', () => {
    requestUserPermission();
  });

window.addEventListener('load', () => {
  checkUsersPermission();
});

if ('Notification' in window && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js', { scope: "/" })
    .then((registration) => {
      console.log('Service worker registered successfully');
    })
    .catch((error) => {
      console.log('Service worker registration failed:', error);
    });

  cartBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const product = productName; 
    const price = productPrice;

    if (product === '') {
      return;
    } else {
      const options = {
        body: price || '',
        actions: [
          { action: 'agree', title: 'Agree' },
          { action: 'disagree', title: 'Disagree' },
        ],
      };
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('Cart Updated', options);
      });
    }
    productName = "";
    productPrice = "";
  });
} else {
  console.log("Service worker not supported");
  cartBtn.hidden = false;
}

function requestUserPermission() {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      cartBtn.hidden = false;
    } else {
      notificationNotAllowed();
    }
  });
}

function checkUsersPermission() {
  switch (Notification.permission) {
    case "granted":
      cartBtn.hidden = false;
      break;
    case "denied":
      cartBtn.hidden = true;
      notificationNotAllowed();
      break;
    default:
      cartBtn.hidden = true;
  }
}

function notificationNotAllowed() {
  // Handle the case where notifications are not allowed
}

navigator.serviceWorker.addEventListener('message', function (event) {
  if (event.data.type === 'notification') {
    showMessage(event.data.message);
  }
});

EcommerceDB.open().then(() => {
}).catch((error) => {
  console.log(error);
});

cartBtn.addEventListener('click', () => {
  window.location.href = 'cart.html';
  const options = {
    body: 'You clicked the cart button',
    actions: [
      { action: 'view-cart', title: 'View Cart' }
    ],
  };
  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification('Cart Button Clicked', options);
  });
});


