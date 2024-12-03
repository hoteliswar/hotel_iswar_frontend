// baseURL = 'https://dineops.onrender.com/api/';
// baseURL = 'https://hotel-iswar-backend.onrender.com/api/';
console.log(baseURL);

// Add keyboard shortcut listener
document.addEventListener('keydown', function(event) {
    console.log(`Ctrl + Shift + R pressed`);
    // Check for Shift + Ctrl + R
    if (event.shiftKey && event.ctrlKey && event.key === 'R') {
        event.preventDefault(); // Prevent default refresh behavior
    }
});



// Helper function to set a cookie
function setCookie(name, value, minutes) {
    const d = new Date();
    d.setTime(d.getTime() + (minutes * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}


// Helper function to get a cookie value
function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}


// Handle the form submission
// document.getElementById('loginForm').addEventListener('submit', function (event) {
//     event.preventDefault(); // Prevent the form from submitting the traditional way

//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     fetch(`${baseURL}accounts/token/`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             username: username,
//             password: password
//         })
//     })
//         // .then(response => response.json())
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Invalid credentials');
//             }
//             return response.json();
//         })
//         .then(async data => {
//             if (data.access && data.refresh) {
//                 // Store the access token in cookies
//                 setCookie('access_token', data.access, 5); // Store for 5 minutes
//                 setCookie('refresh_token', data.refresh, 10000); // Store refresh token

//                 // Store the tokens in variables
//                 accessToken = data.access;
//                 refreshToken = data.refresh;

//                 await Promise.all([callAllAPI()]);
//                 console.log('Login successful, access token stored in cookies.');
//                 console.log('Access Token:', accessToken);
//                 console.log('Refresh Token:', refreshToken);

//                 // Redirect to a new URL after successful login
//                 window.location.href = './../dashboard/dashboard.html'; // Change to your desired URL

//             } else {
//                 console.error('Login failed:', data);
//                 alert('Invalid username or password');
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             // alert('Invalid username or password');
//             customAlert('Invalid Username or Password', type = 'error');

//             // Optional: Clear the password field
//             document.getElementById('password').value = '';
//         });
// });


document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Add overlay to block clicks
    const overlay = document.createElement('div');
    overlay.className = 'click-blocker';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.1);
        z-index: 9998;
        cursor: not-allowed;
    `;

    // Create preloader
    const preloader = document.createElement('div');
    preloader.className = 'pl';
    preloader.innerHTML = `
        <div class="pl__bar"></div>
        <div class="pl__bar"></div>
        <div class="pl__bar"></div>
    `;
    preloader.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
    `;

    // Add styles if not already present
    if (!document.querySelector('#preloader-style')) {
        const style = document.createElement('style');
        style.id = 'preloader-style';
        style.textContent = `
            .pl {
                --dur: 5s;
                --size: 8em;
                --bar-width: calc(var(--size) * 0.25);
                aspect-ratio: 1 / 1;
                display: flex;
                justify-content: space-between;
                width: var(--size);
            }
            .pl__bar {
                background-color: #ffaf02;
                position: relative;
                width: var(--bar-width);
                height: 100%;
                transform-style: preserve-3d;
                animation: bar-spin var(--dur) cubic-bezier(0.65,0,0.35,1) infinite;
            }
            .pl__bar:before,
            .pl__bar:after {
                background-color: hsl(223,90%,10%);
                content: "";
                display: block;
                position: absolute;
                top: 50%;
                left: 0;
                width: var(--bar-width);
                height: var(--bar-width);
            }
            .pl__bar:before {
                transform: translateY(-50%) rotateX(90deg) translateZ(calc(var(--size) / 2 + 1px));
            }
            .pl__bar:after {
                border-radius: 50%;
                transform: translateY(-50%) rotateX(-90deg) translateZ(calc(var(--size) / 2 + 1px));
            }
            .pl__bar:nth-child(2) {
                animation-delay: -0.2s;
            }
            .pl__bar:nth-child(3) {
                animation-delay: -0.4s;
            }
            @keyframes bar-spin {
                from { transform: rotateX(0); }
                to { transform: rotateX(-1turn); }
            }
        `;
        document.head.appendChild(style);
    }

    // Add overlay and preloader to body
    document.body.appendChild(overlay);
    document.body.appendChild(preloader);

    // Function to remove loading state
    const removeLoadingState = () => {
        if (document.body.contains(preloader)) document.body.removeChild(preloader);
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
    };

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${baseURL}accounts/token/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Invalid credentials');
            }
            return response.json();
        })
        .then(async data => {
            if (data.access && data.refresh) {
                // Keep loading state for successful login since we're redirecting
                setCookie('access_token', data.access, 5);
                setCookie('refresh_token', data.refresh, 10000);
                accessToken = data.access;
                refreshToken = data.refresh;
                await Promise.all([callAllAPI()]);
                window.location.href = './../dashboard/dashboard.html';
            } else {
                removeLoadingState();
                console.error('Login failed:', data);
                customAlert('Invalid username or password', 'error');
            }
        })
        .catch(error => {
            removeLoadingState();
            console.error('Error:', error);
            customAlert('Invalid Username or Password', 'error');
            document.getElementById('password').value = '';
        });
});

// Custom alert function
function customAlert(message, type = 'info') {
    // Create alert container
    const alertContainer = document.createElement('div');
    alertContainer.style.position = 'fixed';
    alertContainer.style.top = '20px';
    alertContainer.style.right = '20px';
    alertContainer.style.padding = '15px';
    alertContainer.style.borderRadius = '5px';
    alertContainer.style.maxWidth = '300px';
    alertContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    alertContainer.style.zIndex = '9999';
    alertContainer.style.transition = 'opacity 0.3s ease-in-out';
    alertContainer.style.zIndex = '100002';

    // Set color based on alert type
    switch (type) {
        case 'success':
            alertContainer.style.backgroundColor = '#4CAF50';
            alertContainer.style.color = 'white';
            break;
        case 'error':
            alertContainer.style.backgroundColor = '#f44336';
            alertContainer.style.color = 'white';
            break;
        case 'warning':
            alertContainer.style.backgroundColor = '#ff9800';
            alertContainer.style.color = 'white';
            break;
        default:
            alertContainer.style.backgroundColor = '#2196F3';
            alertContainer.style.color = 'white';
    }

    // Set message
    alertContainer.textContent = message;

    // Add close button
    const closeButton = document.createElement('span');
    closeButton.textContent = '×';
    closeButton.style.float = 'right';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginLeft = '15px';
    closeButton.onclick = function () {
        document.body.removeChild(alertContainer);
    };
    alertContainer.insertBefore(closeButton, alertContainer.firstChild);

    // Add to body
    document.body.appendChild(alertContainer);

    // Auto remove after 5 seconds
    setTimeout(() => {
        alertContainer.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(alertContainer)) {
                document.body.removeChild(alertContainer);
            }
        }, 300);
    }, 5000);
}

// Override default alert
// alert = customAlert;

async function callAllAPI() {
    try {
        // First, wait for all API calls to complete
        const results = await Promise.all([
            getCategoryList(),
            getFooditems(),
            getTablesData(),
            getRoomsData(),
            getServiceCategoryList(),
            getServiceList(),
            getAllBookings(),
            getAllBilling(),
            getAllOrders(),
            getAllPayments()
        ]);

        // Verify all data is in localStorage
        const requiredData = [
            'categoryList',
            'allFoodList',
            'tablesList',
            'roomsList',
            'serviceCategoryList',
            'serviceList',
            'bookingsList',
            'billingList'
        ];

        const missingData = requiredData.filter(key => !localStorage.getItem(key));
        
        if (missingData.length > 0) {
            console.warn('Missing data in localStorage:', missingData);
            // Retry missing data fetches
            const retryPromises = missingData.map(key => {
                switch(key) {
                    case 'categoryList': return getCategoryList();
                    case 'allFoodList': return getFooditems();
                    case 'tablesList': return getTablesData();
                    case 'roomsList': return getRoomsData();
                    case 'serviceCategoryList': return getServiceCategoryList();
                    case 'serviceList': return getServiceList();
                    case 'bookingsList': return getAllBookings();
                    case 'billingList': return getAllBilling();
                }
            });
            await Promise.all(retryPromises);
        }

        console.log('All API calls completed successfully');
        return true;
    } catch (error) {
        console.error('Error in API calls:', error);
        throw error;
    }
}

