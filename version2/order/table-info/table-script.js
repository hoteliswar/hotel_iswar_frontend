function getBrowserHeaderHeight() {
    const screenHeight = window.screen.height; // Total screen height
    const viewportHeight = window.innerHeight; // Viewport height (excluding browser UI)
    const headerHeight = screenHeight - viewportHeight;
    const string = `Screen height: ${screenHeight}px, Viewport height: ${viewportHeight}px, Browser header height: ${headerHeight}px`;
    document.body.style.height = (viewportHeight - 1) + 'px';
    return string;
}
// console.log(getBrowserHeaderHeight());

// document.querySelector('.order-type-info').addEventListener('click', function(event) {
//     if (event.target.classList.contains('type-selectable')) {
//         // Remove 'type-selected' class from all buttons
//         this.querySelectorAll('.type-selectable').forEach(button => {
//             button.classList.remove('type-selected');
//         });

//         // Add 'type-selected' class to the clicked button
//         event.target.classList.add('type-selected');
//     }
// });


// Disable all elements with class 'table-view-cell'
document.querySelectorAll('.table-view-cell').forEach(element => {
    element.style.cursor = 'not-allowed';
    element.disabled = true;
});

// Disable all elements with class 'room-view-cell'
document.querySelectorAll('.room-view-cell').forEach(element => {
    element.style.cursor = 'not-allowed';
    element.disabled = true;
});

document.querySelector('.order-type-info').addEventListener('click', function(event) {
    if (event.target.classList.contains('type-selectable')) {
        // Remove 'type-selected' class from all buttons
        this.querySelectorAll('.type-selectable').forEach(button => {
            button.classList.remove('type-selected');
        });

        // Add 'type-selected' class to the clicked button
        event.target.classList.add('type-selected');

        // Get the selected type
        const selectedType = event.target;

        if (selectedType) {
            if (selectedType.textContent === 'DINE-IN') {
                // Action for DINE-IN
                document.querySelectorAll('.table-view-cell').forEach(element => {
                    element.style.cursor = 'pointer';
                    element.disabled = false;
                });
                document.querySelectorAll('.room-view-cell').forEach(element => {
                    element.style.cursor = 'not-allowed';
                    element.disabled = true;
                });
            } else if (selectedType.textContent === 'DELIVERY') {
                // Action for DELIVERY
                document.querySelectorAll('.table-view-cell').forEach(element => {
                    element.style.cursor = 'not-allowed';
                    element.disabled = true;
                });
                document.querySelectorAll('.room-view-cell').forEach(element => {
                    element.style.cursor = 'not-allowed';
                    element.disabled = true;
                });
            } else if (selectedType.textContent === 'PICKUP') {
                // Action for PICKUP
                document.querySelectorAll('.table-view-cell').forEach(element => {
                    element.style.cursor = 'not-allowed';
                    element.disabled = true;
                });
                document.querySelectorAll('.room-view-cell').forEach(element => {
                    element.style.cursor = 'not-allowed';
                    element.disabled = true;
                });
            } else if (selectedType.textContent === 'ROOM SERVICE') {
                // Action for ROOM SERVICE
                document.querySelectorAll('.room-view-cell').forEach(element => {
                    element.style.cursor = 'pointer';
                    element.disabled = false;
                });
                document.querySelectorAll('.table-view-cell').forEach(element => {
                    element.style.cursor = 'not-allowed';
                    element.disabled = true;
                });
            } else {
                // Default action or handling for other cases
            }
        }
    }
});

