document.addEventListener('DOMContentLoaded', function() {
    // Handle payment method selection
    setupPaymentMethodToggle();
    
    // Handle form submission
    setupFormSubmission();
    
    // Animate form appearance
    initAnimations();
});

// Function to handle payment method toggle
function setupPaymentMethodToggle() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const netBankingFields = document.getElementById('netBankingFields');
    const cardFields = document.getElementById('cardFields');
    const upiFields = document.getElementById('upiFields');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Hide all fields first
            netBankingFields.style.display = 'none';
            cardFields.style.display = 'none';
            upiFields.style.display = 'none';
            
            // Show relevant fields based on selection
            switch(this.value) {
                case 'netBanking':
                    netBankingFields.style.display = 'block';
                    break;
                case 'card':
                    cardFields.style.display = 'block';
                    break;
                case 'upi':
                    upiFields.style.display = 'block';
                    break;
            }
        });
    });
}

// Function to handle form submission
function setupFormSubmission() {
    const paymentForm = document.getElementById('paymentForm');
    
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get the selected payment method
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        
        // Validate form fields based on payment method
        if (validateForm(paymentMethod)) {
            // Show processing message
            showToast('Processing your payment...');
            
            // Simulate payment processing
            setTimeout(() => {
                // Create a mock payment receipt
                const transactionId = `TXN${Math.floor(Math.random() * 1000000)}`;
                createPaymentSuccess(transactionId);
            }, 2000);
        }
    });
}

// Function to validate form fields
function validateForm(paymentMethod) {
    let isValid = true;
    const termsCheck = document.getElementById('termsCheck');
    
    // Check terms acceptance
    if (!termsCheck.checked) {
        showToast('Please accept the terms and conditions', 'error');
        isValid = false;
    }
    
    // Validate specific payment method fields
    switch(paymentMethod) {
        case 'netBanking':
            const bankName = document.getElementById('bankName');
            if (!bankName.value) {
                showToast('Please select a bank', 'error');
                isValid = false;
            }
            break;
            
        case 'card':
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            const nameOnCard = document.getElementById('nameOnCard').value;
            
            if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
                showToast('Please enter a valid 16-digit card number', 'error');
                isValid = false;
            }
            
            if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
                showToast('Please enter a valid expiry date (MM/YY)', 'error');
                isValid = false;
            }
            
            if (!cvv || !/^\d{3}$/.test(cvv)) {
                showToast('Please enter a valid 3-digit CVV', 'error');
                isValid = false;
            }
            
            if (!nameOnCard) {
                showToast('Please enter the name on your card', 'error');
                isValid = false;
            }
            break;
            
        case 'upi':
            const upiId = document.getElementById('upiId').value;
            if (!upiId || !upiId.includes('@')) {
                showToast('Please enter a valid UPI ID', 'error');
                isValid = false;
            }
            break;
    }
    
    return isValid;
}

// Function to handle successful payment
function createPaymentSuccess(transactionId) {
    // Create success message HTML
    const successHTML = `
    <div class="payment-success">
        <div class="success-icon">✓</div>
        <h2>Payment Successful!</h2>
        <p>Your transaction ID: <strong>${transactionId}</strong></p>
        <p>Amount: <strong>₹45,000</strong></p>
        <p>Date: <strong>${new Date().toLocaleDateString()}</strong></p>
        <p>A receipt has been sent to your registered email.</p>
        <div class="action-buttons">
            <button id="downloadReceiptBtn" class="btn btn-primary">Download Receipt</button>
            <a href="index.html" class="btn btn-secondary">Back to Dashboard</a>
        </div>
    </div>
    `;
    
    // Replace the form with the success message
    const formContainer = document.querySelector('.form-container');
    formContainer.innerHTML = successHTML;
    
    // Add event listener to the download button
    document.getElementById('downloadReceiptBtn').addEventListener('click', function() {
        downloadReceipt(transactionId);
    });
    
    // Show toast notification
    showToast('Payment successful!');
}

// Function to download a receipt
function downloadReceipt(transactionId) {
    // Generate receipt HTML
    const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Payment Receipt - ${transactionId}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            .receipt {
                border: 1px solid #ddd;
                padding: 20px;
                margin-top: 20px;
            }
            .receipt-header {
                text-align: center;
                border-bottom: 2px solid #800000;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .receipt-details {
                margin-bottom: 20px;
            }
            .receipt-details table {
                width: 100%;
                border-collapse: collapse;
            }
            .receipt-details th, .receipt-details td {
                padding: 8px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            .receipt-footer {
                margin-top: 30px;
                text-align: center;
                font-size: 0.9em;
                color: #777;
            }
            .stamp {
                color: #800000;
                border: 2px solid #800000;
                border-radius: 50%;
                transform: rotate(-15deg);
                width: 100px;
                height: 100px;
                margin: 20px auto;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="receipt">
            <div class="receipt-header">
                <h2>GMU University</h2>
                <h3>Payment Receipt</h3>
                <p>Transaction ID: ${transactionId}</p>
            </div>
            
            <div class="receipt-details">
                <table>
                    <tr>
                        <th>Student Name</th>
                        <td>Rahul Sharma</td>
                    </tr>
                    <tr>
                        <th>Student ID</th>
                        <td>GMU2023456</td>
                    </tr>
                    <tr>
                        <th>Payment Date</th>
                        <td>${new Date().toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td>Tuition Fee - Spring Semester</td>
                    </tr>
                    <tr>
                        <th>Amount Paid</th>
                        <td>₹45,000</td>
                    </tr>
                    <tr>
                        <th>Payment Method</th>
                        <td>${document.querySelector('input[name="paymentMethod"]:checked').value === 'netBanking' ? 'Net Banking' : 
                            document.querySelector('input[name="paymentMethod"]:checked').value === 'card' ? 'Debit/Credit Card' : 'UPI'}</td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td>Completed</td>
                    </tr>
                </table>
            </div>
            
            <div class="stamp">PAID</div>
            
            <div class="receipt-footer">
                <p>This is a computer-generated receipt and does not require a signature.</p>
                <p>For any queries, please contact the Finance Department at fees@gmu.ac.in</p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    // Create a Blob and download the receipt
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt-${transactionId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    showToast('Receipt downloaded successfully!');
}

// Function to initialize animations
function initAnimations() {
    const formContainer = document.querySelector('.form-container');
    formContainer.classList.add('animated');
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .form-container {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .form-container.animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        .payment-success {
            text-align: center;
            padding: 30px;
            animation: fadeIn 0.5s ease;
        }
        
        .success-icon {
            width: 80px;
            height: 80px;
            background-color: var(--success);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            margin: 0 auto 20px;
            animation: scaleIn 0.5s ease;
        }
        
        .action-buttons {
            margin-top: 20px;
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        
        @keyframes scaleIn {
            from {
                transform: scale(0);
            }
            to {
                transform: scale(1);
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Function to show toast notification
function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Style the toast
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: type === 'success' ? 'var(--success)' : 'var(--danger)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: 'var(--border-radius)',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
        zIndex: '9999',
        transition: 'all 0.5s ease',
        opacity: '0',
        transform: 'translateY(20px)'
    });
    
    // Add to document
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 500);
    }, 5000);
}

// Enhance form styles
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .payment-form {
            padding: 60px 0;
        }
        
        .form-container {
            background-color: var(--white);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            display: flex;
            flex-wrap: wrap;
            overflow: hidden;
        }
        
        .payment-summary {
            flex: 1;
            min-width: 300px;
            background-color: var(--maroon);
            color: var(--white);
            padding: 30px;
        }
        
        .payment-summary h2 {
            margin-bottom: 30px;
            color: var(--gold);
        }
        
        .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 15px 0;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        
        .payment-details {
            flex: 2;
            min-width: 400px;
            padding: 30px;
        }
        
        .payment-details h2 {
            color: var(--maroon);
            margin-bottom: 30px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
        }
        
        .form-control {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: var(--border-radius);
        }
        
        .form-row {
            display: flex;
            gap: 15px;
        }
        
        .form-group.half {
            flex: 1;
        }
        
        .payment-methods {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        .payment-method {
            flex: 1;
            min-width: 120px;
            background-color: var(--light-gray);
            border-radius: var(--border-radius);
            padding: 15px;
            text-align: center;
            cursor: pointer;
            transition: var(--transition);
        }
        
        .payment-method:hover {
            background-color: rgba(212, 175, 55, 0.1);
        }
        
        .payment-method input[type="radio"] {
            margin-right: 5px;
        }
        
        .btn-block {
            width: 100%;
        }
        
        .terms-checkbox {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .terms-checkbox input {
            width: auto;
        }
        
        .page-header {
            background: linear-gradient(rgba(128, 0, 0, 0.8), rgba(101, 67, 33, 0.9)), url('https://source.unsplash.com/random/1600x400/?university') center/cover no-repeat;
            color: var(--white);
            padding: 60px 0;
            text-align: center;
        }
        
        .page-header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        @media (max-width: 768px) {
            .form-container {
                flex-direction: column;
            }
            
            .payment-summary,
            .payment-details {
                min-width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
});
