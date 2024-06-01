
import EcommerceDB from "./database.js";


const imageInput = document.getElementById('imageInput');
const addProduct = document.getElementById('addProduct');
const productName = document.getElementById('productName');
const productPrice = document.getElementById('productPrice');
let selectedImage


EcommerceDB.open()

imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  selectedImage = file
  // console.log('Selected file:', file);
});


addProduct.addEventListener('click', (event) => {
  var pName = productName.value
  var pPrice = productPrice.value
  if (pName == "" || pPrice == "" || selectedImage == null) {
  } else {
    EcommerceDB.uploadImageAndStoreProduct(selectedImage, pName, pPrice).then(() => {
      displayToast("Product Added Successfully")
      productName.value = ""
      productPrice.value = ""
    })

  }


});

const homeButton = document.getElementById('homeButton')
homeButton.addEventListener('click', () => {
  window.location.href = "index.html"
})

function displayToast(message) {
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
}



