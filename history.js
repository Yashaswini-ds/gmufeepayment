document.addEventListener('DOMContentLoaded', function() {
    // Initialize functionality
    initSearchAndFilters();
    setupReceiptDownload();
    setupPaymentButtons();
    initExportButtons();
    initAnimations();
});

// Function for search and filters
function initSearchAndFilters() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const table = document.getElementById('historyTable');
    const tableRows = table.querySelectorAll('tbody tr');
    
    // Search functionality
    searchBtn.addEventListener('click', filterTable);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterTable();
        }
    });
    
    // Filter change events
    statusFilter.addEventListener('change', filterTable);
    dateFilter.addEventListener('change', filterTable);
    
    function filterTable() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;
        const dateValue = dateFilter.value;
        
        tableRows.forEach(row => {
            const transactionId = row.cells[0].textContent.toLowerCase();
            const description = row.cells[2].textContent.toLowerCase();
            const date = new Date(row.cells[1].textContent);
            const status = row.cells[4].textContent.toLowerCase();
            
            let showRow = true;
            
            // Check search term
            if (searchTerm && !transactionId.includes(searchTerm) && !description.includes(searchTerm)) {
                showRow = false;
            }
            
            // Check status filter
            if (statusValue !== 'all' && !status.includes(statusValue)) {
                showRow = false;
            }
            
            // Check date filter
            if (dateValue !== 'all') {
                const now = new Date();
                let dateLimit;
                
                switch(dateValue) {
                    case 'month':
                        dateLimit = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                        break;
                    case 'quarter':
                        dateLimit = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                        break;
                    case 'year':
                        dateLimit = new Date(now.getFullYear(), 0, 1);
                        break;
                }
                
                if (date < dateLimit) {
                    showRow = false;
                }
            }
            
            // Show or hide row
            row.style.display = showRow ? '' : 'none';
        });
        
        // If no results found, show a message
        const visibleRows = [...tableRows].filter(row => row.style.display !== 'none');
        const noResultsRow = table.querySelector('.no-results');
        
        if (visibleRows.length === 0) {
            if (!noResultsRow) {
                const tbody = table.querySelector('tbody');
                const newRow = document.createElement('tr');
                newRow.className = 'no-results';
                const cell = document.createElement('td');
                cell.colSpan = 6;
                cell.textContent = 'No matching records found';
                cell.style.textAlign = 'center';
                cell.style.padding = '20px';
                newRow.appendChild(cell);
                tbody.appendChild(newRow);
            }
        } else if (noResultsRow) {
            noResultsRow.remove();
        }
        
        // Show toast with results
        showToast(`Found ${visibleRows.length} matching transactions`);
    }
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
    // Get transaction details from the table
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
                        <td>${transactionData.status}</td>
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
    const rows = document.querySelectorAll('#historyTable tbody tr');
    for (const row of rows) {
        if (row.cells[0].textContent === transactionId) {
            return {
                date: row.cells[1].textContent,
                description: row.cells[2].textContent,
                amount: row.cells[3].textContent,
                status: row.cells[4].querySelector('span').textContent
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

// Function to set up payment buttons
function setupPaymentButtons() {
    const payNowButtons = document.querySelectorAll('.pay-now');
    
    payNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.location.href = "payment.html";
        });
    });
}

// Function to handle export buttons
function initExportButtons() {
    const exportPdfBtn = document.getElementById('exportPdf');
    const exportCsvBtn = document.getElementById('exportCsv');
    
    exportPdfBtn.addEventListener('click', function() {
        // In a real application, this would generate a proper PDF
        showToast('Generating PDF...');
        setTimeout(() => {
            const pdfContent = generatePdfContent();
            const blob = new Blob([pdfContent], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Payment_History.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast('PDF exported successfully!');
        }, 1500);
    });
    
    exportCsvBtn.addEventListener('click', function() {
        showToast('Generating CSV...');
        setTimeout(() => {
            const csvContent = generateCsvContent();
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Payment_History.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast('CSV exported successfully!');
        }, 1000);
    });
}

// Function to generate CSV content
function generateCsvContent() {
    const table = document.getElementById('historyTable');
    const rows = table.querySelectorAll('tbody tr');
    
    // Header row
    let csv = 'Transaction ID,Date,Description,Amount,Status\n';
    
    // Data rows
    rows.forEach(row => {
        if (row.style.display !== 'none' && !row.classList.contains('no-results')) {
            const transactionId = row.cells[0].textContent;
            const date = row.cells[1].textContent;
            const description = row.cells[2].textContent;
            const amount = row.cells[3].textContent;
            const status = row.cells[4].querySelector('span').textContent;
            
            // Handle commas in fields by adding quotes
            csv += `"${transactionId}","${date}","${description}","${amount}","${status}"\n`;
        }
    });
    
    return csv;
}

// Function to generate PDF content (placeholder)
function generatePdfContent() {
    // This is just a placeholder. In a real app, you'd use a library like jsPDF
    // For now, just return some text to simulate a PDF
    return '%PDF-1.4\n% This is a simulated PDF file\n% In a real application, use proper PDF generation';
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
        
        .payment-history {
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
        
        .pagination {
            display: flex;
            justify-content: center;
            gap: 5px;
            margin: 30px 0;
        }
        
        .pagination-btn {
            padding: 8px 15px;
            border: 1px solid #ddd;
            background-color: white;
            cursor: pointer;
            transition: var(--transition);
        }
        
        .pagination-btn.active {
            background-color: var(--maroon);
            color: white;
            border-color: var(--maroon);
        }
        
        .pagination-btn:hover:not([disabled]) {
            background-color: var(--light-gray);
        }
        
        .pagination-btn[disabled] {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .export-options {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
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
        
        .table-container {
            animation: fadeIn 0.5s ease forwards;
        }
        
        @media (max-width: 768px) {
            .filters {
                flex-direction: column;
            }
            
            .search-box, .filter-options {
                width: 100%;
            }
            
            .export-options {
                flex-direction: column;
                align-items: stretch;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Animate rows on page load
    const tableRows = document.querySelectorAll('#historyTable tbody tr');
    tableRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
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
