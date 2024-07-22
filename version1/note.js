let statuscode;

        // Optionally, you can use the access token for further API requests
        fetch('http://127.0.0.1:8000/api/accounts/tenants/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then((response) => {
            
            statuscode = response.status;
            console.log("response.status =", statuscode); // response.status = 200 || 401
            // return response.json();
            // return response.json();
            if (statuscode == 401){
                console.log('Refreshing token...', statuscode);
                fetch('http://127.0.0.1:8000/api/accounts/token/refresh/',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        refresh: refreshToken
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data.access);
                    if(data.access){
                        setCookie('access_token', data.access, 7);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });

            }
        }
        )


        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));