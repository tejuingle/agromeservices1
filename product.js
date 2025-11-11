import { products } from './data1/data.js';

// Cart functionality
class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
    this.taxRate = 0.05; // 5% tax
  }

  addItem(product, quantity, packSize) {
    const existingItemIndex = this.items.findIndex(
      item => item.id === product.id && item.packSize === packSize
    );

    if (existingItemIndex >= 0) {
      this.items[existingItemIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        imageSrc: product.imageSrc,
        price: calculateDiscountedPrice(product.originalPrice, product.discountPercentage),
        quantity,
        packSize
      });
    }

    this.saveToLocalStorage();
    this.updateCartUI();
    this.updateHeaderCartCount();
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.saveToLocalStorage();
    this.updateCartUI();
    this.updateHeaderCartCount();
  }

  updateQuantity(index, newQuantity) {
    if (newQuantity > 0) {
      this.items[index].quantity = newQuantity;
      this.saveToLocalStorage();
      this.updateCartUI();
      this.updateHeaderCartCount();
    }
  }

  calculateSubtotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  calculateTax() {
    return this.calculateSubtotal() * this.taxRate;
  }

  calculateTotal() {
    return this.calculateSubtotal() + this.calculateTax();
  }

  saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTax = document.getElementById('cart-tax');
    const cartTotal = document.getElementById('cart-total');

    if (this.items.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      cartSubtotal.textContent = '₹0.00';
      cartTax.textContent = '₹0.00';
      cartTotal.textContent = '₹0.00';
      return;
    }

    cartItemsContainer.innerHTML = this.items.map((item, index) => `
      <div class="cart-item">
        <img src="${item.imageSrc}" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>Pack Size: ${item.packSize}</p>
          <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn minus" data-index="${index}">-</button>
            <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-index="${index}">
            <button class="quantity-btn plus" data-index="${index}">+</button>
          </div>
        </div>
        <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
      </div>
    `).join('');

    cartSubtotal.textContent = `₹${this.calculateSubtotal().toFixed(2)}`;
    cartTax.textContent = `₹${this.calculateTax().toFixed(2)}`;
    cartTotal.textContent = `₹${this.calculateTotal().toFixed(2)}`;

    // Update delivery date
    this.updateDeliveryDate();
  }

  updateDeliveryDate() {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3); // 3 days from today
    
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('delivery-date').textContent = 
      deliveryDate.toLocaleDateString('en-US', options);
  }

  updateHeaderCartCount() {
    if (typeof updateCartCount === 'function') {
      updateCartCount();
    }
  }
}

// Initialize cart
const cart = new Cart();

// DOM Elements
const productMainImage = document.getElementById('product-main-image');
const productName = document.getElementById('product-name');
const originalPrice = document.getElementById('original-price');
const discountedPrice = document.getElementById('discounted-price');
const discountPercent = document.getElementById('discount-percent');
const productBrand = document.getElementById('product-brand');
const productCategory = document.getElementById('product-category');
const productDescription = document.getElementById('product-description');
const relatedProductsContainer = document.getElementById('related-products');
const addToCartButton = document.getElementById('add-to-cart');
const buyNowButton = document.getElementById('buy-now');
const quantityInput = document.getElementById('quantity');
const packSizeSelect = document.getElementById('pack-size');
const toggleDescriptionBtn = document.querySelector('.toggle-description-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartButton = document.getElementById('close-cart');
const checkoutButton = document.getElementById('checkout-btn');

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Current product object
let currentProduct = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Find the product in the data
    currentProduct = products.find(product => product.id === productId);
    
    if (currentProduct) {
        displayProductDetails();
        displayRelatedProducts();
    } else {
        // Handle case where product isn't found
        window.location.href = '404.html'; // Redirect or show error
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Update cart UI initially
    cart.updateCartUI();
});

// Display product details
function displayProductDetails() {
    const discountedPriceValue = calculateDiscountedPrice(
        currentProduct.originalPrice,
        currentProduct.discountPercentage
    );
    
    productMainImage.src = currentProduct.imageSrc;
    productMainImage.alt = currentProduct.name;
    productName.textContent = currentProduct.name;
    originalPrice.textContent = `₹${currentProduct.originalPrice.toFixed(2)}`;
    discountedPrice.textContent = `₹${discountedPriceValue.toFixed(2)}`;
    discountPercent.textContent = `${currentProduct.discountPercentage}% OFF`;
    productBrand.textContent = currentProduct.brandName;
    productCategory.textContent = currentProduct.category;
    productDescription.textContent = currentProduct.description || 'No description available';
}

// Display related products
function displayRelatedProducts() {
    // Get products from same category (excluding current product)
    const relatedProducts = products.filter(product => 
        product.category === currentProduct.category && 
        product.id !== currentProduct.id
    ).slice(0, 4); // Limit to 4 products
    
    if (relatedProducts.length === 0) {
        // If no related products, show some random products
        const randomProducts = [...products]
            .filter(p => p.id !== currentProduct.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
        
        renderRelatedProducts(randomProducts);
    } else {
        renderRelatedProducts(relatedProducts);
    }
}

// Render related products HTML
function renderRelatedProducts(products) {
    relatedProductsContainer.innerHTML = products.map(product => {
        const discountedPrice = calculateDiscountedPrice(
            product.originalPrice,
            product.discountPercentage
        );
        
        return `
            <div class="related-product-card" data-id="${product.id}">
                <img src="${product.imageSrc}" alt="${product.name}">
                <h4>${product.name}</h4>
                <div class="price">₹${discountedPrice.toFixed(2)}</div>
                <button class="view-product-btn">View Product</button>
            </div>
        `;
    }).join('');
    
    // Add click event to related products
    document.querySelectorAll('.related-product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking the button
            if (e.target.classList.contains('view-product-btn')) return;
            
            const productId = card.getAttribute('data-id');
            window.location.href = `product.html?id=${productId}`;
        });
    });
    
    // Add click event to view product buttons
    document.querySelectorAll('.view-product-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.closest('.related-product-card').getAttribute('data-id');
            window.location.href = `product.html?id=${productId}`;
        });
    });
}

// Calculate discounted price
function calculateDiscountedPrice(originalPrice, discountPercentage) {
    return originalPrice - (originalPrice * discountPercentage / 100);
}

// Setup event listeners
function setupEventListeners() {
    // Toggle description
    toggleDescriptionBtn.addEventListener('click', () => {
        productDescription.classList.toggle('expanded');
        toggleDescriptionBtn.textContent = 
            productDescription.classList.contains('expanded') ? 
            'Read Less' : 'Read More';
    });
    
    // Add to cart
    addToCartButton.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        const packSize = packSizeSelect.value;
        
        cart.addItem(currentProduct, quantity, packSize);
        
        // Show cart sidebar
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        
        // Show confirmation
        showNotification(`${quantity} ${packSize} pack(s) of ${currentProduct.name} added to cart!`);
    });
    
    // Buy now
    buyNowButton.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        const packSize = packSizeSelect.value;
        
        cart.addItem(currentProduct, quantity, packSize);
        window.location.href = 'checkout.html';
    });
    
    // Quantity validation
    quantityInput.addEventListener('change', () => {
        if (quantityInput.value < 1) {
            quantityInput.value = 1;
        }
    });
    
    // Cart sidebar events
    closeCartButton.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    
    cartOverlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    
    // Cart item events (delegated)
    document.addEventListener('click', (e) => {
        // Remove item
        if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
            const index = e.target.getAttribute('data-index') || 
                          e.target.closest('.remove-item').getAttribute('data-index');
            cart.removeItem(parseInt(index));
        }
        
        // Decrease quantity
        if (e.target.classList.contains('minus')) {
            const index = e.target.getAttribute('data-index');
            const input = document.querySelector(`.quantity-input[data-index="${index}"]`);
            const newQuantity = parseInt(input.value) - 1;
            if (newQuantity > 0) {
                input.value = newQuantity;
                cart.updateQuantity(parseInt(index), newQuantity);
            }
        }
        
        // Increase quantity
        if (e.target.classList.contains('plus')) {
            const index = e.target.getAttribute('data-index');
            const input = document.querySelector(`.quantity-input[data-index="${index}"]`);
            const newQuantity = parseInt(input.value) + 1;
            input.value = newQuantity;
            cart.updateQuantity(parseInt(index), newQuantity);
        }
    });
    
    // Quantity input changes
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const index = e.target.getAttribute('data-index');
            const newQuantity = parseInt(e.target.value);
            if (newQuantity > 0) {
                cart.updateQuantity(parseInt(index), newQuantity);
            } else {
                e.target.value = 1;
            }
        }
    });
    
    // Checkout button
    checkoutButton.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}