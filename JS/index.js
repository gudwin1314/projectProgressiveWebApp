import EcommerceDB from "./database.js";


window.addEventListener('load', () => {
  checkUserPermission();
})

const cartBtn = document.getElementById('cartBtn')

let productBtn = document.getElementById('productBtn')
productBtn.addEventListener('click', () => {
  getGeolocation()
  window.location.href = 'admin.html';
});


EcommerceDB.open()
  .then(() => {
    return EcommerceDB.getAllProducts().then((products) => {
      // console.log("These are products", products)
      displayProducts(products)
    });
  })
  .then((data) => {
    // console.log("Data fetched successfully:", data);
    // displayCartItems(data);
  })
  .catch((error) => {
    console.log("Error:", error);
  });

function displayProducts(products) {
  const mainElement = document.querySelector('main');
  mainElement.innerHTML = '';

  products.forEach(product => {
    const productElement = createProductElement(product);
    mainElement.appendChild(productElement);
  });
}

function createProductElement(product) {
  const productDiv = document.createElement('div');
  productDiv.classList.add('product');

  const img = document.createElement('img');
  img.src = product.imageUrl;
  img.alt = product.name;

  const h2 = document.createElement('h2');
  h2.textContent = product.productName;

  const p = document.createElement('p');
  p.textContent = `$${product.productPrice}`;

  const addToCartBtn = document.createElement('button');
  addToCartBtn.classList.add('addToCart');
  addToCartBtn.textContent = 'Add to Cart';

  addToCartBtn.addEventListener('click', () => {
    requestUserPermission();
    addDataToCart(product.productName, product.productPrice, product.imageUrl);
    displayToast('Added to Cart');

  });

  productDiv.appendChild(img);
  productDiv.appendChild(h2);
  productDiv.appendChild(p);
  productDiv.appendChild(addToCartBtn);

  return productDiv;
}

function addDataToCart(productName, productPrice, productImage) {
  EcommerceDB.add(productName, productPrice, productImage)
}

function displayToast(message) {
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.textContent = message;

  document.body.appendChild(toast);
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
}



if ('Notification' in window && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js', { scope: "/" })
    .then((registration) => {
      // console.log('Service worker registered successfully');
    }).catch((error) => {
      console.log('Service worker registaration failed: ', error)
    })
  cartBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const product = product.productName;
    const price = product.productPrice;

    if (product ==='') {
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
      })
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
    if (permission == 'granted') {
      cartBtn.hidden = false
    } else {
      notificationNotAllowed()
    }
  })
}

function checkUserPermission() {
  switch (Notification.permission) {
    case "granted":
      cartBtn.hidden = false;
      break;
    case "denied":
      cartBtn.hidden = true;
      notificationNotAllowed()
      break;
     
     default:
      cartBtn.hidden=true 
  }
}

navigator.serviceWorker.addEventListener('message',function(event){
    if(event.data.type==='notification'){
      showMessage(event.data.message);
    }
})

cartBtn.addEventListener('click', () => {
  window.location.href = 'cart.html';

  const options={
    body: 'You clicked the cart Button',
    actions:[
      {action:'view-cart',title:'View Cart'}
    ],
  };
  navigator.serviceWorker.ready.then((registration)=>{
    registration.showNotification('Cart button clicked',options);
  })
});


navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

function successCallback(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
}
function errorCallback(error) {
  console.log(`Error getting location: ${error.message}`);
}

function getGeolocation() {
  if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'granted') {
              navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
          } else if (result.state === 'prompt') {
              navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
          } else if (result.state === 'denied') {
              console.log('Geolocation permission denied.');
          }
      });
  } else {
      console.log('Geolocation is not supported by your browser.');
  }
}
