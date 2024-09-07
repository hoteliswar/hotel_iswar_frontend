document.addEventListener('DOMContentLoaded', function () {
    const dashboardContent = document.getElementById('hotel-content');
    const navItems = document.querySelectorAll('.dash-nav-item');
    const insertAllModal = document.querySelector('.insert-all-modal');

    loadContent('BOOKING');   // Load the default content

    navItems.forEach(item => {
        item.addEventListener('click', function () {
            const navName = this.querySelector('.nav-name').textContent.trim();
            loadContent(navName);
        });
    });

    function loadContent2(navName) {
        let fileName;
        switch (navName) {
            case 'HOME':
                fileName = './home-app/home';
                break;
            case 'ROOM':
                fileName = './room-app/room';
                break;
            case 'BOOKING':
                fileName = './booking-app/booking';
                break;
            case 'GUEST':
                fileName = './guest-app/guest';
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

    let currentScript = null;
    
    function loadContent(navName) {
        let fileName;
        switch (navName) {
            case 'HOME':
                fileName = './home-app/home';
                break;
            case 'ROOM':
                fileName = './room-app/room';
                break;
            case 'BOOKING':
                fileName = './booking-app/booking';
                break;
            case 'GUEST':
                fileName = './guest-app/guest';
                break;
            default:
                fileName = 'not-found';
        }

        fetch(`${fileName}.html`)
            .then(response => response.text())
            .then(data => {
                dashboardContent.innerHTML = data;
                // console.log(data);

                // // Move the modal out of hotel-content to the body
                // const modal = document.getElementById('bookingModal');
                // if (modal) {
                //     // Remove it from the current parent (hotel-content)
                //     dashboardContent.removeChild(modal);
                //     insertAllModal.appendChild(modal); // Moves the modal to the body
                // }

                // Remove the previous script if it exists
                if (currentScript) {
                    document.body.removeChild(currentScript);
                }


                // Create and append the new script
                const script = document.createElement('script');
                script.src = `${fileName}.js`;
                document.body.appendChild(script);
                console.log(`${fileName}.js loaded and executed`);

                // Update the reference to the current script
                currentScript = script;
            })
            .catch(error => {
                console.error('Error loading content:', error);
                dashboardContent.innerHTML = '<h2>Error Loading Content</h2>';
            });
    }


});