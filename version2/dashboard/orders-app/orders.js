baseURL = 'https://dineops.onrender.com/api/';

getAllOrders();

function getAllOrders() {
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


function renderOrders2(orders) {
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
            <div class="order-item-col col-3">${displayOrderType} - ${order.table}</div>
            <div class="order-item-col col-2">${order.total_price}</div>
            <div class="order-item-col col-2">
                <i class="fas fa-eye col-4" id="view-btn" onclick="viewOrder(${order.id})"></i>
                <i class="fa-solid fa-pen-to-square col-4" id="edit-btn" onclick="editOrder(${order.id})"></i>
            </div>
        `;

        ordersContainer.appendChild(orderElement);
    });
}

function viewOrder(orderId) {
    const modalContainer = document.querySelector('.modal-container');
    const modal = document.getElementById('orderModal');
    const orderDetails = document.getElementById('orderDetails');
    const closeBtn = document.querySelector('.close');

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
            renderData(data);
        })
        .catch(error => {
            console.log('Error fetching order details:', error);
            orderDetails.innerHTML = 'Error loading order details';
        });
}

function renderData(data) {
    const orderDetails = document.getElementById('orderDetails');
    orderDetails.innerHTML = `
        <div class="order-detail-item">
            <span class="detail-label">Order ID:</span>
            <span class="detail-value">${data.id}</span>
        </div>
        <div class="order-detail-item">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${data.phone ? data.phone : 'N/A'}</span>
        </div>
        <div class="order-detail-item">
            <span class="detail-label">Date:</span>
            <span class="detail-value">${new Date(data.created_at).toLocaleDateString()}</span>
        </div>
        <div class="order-detail-item">
            <span class="detail-label">Order Type:</span>
            <span class="detail-value">${data.order_type.toUpperCase()} - ${data.table}</span>
        </div>
        <div class="order-detail-item">
            <span class="detail-label">Total Price:</span>
            <span class="detail-value">${data.total_price}</span>
        </div>
        <div class="order-detail-item">
            <span class="detail-label">Order Status:</span>
            <span class="detail-value">${data.order_status}</span>
        </div>
        <div class="order-detail-item">
            <span class="detail-label">Payment Status:</span>
            <span class="detail-value">${data.payment_status}</span>
        </div>
        <div class="order-detail-item">
            <span class="detail-label">Payment Method:</span>
            <span class="detail-value">${data.payment_method}</span>
        </div>
    `;
}
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'view-btn') {
        const newOrderModal = document.getElementById('orderModal');
        if (newOrderModal) {
            setTimeout(() => newOrderModal.classList.add('show'), 10);
            newOrderModal.style.display = 'block';
        }
    }
});

document.querySelector('.close').onclick = function () {
    const newOrderModal = document.getElementById('orderModal');
    newOrderModal.classList.remove('show');
    setTimeout(() => newOrderModal.style.display = 'none', 300);
}

console.log("Hello");
// Filter Orders
document.addEventListener('click', function() {
    const filterType = document.getElementById('filterType');
    const filterInputs = document.getElementById('filterInputs');
    const mobileInput = document.getElementById('mobileInput');
    const dateInputs = document.getElementById('dateInputs');
    const orderTypeSelect = document.getElementById('orderTypeSelect');
    console.log(filterType);

    filterType.addEventListener('change', function() {
        mobileInput.style.display = 'none';
        dateInputs.style.display = 'none';
        orderTypeSelect.style.display = 'none';

        switch(this.value) {
            case 'mobile':
                mobileInput.style.display = 'block';
                break;
            case 'date':
                dateInputs.style.display = 'block';
                break;
            case 'orderType':
                orderTypeSelect.style.display = 'block';
                break;
            case 'reset':
                resetFilter();
                break;
        }

        console.log('Filter type changed:', this.value);
    });

    mobileInput.addEventListener('input', filterOrders);
    document.getElementById('startDate').addEventListener('change', filterOrders);
    document.getElementById('endDate').addEventListener('change', filterOrders);
    orderTypeSelect.addEventListener('change', filterOrders);
});

function filterOrders() {
    const filterType = document.getElementById('filterType').value;
    const mobileInput = document.getElementById('mobileInput').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const orderType = document.getElementById('orderTypeSelect').value;

    const url = `${baseURL}orders/order/`;
    const option = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    };

    refreshAccessToken2(url, option)
        .then(data => {
            let filteredOrders = data;

            switch(filterType) {
                case 'mobile':
                    filteredOrders = data.filter(order => order.phone && order.phone.includes(mobileInput));
                    break;
                case 'date':
                    filteredOrders = data.filter(order => {
                        const orderDate = new Date(order.created_at);
                        return (!startDate || orderDate >= new Date(startDate)) &&
                               (!endDate || orderDate <= new Date(endDate));
                    });
                    break;
                case 'orderType':
                    filteredOrders = data.filter(order => order.order_type === orderType);
                    break;
            }

            renderOrders(filteredOrders);
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
            <div class="order-item-col col-3">${displayOrderType} - ${order.table}</div>
            <div class="order-item-col col-2">${order.total_price}</div>
            <div class="order-item-col col-2">
                <i class="fas fa-eye col-4" id="view-btn" onclick="viewOrder(${order.id})"></i>
                <i class="fa-solid fa-pen-to-square col-4" id="edit-btn" onclick="editOrder(${order.id})"></i>
            </div>
        `;

        ordersContainer.appendChild(orderElement);
    });
}

function resetFilter() {
    document.getElementById('filterType').selectedIndex = 0;
    document.getElementById('mobileInput').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('orderTypeSelect').selectedIndex = 0;

    // Hide all filter inputs
    document.getElementById('mobileInput').style.display = 'none';
    document.getElementById('dateInputs').style.display = 'none';
    document.getElementById('orderTypeSelect').style.display = 'none';

    // Fetch and display all orders
    getAllOrders();
}

