baseURL = 'https://dineops.onrender.com/api/';

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
                if (response.status == 401){
                    window.location.href = 'index.html';
                }
                else if (response.status == 200){
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
                if(data.access){
                    setCookie('access_token', data.access, 5);
                }
                if(response.status === 200){
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

async function refreshAccessToken2(url, option) {
    // try {
        const response = await fetch(url, option);
        if (response.status === 401) {
            console.log('Status: 401');
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
                if (response.status == 401){
                    window.location.href = 'index.html';
                }
                else if (response.status == 200){
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
                if(data.access){
                    setCookie('access_token', data.access, 5);
                }
                if(response.status === 200){
                    refreshAccessToken2(url, option);
                }
                // refreshAccessToken(url, option);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        // else if (response.ok) {
        else if (response.status === 200) {
            console.log('Statuss: 200 OK');
            return response.json();
            
        }
    // } catch (error) {
    //     console.error('Error:', error);
    // }
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


getCategoryList();

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

getFooditems();

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


getTablesData();
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