// Helper function to set a cookie
function setCookie(name, value, minutes) {
    const d = new Date();
    d.setTime(d.getTime() + (minutes * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Handle the form submission
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://127.0.0.1:8000/api/accounts/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.access && data.refresh) {
                // Store the access token in cookies
                setCookie('access_token', data.access, 5); // Store for 5 minutes
                setCookie('refresh_token', data.refresh, 10000); // Store refresh token

                // Store the tokens in variables
                accessToken = data.access;
                refreshToken = data.refresh;

                console.log('Login successful, access token stored in cookies.');
                console.log('Access Token:', accessToken);
                console.log('Refresh Token:', refreshToken);

                // Redirect to a new URL after successful login
                window.location.href = './../dashboard/dashboard.html'; // Change to your desired URL
            } else {
                console.error('Login failed:', data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});