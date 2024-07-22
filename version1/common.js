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

    return fetch(url, option)
    .then(response => {
        if (response.status === 401) {
            console.log('Status: 401');
            fetch('http://127.0.0.1:8000/api/accounts/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh: refreshToken
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
                refreshAccessToken(url, option);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        else if (response.status === 200) {
            console.log('Status: 200');
            return response.json();
        }
    });
}

async function refreshAccessToken2(url, option) {
    // try {
        const response = await fetch(url, option);
        if (response.status === 401) {
            console.log('Status: 401');
            fetch('http://127.0.0.1:8000/api/accounts/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh: refreshToken
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
                // refreshAccessToken(url, option);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        else if (response.status === 200) {
            console.log('Statuss: 200');
            return response.json();
        }
    // } catch (error) {
    //     console.error('Error:', error);
    // }
}