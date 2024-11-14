// baseURL = 'https://dineops.onrender.com/api/';
baseURL = 'https://hotel-iswar-backend.onrender.com/api/';
console.log(baseURL);


// Add this at the beginning of your file, after baseURL declaration
function checkTokensAndRedirect() {
    // Check if current page is login page
    if (window.location.pathname.includes('/login/login.html')) {
        return; // Skip redirect if already on login page
    }

    const accessToken = getCookie('access_token');
    const refreshToken = getCookie('refresh_token');

    if (!accessToken || !refreshToken) {
        const rootPath = window.location.origin;
        window.location.href = `${rootPath}/hotel-iswar/login/login.html`;
    }
}


// Call this function immediately
// checkTokensAndRedirect();



// Helper function to save a cookie value
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

function refreshAccessToken(url, option) {
    console.log(' refreshAccessToken() called !!');

    return fetch(url, option)
        .then(response => {
            console.log(response.status);
            if (response.status === 401) {
                console.log('Status: 401');
                fetch(`${baseURL}accounts/token/refresh/`, {
                    // fetch('http://127.0.0.1:8000/api/accounts/token/refresh/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        refresh: getCookie('refresh_token')
                    })
                })
                    .then(response => {
                        if (response.status == 401) {
                            window.location.href = 'index.html';
                        }
                        else if (response.status == 200) {
                            // access update
                            console.log('Access Token:', accessToken);
                            console.log('Refresh Token:', refreshToken);
                            console.log('Refresh Status: 200');
                            // if(data.access){
                            //     setCookie('access_token', data.access, 5);
                            // }
                        }
                        return response.json();
                        // refreshAccessToken(url, option);
                    })
                    .then(data => {
                        console.log(data.access);
                        if (data.access) {
                            setCookie('access_token', data.access, 5);
                        }
                        if (response.status === 200) {
                            refreshAccessToken(url, option);
                        }
                        // refreshAccessToken(url, option);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
            else if (response.status === 200) {
                console.log('Status: 200 okay');
                return response.json();
            }
            else if (response.status === 201) {
                console.log('Status: 201 okay');
                return response.json();
            }
            else {
                console.log(`Unexpected status code: ${response.status}`);
                return response.json().then(err => {
                    throw new Error(err.message);
                });
            }
        });
}

async function refreshAccessToken22(url, option) {
    // try {
    const response = await fetch(url, option);
    // if (!response.ok) {
    if (response.status === 401) {
        console.log(`Status: ${response.status}`);
        fetch(`${baseURL}accounts/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refresh: getCookie('refresh_token')
            })
        })
            .then(response => {
                if (response.status == 401) {
                    window.location.href = 'index.html';
                }
                else if (response.status == 200) {
                    // access update
                    console.log('Access Token:', getCookie('access_token'));
                    console.log('Refresh Token:', getCookie('refresh_token'));
                    console.log('Refresh Status: 200');
                    // if(data.access){
                    //     setCookie('access_token', data.access, 5);
                    // }
                }
                return response.json();
                // refreshAccessToken(url, option);
            })
            .then(data => {
                console.log(data.access);
                if (data.access) {
                    setCookie('access_token', data.access, 5);
                }
                if (response.status === 200) {
                    refreshAccessToken2(url, option);
                }
                // refreshAccessToken(url, option);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    else if (response.ok) {
        // else if (response.status =) {
        console.log('Statuss: ', response.status);
        return response.json();

    }
    // } catch (error) {
    //     console.error('Error:', error);
    // }
}

async function refreshAccessToken2(url, option) {
    try {
        const response = await fetch(url, option);
        console.log(`Status: ${response.status}`);

        if (response.status === 401) {
            // Handle unauthorized access
            const refreshResponse = await fetch(`${baseURL}accounts/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh: getCookie('refresh_token')
                })
            });

            if (refreshResponse.status === 401) {
                // Refresh token is also invalid, redirect to login
                window.location.href = 'index.html';
                // logout();
                return;
            } else if (refreshResponse.status === 200) {
                const data = await refreshResponse.json();
                if (data.access) {
                    setCookie('access_token', data.access, 5);
                    console.log('Access Token refreshed');
                    // Retry the original request with the new token
                    return refreshAccessToken2(url, {
                        ...option,
                        headers: {
                            ...option.headers,
                            'Authorization': `Bearer ${data.access}`
                        }
                    });
                }
            }
        } else if (response.status === 400) {
            // Handle bad request
            console.error('Bad Request:', await response.text());
            throw new Error('Bad Request');
        } else if (response.status === 403) {
            // Handle forbidden
            console.error('Forbidden:', await response.text());
            throw new Error('Forbidden');
        } else if (response.status === 404) {
            // Handle not found
            console.error('Not Found:', await response.text());
            throw new Error('Not Found');
        } else if (response.status === 500) {
            // Handle server error
            console.error('Server Error:', await response.text());
            throw new Error('Server Error');
        } else if (response.status === 204) {
            const data = ['Deleted successfully'];
            return data;
        } else if (response.ok) {
            // Handle successful response
            console.log('Status:', response.status);
            return response.json();
        } else {
            // Handle any other status codes
            console.error('Unexpected Status:', response.status, await response.text());
            throw new Error(`Unexpected Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error in refreshAccessToken2:', error);
        throw error;
    }
}

async function refreshAccessToken3(url, option) {
    console.log('refreshAccessToken() called !!');

    try {
        const response = await fetch(url, option);

        if (response.status === 401) {
            console.log('Status: 401');
            const refreshResponse = await fetch(`${baseURL}accounts/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh: getCookie('refresh_token')
                })
            });

            if (refreshResponse.status === 401) {
                window.location.href = 'index.html';
            } else if (refreshResponse.status === 200) {
                console.log('Access Token:', getCookie('access_token'));
                console.log('Refresh Token:', getCookie('refresh_token'));
                console.log('Refresh Status: 200');

                const data = await refreshResponse.json();
                if (data.access) {
                    setCookie('access_token', data.access, 5);
                }

                return refreshAccessToken3(url, option);
            }
        } else if (response.status === 200 || response.status === 201 || response.ok) {
            console.log(`Status: ${response.status} OK`);
            console.log(response.json());
            return response.json();
        } else {
            console.log(`Unexpected status code: ${response.status}`);
            const err = await response.json();
            throw new Error(err.message);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}



// Local Storage


// getCategoryList();

// API Call GET Category List - Read
function getCategoryList() {
    const option = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    }

    const url = `${baseURL}foods/categories/`;

    refreshAccessToken2(url, option)
        // .then(response => response.json())
        .then(data => {
            console.log('Data:', data);
            // Save the data to local storage
            localStorage.setItem('categoryList', JSON.stringify(data));
            getCategoryListFromStorage();
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });

    // function passToList(data) {
    //     data.forEach(item => {
    //         addCatgeoryToList(item.name, item.description, item.status, '', item.id);
    //     });
    // }
};


function getCategoryListFromStorage() {
    const storedData = localStorage.getItem('categoryList');
    if (storedData) {
        if (storedData === 'undefined') {
            console.log('No category list found in local storage');
            getCategoryList();
        }
        const categoryList = JSON.parse(storedData);
        console.log('Category list from local storage:', categoryList);
        // passToCategoryList(categoryList);
        return categoryList;
    } else {
        console.log('No category list found in local storage');
        // Optionally, you can call getCategoryList() here to fetch from API if not in storage
        getCategoryList();
        // getCategoryListFromStorage();
    }

}

// getFooditems();

// API Call GET Food Items
function getFooditems() {
    const option = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    }
    const url = `${baseURL}foods/fooditems/`;

    refreshAccessToken2(url, option)
        // .then(response => response.json())
        .then(data => {
            console.log('Data:', data);
            localStorage.setItem('allFoodList', JSON.stringify(data));
            getAllFoodListFromStorage();
            // document.getElementById('foods_data').innerHTML = JSON.stringify(data);

            // const preElement = document.getElementById('foods_data');
            // preElement.textContent = JSON.stringify(data, null, 2);
            // passToList(data);
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });

    // function passToList(data) {
    //     data.forEach(item => {
    //         addItemToList(item.name, item.price, item.category_name, item.description, '', item.status, item.id, item.veg);
    //     });
    // }
};

function getAllFoodListFromStorage() {
    const storedFoodData = localStorage.getItem('allFoodList');
    if (storedFoodData) {
        if (storedFoodData === 'undefined') {
            console.log('No food list found in local storage');
            getFooditems();
        }
        const foodList = JSON.parse(storedFoodData);
        console.log('Food list from local storage:', foodList);
        // passToCategoryList(categoryList);
        return foodList;
    } else {
        console.log('No category list found in local storage');
        // Optionally, you can call getCategoryList() here to fetch from API if not in storage
        getFooditems();
    }

}


// getTablesData();

// API Call to GET Tables data
function getTablesData() {
    const option = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    }
    const url = `${baseURL}foods/tables/`;
    refreshAccessToken2(url, option)
        // .then(response => response.json())
        .then(data => {
            console.log('Data:', data);
            localStorage.setItem('tablesList', JSON.stringify(data));
            getTablesListFromStorage();
        })
        .catch(error => {
            console.log('Error fetching table:', error);
        });

    return true;

}

function getTablesListFromStorage() {
    const storedData = localStorage.getItem('tablesList');
    if (storedData) {
        if (storedData === 'undefined') {
            console.log('No table list found in local storage');
            getTablesData();
        }
        const tablesList = JSON.parse(storedData);
        console.log('Table list from local storage:', tablesList);
        // passToCategoryList(categoryList);
        return tablesList;
    } else {
        console.log('No category list found in local storage');
        // Optionally, you can call getCategoryList() here to fetch from API if not in storage
        getTablesData();
    }

}


// getRoomsData();

// API Call to GET Rooms data
function getRoomsData2() {
    const option = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    }
    url = `${baseURL}hotel/rooms/`;
    refreshAccessToken2(url, option)
        // .then(response => response.json())
        .then(data => {
            console.log('Data:', data);
            localStorage.setItem('roomsList', JSON.stringify(data));
            getRoomsListFromStorage();
            return true;
        })
        .catch(error => {
            console.log('Error fetching table:', error)
        });
}

async function getRoomsData() {
    const url = `${baseURL}hotel/rooms/`;
    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await refreshAccessToken2(url, options);
        // const roomsData = await response.json();
        // Save the updated room data to local storage
        localStorage.setItem('roomsList', JSON.stringify(response));
        console.log('Rooms data updated in local storage');
    } catch (error) {
        console.log('Error fetching rooms data:', error);
    }
}

function getRoomsListFromStorage() {
    const storedData = localStorage.getItem('roomsList');
    if (storedData) {
        if (storedData === 'undefined') {
            console.log('No room list found in local storage');
            getRoomsData();
        }
        const roomsList = JSON.parse(storedData);
        console.log('Room list from local storage:', roomsList);
        // passToCategoryList(categoryList);
        return roomsList;
    } else {
        console.log('No category list found in local storage');
        // Optionally, you can call getCategoryList() here to fetch from API if not in storage
        getRoomsData();
    }
}


// getServiceCategoryList();

// API Call GET Category List - Read
function getServiceCategoryList() {
    const option = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    }

    const url = `${baseURL}hotel/service-categories/`;

    refreshAccessToken2(url, option)
        // .then(response => response.json())
        .then(data => {
            console.log('Data:', data);
            // Save the data to local storage
            localStorage.setItem('serviceCategoryList', JSON.stringify(data));
            getServiceCategoryListFromStorage();
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });

    // function passToList(data) {
    //     data.forEach(item => {
    //         addCatgeoryToList(item.name, item.description, item.status, '', item.id);
    //     });
    // }
};


function getServiceCategoryListFromStorage() {
    const storedData = localStorage.getItem('serviceCategoryList');
    if (storedData) {
        if (storedData === 'undefined') {
            console.log('No service category list found in local storage');
            getServiceCategoryList();
        }
        const categoryList = JSON.parse(storedData);
        console.log('Service Category list from local storage:', categoryList);
        // passToCategoryList(categoryList);
        return categoryList;
    } else {
        console.log('No service category list found in local storage');
        // Optionally, you can call getCategoryList() here to fetch from API if not in storage
        getServiceCategoryList();
    }

}



// getServiceList();

// API Call GET Category List - Read
function getServiceList() {
    const option = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    }

    const url = `${baseURL}hotel/services/`;

    refreshAccessToken2(url, option)
        // .then(response => response.json())
        .then(data => {
            console.log('Data:', data);
            // Save the data to local storage
            localStorage.setItem('serviceList', JSON.stringify(data));
            getServiceListFromStorage();
            resolve(data); // Resolve the promise with the data
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });

    // function passToList(data) {
    //     data.forEach(item => {
    //         addCatgeoryToList(item.name, item.description, item.status, '', item.id);
    //     });
    // }
};


function getServiceListFromStorage() {
    const storedData = localStorage.getItem('serviceList');
    if (storedData) {
        if (storedData === 'undefined') {
            console.log('No service category list found in local storage');
            getServiceList();
        }
        const categoryList = JSON.parse(storedData);
        console.log('Service Category list from local storage:', categoryList);
        // passToCategoryList(categoryList);
        return categoryList;
    } else {
        console.log('No service category list found in local storage');
        // Optionally, you can call getCategoryList() here to fetch from API if not in storage
        getServiceList();
    }

}


// getAllBookings();

// API Call GET All Bookings - Read
async function getAllBookings() {
    const option = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    }

    const url = `${baseURL}hotel/bookings/`;

    refreshAccessToken2(url, option)
        // .then(response => response.json())
        .then(data => {
            console.log('All BookingsData:', data);
            // Save the data to local storage
            localStorage.setItem('bookingsList', JSON.stringify(data));
            getAllBookingsFromStorage();
            resolve(data);
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });

};


function getAllBookingsFromStorage() {
    const storedData = localStorage.getItem('bookingsList');
    if (storedData) {
        if (storedData === 'undefined') {
            console.log('No booking list found in local storage');
            getAllBookings();
        }
        const categoryList = JSON.parse(storedData);
        console.log('Booking list from local storage:', categoryList);
        return categoryList;
    } else {
        console.log('No Booking list found in local storage');
        getAllBookings();
    }

}

// getAllBilling();

// API Call GET All Billings - Read
async function getAllBilling() {
    const option = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    }

    const url = `${baseURL}billing/bills/`;

    refreshAccessToken2(url, option)
        // .then(response => response.json())
        .then(data => {
            console.log('All Billing Data:', data);
            // Save the data to local storage
            localStorage.setItem('billingList', JSON.stringify(data));
            getAllBillingFromStorage();
            resolve(data);
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });

};


function getAllBillingFromStorage() {
    const storedData = localStorage.getItem('billingList');
    if (storedData) {
        if (storedData === 'undefined') {
            console.log('No billing list found in local storage');
            getAllBilling();
        }
        const categoryList = JSON.parse(storedData);
        console.log('Billing list from local storage:', categoryList);
        return categoryList;
    } else {
        console.log('No Billing list found in local storage');
        getAllBilling();
    }

}


// Disable all console statements
// console.log = function() {};
// console.table = function() {};
// alert = function() {};

// Custom alert function
function customAlert(message, type = 'info') {
    // Create alert container
    const alertContainer = document.createElement('div');
    alertContainer.style.position = 'fixed';
    alertContainer.style.top = '40px';
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
alert = customAlert;

// terminateConsole();

function terminateConsole() {
    console.log = function () { }
    console.table = function () { }
    console.warn = function () { }
    console.error = function () { }
}


if (document.getElementById('logout')) {
    const liLogout = document.getElementById('logout');
    liLogout.style.cursor = 'pointer';
    // color on hover
    liLogout.addEventListener('mouseover', function () {
        liLogout.style.color = 'rgb(255, 175, 2)'; //hover color
    });
    liLogout.addEventListener('mouseout', function () {
        liLogout.style.color = 'black'; //default color
    });


    document.getElementById('logout').onclick = function () {
        clearCookies();
        clearLocalStorage();
        // window.location.href = './login/login.html';
        const rootPath = window.location.origin;
        window.location.href = `${rootPath}/login/login.html`;
        // window.location.href = `${rootPath}/hotel_iswar_frontend/hotel-iswar/login/login.html`;
    }

}

// onclick function for logout on logout clear all cookies and local storage
// and redirect to login page

// document.getElementById('logout').onclick = function () {
//     clearCookies();
//     clearLocalStorage();
//     // window.location.href = './login/login.html';
//     const rootPath = window.location.origin;
//     window.location.href = `${rootPath}/hotel-iswar/login/login.html`;
//     // window.location.href = `${rootPath}/hotel_iswar_frontend/hotel-iswar/login/login.html`;
// }

function clearCookies() {
    const cookies = document.cookie.split(';');

    cookies.forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

}

function clearLocalStorage() {
    localStorage.clear();
}

function logout() {
    clearCookies();
    clearLocalStorage();
    // window.location.href = './login/login.html';
    const rootPath = window.location.origin;
    window.location.href = `${rootPath}/hotel-iswar/login/login.html`;
}