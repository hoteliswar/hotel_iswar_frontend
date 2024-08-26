
function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}


document.addEventListener('DOMContentLoaded', function () {
    const dashboardContent = document.getElementById('dashboard-content');
    const navItems = document.querySelectorAll('.dash-nav-item');

    loadContent('DASHBOARD');   // Load the default content

    navItems.forEach(item => {
        item.addEventListener('click', function () {
            const navName = this.querySelector('.nav-name').textContent.trim();
            loadContent(navName);
        });
    });

    // Example: Load content for each Side Nav items
    function loadContent2(navName) {
        switch (navName) {
            case 'DASHBOARD':
                dashboardContent.innerHTML = '<h2>Dashboard Content</h2><p>Welcome to your dashboard!</p>';
                break;
            case 'MENU MANAGEMENT':
                dashboardContent.innerHTML = '<h2>Menu Content</h2><p>Here you can manage your menu items.</p>';
                break;
            case 'Category 3':
                dashboardContent.innerHTML = '<h2>Category 3 Content</h2><p>This is the content for Category 3.</p>';
                break;
            default:
                dashboardContent.innerHTML = '<h2>Content Not Found</h2><p>Please select a valid category.</p>';
        }
    }

    function loadContent(navName) {
        let fileName;
        switch (navName) {
            case 'DASHBOARD':
                fileName = './dashboard-app/dashboard-content';
                break;
            case 'MENU MANAGEMENT':
                fileName = './menu-management/menu-content';
                break;
            case 'REPORTS':
                fileName = './reports-app/reports-content';
                break;
            default:
                fileName = 'not-found';
        }

        let currentScript = null;
        function handleItemClick(scriptUrl) {
            // Remove the old script if it exists
            if (currentScript) {
                document.body.removeChild(currentScript);
            }

            // Create and append the new script
            const script = document.createElement('script');
            script.src = scriptUrl;
            document.body.appendChild(script);

            // Update the reference to the current script
            currentScript = script;
        }

        fetch(`${fileName}.html`)
            .then(response => response.text())
            .then(data => {
                dashboardContent.innerHTML = data;
                // Load and execute the associated JavaScript file
                const script = document.createElement('script');
                script.src = `${fileName}.js`;
                scriptUrl = `${fileName}.js`;
                script.onload = function () {
                    // This will run after the script has loaded and executed
                    console.log(`${fileName}.js loaded and executed`);
                };
                // document.body.appendChild(script);
                handleItemClick(scriptUrl);
            })
            .catch(error => {
                console.error('Error loading content:', error);
                dashboardContent.innerHTML = '<h2>Error Loading Content</h2>';
            });
    }

});


// Landscape Alert

function checkOrientation() {
    if (window.innerWidth <= 900) {
        let overlay = document.getElementById('orientationOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'orientationOverlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 1)';
            overlay.style.zIndex = '9998';
            document.body.appendChild(overlay);

            let alertBox = document.createElement('div');
            alertBox.id = 'orientationAlert';
            alertBox.style.position = 'fixed';
            alertBox.style.top = '50%';
            alertBox.style.left = '50%';
            alertBox.style.transform = 'translate(-50%, -50%)';
            alertBox.style.padding = '40px';
            alertBox.style.backgroundColor = 'white';
            alertBox.style.color = 'black';
            alertBox.style.textAlign = 'center';
            alertBox.style.zIndex = '9999';
            alertBox.style.borderRadius = '10px';
            alertBox.style.boxShadow = '0 0 10px rgba(255,255,255,0.5)';
            alertBox.textContent = "For the best experience, please use in landscape mode in Desktop or Tablet.";
            overlay.appendChild(alertBox);
        }
    } else {
        let overlay = document.getElementById('orientationOverlay');
        if (overlay) {
            overlay.remove();
        }
    }
}

window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("resize", checkOrientation);
checkOrientation(); // Initial check

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

    const url = 'http://127.0.0.1:8000/api/foods/categories/';

    refreshAccessToken(url, option)
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



