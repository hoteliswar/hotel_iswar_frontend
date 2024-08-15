// document.addEventListener('DOMContentLoaded', function() {
//     const menuNavItems = document.querySelectorAll('.nav-item');
//     const contentLoadSection = document.querySelector('.nav-item-content-load');

//     menuNavItems.forEach(item => {
//         item.addEventListener('click', function() {
//             // Remove 'nav-item-selected' class from all items
//             menuNavItems.forEach(navItem => navItem.classList.remove('nav-item-selected'));

//             // Add 'nav-item-selected' class to clicked item
//             this.classList.add('nav-item-selected');

//             // Load content based on clicked item
//             const contentPage = this.textContent.toLowerCase().replace(' ', '-') + '.html';
//             fetch(contentPage)
//                 .then(response => response.text())
//                 .then(data => {
//                     contentLoadSection.innerHTML = data;
//                 })
//                 .catch(error => {
//                     console.error('Error loading content:', error);
//                     contentLoadSection.innerHTML = 'Error loading content';
//                 });
//         });
//     });
// });

console.log("menu-content.js Loaded")

// ---------------------------------------

// document.addEventListener('DOMContentLoaded', function() {
//     const menuNavItems = document.querySelectorAll('.nav-item');
//     const contentLoadSection = document.querySelector('.nav-item-content-load');

//     menuNavItems.forEach(item => {
//         item.addEventListener('click', function() {
//             menuNavItems.forEach(navItem => navItem.classList.remove('nav-item-selected'));
//             this.classList.add('nav-item-selected');

//             const contentPage = this.textContent.toLowerCase().replace(' ', '-');

//             // Load HTML
//             fetch(`${contentPage}.html`)
//                 .then(response => response.text())
//                 .then(data => {
//                     contentLoadSection.innerHTML = data;

//                     // Load and execute JS
//                     const script = document.createElement('script');
//                     script.src = `${contentPage}.js`;
//                     document.body.appendChild(script);
//                 })
//                 .catch(error => {
//                     console.error('Error loading content:', error);
//                     contentLoadSection.innerHTML = 'Error loading content';
//                 });
//         });
//     });
// });


function initializeMenuContent2() {
    const menuNavItems = document.querySelectorAll('.nav-item');
    const contentLoadSection = document.querySelector('.nav-item-content-load');

    menuNavItems.forEach(item => {
        item.addEventListener('click', function () {
            menuNavItems.forEach(navItem => navItem.classList.remove('nav-item-selected'));
            this.classList.add('nav-item-selected');

            const contentPage = this.textContent.toLowerCase().replace(' ', '-');
            loadContent(contentPage, contentLoadSection);

            function loadContent(contentPage, contentLoadSection) {
                // Load HTML
                fetch(`./menu-management/${contentPage}/${contentPage}.html`)
                    .then(response => response.text())
                    .then(data => {
                        contentLoadSection.innerHTML = data;
                        // Load and execute the associated JavaScript file
                        const script = document.createElement('script');
                        script.src = `./menu-management/${contentPage}/${contentPage}.js`;
                        script.onload = function () {
                            // This will run after the script has loaded and executed
                            console.log(`${contentPage}.js loaded and executed`);
                        };
                        document.body.appendChild(script);
                    })
                    .catch(error => {
                        console.error('Error loading content:', error);
                        contentLoadSection.innerHTML = 'Error loading content';
                    });
            }
        });
    });
}

// ---------------Updated----------------

function initializeMenuContent() {
    const menuNavItems = document.querySelectorAll('.nav-item');
    const contentLoadSection = document.querySelector('.nav-item-content-load');

    menuNavItems.forEach(item => {
        item.addEventListener('click', function () {
            loadSelectedContent(this);
        });
    });

    // Load 'categories' by default
    const categoriesItem = Array.from(menuNavItems).find(item => item.textContent.toLowerCase().includes('items'));
    if (categoriesItem) {
        loadSelectedContent(categoriesItem);
    }

    function loadSelectedContent(selectedItem) {
        menuNavItems.forEach(navItem => navItem.classList.remove('nav-item-selected'));
        selectedItem.classList.add('nav-item-selected');

        const contentPage = selectedItem.textContent.toLowerCase().replace(' ', '-');
        loadContent(contentPage, contentLoadSection);
    }

    function loadContent(contentPage, contentLoadSection) {
        // Load HTML
        fetch(`./menu-management/${contentPage}/${contentPage}.html`)
            .then(response => response.text())
            .then(data => {
                contentLoadSection.innerHTML = data;
                // Load and execute the associated JavaScript file
                const script = document.createElement('script');
                script.src = `./menu-management/${contentPage}/${contentPage}.js`;
                script.onload = function () {
                    // This will run after the script has loaded and executed
                    console.log(`${contentPage}.js loaded and executed`);
                };
                document.body.appendChild(script);
            })
            .catch(error => {
                console.error('Error loading content:', error);
                contentLoadSection.innerHTML = 'Error loading content';
            });
    }
}



// Check if the document is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initializeMenuContent();
} else {
    document.addEventListener('DOMContentLoaded', initializeMenuContent);
}
