document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Gather form data
    const firstname = document.getElementById('firstname').value.trim();
    const lastname  = document.getElementById('lastname').value.trim();
    const username  = document.getElementById('username').value.trim();
    const password  = document.getElementById('password').value;

    // Basic client-side validation
    if (!firstname || !lastname || !username || !password) {
        document.getElementById('message').innerHTML =
            '<div class="alert alert-danger">Please fill in all required fields.</div>';
        return;
    }

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstname, lastname, username, password })
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('message').innerHTML =
                '<div class="alert alert-success">' + data.message + '</div>';
            // Redirect to login after a short delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            document.getElementById('message').innerHTML =
                '<div class="alert alert-danger">' + data.error + '</div>';
        }
    } catch (error) {
        document.getElementById('message').innerHTML =
            '<div class="alert alert-danger">An error occurred. Please try again later.</div>';
    }
});
