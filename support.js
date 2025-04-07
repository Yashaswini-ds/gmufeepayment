document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQ functionality
    initFAQ();
    
    // Initialize contact form
    setupContactForm();
    
    // Initialize animations
    initAnimations();
});

// Function to handle FAQ accordion
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle active class on the question
            this.classList.toggle('active');
            
            // Get the next sibling element (the answer)
            const answer = this.nextElementSibling;
            
            // Toggle display of the answer
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// Function to handle contact form submission
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const studentId = document.getElementById('studentId').value;
        const email = document.getElementById('email').value;
        const queryType = document.getElementById('queryType').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (!name || !studentId || !email || !queryType || !message) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Show processing message
        showToast('Submitting your query...');
        
        // Simulate form submission
        setTimeout(() => {
            // Show success message and clear form
            showSubmissionSuccess();
            contactForm.reset();
        }, 2000);
    });
    
    // File input visual enhancement
    const fileInput = document.getElementById('attachment');
    
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const fileName = this.files[0] ? this.files[0].name : 'No file chosen';
            const fileLabel = this.nextElementSibling;
            
            // If there's a small element after the input, update its text
            if (fileLabel && fileLabel.tagName.toLowerCase() === 'small') {
                if (this.files[0]) {
                    fileLabel.textContent = `Selected file: ${fileName}`;
                } else {
                    fileLabel.textContent = 'Max file size: 5MB (PDF, JPG, PNG)';
                }
            }
        });
    }
}

// Function to show submission success message
function showSubmissionSuccess() {
    // Create ticket ID
    const ticketId = 'TICKET' + Math.floor(Math.random() * 100000).toString().padStart(6, '0');
    
    // Get the form container
    const formContainer = document.querySelector('.contact-form');
    
    // Create success message HTML
    const successHTML = `
    <div class="submission-success">
        <div class="success-icon">✓</div>
        <h3>Query Submitted Successfully!</h3>
        <p>Your query has been received and we will get back to you shortly.</p>
        <div class="ticket-info">
            <p>Ticket ID: <strong>${ticketId}</strong></p>
            <p>Please save this ticket ID for future reference.</p>
        </div>
        <p>A confirmation email has been sent to your registered email address.</p>
        <button id="newQueryBtn" class="btn btn-secondary">Submit Another Query</button>
    </div>
    `;
    
    // Replace the form with the success message
    formContainer.innerHTML = successHTML;
    
    // Add event listener to the new query button
    document.getElementById('newQueryBtn').addEventListener('click', function() {
        window.location.reload();
    });
    
    // Show toast notification
    showToast('Query submitted successfully!');
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
        
        .support {
            padding: 60px 0;
        }
        
        .support-layout {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            margin-bottom: 50px;
        }
        
        .faq-section {
            flex: 1;
            min-width: 300px;
        }
        
        .contact-section {
            flex: 1;
            min-width: 300px;
        }
        
        .faq-section h2,
        .contact-section h2,
        .contact-info h2 {
            color: var(--maroon);
            margin-bottom: 30px;
            text-align: center;
        }
        
        .faq-item {
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: var(--border-radius);
            overflow: hidden;
        }
        
        .faq-question {
            padding: 15px;
            background-color: var(--white);
            cursor: pointer;
            font-weight: 600;
            position: relative;
            transition: background-color 0.3s;
        }
        
        .faq-question:hover {
            background-color: var(--light-gray);
        }
        
        .faq-question::after {
            content: '+';
            position: absolute;
            right: 15px;
            transition: transform 0.3s;
        }
        
        .faq-question.active::after {
            transform: rotate(45deg);
        }
        
        .faq-answer {
            padding: 0 15px;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            background-color: var(--white);
        }
        
        .faq-answer p {
            margin-top: 0;
            margin-bottom: 10px;
        }
        
        .faq-answer ul,
        .faq-answer ol {
            margin-top: 5px;
            margin-bottom: 15px;
            padding-left: 20px;
        }
        
        .faq-answer li {
            margin-bottom: 5px;
        }
        
        .contact-form {
            background-color: var(--white);
            padding: 25px;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
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
        
        .form-control:focus {
            outline: none;
            border-color: var(--maroon);
            box-shadow: 0 0 0 2px rgba(128, 0, 0, 0.1);
        }
        
        textarea.form-control {
            resize: vertical;
        }
        
        .btn-block {
            width: 100%;
        }
        
        .contact-cards {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
            margin-top: 30px;
        }
        
        .contact-card {
            background-color: var(--white);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            padding: 25px;
            text-align: center;
            min-width: 250px;
            flex: 1;
            transition: all 0.3s ease;
        }
        
        .contact-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .contact-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--maroon);
            color: var(--white);
            font-size: 24px;
        }
        
        .contact-icon::before {
            font-family: monospace;
        }
        
        .contact-icon.phone::before {
            content: "📞";
        }
        
        .contact-icon.email::before {
            content: "✉";
        }
        
        .contact-icon.location::before {
            content: "📍";
        }
        
        .contact-card h3 {
            margin-bottom: 10px;
        }
        
        .contact-card p {
            margin: 5px 0;
        }
        
        .contact-card .details {
            color: var(--text-light);
            font-size: 0.9em;
        }
        
        .submission-success {
            text-align: center;
            padding: 30px;
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
        
        .ticket-info {
            margin: 20px 0;
            padding: 15px;
            background-color: #f9f9f9;
            border-left: 3px solid var(--maroon);
            text-align: left;
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
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .faq-item,
        .contact-form,
        .contact-card {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeIn 0.5s ease forwards;
        }
        
        @media (max-width: 768px) {
            .support-layout {
                flex-direction: column;
            }
            
            .contact-cards {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Stagger animations
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
    
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Auto-open first FAQ question after delay
    setTimeout(() => {
        const firstQuestion = document.querySelector('.faq-question');
        if (firstQuestion) {
            firstQuestion.click();
        }
    }, 1000);
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
