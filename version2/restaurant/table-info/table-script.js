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

getTablesData();

getAllTablesRooms();

function getAllTablesRooms() {
    const tableInfo = JSON.parse(localStorage.getItem('tablesList')) || [];

    const tableInfo2 = [
        {
            id: 1,
            table_number: 1,
            occupied: true,
            order_id: 2,
            order_time: '2024-09-19T23:23:00',
        },
        {
            id: 2,
            table_number: 2,
            occupied: false,
            order_id: null,
            order_time: null,
        },
        {
            id: 3,
            table_number: 3,
            occupied: false,
            order_id: null,
            order_time: null,
        },
        {
            id: 4,
            table_number: 4,
            occupied: false,
            order_id: null,
            order_time: null,
        },
        {
            id: 5,
            table_number: 5,
            occupied: false,
            order_id: null,
            order_time: null,
        }
    ];

    
    const tableViewRow = document.querySelector('.table-view-row');
    
    tableInfo.forEach((table) => {
        const tableViewCell = document.createElement('div');
        tableViewCell.classList.add('table-view-cell');
        
        // Uncomment after connection to database
        // if (table.occupied && table.order_id && table.order_time) {
        if (table.occupied) {
            tableViewCell.classList.add('occupied-table');
        }

        tableViewCell.addEventListener('click', function() {
            if (!table.occupied) {
                window.location.href = `./../takeorder/takeorder.html?table=${table.table_number}&orderType=dine_in`;
            }
        });
                
        const tableText = document.createElement('div');
        tableText.classList.add('text');
        
        const orderMin = document.createElement('div');
        orderMin.id = 'order-min';
        const tableNo = document.createElement('div');
        tableNo.id = 'table-no';
        const amount = document.createElement('div');
        amount.id = 'amount';
        
        tableNo.textContent = table.table_number;
        amount.textContent = table.amount || '';
        
        if (table.order_time) {
            const orderTime = new Date(table.order_time);
            const currentTime = new Date();
            console.log(currentTime);
            const timeDiff = Math.floor((currentTime - orderTime) / 60000); // Difference in minutes
            orderMin.textContent = `${timeDiff} Min`;
        } else {
            orderMin.textContent = '';
        }
        
        tableText.appendChild(orderMin);
        tableText.appendChild(tableNo);
        tableText.appendChild(amount);
        tableViewCell.appendChild(tableText);
        tableViewRow.appendChild(tableViewCell);
    });
    
    const roomInfo = [
        {
            room_number: 101,
            occupied: true,
        },
        {
            room_number: 202,
            occupied: false,
        },
        {
            room_number: 103,
            occupied: false,
        },
        {
            room_number: 107,
            occupied: false,
        },
        {
            room_number: 204,
            occupied: false,
        }
    ];
    
    const roomViewRow = document.querySelector('.room-view-row');
    
    roomInfo.forEach((room) => {
        const roomViewCell = document.createElement('div');
        roomViewCell.classList.add('room-view-cell');

        if (!room.occupied) {
            roomViewCell.classList.add('occupied-room');
        }

        roomViewCell.addEventListener('click', function() {
            if (room.occupied) {
                window.location.href = `./../takeorder/takeorder.html?room=${room.room_number}&orderType=room_service`;
            }
        });

        const roomText = document.createElement('div');
        roomText.classList.add('text');

        const roomNo = document.createElement('div');
        roomNo.id = 'room-no';

        roomNo.textContent = room.room_number;

        roomText.appendChild(roomNo);
        roomViewCell.appendChild(roomText);
        roomViewRow.appendChild(roomViewCell);
    });


}



document.querySelector('.order-type-info').addEventListener('click', function (event) {
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
            if (selectedType.textContent === 'DELIVERY') {
                // Action for DELIVERY
                document.querySelectorAll('.table-view-cell').forEach(element => {
                    element.style.cursor = 'not-allowed';
                    element.disabled = true;
                });
                document.querySelectorAll('.room-view-cell').forEach(element => {
                    element.style.cursor = 'not-allowed';
                    element.disabled = true;
                });
                document.addEventListener('click', function (event) {
                    if (event.target.id.includes('delivery')) {
                        window.location.href = `./../takeorder/takeorder.html?orderType=DELIVERY`;
                    }
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
                document.addEventListener('click', function (event) {
                    if (event.target.id.includes('pickup')) {
                        window.location.href = `./../takeorder/takeorder.html?orderType=PICKUP`;
                    }
                });
            } else {
                // Default action or handling for other cases
            }
        }
    }
});

