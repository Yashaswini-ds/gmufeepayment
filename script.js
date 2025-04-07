// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Set up receipt download functionality
    setupReceiptDownload();
    
    // Set up payment handling
    setupPaymentHandling();
    
    // Just for demonstration - showing a toast message
    setTimeout(() => {
        showToast("Welcome to GMU Fee Payment System!");
    }, 2000);
});

// Function to initialize animations
function initAnimations() {
    // Animate elements when they come into view
    const animatedElements = document.querySelectorAll('.card, .announcement');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        observer.observe(element);
    });
}

// Function to set up receipt download functionality
function setupReceiptDownload() {
    const downloadButtons = document.querySelectorAll('.download-receipt');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const transactionId = this.getAttribute('data-id');
            downloadReceipt(transactionId);
        });
    });
}

// Function to download a receipt
function downloadReceipt(transactionId) {
    // In a real application, this would make an AJAX request to get receipt data
    // For now, we'll create a basic receipt with HTML and download it
    
    // Get transaction details from the table (in a real app, this would come from the server)
    let transactionData = getTransactionDetails(transactionId);
    
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
                        <td>${transactionData.date}</td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td>${transactionData.description}</td>
                    </tr>
                    <tr>
                        <th>Amount Paid</th>
                        <td>${transactionData.amount}</td>
                    </tr>
                    <tr>
                        <th>Payment Method</th>
                        <td>Online Banking</td>
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
    showToast(`Receipt for ${transactionId} downloaded successfully!`);
}

// Helper function to get transaction details from the table
function getTransactionDetails(transactionId) {
    // Find the row with this transaction ID
    const rows = document.querySelectorAll('table tbody tr');
    for (const row of rows) {
        if (row.cells[0].textContent === transactionId) {
            return {
                date: row.cells[1].textContent,
                description: row.cells[2].textContent,
                amount: row.cells[3].textContent,
                status: row.cells[4].textContent
            };
        }
    }
    return {
        date: "Unknown",
        description: "Unknown",
        amount: "Unknown",
        status: "Unknown"
    };
}

// Function to set up payment handling
function setupPaymentHandling() {
    const payNowButtons = document.querySelectorAll('.pay-now');
    
    payNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real application, this would redirect to a payment gateway
            // For now, we'll just show a message
            window.location.href = "payment.html";
        });
    });
}

// Function to show toast notification
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Style the toast
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'var(--maroon)',
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
