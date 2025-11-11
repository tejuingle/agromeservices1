document.addEventListener('DOMContentLoaded', () => {
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));

    if (!orderDetails) {
        window.location.href = 'index.html';  // If no order data found, redirect back to home
        return;
    }

    const confirmationMessage = document.getElementById('confirmation-message');
    const orderSummary = document.getElementById('order-summary');

    // Display confirmation message
    confirmationMessage.innerHTML = `<h2>Thank you for your order!</h2><p>Your order has been successfully placed.</p>`;

    // Display order details
    let orderHTML = `
        <h3>Order Summary</h3>
        <p><strong>Date:</strong> ${new Date(orderDetails.date).toLocaleString()}</p>
        <p><strong>Subtotal:</strong> ₹${orderDetails.subtotal}</p>
        <p><strong>Shipping:</strong> ₹${orderDetails.shipping}</p>
        <p><strong>Tax:</strong> ₹${orderDetails.tax}</p>
        <p><strong>Total:</strong> ₹${orderDetails.total}</p>
    `;
    
    orderSummary.innerHTML = orderHTML;

    // Optionally, clear order data after showing confirmation
    localStorage.removeItem('orderDetails');
});
