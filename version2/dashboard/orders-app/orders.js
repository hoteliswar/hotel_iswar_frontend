baseURL = 'https://dineops.onrender.com/api/';

getAllOrders();

function getAllOrders(){
    url = `${baseURL}orders/order/`;

    const option = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    }

    refreshAccessToken2(url, option)
        // .then(response => response.json())
        .then(data => {
            console.log('Get Orders Data:', data);
            renderOrders(data);
            renderOrders(data);
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });
}


function renderOrders(orders) {
    const ordersContainer = document.querySelector('.load-orders');
    // ordersContainer.innerHTML = '';

    orders.forEach(order => {

        let displayOrderType;
        switch (order.order_type) {
            case 'dine_in':
                displayOrderType = 'DINE IN';
                break;
            case 'pickup':
                displayOrderType = 'PICKUP';
                break;
            case 'delivery':
                displayOrderType = 'DELIVERY';
                break;
            case 'room_service':
                displayOrderType = 'ROOM SERVICE';
                break;
            default:
                displayOrderType = order.order_type.toUpperCase();
        }

        const orderElement = document.createElement('div');
        orderElement.classList.add('order-item');
        
        orderElement.innerHTML = `
            <div class="order-item-col col-1">${order.id}</div>
            <div class="order-item-col col-2">${order.phone ? order.phone : 'N/A'}</div>
            <div class="order-item-col col-2">${new Date(order.created_at).toLocaleDateString()}</div>
            <div class="order-item-col col-2">${displayOrderType} - ${order.table}</div>
            <div class="order-item-col col-2">${order.total_price}</div>
            <div class="order-item-col col-2">
                <button onclick="viewOrder(${order.id})">View</button>
                <button onclick="editOrder(${order.id})">Edit</button>
            </div>
        `;

        ordersContainer.appendChild(orderElement);
    });
}

function viewOrder(orderId) {
    const modal = document.getElementById('orderModal');
    const orderDetails = document.getElementById('orderDetails');
    const closeBtn = document.getElementsByClassName('close')[0];

    // Fetch order details
    const url = `${baseURL}orders/order/${orderId}/`;
    const option = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    };

    refreshAccessToken2(url, option)
        .then(data => {
            orderDetails.innerHTML = `
                <p><strong>Order ID:</strong> ${data.id}</p>
                <p><strong>Order Type:</strong> ${data.order_type}</p>
                <p><strong>Total Price:</strong> $${data.total_price}</p>
                <p><strong>Status:</strong> ${data.status}</p>
                <p><strong>Created At:</strong> ${new Date(data.created_at).toLocaleString()}</p>
                <h3>Food Items:</h3>
                <ul>
                    ${data.food_items.map(item => `<li>${item.name} - $${item.price}</li>`).join('')}
                </ul>
            `;
            console.log('Order Details:', data);
            modal.style.right = '0';
        })
        .catch(error => {
            console.log('Error fetching order details:', error);
            orderDetails.innerHTML = 'Error loading order details';
        });

    closeBtn.onclick = function() {
        modal.style.right = '-100%';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.right = '-100%';
        }
    }
}
