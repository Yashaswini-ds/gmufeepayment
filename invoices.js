document.addEventListener('DOMContentLoaded', function() {
    // Initialize functionality
    initSearchAndFilters();
    setupInvoiceDownload();
    setupReceiptDownload();
    setupPaymentButtons();
    initShowMoreButton();
    initAnimations();
});

// Function for search and filters
function initSearchAndFilters() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const statusFilter = document.getElementById('statusFilter');
    const semesterFilter = document.getElementById('semesterFilter');
    const invoiceCards = document.querySelectorAll('.invoice-card');
    const noResults = document.getElementById('noResults');
    
    // Search functionality
    searchBtn.addEventListener('click', filterInvoices);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterInvoices();
        }
    });
    
    // Filter change events
    statusFilter.addEventListener('change', filterInvoices);
    semesterFilter.addEventListener('change', filterInvoices);
    
    function filterInvoices() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;
        const semesterValue = semesterFilter.value;
        
        let visibleCount = 0;
        
        invoiceCards.forEach(card => {
            const invoiceId = card.querySelector('.invoice-id').textContent.toLowerCase();
            const description = card.querySelector('h3').textContent.toLowerCase();
            const status = card.getAttribute('data-status');
            const semester = card.getAttribute('data-semester');
            
            let showCard = true;
            
            // Check search term
            if (searchTerm && !invoiceId.includes(searchTerm) && !description.includes(searchTerm)) {
                showCard = false;
            }
            
            // Check status filter
            if (statusValue !== 'all' && status !== statusValue) {
                showCard = false;
            }
            
            // Check semester filter
            if (semesterValue !== 'all' && semester !== semesterValue) {
                showCard = false;
            }
            
            // Show or hide card
            if (showCard) {
                card.style.display = '';
                visibleCount++;
                
                // Add animation
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, visibleCount * 100);
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show or hide "no results" message
        if (visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
        
        // Hide or show "Show More" button
        const showMoreBtn = document.getElementById('showMoreBtn');
        if (visibleCount <= 6) {
            showMoreBtn.style.display = 'none';
        } else {
            showMoreBtn.style.display = 'block';
        }
        
        // Show toast with results
        showToast(`Found ${visibleCount} matching invoices`);
    }
}

// Function to set up invoice download functionality
function setupInvoiceDownload() {
    const downloadButtons = document.querySelectorAll('.download-invoice');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const invoiceId = this.getAttribute('data-id');
            downloadInvoice(invoiceId);
        });
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

// Function to download an invoice
function downloadInvoice(invoiceId) {
    // Get invoice details from the card
    let invoiceData = getInvoiceDetails(invoiceId);
    
    // Generate invoice HTML
    const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Invoice - ${invoiceId}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            .invoice {
                border: 1px solid #ddd;
                padding: 20px;
                margin-top: 20px;
            }
            .invoice-header {
                text-align: center;
                border-bottom: 2px solid #800000;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .invoice-header h2 {
                color: #800000;
            }
            .billing-details {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
            }
            .billing-details div {
                width: 48%;
            }
            .invoice-items {
                margin-bottom: 20px;
            }
            .invoice-items table {
                width: 100%;
                border-collapse: collapse;
            }
            .invoice-items th, .invoice-items td {
                padding: 8px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            .invoice-items th {
                background-color: #f5f5f5;
            }
            .invoice-total {
                text-align: right;
                margin-bottom: 20px;
            }
            .invoice-total table {
                width: 300px;
                margin-left: auto;
            }
            .invoice-total th, .invoice-total td {
                padding: 8px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            .invoice-total .grand-total {
                font-weight: bold;
                font-size: 1.2em;
            }
            .invoice-footer {
                margin-top: 30px;
                text-align: center;
                font-size: 0.9em;
                color: #777;
            }
            .invoice-note {
                padding: 10px;
                background-color: #f9f9f9;
                border-left: 3px solid #800000;
                margin-top: 20px;
            }
            .due-date {
                color: ${invoiceData.status === 'Paid' ? 'green' : (invoiceData.status === 'Overdue' ? 'red' : '#800000')};
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="invoice">
            <div class="invoice-header">
                <h2>GMU University</h2>
                <h3>INVOICE</h3>
                <p>Invoice ID: ${invoiceId}</p>
                <p>Status: ${invoiceData.status}</p>
            </div>
            
            <div class="billing-details">
                <div>
                    <h4>Billed To:</h4>
                    <p>Rahul Sharma</p>
                    <p>Student ID: GMU2023456</p>
                    <p>Email: rahul.sharma@example.com</p>
                    <p>Phone: +91 9876543210</p>
                </div>
                <div>
                    <h4>From:</h4>
                    <p>GMU University</p>
                    <p>Finance Department</p>
                    <p>123 Education Lane, Knowledge City</p>
                    <p>Email: fees@gmu.ac.in</p>
                </div>
            </div>
            
            <div class="invoice-details">
                <p><strong>Issue Date:</strong> ${invoiceData.issueDate}</p>
                <p><strong>Due Date:</strong> <span class="due-date">${invoiceData.dueDate}</span></p>
            </div>
            
            <div class="invoice-items">
                <h4>Invoice Items</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${invoiceData.description}</td>
                            <td>${invoiceData.amount}</td>
                        </tr>
                        ${invoiceData.lateFee ? `
                        <tr>
                            <td>Late Fee</td>
                            <td>${invoiceData.lateFee}</td>
                        </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
            
            <div class="invoice-total">
                <table>
                    <tr>
                        <th>Subtotal:</th>
                        <td>${invoiceData.amount}</td>
                    </tr>
                    ${invoiceData.lateFee ? `
                    <tr>
                        <th>Late Fee:</th>
                        <td>${invoiceData.lateFee}</td>
                    </tr>
                    ` : ''}
                    <tr class="grand-total">
                        <th>Total Due:</th>
                        <td>${invoiceData.lateFee ? 
                            `₹${(parseInt(invoiceData.amount.replace(/[^0-9]/g, '')) + 
                                 parseInt(invoiceData.lateFee.replace(/[^0-9]/g, ''))).toLocaleString('en-IN')}`
                            : invoiceData.amount}</td>
                    </tr>
                </table>
            </div>
            
            ${invoiceData.paymentDate ? `
            <div class="invoice-note" style="background-color: #e8f5e9; border-left-color: green;">
                <p><strong>Payment Received on:</strong> ${invoiceData.paymentDate}</p>
                <p><strong>Payment Status:</strong> Completed</p>
                <p><strong>Transaction ID:</strong> ${invoiceData.transactionId || 'N/A'}</p>
            </div>
            ` : `
            <div class="invoice-note">
                <p><strong>Payment Instructions:</strong></p>
                <p>Please pay before the due date to avoid late fees. You can pay online through our portal or visit the finance department during working hours.</p>
            </div>
            `}
            
            <div class="invoice-footer">
                <p>This is a computer-generated invoice and does not require a signature.</p>
                <p>For any queries, please contact the Finance Department at fees@gmu.ac.in</p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    // Create a Blob and download the invoice
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${invoiceId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    showToast(`Invoice ${invoiceId} downloaded successfully!`);
}

// Function to download a receipt
function downloadReceipt(transactionId) {
    // Get receipt details
    let receiptData = {
        date: "Unknown",
        description: "Unknown",
        amount: "Unknown"
    };
    
    // Look for the parent invoice card to get details
    const invoiceCards = document.querySelectorAll('.invoice-card');
    invoiceCards.forEach(card => {
        if (card.querySelector(`.download-receipt[data-id="${transactionId}"]`)) {
            receiptData.description = card.querySelector('h3').textContent;
            receiptData.amount = card.querySelector('.amount').textContent;
            
            // Try to find payment date
            const detailItems = card.querySelectorAll('.detail-item');
            detailItems.forEach(item => {
                const label = item.querySelector('.label').textContent;
                if (label === 'Payment Date:') {
                    receiptData.date = item.querySelector('.value').textContent;
                }
            });
        }
    });
    
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
                        <td>${receiptData.date}</td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td>${receiptData.description}</td>
                    </tr>
                    <tr>
                        <th>Amount Paid</th>
                        <td>${receiptData.amount}</td>
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

// Helper function to get invoice details from the card
function getInvoiceDetails(invoiceId) {
    // Find the card with this invoice ID
    const cards = document.querySelectorAll('.invoice-card');
    for (const card of cards) {
        if (card.querySelector('.invoice-id').textContent === invoiceId) {
            const statusElement = card.querySelector('.invoice-status');
            const status = statusElement ? statusElement.textContent : 'Unknown';
            const description = card.querySelector('h3').textContent;
            
            let issueDate = 'Unknown';
            let dueDate = 'Unknown';
            let amount = 'Unknown';
            let paymentDate = null;
            let lateFee = null;
            let transactionId = null;
            
            // Extract details
            const detailItems = card.querySelectorAll('.detail-item');
            detailItems.forEach(item => {
                const label = item.querySelector('.label').textContent;
                const value = item.querySelector('.value').textContent;
                
                if (label === 'Issue Date:') issueDate = value;
                if (label === 'Due Date:') dueDate = value;
                if (label === 'Amount:') amount = value;
                if (label === 'Payment Date:') paymentDate = value;
                if (label === 'Late Fee:') lateFee = value;
            });
            
            // Get transaction ID if available
            const receiptBtn = card.querySelector('.download-receipt');
            if (receiptBtn) {
                transactionId = receiptBtn.getAttribute('data-id');
            }
            
            return {
                status,
                description,
                issueDate,
                dueDate,
                amount,
                paymentDate,
                lateFee,
                transactionId
            };
        }
    }
    
    return {
        status: 'Unknown',
        description: 'Unknown',
        issueDate: 'Unknown',
        dueDate: 'Unknown',
        amount: 'Unknown'
    };
}

// Function to set up payment buttons
function setupPaymentButtons() {
    const payNowButtons = document.querySelectorAll('.pay-now');
    
    payNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.location.href = "payment.html";
        });
    });
}

// Function to initialize Show More button
function initShowMoreButton() {
    const showMoreBtn = document.getElementById('showMoreBtn');
    const invoiceCards = document.querySelectorAll('.invoice-card');
    
    // Initially show only 6 cards
    for (let i = 0; i < invoiceCards.length; i++) {
        if (i >= 6) {
            invoiceCards[i].style.display = 'none';
        }
    }
    
    // Show more when button is clicked
    showMoreBtn.addEventListener('click', function() {
        let hiddenCards = 0;
        
        for (let i = 0; i < invoiceCards.length; i++) {
            if (invoiceCards[i].style.display === 'none' && !hasActiveFilters()) {
                invoiceCards[i].style.display = '';
                invoiceCards[i].style.opacity = '0';
                invoiceCards[i].style.transform = 'translateY(20px)';
                
                // Stagger animations
                setTimeout(() => {
                    invoiceCards[i].style.opacity = '1';
                    invoiceCards[i].style.transform = 'translateY(0)';
                }, hiddenCards * 100);
                
                hiddenCards++;
                
                // Only show 6 more at a time
                if (hiddenCards >= 6) {
                    break;
                }
            }
        }
        
        // Hide button if all cards are shown
        const stillHidden = Array.from(invoiceCards).filter(card => card.style.display === 'none').length;
        if (stillHidden === 0 || hasActiveFilters()) {
            showMoreBtn.style.display = 'none';
        }
        
        showToast(`Showing ${Math.min(hiddenCards, 6)} more invoices`);
    });
    
    // Helper function to check if any filters are active
    function hasActiveFilters() {
        const searchInput = document.getElementById('searchInput');
        const statusFilter = document.getElementById('statusFilter');
        const semesterFilter = document.getElementById('semesterFilter');
        
        return searchInput.value !== '' || 
               statusFilter.value !== 'all' || 
               semesterFilter.value !== 'all';
    }
}

// Function to initialize animations
function initAnimations() {
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
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
        
        .invoices {
            padding: 60px 0;
        }
        
        .filters {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .search-box {
            display: flex;
            flex: 2;
        }
        
        .search-box input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: var(--border-radius) 0 0 var(--border-radius);
        }
        
        .search-box button {
            padding: 10px 20px;
            background-color: var(--maroon);
            color: white;
            border: none;
            border-radius: 0 var(--border-radius) var(--border-radius) 0;
            cursor: pointer;
        }
        
        .filter-options {
            display: flex;
            gap: 10px;
            flex: 1;
        }
        
        .filter-options select {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: var(--border-radius);
            background-color: white;
        }
        
        .invoices-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }
        
        .invoice-card {
            background-color: white;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            overflow: hidden;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(20px);
            animation: fadeIn 0.5s ease forwards;
        }
        
        .invoice-card:hover {
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            transform: translateY(-5px);
        }
        
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background-color: var(--light-gray);
        }
        
        .invoice-id {
            font-weight: bold;
        }
        
        .invoice-status {
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
        }
        
        .invoice-status.pending {
            background-color: rgba(255, 193, 7, 0.1);
            color: var(--warning);
        }
        
        .invoice-status.paid {
            background-color: rgba(40, 167, 69, 0.1);
            color: var(--success);
        }
        
        .invoice-status.overdue {
            background-color: rgba(220, 53, 69, 0.1);
            color: var(--danger);
        }
        
        .invoice-body {
            padding: 15px;
        }
        
        .invoice-body h3 {
            margin-bottom: 10px;
            color: var(--maroon);
        }
        
        .invoice-details {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .detail-item {
            display: flex;
            justify-content: space-between;
        }
        
        .detail-item .label {
            color: var(--text-light);
        }
        
        .detail-item .amount {
            font-weight: bold;
            color: var(--maroon);
        }
        
        .invoice-footer {
            padding: 15px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            border-top: 1px solid var(--light-gray);
        }
        
        .no-results {
            text-align: center;
            padding: 30px;
            background-color: white;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
        }
        
        .show-more-container {
            text-align: center;
            margin-top: 30px;
        }
        
        @keyframes fadeIn {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 768px) {
            .filters {
                flex-direction: column;
            }
            
            .search-box, .filter-options {
                width: 100%;
            }
            
            .invoices-container {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Animate invoice cards on page load
    const invoiceCards = document.querySelectorAll('.invoice-card');
    invoiceCards.forEach((card, index) => {
        if (index < 6) { // Only animate the first 6 visible cards
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.animation = 'none'; // Remove default animation
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        }
    });
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
        backgroundColor: type === 'success' ? '#28a745' : '#dc3545',
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
