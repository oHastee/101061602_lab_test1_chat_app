document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Gather form data
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Basic client-side validation
    if (!username || !password) {
        document.getElementById('message').innerHTML =
            '<div class="alert alert-danger">Please enter both username and password.</div>';
        return;
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            // Save the username in localStorage for session management
            localStorage.setItem('username', data.username);
            // Redirect to the chat page
            window.location.href = 'chat.html';
        } else {
            document.getElementById('message').innerHTML =
                '<div class="alert alert-danger">' + data.error + '</div>';
        }
    } catch (error) {
        document.getElementById('message').innerHTML =
            '<div class="alert alert-danger">An error occurred. Please try again later.</div>';
    }
});
