document.addEventListener('DOMContentLoaded', function () {
    const dashboardContent = document.getElementById('dashboard-content');
    const navItems = document.querySelectorAll('.dash-nav-item');

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
            case 'MENU':
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
            case 'Category 3':
                fileName = 'category3-content';
                break;
            default:
                fileName = 'not-found';
        }

        fetch(`${fileName}.html`)
            .then(response => response.text())
            .then(data => {
                dashboardContent.innerHTML = data;
                // Load and execute the associated JavaScript file
                const script = document.createElement('script');
                script.src = `${fileName}.js`;
                script.onload = function () {
                    // This will run after the script has loaded and executed
                    console.log(`${fileName}.js loaded and executed`);
                };
                document.body.appendChild(script);
            })
            .catch(error => {
                console.error('Error loading content:', error);
                dashboardContent.innerHTML = '<h2>Error Loading Content</h2>';
            });
    }

});
