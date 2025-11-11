import { products } from './data1/data.js';

// Price calculations
const calculateDiscountedPrice = (original, discount) => 
  Math.round(original - (original * discount / 100));

// Initialize product sections
const initProductSection = (containerId, productList) => {
  const container = document.getElementById(containerId);
  
  // Check if container exists
  if (!container) {
    console.error(`Container with ID ${containerId} not found`);
    return;
  }
  
  // Check if products are available
  if (!productList || productList.length === 0) {
    container.innerHTML = '<p class="no-products">No products available</p>';
    return;
  }
  
  container.innerHTML = productList.map(createProductCard).join('');
  
  // Add hover effects after DOM is loaded
  addHoverEffects(containerId);
};

// Product card template
const createProductCard = (product) => {
  const discountedPrice = calculateDiscountedPrice(
    product.originalPrice,
    product.discountPercentage
  );

  return `
    <div class="product-card">
      <a href="product.html?id=${product.id}" class="product-link">
        <div class="product-image-container">
          <img src="${product.imageSrc}" alt="${product.name}" class="product-image">
          ${product.discountPercentage > 0 ? 
            `<span class="discount-badge">${product.discountPercentage}% OFF</span>` : ''}
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <div class="price-container">
            <span class="current-price">₹${discountedPrice}</span>
            ${product.discountPercentage > 0 ? 
              `<span class="original-price">₹${product.originalPrice}</span>` : ''}
          </div>
        </div>
      </a>
      <button class="quick-view-btn" data-id="${product.id}">
        <i class="fas fa-eye"></i> Quick View
      </button>
    </div>
  `;
};

// Add hover effects to product cards
const addHoverEffects = (containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const productCards = container.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const quickViewBtn = card.querySelector('.quick-view-btn');
    if (!quickViewBtn) return;
    
    card.addEventListener('mouseenter', () => {
      quickViewBtn.style.opacity = '1';
      quickViewBtn.style.transform = 'translateY(0)';
    });
    
    card.addEventListener('mouseleave', () => {
      quickViewBtn.style.opacity = '0';
      quickViewBtn.style.transform = 'translateY(20px)';
    });
  });
};

// Initialize quick view functionality
const initQuickView = () => {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.quick-view-btn')) {
      const productId = e.target.closest('.quick-view-btn').dataset.id;
      // Here you can implement your quick view modal logic
      console.log(`Quick view for product ${productId}`);
      // For now, just redirect to product page
      window.location.href = `product.html?id=${productId}`;
    }
  });
};

// Function to check if products are loaded correctly
const checkProducts = () => {
  console.log('Loaded products:', products);
  if (!products || products.length === 0) {
    console.error('No products loaded - check data file and import path');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // First verify products are loaded
  checkProducts();
  
  // Initialize product sections
  initProductSection('featured-products-container', 
    products.filter(p => p.featured).slice(0, 8));
  
  initProductSection('best-selling-container', 
    [...products].sort((a, b) => b.sales - a.sales).slice(0, 8));
  
  initProductSection('all-products-container', 
    products.slice(0, 12));
  
  // Initialize quick view
  initQuickView();
});