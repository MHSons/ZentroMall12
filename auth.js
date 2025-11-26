/* File: auth.js */

document.addEventListener('DOMContentLoaded', () => {
    
    // UI Toggling
    const loginSection = document.getElementById('login-section');
    const signupSection = document.getElementById('signup-section');
    const showLoginBtn = document.getElementById('show-login-btn');
    const showSignupBtn = document.getElementById('show-signup-btn');
    
    showLoginBtn.addEventListener('click', () => {
        loginSection.classList.remove('hidden');
        signupSection.classList.add('hidden');
        showLoginBtn.classList.add('active');
        showSignupBtn.classList.remove('active');
    });

    showSignupBtn.addEventListener('click', () => {
        signupSection.classList.remove('hidden');
        loginSection.classList.add('hidden');
        showSignupBtn.classList.add('active');
        showLoginBtn.classList.remove('active');
    });

    // --- Form Submission Logic ---
    
    // Login Form Handler
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // **DEMO ONLY:** A real system requires an API call to a secure server.
        if (email === "demo@mahstore.com" && password === "123456") {
            alert('Login Successful! Welcome back.');
            // In a real app, you would set a secure session cookie here
            window.location.href = 'index.html'; 
        } else {
            alert('Invalid Email or Password. Please try again.');
        }
    });

    // Signup Form Handler
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match. Please re-enter.');
            return;
        }

        // **DEMO ONLY:** A real system requires storing the user data on a secure server.
        alert(`Account created successfully for ${name}! Please login.`);
        
        // After successful sign up, switch to login view
        showLoginBtn.click();
    });
});
