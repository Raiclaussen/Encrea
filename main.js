// Variables en general

const productsContainer = document.getElementById('products');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Eventos

productsContainer.addEventListener('click', addToCart);
checkoutBtn.addEventListener('click', processPayment);

// Obtener Productos Json

fetch('productos.json')
  .then(response => response.json())
  .then(products => {
    displayProducts(products);
  })
  .catch(error => {
    console.error('Error al cargar los productos:', error);
  });

// Función para mostrar los productos en el DOM

function displayProducts(products) {
  products.forEach(product => {
    const productElement = createProductElement(product);
    productsContainer.appendChild(productElement);
  });
}

// Función para crear un elemento de producto
function createProductElement(product) {
  const productElement = document.createElement('div');
  productElement.classList.add('product');

  const productName = document.createElement('h2');
  productName.textContent = product.name;

  const productPrice = document.createElement('p');
  productPrice.textContent = `Precio: $${product.price.toFixed(2)}`;

  const addToCartBtn = document.createElement('button');
  addToCartBtn.textContent = 'Agregar al carrito';

  productElement.appendChild(productName);
  productElement.appendChild(productPrice);
  productElement.appendChild(addToCartBtn);

  return productElement;
}

// Función para agregar un producto al carrito

function addToCart(event) {
    if (event.target.tagName === 'BUTTON') {
      const product = event.target.parentElement;
      const productName = product.querySelector('h2').textContent;
      const productPrice = parseFloat(product.querySelector('p').textContent.replace('Precio: $', ''));
  
      const cartItem = document.createElement('li');
      cartItem.textContent = `${productName} - $${productPrice.toFixed(2)}`;
      cartItems.appendChild(cartItem);
  
      updateCartTotal(productPrice);
  
      // Agregar la alerta
      alert(`¡Producto agregado al carrito! ${productName} - $${productPrice.toFixed(2)}`);
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      });
      
      swalWithBootstrapButtons.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, agregar producto',
        cancelButtonText: 'No, agregar producto',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            '¡Eliminado!',
            'Tu producto ha sido eliminado.',
            'success'
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'Tu producto está en el carrito',
            'error'
          );
        }
      });
      
    }
  }




// Función para actualizar el total del carrito
function updateCartTotal(price) {
  const currentTotal = parseFloat(cartTotal.textContent.replace('$', ''));
  const newTotal = currentTotal + price;
  cartTotal.textContent = `$${newTotal.toFixed(2)}`;
}

// Función para procesar el pago

function processPayment() {
    const cartItemsCount = cartItems.childElementCount;
    const cartTotalAmount = parseFloat(cartTotal.textContent.replace('$', ''));
  
    if (cartItemsCount > 0) {
      Swal.fire({
        title: '¡Pago procesado!',
        text: `Total: $${cartTotalAmount.toFixed(2)}`,
        icon: 'success'
      }).then(() => {
        clearCart();
      });
    } else {
      Swal.fire('El carrito está vacío', 'No se puede procesar el pago.', 'error');
    }
  }
  

// Función para vaciar el carrito
function clearCart() {
  cartItems.innerHTML = '';
  cartTotal.textContent = '$0.00';
}
