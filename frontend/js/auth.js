// Check if user is already logged in
async function checkAuth() {
    try {
        await apiCall('/auth/me');
        // User is logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        // Not logged in, stay on current page
    }
}

// Show error message
function showError(message) {
    var errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    var successDiv = document.getElementById('success-message');
    if (successDiv) {
        successDiv.style.display = 'none';
    }
}

// Show success message
function showSuccess(message) {
    var successDiv = document.getElementById('success-message');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
    }

    var errorDiv = document.getElementById('error-message');
    errorDiv.style.display = 'none';
}

// Handle login form submission
function setupLoginForm() {
    var form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        var username = document.getElementById('username').value.trim();
        var password = document.getElementById('password').value;
        var submitBtn = form.querySelector('button[type="submit"]');

        if (!username || !password) {
            showError('Please fill in all fields');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        try {
            await apiCall('/auth/login', 'POST', {
                username: username,
                password: password
            });
            window.location.href = 'dashboard.html';
        } catch (error) {
            showError(error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    });
}

// Handle register form submission
function setupRegisterForm() {
    var form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        var username = document.getElementById('username').value.trim();
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confirm-password').value;
        var submitBtn = form.querySelector('button[type="submit"]');

        if (!username || !password || !confirmPassword) {
            showError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        if (password.length < 4) {
            showError('Password must be at least 4 characters');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering...';

        try {
            await apiCall('/auth/register', 'POST', {
                username: username,
                password: password
            });
            // Redirect to login with success message
            window.location.href = 'index.html?registered=true';
        } catch (error) {
            showError(error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register';
        }
    });
}

// Check for success message from registration redirect
function checkRegistrationSuccess() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('registered') === 'true') {
        showSuccess('Registration successful! Please login.');
        // Clean up URL
        window.history.replaceState({}, '', 'index.html');
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function () {
    checkAuth();
    setupLoginForm();
    setupRegisterForm();
    checkRegistrationSuccess();
});
